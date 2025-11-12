import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
/**
 * @route   GET /api/shifts
 * @desc    Get all shifts with optional filters
 * @access  Protected
 * @query   ?date=YYYY-MM-DD&employee_id=uuid&status=scheduled
 */
export declare const getAllShifts: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   GET /api/shifts/week/:date
 * @desc    Get weekly schedule starting from date
 * @access  Protected
 */
export declare const getWeeklySchedule: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   GET /api/shifts/:id
 * @desc    Get shift by ID
 * @access  Protected
 */
export declare const getShiftById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   POST /api/shifts
 * @desc    Create new shift
 * @access  Manager only
 */
export declare const createShift: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   PUT /api/shifts/:id
 * @desc    Update shift
 * @access  Manager only
 */
export declare const updateShift: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
/**
 * @route   DELETE /api/shifts/:id
 * @desc    Delete shift
 * @access  Manager only
 */
export declare const deleteShift: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=shiftController.d.ts.map