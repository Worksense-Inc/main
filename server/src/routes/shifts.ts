import { Router } from 'express';
import {
  getAllShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
  getWeeklySchedule,
} from '../controllers/shiftController';
import { authenticateToken, requireManager } from '../middleware/auth';
import { createShiftValidator, updateShiftValidator } from '../middleware/validators';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Validation middleware wrapper
const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array()
    });
    return;
  }
  next();
};

// All shift routes require authentication
router.use(authenticateToken);

// GET routes (employees can view)
router.get('/', getAllShifts);
router.get('/week/:date', getWeeklySchedule);
router.get('/:id', getShiftById);

// POST, PUT, DELETE routes (managers only)
router.post('/', requireManager, createShiftValidator, validate, createShift);
router.put('/:id', requireManager, updateShiftValidator, validate, updateShift);
router.delete('/:id', requireManager, deleteShift);

export default router;
