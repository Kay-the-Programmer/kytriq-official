import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUser, UserInterface } from '../db/data';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

export interface AuthRequest extends Request {
    user?: UserInterface;
}

interface JwtPayload {
  id: string;
  email: string;
  role: 'admin' | 'customer';
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.sendStatus(401); // Unauthorized

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const fullUser = await findUser(decoded.id);

        if (!fullUser) return res.sendStatus(404); // Not Found

        // In middleware/auth.ts, line 29
        (req as AuthRequest).user = fullUser.toJSON() as UserInterface;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        if ((error as Error).name === 'JsonWebTokenError') {
            return res.status(403).send('Invalid token'); // Forbidden
        }
        if ((error as Error).name === 'TokenExpiredError') {
            return res.status(401).send('Token expired'); // Unauthorized
        }
        return res.status(500).send('Authentication error');
    }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    if ((req as AuthRequest).user?.role !== 'admin') {
        return res.status(403).send('Forbidden: Access is restricted to administrators.');
    }
    next();
};
