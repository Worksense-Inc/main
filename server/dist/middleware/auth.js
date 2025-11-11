"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOwnerOrManager = exports.requireManager = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const authenticateToken = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            throw new errorHandler_1.AppError('Access token required', 401);
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET not configured');
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new errorHandler_1.AppError('Invalid token', 401));
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new errorHandler_1.AppError('Token expired', 401));
        }
        next(error);
    }
};
exports.authenticateToken = authenticateToken;
const requireManager = (req, _res, next) => {
    if (!req.user) {
        return next(new errorHandler_1.AppError('Authentication required', 401));
    }
    if (req.user.role !== 'manager') {
        return next(new errorHandler_1.AppError('Manager access required', 403));
    }
    next();
};
exports.requireManager = requireManager;
const requireOwnerOrManager = (resourceUserId) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new errorHandler_1.AppError('Authentication required', 401));
        }
        const isOwner = req.user.id === resourceUserId;
        const isManager = req.user.role === 'manager';
        if (!isOwner && !isManager) {
            return next(new errorHandler_1.AppError('Access denied', 403));
        }
        next();
    };
};
exports.requireOwnerOrManager = requireOwnerOrManager;
//# sourceMappingURL=auth.js.map