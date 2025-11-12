import { Router } from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
} from '../middleware/validators';
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Validation middleware wrapper
const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  next();
};

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

// Protected routes
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getCurrentUser);
router.put(
  '/profile',
  authenticateToken,
  updateProfileValidator,
  validate,
  updateProfile
);

export default router;
