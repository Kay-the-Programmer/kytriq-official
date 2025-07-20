// backend/routes/software.ts
import { Router, Request, Response } from 'express';
import { SoftwareProduct } from '../models';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const softwareProducts = await SoftwareProduct.find().exec();
        res.json(softwareProducts);
    } catch (error) {
        console.error('Error fetching software products:', error);
        res.status(500).send('Server error');
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const software = await SoftwareProduct.findById(req.params.id).exec();
        if (software) {
            res.json(software);
        } else {
            res.status(404).send('Software not found');
        }
    } catch (error) {
        console.error('Error fetching software product:', error);
        res.status(500).send('Server error');
    }
});

router.post('/', authenticateToken, authorizeAdmin, async (req: Request, res: Response) => {
    try {
        const newSoftware = new SoftwareProduct(req.body);
        await newSoftware.save();
        res.status(201).json(newSoftware);
    } catch (error) {
        console.error('Error creating software product:', error);
        res.status(500).send('Server error');
    }
});

router.put('/:id', authenticateToken, authorizeAdmin, async (req: Request, res: Response) => {
    try {
        if (req.params.id !== req.body.id) {
            return res.status(400).send('Software ID mismatch');
        }

        const updatedSoftware = await SoftwareProduct.findByIdAndUpdate(
            req.params.id,
            { ...req.body, _id: req.params.id },
            { new: true, runValidators: true }
        ).exec();

        if (!updatedSoftware) {
            return res.status(404).send('Software not found');
        }

        res.json(updatedSoftware);
    } catch (error) {
        console.error('Error updating software product:', error);
        res.status(500).send('Server error');
    }
});

router.delete('/:id', authenticateToken, authorizeAdmin, async (req: Request, res: Response) => {
    try {
        const result = await SoftwareProduct.findByIdAndDelete(req.params.id).exec();
        if (!result) {
            return res.status(404).send('Software not found');
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting software product:', error);
        res.status(500).send('Server error');
    }
});

export default router;