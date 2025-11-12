"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shiftSwapController_1 = require("../controllers/shiftSwapController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All shift swap routes require authentication
router.use(auth_1.authenticateToken);
// GET routes (employees can view)
router.get('/', shiftSwapController_1.getShiftSwapRequests);
router.get('/available', shiftSwapController_1.getAvailableShifts);
// POST route (employees can create swap requests)
router.post('/', shiftSwapController_1.requestShiftPickup);
// PUT route (managers only - to approve/reject)
router.put('/:id/approve', auth_1.requireManager, shiftSwapController_1.approveShiftSwap);
exports.default = router;
//# sourceMappingURL=shiftSwaps.js.map