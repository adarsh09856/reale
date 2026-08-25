import { Router } from 'express';
import { KpiService } from '../services/kpi.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';

const router = Router();

// GET /api/v1/kpis/summary
router.get('/summary', authenticate, requirePermission('dashboard:read'), async (req, res, next) => {
  try {
    const summary = await KpiService.getSummary();
    res.json({ success: true, ...summary });
  } catch (err) {
    next(err);
  }
});

export default router;
