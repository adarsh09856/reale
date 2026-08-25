import { Router } from 'express';
import { UserService } from '../services/user.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';

const router = Router();

// --- Users ---
router.get('/users', authenticate, requirePermission('users:read'), async (req, res, next) => {
  try {
    const users = await UserService.listUsers();
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
});

router.get('/users/:id', authenticate, requirePermission('users:read'), async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

router.post('/users', authenticate, requirePermission('users:create'), async (req, res, next) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

router.patch('/users/:id', authenticate, requirePermission('users:edit'), async (req, res, next) => {
  try {
    const user = await UserService.updateUser(req.params.id, req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/users/:id', authenticate, requirePermission('users:delete'), async (req, res, next) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- Roles & Permissions ---
router.get('/roles', authenticate, requirePermission('roles:read'), async (req, res, next) => {
  try {
    const roles = await UserService.listRoles();
    res.json({ success: true, count: roles.length, roles });
  } catch (err) {
    next(err);
  }
});

router.get('/roles/:id', authenticate, requirePermission('roles:read'), async (req, res, next) => {
  try {
    const role = await UserService.getRoleById(req.params.id);
    res.json({ success: true, role });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

router.get('/permissions', authenticate, requirePermission('roles:read'), async (req, res, next) => {
  try {
    const permissions = await UserService.listPermissions();
    res.json({ success: true, count: permissions.length, permissions });
  } catch (err) {
    next(err);
  }
});

router.put('/roles/:id/permissions', authenticate, requirePermission('roles:manage_permissions'), async (req, res, next) => {
  try {
    const { permissions } = req.body;
    if (!Array.isArray(permissions)) {
      return res.status(400).json({ success: false, error: 'Permissions must be an array of permission keys.' });
    }
    const updatedRole = await UserService.updateRolePermissions(req.params.id, permissions);
    res.json({ success: true, role: updatedRole });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
