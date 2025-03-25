declare module 'express' {
	interface Request {
	  auth?: { visiteurId: string };
	}
}

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Définir le middleware d'authentification
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Authorization header is missing.');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { visiteurId: string };

    req.auth = { visiteurId: decodedToken.visiteurId };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized request' });
  }
};