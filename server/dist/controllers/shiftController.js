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
exports.deleteShift = exports.updateShift = exports.createShift = exports.getShiftById = exports.getWeeklySchedule = exports.getAllShifts = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const ShiftModel = __importStar(require("../models/Shift"));
const getWeekDates = (dateString) => {
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
const getAllShifts = async (req, res, next) => {
    try {
        const { date, employee_id, status } = req.query;
        const filters = {};
        if (date)
            filters.date = date;
        if (employee_id)
            filters.employee_id = employee_id;
        if (status)
            filters.status = status;
        // If employee, only show their own shifts
        if (req.user?.role === 'employee') {
            filters.employee_id = req.user.id;
        }
        const shifts = await ShiftModel.findAll(filters);
        res.status(200).json({
            success: true,
            data: shifts,
            count: shifts.length,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllShifts = getAllShifts;
/**
 * @route   GET /api/shifts/week/:date
 * @desc    Get weekly schedule starting from date
 * @access  Protected
 */
const getWeeklySchedule = async (req, res, next) => {
    try {
        const { date } = req.params;
        // Get Monday to Sunday dates
        const { start, end } = getWeekDates(date);
        const filters = {};
        // If employee, only show their own shifts
        if (req.user?.role === 'employee') {
            filters.employee_id = req.user.id;
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
    }
    catch (error) {
        next(error);
    }
};
exports.getWeeklySchedule = getWeeklySchedule;
/**
 * @route   GET /api/shifts/:id
 * @desc    Get shift by ID
 * @access  Protected
 */
const getShiftById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const shift = await ShiftModel.findById(id);
        if (!shift) {
            throw new errorHandler_1.AppError('Shift not found', 404);
        }
        // Employees can only view their own shifts
        if (req.user?.role === 'employee' && shift.assigned_to !== req.user.id) {
            throw new errorHandler_1.AppError('Access denied', 403);
        }
        res.status(200).json({
            success: true,
            data: shift,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getShiftById = getShiftById;
/**
 * @route   POST /api/shifts
 * @desc    Create new shift
 * @access  Manager only
 */
const createShift = async (req, res, next) => {
    try {
        const { assigned_to, shift_date, start_time, end_time, position, notes } = req.body;
        if (!req.user) {
            throw new errorHandler_1.AppError('User not authenticated', 401);
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
    }
    catch (error) {
        next(error);
    }
};
exports.createShift = createShift;
/**
 * @route   PUT /api/shifts/:id
 * @desc    Update shift
 * @access  Manager only
 */
const updateShift = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const existingShift = await ShiftModel.findById(id);
        if (!existingShift) {
            throw new errorHandler_1.AppError('Shift not found', 404);
        }
        const updatedShift = await ShiftModel.update(id, updates);
        res.status(200).json({
            success: true,
            message: 'Shift updated successfully',
            data: updatedShift,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateShift = updateShift;
/**
 * @route   DELETE /api/shifts/:id
 * @desc    Delete shift
 * @access  Manager only
 */
const deleteShift = async (req, res, next) => {
    try {
        const { id } = req.params;
        const shift = await ShiftModel.findById(id);
        if (!shift) {
            throw new errorHandler_1.AppError('Shift not found', 404);
        }
        await ShiftModel.deleteShift(id);
        res.status(200).json({
            success: true,
            message: 'Shift deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteShift = deleteShift;
//# sourceMappingURL=shiftController.js.map