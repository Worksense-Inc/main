"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTimeOffValidator = exports.createTimeOffValidator = exports.updateShiftValidator = exports.createShiftValidator = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
// Auth validators
exports.registerValidator = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('first_name').trim().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('last_name').trim().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('role')
        .isIn(['manager', 'employee'])
        .withMessage('Role must be manager or employee'),
];
exports.loginValidator = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
// Shift validators
exports.createShiftValidator = [
    (0, express_validator_1.body)('shift_date').isISO8601().withMessage('Valid date is required'),
    (0, express_validator_1.body)('start_time')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Valid start time is required (HH:MM)'),
    (0, express_validator_1.body)('end_time')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Valid end time is required (HH:MM)'),
    (0, express_validator_1.body)('position').trim().notEmpty().withMessage('Position is required'),
    (0, express_validator_1.body)('assigned_to').optional().isUUID().withMessage('Valid user ID required'),
];
exports.updateShiftValidator = [
    (0, express_validator_1.param)('id').isUUID().withMessage('Valid shift ID required'),
    (0, express_validator_1.body)('shift_date').optional().isISO8601(),
    (0, express_validator_1.body)('start_time')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    (0, express_validator_1.body)('end_time')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    (0, express_validator_1.body)('position').optional().trim().notEmpty(),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['scheduled', 'open', 'completed', 'cancelled']),
];
// Time off validators
exports.createTimeOffValidator = [
    (0, express_validator_1.body)('start_date').isISO8601().withMessage('Valid start date is required'),
    (0, express_validator_1.body)('end_date').isISO8601().withMessage('Valid end date is required'),
    (0, express_validator_1.body)('reason').optional().trim(),
];
exports.updateTimeOffValidator = [
    (0, express_validator_1.param)('id').isUUID().withMessage('Valid request ID required'),
    (0, express_validator_1.body)('status')
        .isIn(['approved', 'denied'])
        .withMessage('Status must be approved or denied'),
];
//# sourceMappingURL=validators.js.map