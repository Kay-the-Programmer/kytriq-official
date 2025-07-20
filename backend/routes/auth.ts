import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserByEmail, saveUser, UserInterface } from '../db/data';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required',
                field: !email ? 'email' : 'password'
            });
        }

        const user = await findUserByEmail(email);

        // User not found
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid email or password',
                field: 'email'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Invalid email or password',
                field: 'password'
            });
        }

        // Generate token and send response
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({ accessToken, user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ 
            message: 'An error occurred during login. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
    }
});

router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { fullName, email, password } = req.body;

        // Validate input
        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: 'Full name, email, and password are required',
                field: !fullName ? 'fullName' : (!email ? 'email' : 'password')
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Please enter a valid email address',
                field: 'email'
            });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long',
                field: 'password'
            });
        }

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                message: 'User with this email already exists',
                field: 'email'
            });
        }

        // Create new user
        const userId = `user_${Date.now()}`;
        const newUser: UserInterface = {
            id: userId,
            fullName,
            email,
            password,
            role: 'customer', // Default role for new signups
            memberSince: new Date().toISOString().split('T')[0],
            shippingAddress: { address: '', city: '', state: '', zip: '' },
        };

        const savedUser = await saveUser(newUser);

        // Check if user was saved successfully
        if (!savedUser) {
            return res.status(500).json({
                message: 'Failed to create user. Please try again later.'
            });
        }

        // Generate token and send response
        const accessToken = jwt.sign(
            { id: savedUser.id, email: savedUser.email, role: savedUser.role }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(201).json({ accessToken, user: savedUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({
            message: 'An error occurred during signup. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
    }
});

router.get('/me', authenticateToken, async (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        if (authReq.user) {
            res.json(authReq.user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Error fetching user profile');
    }
});

export default router;
