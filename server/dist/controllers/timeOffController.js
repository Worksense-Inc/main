"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTimeOffRequest = exports.updateTimeOffStatus = exports.createTimeOffRequest = exports.getTimeOffById = exports.getAllTimeOffRequests = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const TimeOffModel = __importStar(require("../models/TimeOff"));
/**
 * @route   GET /api/time-off
 * @desc    Get all time off requests
 * @access  Protected
 */
const getAllTimeOffRequests = async (req, res, next) => {
    try {
        const filters = {};
        // Employees only see their own requests
        if (req.user?.role === 'employee') {
            filters.employee_id = req.user.id;
        }
        // Managers can filter by status
        if (req.query.status) {
            filters.status = req.query.status;
        }
        const requests = await TimeOffModel.findAll(filters);
        res.status(200).json({
            success: true,
            data: requests,
            count: requests.length,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllTimeOffRequests = getAllTimeOffRequests;
/**
 * @route   GET /api/time-off/:id
 * @desc    Get time off request by ID
 * @access  Protected
 */
const getTimeOffById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const request = await TimeOffModel.findById(id);
        if (!request) {
            throw new errorHandler_1.AppError('Time off request not found', 404);
        }
        // Employees can only view their own requests
        if (req.user?.role === 'employee' && request.employee_id !== req.user.id) {
            throw new errorHandler_1.AppError('Access denied', 403);
        }
        res.status(200).json({
            success: true,
            data: request,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTimeOffById = getTimeOffById;
/**
 * @route   POST /api/time-off
 * @desc    Create time off request
 * @access  Protected (employee)
 */
const createTimeOffRequest = async (req, res, next) => {
    try {
        const { start_date, end_date, reason } = req.body;
        if (!req.user) {
            throw new errorHandler_1.AppError('User not authenticated', 401);
        }
        // Validate dates
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        if (endDate < startDate) {
            throw new errorHandler_1.AppError('End date must be after start date', 400);
        }
        const newRequest = await TimeOffModel.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.createTimeOffRequest = createTimeOffRequest;
/**
 * @route   PUT /api/time-off/:id
 * @desc    Update time off request status (approve/deny)
 * @access  Manager only
 */
const updateTimeOffStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!req.user) {
            throw new errorHandler_1.AppError('User not authenticated', 401);
        }
        const request = await TimeOffModel.findById(id);
        if (!request) {
            throw new errorHandler_1.AppError('Time off request not found', 404);
        }
        if (request.status !== 'pending') {
            throw new errorHandler_1.AppError('Only pending requests can be updated', 400);
        }
        const updatedRequest = await TimeOffModel.update(id, {
            status: status,
            reviewed_by: req.user.id,
            reviewed_at: new Date().toISOString(),
        });
        res.status(200).json({
            success: true,
            message: `Time off request ${status}`,
            data: updatedRequest,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateTimeOffStatus = updateTimeOffStatus;
/**
 * @route   DELETE /api/time-off/:id
 * @desc    Delete time off request
 * @access  Protected (employee can delete own pending requests)
 */
const deleteTimeOffRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            throw new errorHandler_1.AppError('User not authenticated', 401);
        }
        const request = await TimeOffModel.findById(id);
        if (!request) {
            throw new errorHandler_1.AppError('Time off request not found', 404);
        }
        // Only the employee who created it can delete (and only if pending)
        if (request.employee_id !== req.user.id && req.user.role !== 'manager') {
            throw new errorHandler_1.AppError('Access denied', 403);
        }
        if (request.status !== 'pending') {
            throw new errorHandler_1.AppError('Only pending requests can be deleted', 400);
        }
        await TimeOffModel.deleteTimeOffRequest(id);
        res.status(200).json({
            success: true,
            message: 'Time off request deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTimeOffRequest = deleteTimeOffRequest;
//# sourceMappingURL=timeOffController.js.map