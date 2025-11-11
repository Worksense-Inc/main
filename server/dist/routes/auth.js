"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// TODO: Implement auth endpoints
router.post('/register', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
router.post('/login', (_req, res) => res.status(501).json({ message: 'Not implemented' }));
exports.default = router;
//# sourceMappingURL=auth.js.map