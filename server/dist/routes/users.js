"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticateToken);
// GET routes (employees can view basic info)
router.get('/', userController_1.getAllUsers);
router.get('/:id', userController_1.getUserById);
// PUT and DELETE routes (managers only)
router.put('/:id', auth_1.requireManager, userController_1.updateUser);
router.delete('/:id', auth_1.requireManager, userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=users.js.map