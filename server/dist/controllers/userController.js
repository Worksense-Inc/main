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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const UserModel = __importStar(require("../models/User"));
/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Protected (Employee level)
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.findAll();
        res.status(200).json({
            success: true,
            data: users.map((user) => ({
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
            })),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Protected (Employee level)
 */
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                created_at: user.created_at,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Protected (Manager level)
 */
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Validate user exists
        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        // Update user
        const updatedUser = await UserModel.update(id, updateData);
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: {
                id: updatedUser.id,
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                role: updatedUser.role,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Protected (Manager level)
 */
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Validate user exists
        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        // Prevent self-deletion
        if (req.user?.id === id) {
            throw new errorHandler_1.AppError('Cannot delete your own account', 400);
        }
        await UserModel.deleteUser(id);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map