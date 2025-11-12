import { Router } from 'express';
import {
  getShiftSwapRequests,
  requestShiftPickup,
  approveShiftSwap,
  getAvailableShifts,
} from '../controllers/shiftSwapController';
import { authenticateToken, requireManager } from '../middleware/auth';

const router = Router();

// All shift swap routes require authentication
router.use(authenticateToken);

// GET routes (employees can view)
router.get('/', getShiftSwapRequests);
router.get('/available', getAvailableShifts);

// POST route (employees can create swap requests)
router.post('/', requestShiftPickup);

// PUT route (managers only - to approve/reject)
router.put('/:id/approve', requireManager, approveShiftSwap);

export default router;
