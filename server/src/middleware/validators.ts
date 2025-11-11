import { body, param, query, ValidationChain } from 'express-validator';

// Auth validators
export const registerValidator: ValidationChain[] = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('role')
    .isIn(['manager', 'employee'])
    .withMessage('Role must be manager or employee'),
];

export const loginValidator: ValidationChain[] = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Shift validators
export const createShiftValidator: ValidationChain[] = [
  body('shift_date').isISO8601().withMessage('Valid date is required'),
  body('start_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid start time is required (HH:MM)'),
  body('end_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid end time is required (HH:MM)'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('assigned_to').optional().isUUID().withMessage('Valid user ID required'),
];

export const updateShiftValidator: ValidationChain[] = [
  param('id').isUUID().withMessage('Valid shift ID required'),
  body('shift_date').optional().isISO8601(),
  body('start_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('end_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('position').optional().trim().notEmpty(),
  body('status')
    .optional()
    .isIn(['scheduled', 'open', 'completed', 'cancelled']),
];

// Time off validators
export const createTimeOffValidator: ValidationChain[] = [
  body('start_date').isISO8601().withMessage('Valid start date is required'),
  body('end_date').isISO8601().withMessage('Valid end date is required'),
  body('reason').optional().trim(),
];

export const updateTimeOffValidator: ValidationChain[] = [
  param('id').isUUID().withMessage('Valid request ID required'),
  body('status')
    .isIn(['approved', 'denied'])
    .withMessage('Status must be approved or denied'),
];
