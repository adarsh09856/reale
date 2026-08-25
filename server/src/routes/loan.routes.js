import { Router } from 'express';
import { LoanService } from '../services/loan.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/rbac.middleware.js';

const router = Router();

// GET /api/v1/loan/rates (Public: returns active bank rates from DB)
router.get('/rates', async (req, res, next) => {
  try {
    const rates = await LoanService.getActiveRates();
    res.json({ success: true, count: rates.length, rates });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/loan/calculate (Public: multi-bank EMI calculation reading DB rates)
router.post('/calculate', async (req, res, next) => {
  try {
    const { propertyPriceNu, downPaymentNu, tenureYears, bankKey } = req.body;
    if (!propertyPriceNu) {
      return res.status(400).json({ success: false, error: 'propertyPriceNu is required.' });
    }
    const calculation = await LoanService.calculateLoan({
      propertyPriceNu,
      downPaymentNu,
      tenureYears,
      bankKey
    });
    res.json({ success: true, calculation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/v1/admin/loan-rates (Admin: list all bank rates)
router.get('/admin/rates', authenticate, requirePermission('bank_rates:read'), async (req, res, next) => {
  try {
    const rates = await LoanService.getAllRates();
    res.json({ success: true, rates });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/loan-rates (Admin: add bank rate)
router.post('/admin/rates', authenticate, requirePermission('bank_rates:manage'), async (req, res, next) => {
  try {
    const rate = await LoanService.createBankRate(req.body);
    res.status(201).json({ success: true, rate });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/admin/loan-rates/:id (Admin: update bank rate)
router.patch('/admin/rates/:id', authenticate, requirePermission('bank_rates:manage'), async (req, res, next) => {
  try {
    const rate = await LoanService.updateBankRate(req.params.id, req.body);
    res.json({ success: true, rate });
  } catch (err) {
    next(err);
  }
});

export default router;
