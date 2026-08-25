import { prisma } from '../prisma.js';

export class PropertyService {
  static async listProperties(user, query = {}) {
    const { status, type, location, minPrice, maxPrice, search } = query;

    let whereClause = { deletedAt: null };

    // Scoping
    if (!user) {
      // Public: published only
      whereClause.status = 'PUBLISHED';
    } else if (user.roleName === 'agent') {
      // Agent: all published OR their own listings
      whereClause.OR = [
        { status: 'PUBLISHED' },
        { createdById: user.id }
      ];
      if (status) {
        whereClause.status = status;
      }
    } else if (['broker', 'admin', 'super_admin'].includes(user.roleName)) {
      // Broker/Admin: can filter by any status or see all
      if (status) {
        whereClause.status = status;
      }
    } else {
      whereClause.status = 'PUBLISHED';
    }

    if (type) whereClause.type = { contains: type };
    if (location) whereClause.location = { contains: location };
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

    return prisma.property.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getPropertyById(id, user) {
    const property = await prisma.property.findUnique({
      where: { id, deletedAt: null },
      include: {
        createdBy: { select: { id: true, name: true, phone: true } }
      }
    });

    if (!property) throw new Error('Property not found.');

    // If not published, verify access
    if (property.status !== 'PUBLISHED') {
      if (!user) throw new Error('Property not found.');
      if (user.roleName === 'agent' && property.createdById !== user.id) {
        throw new Error('Forbidden: You do not have permission to view this pending listing.');
      }
    }

    return property;
  }

  static async createProperty(user, data) {
    const isBrokerOrAdmin = ['broker', 'admin', 'super_admin'].includes(user.roleName);
    const initialStatus = isBrokerOrAdmin && data.status ? data.status : 'PENDING_APPROVAL';

    const created = await prisma.property.create({
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
        action: 'CREATE_PROPERTY',
        entityType: 'property',
        entityId: created.id,
        details: `Created property listing "${created.title}" (Status: ${initialStatus})`
      }
    });

    return created;
  }

  static async updateProperty(id, user, data) {
    const property = await prisma.property.findUnique({
      where: { id, deletedAt: null }
    });
    if (!property) throw new Error('Property not found.');

    // Row-level ownership check for agents
    if (user.roleName === 'agent' && property.createdById !== user.id) {
      throw new Error('Forbidden: You can only edit properties you created.');
    }

    // Optimistic Concurrency Check
    if (data.version !== undefined && data.version !== property.version) {
      const err = new Error('Conflict: Property was modified by another administrator. Please refresh.');
      err.statusCode = 409;
      throw err;
    }

    const { version, ...updateData } = data;

    const updated = await prisma.property.update({
      where: { id },
      data: {
        ...updateData,
        version: property.version + 1
      }
    });

    return updated;
  }

  static async publishProperty(id, user) {
    const property = await prisma.property.findUnique({
      where: { id, deletedAt: null }
    });
    if (!property) throw new Error('Property not found.');

    const updated = await prisma.property.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        version: property.version + 1
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'PUBLISH_PROPERTY',
        entityType: 'property',
        entityId: updated.id,
        details: `Approved and published listing "${updated.title}"`
      }
    });

    return updated;
  }

  static async deleteProperty(id, user) {
    const property = await prisma.property.findUnique({
      where: { id, deletedAt: null }
    });
    if (!property) throw new Error('Property not found.');

    if (user.roleName === 'agent' && property.createdById !== user.id) {
      throw new Error('Forbidden: You can only delete properties you created.');
    }

    await prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'DELETE_PROPERTY',
        entityType: 'property',
        entityId: id,
        details: `Soft deleted property "${property.title}"`
      }
    });

    return { success: true };
  }
}
