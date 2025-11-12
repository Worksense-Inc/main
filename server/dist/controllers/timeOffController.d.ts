import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
/**
 * @route   GET /api/time-off
 * @desc    Get all time off requests
 * @access  Protected
 */
export declare const getAllTimeOffRequests: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   GET /api/time-off/:id
 * @desc    Get time off request by ID
 * @access  Protected
 */
export declare const getTimeOffById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   POST /api/time-off
 * @desc    Create time off request
 * @access  Protected (employee)
 */
export declare const createTimeOffRequest: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   PUT /api/time-off/:id
 * @desc    Update time off request status (approve/deny)
 * @access  Manager only
 */
export declare const updateTimeOffStatus: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   DELETE /api/time-off/:id
 * @desc    Delete time off request
 * @access  Protected (employee can delete own pending requests)
 */
export declare const deleteTimeOffRequest: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=timeOffController.d.ts.map