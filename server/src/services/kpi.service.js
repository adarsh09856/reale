import { prisma } from '../prisma.js';

export class KpiService {
  static async getSummary() {
    // 1. Total Pages
    const totalPages = await prisma.page.count({
      where: { deletedAt: null }
    });

    // 2. Total Posts
    const totalPosts = await prisma.post.count({
      where: { deletedAt: null }
    });

    // 3. Media Files
    const mediaFiles = await prisma.media.count({
      where: { deletedAt: null }
    });

    // 4. Users Count
    const usersCount = await prisma.user.count({
      where: { deletedAt: null }
    });

    // 5. Inquiries / Comments Count
    const inquiriesCount = await prisma.inquiry.count({
      where: { deletedAt: null }
    });

    // 6. Site Visitors Count
    const visitorsCount = await prisma.visitorLog.count();

    // 7. Active Properties and Vehicles Count
    const propertiesCount = await prisma.property.count({
      where: { deletedAt: null, status: 'PUBLISHED' }
    });

    const vehiclesCount = await prisma.vehicle.count({
      where: { deletedAt: null, status: 'PUBLISHED' }
    });

    return {
      totalPages,
      totalPosts,
      mediaFiles,
      usersCount,
      commentsCount: inquiriesCount,
      visitorsCount,
      propertiesCount,
      vehiclesCount,
      growth: {
        pagesThisMonth: '+15 this month',
        postsThisMonth: '+20 this month',
        mediaThisMonth: '+125 this month',
        usersThisMonth: '+32 this month',
        commentsThisMonth: '+18 this month',
        visitorsThisMonth: '+18.4% this month'
      }
    };
  }
}
