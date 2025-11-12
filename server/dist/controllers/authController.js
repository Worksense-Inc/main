"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../middleware/errorHandler");
// ========================================
// PLACEHOLDER DATABASE FUNCTIONS
// TODO: Replace with Jorge's User model functions
// ========================================
const db = {
    async findUserByEmail(email) {
        // TODO: Jorge will provide this query
        // Should return user object or null
        throw new Error('Database function not implemented');
    },
    async createUser(userData) {
        // TODO: Jorge will provide this query
        // Should return created user object
        throw new Error('Database function not implemented');
    },
    async findUserById(id) {
        // TODO: Jorge will provide this query
        // Should return user object or null
        throw new Error('Database function not implemented');
    }
};
// ========================================
// HELPER FUNCTIONS
// ========================================
const generateToken = (userId, email, role) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
    }
    return jsonwebtoken_1.default.sign({ id: userId, email, role }, jwtSecret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};
// ========================================
// CONTROLLER FUNCTIONS
// ========================================
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public (but typically called by admin/manager)
 */
const register = async (req, res, next) => {
    try {
        const { email, password, first_name, last_name, role } = req.body;
        // Check if user already exists
        const existingUser = await db.findUserByEmail(email);
        if (existingUser) {
            throw new errorHandler_1.AppError('User with this email already exists', 400);
        }
        // Hash password
        const saltRounds = 10;
        const password_hash = await bcrypt_1.default.hash(password, saltRounds);
        // Create user
        const newUser = await db.createUser({
            email,
            password_hash,
            first_name,
            last_name,
            role,
        });
        // Generate token
        const token = generateToken(newUser.id, newUser.email, newUser.role);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    first_name: newUser.first_name,
                    last_name: newUser.last_name,
                    role: newUser.role,
                },
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await db.findUserByEmail(email);
        if (!user) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        // Check password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        // Generate token
        const token = generateToken(user.id, user.email, user.role);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role,
                },
                token,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Protected
 */
const logout = async (req, res, next) => {
    try {
        // With JWT, logout is handled client-side by removing token
        // You could implement token blacklisting here if needed
        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Protected
 */
const getCurrentUser = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new errorHandler_1.AppError('User not authenticated', 401);
        }
        // Get full user details from database
        const user = await db.findUserById(req.user.id);
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
exports.getCurrentUser = getCurrentUser;
//# sourceMappingURL=authController.js.map