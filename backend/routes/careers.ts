import { Router, Request, Response } from 'express';
import { getData, saveJobOpening, deleteJobOpening } from '../data';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json(getData().jobOpenings);
});

router.post('/', authenticateToken, authorizeAdmin, (req: Request, res: Response) => {
    const newJob = saveJobOpening(req.body);
    res.status(201).json(newJob);
});

router.put('/:id', authenticateToken, authorizeAdmin, (req: Request, res: Response) => {
    if (req.params.id !== req.body.id) {
        return res.status(400).send('Job ID mismatch');
    }
    const updatedJob = saveJobOpening(req.body);
    res.json(updatedJob);
});

router.delete('/:id', authenticateToken, authorizeAdmin, (req: Request, res: Response) => {
    deleteJobOpening(req.params.id);
    res.status(204).send();
});

export default router;