"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shiftController_1 = require("../controllers/shiftController");
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
// All shift routes require authentication
router.use(auth_1.authenticateToken);
// GET routes (employees can view)
router.get('/', shiftController_1.getAllShifts);
router.get('/week/:date', shiftController_1.getWeeklySchedule);
router.get('/:id', shiftController_1.getShiftById);
// POST, PUT, DELETE routes (managers only)
router.post('/', auth_1.requireManager, validators_1.createShiftValidator, validate, shiftController_1.createShift);
router.put('/:id', auth_1.requireManager, validators_1.updateShiftValidator, validate, shiftController_1.updateShift);
router.delete('/:id', auth_1.requireManager, shiftController_1.deleteShift);
exports.default = router;
//# sourceMappingURL=shifts.js.map