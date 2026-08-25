import { prisma } from '../prisma.js';

export class VehicleService {
  static async listVehicles(user, query = {}) {
    const { status, transmission, fuel, minPrice, maxPrice, search } = query;

    let whereClause = { deletedAt: null };

    if (!user) {
      whereClause.status = 'PUBLISHED';
    } else if (user.roleName === 'agent') {
      whereClause.OR = [
        { status: 'PUBLISHED' },
        { createdById: user.id }
      ];
      if (status) whereClause.status = status;
    } else if (['broker', 'admin', 'super_admin'].includes(user.roleName)) {
      if (status) whereClause.status = status;
    } else {
      whereClause.status = 'PUBLISHED';
    }

    if (transmission) whereClause.transmission = { contains: transmission };
    if (fuel) whereClause.fuel = { contains: fuel };
    if (minPrice || maxPrice) {
      whereClause.priceNu = {};
      if (minPrice) whereClause.priceNu.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.priceNu.lte = parseFloat(maxPrice);
    }
    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { location: { contains: search } },
        { description: { contains: search } }
      ];
    }

    return prisma.vehicle.findMany({
      where: whereClause,
      include: {
        createdBy: { select: { id: true, name: true, email: true, role: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getVehicleById(id, user) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id, deletedAt: null },
      include: { createdBy: { select: { id: true, name: true } } }
    });
    if (!vehicle) throw new Error('Vehicle not found.');

    if (vehicle.status !== 'PUBLISHED') {
      if (!user) throw new Error('Vehicle not found.');
      if (user.roleName === 'agent' && vehicle.createdById !== user.id) {
        throw new Error('Forbidden: You cannot view this pending vehicle listing.');
      }
    }
    return vehicle;
  }

  static async createVehicle(user, data) {
    const isBrokerOrAdmin = ['broker', 'admin', 'super_admin'].includes(user.roleName);
    const initialStatus = isBrokerOrAdmin && data.status ? data.status : 'PENDING_APPROVAL';

    const created = await prisma.vehicle.create({
      data: {
        ...data,
        status: initialStatus,
        createdById: user.id,
        publishedAt: initialStatus === 'PUBLISHED' ? new Date() : null
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'CREATE_VEHICLE',
        entityType: 'vehicle',
        entityId: created.id,
        details: `Created vehicle listing "${created.title}" (Status: ${initialStatus})`
      }
    });

    return created;
  }

  static async updateVehicle(id, user, data) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id, deletedAt: null }
    });
    if (!vehicle) throw new Error('Vehicle not found.');

    if (user.roleName === 'agent' && vehicle.createdById !== user.id) {
      throw new Error('Forbidden: You can only edit vehicles you created.');
    }

    if (data.version !== undefined && data.version !== vehicle.version) {
      const err = new Error('Conflict: Vehicle was modified by another administrator. Please refresh.');
      err.statusCode = 409;
      throw err;
    }

    const { version, ...updateData } = data;

    return prisma.vehicle.update({
      where: { id },
      data: {
        ...updateData,
        version: vehicle.version + 1
      }
    });
  }

  static async publishVehicle(id, user) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id, deletedAt: null }
    });
    if (!vehicle) throw new Error('Vehicle not found.');

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        version: vehicle.version + 1
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'PUBLISH_VEHICLE',
        entityType: 'vehicle',
        entityId: updated.id,
        details: `Approved and published vehicle listing "${updated.title}"`
      }
    });

    return updated;
  }

  static async deleteVehicle(id, user) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id, deletedAt: null }
    });
    if (!vehicle) throw new Error('Vehicle not found.');

    if (user.roleName === 'agent' && vehicle.createdById !== user.id) {
      throw new Error('Forbidden: You can only delete vehicles you created.');
    }

    await prisma.vehicle.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return { success: true };
  }
}
