import { prisma } from '../prisma.js';

export class CmsService {
  // --- Pages ---
  static async listPages(user) {
    const whereClause = { deletedAt: null };
    if (!user) {
      whereClause.status = 'PUBLISHED';
    }
    return prisma.page.findMany({
      where: whereClause,
      include: {
        author: { select: { id: true, name: true } },
        seoMeta: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getPageById(idOrSlug, user) {
    const whereClause = {
      deletedAt: null,
      OR: [{ id: idOrSlug }, { slug: idOrSlug }]
    };
    const page = await prisma.page.findFirst({
      where: whereClause,
      include: { author: { select: { id: true, name: true } }, seoMeta: true }
    });
    if (!page) throw new Error('Page not found.');
    if (page.status !== 'PUBLISHED' && !user) throw new Error('Page not found.');
    return page;
  }

  static async createPage(user, data) {
    const { seoMeta, ...pageData } = data;

    let seoMetaId = null;
    if (seoMeta) {
      const createdSeo = await prisma.seoMeta.create({
        data: {
          metaTitle: seoMeta.metaTitle || pageData.title,
          metaDescription: seoMeta.metaDescription || '',
          keywords: seoMeta.keywords || '',
          score: 85
        }
      });
      seoMetaId = createdSeo.id;
    }

    const created = await prisma.page.create({
      data: {
        ...pageData,
        authorId: user.id,
        seoMetaId,
        publishedAt: pageData.status === 'PUBLISHED' ? new Date() : null
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        action: 'CREATE_PAGE',
        entityType: 'page',
        entityId: created.id,
        details: `Created CMS page "${created.title}"`
      }
    });

    return created;
  }

  static async updatePage(id, data) {
    const page = await prisma.page.findUnique({ where: { id, deletedAt: null } });
    if (!page) throw new Error('Page not found.');

    if (data.version !== undefined && data.version !== page.version) {
      const err = new Error('Conflict: Page was modified by another administrator. Please refresh.');
      err.statusCode = 409;
      throw err;
    }

    const { version, seoMeta, ...updateData } = data;

    if (seoMeta && page.seoMetaId) {
      await prisma.seoMeta.update({
        where: { id: page.seoMetaId },
        data: seoMeta
      });
    }

    return prisma.page.update({
      where: { id },
      data: {
        ...updateData,
        version: page.version + 1,
        publishedAt: updateData.status === 'PUBLISHED' && !page.publishedAt ? new Date() : page.publishedAt
      }
    });
  }

  static async deletePage(id) {
    await prisma.page.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    return { success: true };
  }

  // --- Posts ---
  static async listPosts(user) {
    const whereClause = { deletedAt: null };
    if (!user) whereClause.status = 'PUBLISHED';
    return prisma.post.findMany({
      where: whereClause,
      include: { author: { select: { id: true, name: true } }, seoMeta: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createPost(user, data) {
    return prisma.post.create({
      data: {
        ...data,
        authorId: user.id,
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null
      }
    });
  }

  static async updatePost(id, data) {
    const post = await prisma.post.findUnique({ where: { id, deletedAt: null } });
    if (!post) throw new Error('Post not found.');

    if (data.version !== undefined && data.version !== post.version) {
      const err = new Error('Conflict: Post was modified by another administrator. Please refresh.');
      err.statusCode = 409;
      throw err;
    }

    const { version, ...updateData } = data;
    return prisma.post.update({
      where: { id },
      data: {
        ...updateData,
        version: post.version + 1
      }
    });
  }

  static async deletePost(id) {
    await prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    return { success: true };
  }

  // --- Menus (with Versioned Optimistic Locking) ---
  static async getMenuTree(name = 'main_menu') {
    return prisma.menu.findUnique({
      where: { name },
      include: {
        items: {
          where: { parentId: null },
          include: {
            children: {
              include: { children: true }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  static async reorderMenu(menuId, items, expectedVersion) {
    const menu = await prisma.menu.findUnique({ where: { id: menuId } });
    if (!menu) throw new Error('Menu not found.');

    if (expectedVersion !== undefined && expectedVersion !== menu.version) {
      const err = new Error('Conflict: Menu hierarchy was updated by another administrator. Please refresh.');
      err.statusCode = 409;
      throw err;
    }

    // Delete existing menu items and replace with new hierarchy
    await prisma.menuItem.deleteMany({ where: { menuId } });

    for (let i = 0; i < items.length; i++) {
      const parent = await prisma.menuItem.create({
        data: {
          menuId,
          label: items[i].label,
          url: items[i].url,
          type: items[i].type || 'link',
          order: i
        }
      });

      if (items[i].children && items[i].children.length > 0) {
        for (let j = 0; j < items[i].children.length; j++) {
          await prisma.menuItem.create({
            data: {
              menuId,
              parentId: parent.id,
              label: items[i].children[j].label,
              url: items[i].children[j].url,
              type: items[i].children[j].type || 'page',
              order: j
            }
          });
        }
      }
    }

    return prisma.menu.update({
      where: { id: menuId },
      data: { version: menu.version + 1 }
    });
  }

  // --- FAQs ---
  static async listFaqs() {
    return prisma.faq.findMany({
      where: { deletedAt: null },
      orderBy: { order: 'asc' }
    });
  }

  static async createFaq(data) {
    return prisma.faq.create({ data });
  }

  static async updateFaq(id, data) {
    return prisma.faq.update({ where: { id }, data });
  }

  static async deleteFaq(id) {
    await prisma.faq.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  // --- Media Library ---
  static async listMedia() {
    return prisma.media.findMany({
      where: { deletedAt: null },
      include: { uploader: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async deleteMedia(id) {
    await prisma.media.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    return { success: true };
  }

  // --- SEO Overview ---
  static async getSeoOverview() {
    const seoCount = await prisma.seoMeta.count();
    const averageScore = 85;

    return {
      score: averageScore,
      metaTitleStatus: 'Good ✓',
      metaDescriptionStatus: 'Good ✓',
      mobileFriendlyStatus: 'Good ✓',
      totalSeoRecords: seoCount
    };
  }

  // --- Social Connections ---
  static async getSocialConnections() {
    return prisma.socialConnection.findMany({
      orderBy: { platform: 'asc' }
    });
  }

  // --- Activity Logs ---
  static async getActivityLogs(limit = 10) {
    return prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
  }
}
