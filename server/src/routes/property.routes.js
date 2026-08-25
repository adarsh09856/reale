import { Router } from 'express';
import { PropertyService } from '../services/property.service.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';

const router = Router();

// GET /api/v1/properties (Public reads published; Auth scoped for agents/brokers)
router.get('/', optionalAuthenticate, async (req, res, next) => {
  try {
    const properties = await PropertyService.listProperties(req.user, req.query);
    res.json({ success: true, count: properties.length, properties });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/properties/:id
router.get('/:id', optionalAuthenticate, async (req, res, next) => {
  try {
    const property = await PropertyService.getPropertyById(req.params.id, req.user);
    res.json({ success: true, property });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// POST /api/v1/properties
router.post('/', authenticate, requirePermission('properties:create'), async (req, res, next) => {
  try {
    const property = await PropertyService.createProperty(req.user, req.body);
    res.status(201).json({ success: true, property });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/properties/:id
router.patch('/:id', authenticate, requirePermission('properties:edit'), async (req, res, next) => {
  try {
    const updated = await PropertyService.updateProperty(req.params.id, req.user, req.body);
    res.json({ success: true, property: updated });
  } catch (err) {
    res.status(err.statusCode || 400).json({ success: false, error: err.message });
  }
});

// PATCH /api/v1/properties/:id/publish (Broker / Admin only)
router.patch('/:id/publish', authenticate, requirePermission('properties:publish'), async (req, res, next) => {
  try {
    const published = await PropertyService.publishProperty(req.params.id, req.user);
    res.json({ success: true, property: published });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/properties/:id
router.delete('/:id', authenticate, requirePermission('properties:delete'), async (req, res, next) => {
  try {
    await PropertyService.deleteProperty(req.params.id, req.user);
    res.json({ success: true, message: 'Property listing soft deleted successfully.' });
  } catch (err) {
    res.status(403).json({ success: false, error: err.message });
  }
});

export default router;
