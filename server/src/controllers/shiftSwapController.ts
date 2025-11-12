import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler';

// ========================================
// PLACEHOLDER DATABASE FUNCTIONS
// TODO: Replace with Jorge's model functions
// ========================================
const db = {
  async getOpenShifts(): Promise<any[]> {
    // TODO: Jorge will provide this query
    // Should return shifts with status='open'
    throw new Error('Database function not implemented');
  },

  async getShiftById(id: string): Promise<any | null> {
    // TODO: Jorge will provide this query
    throw new Error('Database function not implemented');
  },

  async createShiftSwapRequest(requestData: any): Promise<any> {
    // TODO: Jorge will provide this query
    throw new Error('Database function not implemented');
  },

  async getShiftSwapRequests(filters?: any): Promise<any[]> {
    // TODO: Jorge will provide this query
    throw new Error('Database function not implemented');
  },

  async updateShiftSwapStatus(id: string, status: string, approvedBy: string): Promise<any> {
    // TODO: Jorge will provide this query
    throw new Error('Database function not implemented');
  },

  async assignShiftToEmployee(shiftId: string, employeeId: string): Promise<any> {
    // TODO: Jorge will provide this query
    throw new Error('Database function not implemented');
  }
};

// ========================================
// CONTROLLER FUNCTIONS
// ========================================

/**
 * @route   GET /api/shift-swaps/available
 * @desc    Get available open shifts
 * @access  Protected (employee)
 */
export const getAvailableShifts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const openShifts = await db.getOpenShifts();

    res.status(200).json({
      success: true,
      data: openShifts,
      count: openShifts.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/shift-swaps
 * @desc    Get shift swap requests
 * @access  Protected
 */
export const getShiftSwapRequests = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters: any = {};
    
    // Employees only see their own requests
    if (req.user?.role === 'employee') {
      filters.requesting_employee_id = req.user.id;
    }
    
    // Filter by status if specified
    if (req.query.status) {
      filters.status = req.query.status;
    }

    const requests = await db.getShiftSwapRequests(filters);

    res.status(200).json({
      success: true,
      data: requests,
      count: requests.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/shift-swaps
 * @desc    Request to pick up an open shift
 * @access  Protected (employee)
 */
export const requestShiftPickup = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shift_id } = req.body;

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    // Verify shift exists and is open
    const shift = await db.getShiftById(shift_id);
    if (!shift) {
      throw new AppError('Shift not found', 404);
    }

    if (shift.status !== 'open') {
      throw new AppError('This shift is not available for pickup', 400);
    }

    const newRequest = await db.createShiftSwapRequest({
      shift_id,
      requesting_employee_id: req.user.id,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Shift pickup request submitted successfully',
      data: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/shift-swaps/:id
 * @desc    Approve or deny shift swap request
 * @access  Manager only
 */
export const approveShiftSwap = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'denied'

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    if (!['approved', 'denied'].includes(status)) {
      throw new AppError('Status must be approved or denied', 400);
    }

    const updatedRequest = await db.updateShiftSwapStatus(id, status, req.user.id);

    // If approved, assign the shift to the requesting employee
    if (status === 'approved') {
      await db.assignShiftToEmployee(
        updatedRequest.shift_id, 
        updatedRequest.requesting_employee_id
      );
    }

    res.status(200).json({
      success: true,
      message: `Shift swap request ${status}`,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};