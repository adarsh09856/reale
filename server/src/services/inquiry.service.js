import { prisma } from '../prisma.js';

export class InquiryService {
  static async listInquiries(user, query = {}) {
    const { status, type } = query;
    let whereClause = { deletedAt: null };

    // Scoping: Agents only see inquiries assigned to them; Brokers/Admins see all
    if (user.roleName === 'agent') {
      whereClause.assignedToId = user.id;
    }

    if (status) whereClause.status = status;
    if (type) whereClause.type = type;

    return prisma.inquiry.findMany({
      where: whereClause,
      include: {
        assignedTo: { select: { id: true, name: true, email: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createInquiry(data) {
    return prisma.inquiry.create({
      data: {
        type: data.type || 'GENERAL',
        itemId: data.itemId || null,
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        message: data.message,
        source: data.source || 'WEBSITE',
        status: 'NEW'
      }
    });
  }

  static async assignInquiry(inquiryId, assignedToId, currentUser) {
    // 1. Verify Inquiry exists
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId, deletedAt: null }
    });
    if (!inquiry) throw new Error('Inquiry not found.');

    // 2. Validate Target User holds Agent/Broker/Admin role
    const targetUser = await prisma.user.findUnique({
      where: { id: assignedToId, deletedAt: null },
      include: { role: true }
    });

    if (!targetUser || !['agent', 'broker', 'admin', 'super_admin'].includes(targetUser.role.name)) {
      const err = new Error('Invalid assignment: Target user must hold an Agent, Broker, or Admin role.');
      err.statusCode = 400;
      throw err;
    }

    // 3. Update Inquiry
    const updated = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: {
        assignedToId: targetUser.id,
        assignedAt: new Date(),
        status: inquiry.status === 'NEW' ? 'ASSIGNED' : inquiry.status
      },
      include: { assignedTo: { select: { id: true, name: true, email: true } } }
    });

    // 4. Log Audit Activity
    await prisma.activityLog.create({
      data: {
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'LEAD_ASSIGNED',
        entityType: 'inquiry',
        entityId: inquiryId,
        details: `Assigned lead from "${inquiry.name}" to agent ${targetUser.name}`
      }
    });

    return updated;
  }

  static async updateStatus(inquiryId, status, currentUser) {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: inquiryId, deletedAt: null }
    });
    if (!inquiry) throw new Error('Inquiry not found.');

    if (currentUser.roleName === 'agent' && inquiry.assignedToId !== currentUser.id) {
      throw new Error('Forbidden: You can only update inquiries assigned to you.');
    }

    return prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status }
    });
  }

  static async deleteInquiry(inquiryId) {
    await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { deletedAt: new Date() }
    });
    return { success: true };
  }
}
