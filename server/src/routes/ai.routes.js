import { Router } from 'express';
import { AiService } from '../services/ai.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// POST /api/v1/ai/generate-page
router.post('/generate-page', authenticate, requirePermission('ai:use'), aiLimiter, async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, error: 'Prompt is required.' });
    const result = await AiService.generatePage(prompt);
    res.json({ success: true, page: result });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/ai/generate-faq
router.post('/generate-faq', authenticate, requirePermission('ai:use'), aiLimiter, async (req, res, next) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ success: false, error: 'Topic is required.' });
    const result = await AiService.generateFaq(topic);
    res.json({ success: true, faq: result });
  } catch (err) {
    next(err);
  }
});

export default router;
