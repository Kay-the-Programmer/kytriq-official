import { Router, Request, Response } from 'express';
import { getData, saveBlogPost, deleteBlogPost } from '../data';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json(getData().blogPosts);
});

router.post('/', authenticateToken, authorizeAdmin, (req: Request, res: Response) => {
    const newPost = saveBlogPost(req.body);
    res.status(201).json(newPost);
});

router.put('/:id', authenticateToken, authorizeAdmin, (req: Request, res: Response) => {
    if (req.params.id !== req.body.id) {
        return res.status(400).send('Post ID mismatch');
    }
    const updatedPost = saveBlogPost(req.body);
    res.json(updatedPost);
});

router.delete('/:id', authenticateToken, authorizeAdmin, (req: Request, res: Response) => {
    deleteBlogPost(req.params.id);
    res.status(204).send();
});

export default router;