import { Router } from 'express';
import { InquiryService } from '../services/inquiry.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';
import { inquiryLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// GET /api/v1/inquiries
router.get('/', authenticate, requirePermission('inquiries:read'), async (req, res, next) => {
  try {
    const inquiries = await InquiryService.listInquiries(req.user, req.query);
    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/inquiries (Public submission)
router.post('/', inquiryLimiter, async (req, res, next) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, error: 'Name, phone, and message are required.' });
    }
    const inquiry = await InquiryService.createInquiry(req.body);
    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/inquiries/:id/assign (Assign Lead to an Agent)
router.patch('/:id/assign', authenticate, requirePermission('inquiries:edit'), async (req, res, next) => {
  try {
    const { assignedToId } = req.body;
    if (!assignedToId) {
      return res.status(400).json({ success: false, error: 'assignedToId is required.' });
    }
    const updated = await InquiryService.assignInquiry(req.params.id, assignedToId, req.user);
    res.json({ success: true, inquiry: updated });
  } catch (err) {
    res.status(err.statusCode || 400).json({ success: false, error: err.message });
  }
});

// PATCH /api/v1/inquiries/:id/status
router.patch('/:id/status', authenticate, requirePermission('inquiries:edit'), async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, error: 'Status is required.' });
    const updated = await InquiryService.updateStatus(req.params.id, status, req.user);
    res.json({ success: true, inquiry: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/inquiries/:id
router.delete('/:id', authenticate, requirePermission('inquiries:delete'), async (req, res, next) => {
  try {
    await InquiryService.deleteInquiry(req.params.id);
    res.json({ success: true, message: 'Inquiry soft deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

export default router;
