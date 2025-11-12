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
exports.approveShiftSwap = exports.requestShiftPickup = exports.getShiftSwapRequests = exports.getAvailableShifts = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const ShiftSwapModel = __importStar(require("../models/ShiftSwap"));
const ShiftModel = __importStar(require("../models/Shift"));
// ========================================
// CONTROLLER FUNCTIONS
// ========================================
/**
 * @route   GET /api/shift-swaps/available
 * @desc    Get available open shifts
 * @access  Protected (employee)
 */
const getAvailableShifts = async (req, res, next) => {
    try {
        const openShifts = await ShiftModel.findAll({ status: 'open' });
        res.status(200).json({
            success: true,
            data: openShifts,
            count: openShifts.length,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAvailableShifts = getAvailableShifts;
/**
 * @route   GET /api/shift-swaps
 * @desc    Get shift swap requests
 * @access  Protected
 */
const getShiftSwapRequests = async (req, res, next) => {
    try {
        const filters = {};
        // Employees only see their own requests
        if (req.user?.role === 'employee') {
            filters.requesting_employee_id = req.user.id;
        }
        // Filter by status if specified
        if (req.query.status) {
            filters.status = req.query.status;
        }
        const requests = await ShiftSwapModel.findAll(filters);
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
exports.getShiftSwapRequests = getShiftSwapRequests;
/**
 * @route   POST /api/shift-swaps
 * @desc    Request to pick up an open shift
 * @access  Protected (employee)
 */
const requestShiftPickup = async (req, res, next) => {
    try {
        const { shift_id } = req.body;
        if (!req.user) {
            throw new errorHandler_1.AppError('User not authenticated', 401);
        }
        // Verify shift exists and is open
        const shift = await ShiftModel.findById(shift_id);
        if (!shift) {
            throw new errorHandler_1.AppError('Shift not found', 404);
        }
        if (shift.status !== 'open') {
            throw new errorHandler_1.AppError('This shift is not available for pickup', 400);
        }
        const newRequest = await ShiftSwapModel.create({
            shift_id,
            requesting_employee_id: req.user.id,
            status: 'pending',
        });
        res.status(201).json({
            success: true,
            message: 'Shift pickup request submitted successfully',
            data: newRequest,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.requestShiftPickup = requestShiftPickup;
/**
 * @route   PUT /api/shift-swaps/:id
 * @desc    Approve or deny shift swap request
 * @access  Manager only
 */
const approveShiftSwap = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'denied'
        if (!req.user) {
            throw new errorHandler_1.AppError('User not authenticated', 401);
        }
        if (!['approved', 'denied'].includes(status)) {
            throw new errorHandler_1.AppError('Status must be approved or denied', 400);
        }
        const updatedRequest = await ShiftSwapModel.update(id, {
            status: status,
            approved_by: req.user.id,
            approved_at: new Date().toISOString(),
        });
        // If approved, assign the shift to the requesting employee
        if (status === 'approved') {
            // Assign the shift to the requesting employee and mark as scheduled
            await ShiftModel.update(updatedRequest.shift_id, {
                assigned_to: updatedRequest.requesting_employee_id,
                status: 'scheduled',
            });
        }
        res.status(200).json({
            success: true,
            message: `Shift swap request ${status}`,
            data: updatedRequest,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.approveShiftSwap = approveShiftSwap;
//# sourceMappingURL=shiftSwapController.js.map