import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const authenticateToken: (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
export declare const requireManager: (req: AuthRequest, _res: Response, next: NextFunction) => void;
export declare const requireOwnerOrManager: (resourceUserId: string) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map