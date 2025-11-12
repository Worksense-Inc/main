import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public (but typically called by admin/manager)
 */
export declare const register: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export declare const login: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Protected
 */
export declare const logout: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Protected
 */
export declare const getCurrentUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map