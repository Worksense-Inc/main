"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validators_1 = require("../middleware/validators");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
// Validation middleware wrapper
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            errors: errors.array()
        });
        return;
    }
    next();
};
// Public routes
router.post('/register', validators_1.registerValidator, validate, authController_1.register);
router.post('/login', validators_1.loginValidator, validate, authController_1.login);
// Protected routes
router.post('/logout', auth_1.authenticateToken, authController_1.logout);
router.get('/me', auth_1.authenticateToken, authController_1.getCurrentUser);
exports.default = router;
//# sourceMappingURL=auth.js.map