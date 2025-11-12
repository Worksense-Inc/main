import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/errorHandler';

// ========================================
// PLACEHOLDER DATABASE FUNCTIONS
// TODO: Replace with Jorge's TimeOff model functions
// ========================================
const db = {
  async getAllTimeOffRequests(filters?: any): Promise<any[]> {
    // TODO: Jorge will provide this query
    throw new Error('Database function not implemented');
  },

  async getTimeOffById(id: string): Promise<any | null> {
    // TODO: Jorge will provide this query
    throw new Error('Database function not implemented');
  },

  async createTimeOffRequest(requestData: any): Promise<any> {
    // TODO: Jorge will provide this query
    throw new Error('Database function not implemented');
  },

  async updateTimeOffStatus(id: string, status: string, reviewedBy: string): Promise<any> {
    // TODO: Jorge will provide this query
    throw new Error('Database function not implemented');
  },

  async deleteTimeOffRequest(id: string): Promise<boolean> {
    // TODO: Jorge will provide this query
    throw new Error('Database function not implemented');
  }
};

// ========================================
// CONTROLLER FUNCTIONS
// ========================================

/**
 * @route   GET /api/time-off
 * @desc    Get all time off requests
 * @access  Protected
 */
export const getAllTimeOffRequests = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters: any = {};
    
    // Employees only see their own requests
    if (req.user?.role === 'employee') {
      filters.employee_id = req.user.id;
    }
    
    // Managers can filter by status
    if (req.query.status) {
      filters.status = req.query.status;
    }

    const requests = await db.getAllTimeOffRequests(filters);

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
 * @route   GET /api/time-off/:id
 * @desc    Get time off request by ID
 * @access  Protected
 */
export const getTimeOffById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const request = await db.getTimeOffById(id);
    if (!request) {
      throw new AppError('Time off request not found', 404);
    }

    // Employees can only view their own requests
    if (req.user?.role === 'employee' && request.employee_id !== req.user.id) {
      throw new AppError('Access denied', 403);
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/time-off
 * @desc    Create time off request
 * @access  Protected (employee)
 */
export const createTimeOffRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { start_date, end_date, reason } = req.body;

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (endDate < startDate) {
      throw new AppError('End date must be after start date', 400);
    }

    const newRequest = await db.createTimeOffRequest({
      employee_id: req.user.id,
      start_date,
      end_date,
      reason,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Time off request submitted successfully',
      data: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/time-off/:id
 * @desc    Update time off request status (approve/deny)
 * @access  Manager only
 */
export const updateTimeOffStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const request = await db.getTimeOffById(id);
    if (!request) {
      throw new AppError('Time off request not found', 404);
    }

    if (request.status !== 'pending') {
      throw new AppError('Only pending requests can be updated', 400);
    }

    const updatedRequest = await db.updateTimeOffStatus(id, status, req.user.id);

    res.status(200).json({
      success: true,
      message: `Time off request ${status}`,
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/time-off/:id
 * @desc    Delete time off request
 * @access  Protected (employee can delete own pending requests)
 */
export const deleteTimeOffRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    const request = await db.getTimeOffById(id);
    if (!request) {
      throw new AppError('Time off request not found', 404);
    }

    // Only the employee who created it can delete (and only if pending)
    if (request.employee_id !== req.user.id && req.user.role !== 'manager') {
      throw new AppError('Access denied', 403);
    }

    if (request.status !== 'pending') {
      throw new AppError('Only pending requests can be deleted', 400);
    }

    await db.deleteTimeOffRequest(id);

    res.status(200).json({
      success: true,
      message: 'Time off request deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};