import { Router } from 'express';
import { CmsService } from '../services/cms.service.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { uploadMiddleware, processAndSaveImage } from '../utils/fileUpload.js';
import { prisma } from '../prisma.js';

const router = Router();

// --- Pages ---
router.get('/pages', optionalAuthenticate, async (req, res, next) => {
  try {
    const pages = await CmsService.listPages(req.user);
    res.json({ success: true, count: pages.length, pages });
  } catch (err) {
    next(err);
  }
});

router.get('/pages/:idOrSlug', optionalAuthenticate, async (req, res, next) => {
  try {
    const page = await CmsService.getPageById(req.params.idOrSlug, req.user);
    res.json({ success: true, page });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

router.post('/pages', authenticate, requirePermission('pages:create'), async (req, res, next) => {
  try {
    const page = await CmsService.createPage(req.user, req.body);
    res.status(201).json({ success: true, page });
  } catch (err) {
    next(err);
  }
});

router.patch('/pages/:id', authenticate, requirePermission('pages:edit'), async (req, res, next) => {
  try {
    const page = await CmsService.updatePage(req.params.id, req.body);
    res.json({ success: true, page });
  } catch (err) {
    res.status(err.statusCode || 400).json({ success: false, error: err.message });
  }
});

router.delete('/pages/:id', authenticate, requirePermission('pages:delete'), async (req, res, next) => {
  try {
    await CmsService.deletePage(req.params.id);
    res.json({ success: true, message: 'Page soft deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

// --- Posts ---
router.get('/posts', optionalAuthenticate, async (req, res, next) => {
  try {
    const posts = await CmsService.listPosts(req.user);
    res.json({ success: true, count: posts.length, posts });
  } catch (err) {
    next(err);
  }
});

router.post('/posts', authenticate, requirePermission('posts:create'), async (req, res, next) => {
  try {
    const post = await CmsService.createPost(req.user, req.body);
    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
});

router.patch('/posts/:id', authenticate, requirePermission('posts:edit'), async (req, res, next) => {
  try {
    const post = await CmsService.updatePost(req.params.id, req.body);
    res.json({ success: true, post });
  } catch (err) {
    res.status(err.statusCode || 400).json({ success: false, error: err.message });
  }
});

router.delete('/posts/:id', authenticate, requirePermission('posts:delete'), async (req, res, next) => {
  try {
    await CmsService.deletePost(req.params.id);
    res.json({ success: true, message: 'Post soft deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

// --- Menus ---
router.get('/menus', async (req, res, next) => {
  try {
    const menu = await CmsService.getMenuTree(req.query.name || 'main_menu');
    res.json({ success: true, menu });
  } catch (err) {
    next(err);
  }
});

router.patch('/menus/:id/reorder', authenticate, requirePermission('menus:manage'), async (req, res, next) => {
  try {
    const { items, expectedVersion } = req.body;
    const menu = await CmsService.reorderMenu(req.params.id, items, expectedVersion);
    res.json({ success: true, menu });
  } catch (err) {
    res.status(err.statusCode || 400).json({ success: false, error: err.message });
  }
});

// --- FAQs ---
router.get('/faqs', async (req, res, next) => {
  try {
    const faqs = await CmsService.listFaqs();
    res.json({ success: true, count: faqs.length, faqs });
  } catch (err) {
    next(err);
  }
});

router.post('/faqs', authenticate, requirePermission('faqs:create'), async (req, res, next) => {
  try {
    const faq = await CmsService.createFaq(req.body);
    res.status(201).json({ success: true, faq });
  } catch (err) {
    next(err);
  }
});

router.patch('/faqs/:id', authenticate, requirePermission('faqs:edit'), async (req, res, next) => {
  try {
    const faq = await CmsService.updateFaq(req.params.id, req.body);
    res.json({ success: true, faq });
  } catch (err) {
    next(err);
  }
});

router.delete('/faqs/:id', authenticate, requirePermission('faqs:delete'), async (req, res, next) => {
  try {
    await CmsService.deleteFaq(req.params.id);
    res.json({ success: true, message: 'FAQ soft deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

// --- Media Library ---
router.get('/media', authenticate, requirePermission('media:read'), async (req, res, next) => {
  try {
    const media = await CmsService.listMedia();
    res.json({ success: true, count: media.length, media });
  } catch (err) {
    next(err);
  }
});

router.post('/media/upload', authenticate, requirePermission('media:create'), uploadMiddleware.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    const processed = await processAndSaveImage(req.file.buffer, req.file.originalname);
    const mediaRecord = await prisma.media.create({
      data: {
        ...processed,
        uploadedBy: req.user.id
      }
    });

    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        userName: req.user.name,
        action: 'UPLOAD_MEDIA',
        entityType: 'media',
        entityId: mediaRecord.id,
        details: `Uploaded media file "${processed.fileName}" (${(processed.sizeBytes / 1024).toFixed(1)} KB)`
      }
    });

    res.status(201).json({ success: true, media: mediaRecord });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/media/:id', authenticate, requirePermission('media:delete'), async (req, res, next) => {
  try {
    await CmsService.deleteMedia(req.params.id);
    res.json({ success: true, message: 'Media marked for deletion (30-day retention).' });
  } catch (err) {
    next(err);
  }
});

// --- SEO Overview ---
router.get('/seo/overview', authenticate, requirePermission('seo:read'), async (req, res, next) => {
  try {
    const seo = await CmsService.getSeoOverview();
    res.json({ success: true, seo });
  } catch (err) {
    next(err);
  }
});

// --- Social Connections ---
router.get('/social/connections', authenticate, requirePermission('settings:read'), async (req, res, next) => {
  try {
    const connections = await CmsService.getSocialConnections();
    res.json({ success: true, connections });
  } catch (err) {
    next(err);
  }
});

// --- Activity Logs ---
router.get('/activity-logs', authenticate, requirePermission('audit:read'), async (req, res, next) => {
  try {
    const logs = await CmsService.getActivityLogs(parseInt(req.query.limit || '15', 10));
    res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    next(err);
  }
});

export default router;
