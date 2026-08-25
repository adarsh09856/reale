import { Router } from 'express';
import { SystemService } from '../services/system.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';

const router = Router();

// GET /api/v1/health (Public unauthenticated health ping)
router.get('/health', (req, res) => {
  const health = SystemService.getPublicHealth();
  res.json(health);
});

// GET /api/v1/health/detailed (Authenticated, permission-gated system metrics)
router.get('/health/detailed', authenticate, requirePermission('system:read'), async (req, res, next) => {
  try {
    const detailed = await SystemService.getDetailedHealth();
    res.json({ success: true, ...detailed });
  } catch (err) {
    next(err);
  }
});

export default router;
