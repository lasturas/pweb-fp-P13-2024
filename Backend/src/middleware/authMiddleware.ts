import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1]; // Format: Bearer <token>

  if (!token) {
    res.status(401).json({ message: "Access denied, token missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    (req as any).user = decoded; // Simpan user ke dalam req
    next(); // Lanjut ke handler berikutnya
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
