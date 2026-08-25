import { Router } from 'express';
import { VehicleService } from '../services/vehicle.service.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';

const router = Router();

// GET /api/v1/vehicles
router.get('/', optionalAuthenticate, async (req, res, next) => {
  try {
    const vehicles = await VehicleService.listVehicles(req.user, req.query);
    res.json({ success: true, count: vehicles.length, vehicles });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/vehicles/:id
router.get('/:id', optionalAuthenticate, async (req, res, next) => {
  try {
    const vehicle = await VehicleService.getVehicleById(req.params.id, req.user);
    res.json({ success: true, vehicle });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// POST /api/v1/vehicles
router.post('/', authenticate, requirePermission('vehicles:create'), async (req, res, next) => {
  try {
    const vehicle = await VehicleService.createVehicle(req.user, req.body);
    res.status(201).json({ success: true, vehicle });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/vehicles/:id
router.patch('/:id', authenticate, requirePermission('vehicles:edit'), async (req, res, next) => {
  try {
    const updated = await VehicleService.updateVehicle(req.params.id, req.user, req.body);
    res.json({ success: true, vehicle: updated });
  } catch (err) {
    res.status(err.statusCode || 400).json({ success: false, error: err.message });
  }
});

// PATCH /api/v1/vehicles/:id/publish
router.patch('/:id/publish', authenticate, requirePermission('vehicles:publish'), async (req, res, next) => {
  try {
    const published = await VehicleService.publishVehicle(req.params.id, req.user);
    res.json({ success: true, vehicle: published });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/vehicles/:id
router.delete('/:id', authenticate, requirePermission('vehicles:delete'), async (req, res, next) => {
  try {
    await VehicleService.deleteVehicle(req.params.id, req.user);
    res.json({ success: true, message: 'Vehicle listing soft deleted successfully.' });
  } catch (err) {
    res.status(403).json({ success: false, error: err.message });
  }
});

export default router;
