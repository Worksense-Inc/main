import { Router } from 'express';
import {
  getAllTimeOffRequests,
  getTimeOffById,
  createTimeOffRequest,
  updateTimeOffStatus,
  deleteTimeOffRequest,
} from '../controllers/timeOffController';
import { authenticateToken, requireManager } from '../middleware/auth';
import { createTimeOffValidator, updateTimeOffValidator } from '../middleware/validators';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Validation middleware wrapper
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// All routes require authentication
router.use(authenticateToken);

// GET routes
router.get('/', getAllTimeOffRequests);
router.get('/:id', getTimeOffById);

// POST routes (employees can create their own)
router.post('/', createTimeOffValidator, validate, createTimeOffRequest);

// PUT routes (managers approve/deny)
router.put('/:id', requireManager, updateTimeOffValidator, validate, updateTimeOffStatus);

// DELETE routes (employees can delete their own pending requests)
router.delete('/:id', deleteTimeOffRequest);

export default router;
