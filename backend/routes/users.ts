import { Router, Request, Response } from 'express';
import { getData, saveUser, deleteUser } from '../data';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, authorizeAdmin, (req: Request, res: Response) => {
    const users = getData().users.map(({ password, ...user }) => user); // Exclude passwords
    res.json(users);
});

router.post('/', authenticateToken, authorizeAdmin, (req: Request, res: Response) => {
    const newUser = saveUser(req.body);
    const { password, ...userResponse } = newUser;
    res.status(201).json(userResponse);
});

router.put('/:id', authenticateToken, authorizeAdmin, (req: Request, res: Response) => {
    if (req.params.id !== req.body.id) {
        return res.status(400).send('User ID mismatch');
    }
    const updatedUser = saveUser(req.body);
    const { password, ...userResponse } = updatedUser;
    res.json(userResponse);
});

router.delete('/:id', authenticateToken, authorizeAdmin, (req: Request, res: Response) => {
    deleteUser(req.params.id);
    res.status(204).send();
});

export default router;