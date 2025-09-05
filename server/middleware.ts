import { type Request, type Response, type NextFunction } from "express";
import { authService } from "./auth";
import "express-session";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        fullName: string;
        role: string;
      };
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ 
      message: "Нэвтрэх шаардлагатай",
      code: "UNAUTHORIZED"
    });
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ 
      message: "Нэвтрэх шаардлагатай",
      code: "UNAUTHORIZED"
    });
  }
  
  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      message: "Админ эрх шаардлагатай",
      code: "FORBIDDEN"
    });
  }
  
  next();
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  // This middleware doesn't block the request, just adds user info if available
  next();
}

declare module "express-session" {
  interface SessionData {
    userId?: string;
    user?: {
      id: string;
      username: string;
      email: string;
      fullName: string;
      role: string;
    };
  }
}
