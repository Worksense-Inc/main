import { Router } from 'express';

const router = Router();

// TODO: Implement shift endpoints
router.get('/', (_req, res) =>
  res.status(501).json({ message: 'Not implemented' })
);
router.post('/', (_req, res) =>
  res.status(501).json({ message: 'Not implemented' })
);

export default router;
