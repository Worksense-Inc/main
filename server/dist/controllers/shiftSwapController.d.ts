import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
/**
 * @route   GET /api/shift-swaps/available
 * @desc    Get available open shifts
 * @access  Protected (employee)
 */
export declare const getAvailableShifts: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   GET /api/shift-swaps
 * @desc    Get shift swap requests
 * @access  Protected
 */
export declare const getShiftSwapRequests: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   POST /api/shift-swaps
 * @desc    Request to pick up an open shift
 * @access  Protected (employee)
 */
export declare const requestShiftPickup: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   PUT /api/shift-swaps/:id
 * @desc    Approve or deny shift swap request
 * @access  Manager only
 */
export declare const approveShiftSwap: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=shiftSwapController.d.ts.map