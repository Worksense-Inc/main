import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authenticateToken, requireManager } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET routes (employees can view basic info)
router.get('/', getAllUsers);
router.get('/:id', getUserById);

// PUT and DELETE routes (managers only)
router.put('/:id', requireManager, updateUser);
router.delete('/:id', requireManager, deleteUser);
≈r
export default router;
