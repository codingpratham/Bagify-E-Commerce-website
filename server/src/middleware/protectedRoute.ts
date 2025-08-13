import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: { id: string , role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      role: string; userId: string 
};

    if (!decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - User ID not found" });
    }

    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  authMiddleware(req, res, () => {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    next();
  })
};

export const user = (req: AuthRequest, res: Response, next: NextFunction) => {
  authMiddleware(req, res, () => {
    if (req.user?.role !== "USER") {
      return res.status(403).json({ message: "Forbidden - user access required" });
    }
    next();
  })
};