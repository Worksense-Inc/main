"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const timeOffController_1 = require("../controllers/timeOffController");
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
// All routes require authentication
router.use(auth_1.authenticateToken);
// GET routes
router.get('/', timeOffController_1.getAllTimeOffRequests);
router.get('/:id', timeOffController_1.getTimeOffById);
// POST routes (employees can create their own)
router.post('/', validators_1.createTimeOffValidator, validate, timeOffController_1.createTimeOffRequest);
// PUT routes (managers approve/deny)
router.put('/:id', auth_1.requireManager, validators_1.updateTimeOffValidator, validate, timeOffController_1.updateTimeOffStatus);
// DELETE routes (employees can delete their own pending requests)
router.delete('/:id', timeOffController_1.deleteTimeOffRequest);
exports.default = router;
//# sourceMappingURL=timeOff.js.map