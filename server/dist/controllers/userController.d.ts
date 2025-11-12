import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Protected (Employee level)
 */
export declare const getAllUsers: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Protected (Employee level)
 */
export declare const getUserById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Protected (Manager level)
 */
export declare const updateUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Protected (Manager level)
 */
export declare const deleteUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map