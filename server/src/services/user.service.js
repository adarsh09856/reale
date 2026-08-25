import bcrypt from 'bcryptjs';
import { prisma } from '../prisma.js';

export class UserService {
  static async listUsers() {
    return prisma.user.findMany({
      where: { deletedAt: null },
      include: { role: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { role: { include: { permissions: { include: { permission: true } } } } }
    });
    if (!user) throw new Error('User not found.');
    return user;
  }

  static async createUser(data) {
    const passwordHash = await bcrypt.hash(data.password || 'TemporaryPassword123!', 10);
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
        roleId: data.roleId,
        phone: data.phone || null,
        avatarUrl: data.avatarUrl || null,
        status: data.status || 'ACTIVE'
      },
      include: { role: true }
    });
  }

  static async updateUser(id, data) {
    const targetUser = await prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { role: true }
    });
    if (!targetUser) throw new Error('User not found.');

    // LOCKOUT SAFEGUARD: Prevent demoting the last active super_admin
    if (targetUser.role.name === 'super_admin' && data.roleId && data.roleId !== targetUser.roleId) {
      const activeSuperAdmins = await prisma.user.count({
        where: { role: { name: 'super_admin' }, status: 'ACTIVE', deletedAt: null }
      });
      if (activeSuperAdmins <= 1) {
        throw new Error('Lockout Protection: Cannot demote or change the role of the last remaining active Super Administrator.');
      }
    }

    if (targetUser.role.name === 'super_admin' && data.status === 'SUSPENDED') {
      const activeSuperAdmins = await prisma.user.count({
        where: { role: { name: 'super_admin' }, status: 'ACTIVE', deletedAt: null }
      });
      if (activeSuperAdmins <= 1) {
        throw new Error('Lockout Protection: Cannot suspend the last remaining active Super Administrator.');
      }
    }

    return prisma.user.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.email ? { email: data.email } : {}),
        ...(data.roleId ? { roleId: data.roleId } : {}),
        ...(data.status ? { status: data.status } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {})
      },
      include: { role: true }
    });
  }

  static async deleteUser(id) {
    const targetUser = await prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { role: true }
    });
    if (!targetUser) throw new Error('User not found.');

    // LOCKOUT SAFEGUARD: Prevent deleting the last active super_admin
    if (targetUser.role.name === 'super_admin') {
      const activeSuperAdmins = await prisma.user.count({
        where: { role: { name: 'super_admin' }, deletedAt: null }
      });
      if (activeSuperAdmins <= 1) {
        throw new Error('Lockout Protection: Cannot delete the last remaining active Super Administrator.');
      }
    }

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'SUSPENDED' }
    });

    return { success: true };
  }

  // --- Roles & Permissions Management ---
  static async listRoles() {
    return prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    });
  }

  static async getRoleById(id) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: { permissions: { include: { permission: true } } }
    });
    if (!role) throw new Error('Role not found.');
    return role;
  }

  static async listPermissions() {
    return prisma.permission.findMany({
      orderBy: { key: 'asc' }
    });
  }

  static async updateRolePermissions(roleId, permissionKeys) {
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new Error('Role not found.');

    // LOCKOUT SAFEGUARD: Super Admin keeps all permissions
    if (role.name === 'super_admin') {
      throw new Error('Lockout Protection: Super Administrator role permissions cannot be altered.');
    }

    // Resolve keys to permission records
    const permissions = await prisma.permission.findMany({
      where: { key: { in: permissionKeys } }
    });

    // Replace role permissions
    await prisma.rolePermission.deleteMany({ where: { roleId } });

    await prisma.rolePermission.createMany({
      data: permissions.map(p => ({
        roleId,
        permissionId: p.id
      }))
    });

    return prisma.role.findUnique({
      where: { id: roleId },
      include: { permissions: { include: { permission: true } } }
    });
  }
}
