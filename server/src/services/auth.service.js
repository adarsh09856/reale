import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../prisma.js';
import { config } from '../config/index.js';

export class AuthService {
  static async login(email, password, ipAddress) {
    const user = await prisma.user.findUnique({
      where: { email, deletedAt: null },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true }
            }
          }
        }
      }
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new Error('Invalid email or password.');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password.');
    }

    // Generate Short-Lived Access Token (15m)
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role.name },
      config.jwtSecret,
      { expiresIn: config.jwtAccessExpiry }
    );

    // Generate Rotated Refresh Token (7d)
    const refreshTokenPlain = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(refreshTokenPlain).digest('hex');
    const expiresAt = new Date(Date.now() + config.jwtRefreshExpiryDays * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt
      }
    });

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'USER_LOGIN',
        entityType: 'auth',
        ipAddress,
        details: `Authenticated user ${user.name} (${user.role.name})`
      }
    });

    const permissionKeys = user.role.permissions.map(rp => rp.permission.key);

    return {
      accessToken,
      refreshToken: refreshTokenPlain,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        role: user.role.name,
        permissions: permissionKeys
      }
    };
  }

  static async refreshToken(refreshTokenPlain) {
    if (!refreshTokenPlain) {
      throw new Error('Refresh token required.');
    }

    const tokenHash = crypto.createHash('sha256').update(refreshTokenPlain).digest('hex');
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: { role: true } } }
    });

    if (!tokenRecord || tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token.');
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revoked: true }
    });

    // Issue new pair (Rotation)
    const newAccessToken = jwt.sign(
      { userId: tokenRecord.user.id, role: tokenRecord.user.role.name },
      config.jwtSecret,
      { expiresIn: config.jwtAccessExpiry }
    );

    const newRefreshPlain = crypto.randomBytes(40).toString('hex');
    const newTokenHash = crypto.createHash('sha256').update(newRefreshPlain).digest('hex');
    const expiresAt = new Date(Date.now() + config.jwtRefreshExpiryDays * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: {
        userId: tokenRecord.user.id,
        tokenHash: newTokenHash,
        expiresAt
      }
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshPlain
    };
  }

  static async logout(refreshTokenPlain) {
    if (refreshTokenPlain) {
      const tokenHash = crypto.createHash('sha256').update(refreshTokenPlain).digest('hex');
      await prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { revoked: true }
      });
    }
    return { success: true };
  }

  static async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true }
            }
          }
        }
      }
    });

    if (!user) throw new Error('User not found.');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      role: user.role.name,
      permissions: user.role.permissions.map(rp => rp.permission.key)
    };
  }

  static async updateMe(userId, { name, avatarUrl, phone }) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name ? { name } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
        ...(phone !== undefined ? { phone } : {})
      }
    });

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      avatarUrl: updated.avatarUrl,
      phone: updated.phone
    };
  }

  static async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found.');

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new Error('Current password is incorrect.');
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash }
    });

    // Revoke all existing refresh tokens
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true }
    });

    return { success: true, message: 'Password changed successfully. Please log in again.' };
  }

  static async forgotPassword(email) {
    const user = await prisma.user.findUnique({ where: { email, deletedAt: null } });
    // Always return generic 200 to prevent user enumeration
    if (!user) {
      return { success: true, message: 'If an account exists with that email, a password reset link has been dispatched.' };
    }

    const tokenPlain = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(tokenPlain).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt
      }
    });

    // Simulated email delivery (or SMTP in production)
    console.log(`[SMTP Email Service] Password reset token dispatched to ${email}: Reset Token = ${tokenPlain}`);

    return { success: true, message: 'If an account exists with that email, a password reset link has been dispatched.' };
  }

  static async resetPassword(tokenPlain, newPassword) {
    const tokenHash = crypto.createHash('sha256').update(tokenPlain).digest('hex');
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
      throw new Error('Invalid or expired password reset token.');
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash: newHash }
    });

    await prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { used: true }
    });

    await prisma.refreshToken.updateMany({
      where: { userId: resetRecord.userId },
      data: { revoked: true }
    });

    return { success: true, message: 'Password reset successfully. You may now log in with your new password.' };
  }
}
