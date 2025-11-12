import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler';
import * as ShiftModel from '../models/Shift';

const getWeekDates = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDay();
  const diff = date.getDate() - day; // Get Monday

  const monday = new Date(date.setDate(diff));
  const sunday = new Date(date.setDate(diff + 6));

  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
};

// ========================================
// CONTROLLER FUNCTIONS
// ========================================

/**
 * @route   GET /api/shifts
 * @desc    Get all shifts with optional filters
 * @access  Protected
 * @query   ?date=YYYY-MM-DD&employee_id=uuid&status=scheduled
 */
export const getAllShifts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, employee_id, status } = req.query;

    const filters: Record<string, string> = {};
    if (date) filters.date = date as string;
    if (employee_id) filters.assigned_to = employee_id as string;
    if (status) filters.status = status as string;

    // If employee, only show their own shifts
    if (req.user?.role === 'employee') {
      filters.assigned_to = req.user.id;
    }

    const shifts = await ShiftModel.findAll(filters);

    res.status(200).json({
      success: true,
      data: shifts,
      count: shifts.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/shifts/week/:date
 * @desc    Get weekly schedule starting from date
 * @access  Protected
 */
export const getWeeklySchedule = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.params;

    // Get Monday to Sunday dates
    const { start, end } = getWeekDates(date);

    const filters: Record<string, string> = {};

    // If employee, only show their own shifts
    if (req.user?.role === 'employee') {
      filters.assigned_to = req.user.id;
    }

    const shifts = await ShiftModel.getByDateRange(start, end, filters);

    res.status(200).json({
      success: true,
      data: {
        week_start: start,
        week_end: end,
        shifts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/shifts/:id
 * @desc    Get shift by ID
 * @access  Protected
 */
export const getShiftById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const shift = await ShiftModel.findById(id);
    if (!shift) {
      throw new AppError('Shift not found', 404);
    }

    // Employees can only view their own shifts
    if (req.user?.role === 'employee' && shift.assigned_to !== req.user.id) {
      throw new AppError('Access denied', 403);
    }

    res.status(200).json({
      success: true,
      data: shift,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/shifts
 * @desc    Create new shift
 * @access  Manager only
 */
export const createShift = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assigned_to, shift_date, start_time, end_time, position, notes } =
      req.body;

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const newShift = await ShiftModel.create({
      assigned_to: assigned_to || null,
      shift_date,
      start_time,
      end_time,
      position,
      notes,
      status: assigned_to ? 'scheduled' : 'open',
      created_by: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Shift created successfully',
      data: newShift,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/shifts/:id
 * @desc    Update shift
 * @access  Manager only
 */
export const updateShift = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existingShift = await ShiftModel.findById(id);
    if (!existingShift) {
      throw new AppError('Shift not found', 404);
    }

    const updatedShift = await ShiftModel.update(id, updates);

    res.status(200).json({
      success: true,
      message: 'Shift updated successfully',
      data: updatedShift,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/shifts/:id
 * @desc    Delete shift
 * @access  Manager only
 */
export const deleteShift = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const shift = await ShiftModel.findById(id);
    if (!shift) {
      throw new AppError('Shift not found', 404);
    }

    await ShiftModel.deleteShift(id);

    res.status(200).json({
      success: true,
      message: 'Shift deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
