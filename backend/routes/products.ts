import { Router, Request, Response } from 'express';
import { getData, findProduct, saveProduct, deleteProduct } from '../db/data';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const data = await getData();
        res.json(data.products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const product = await findProduct(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error(`Error fetching product ${req.params.id}:`, error);
        res.status(500).send('Error fetching product');
    }
});

router.post('/', authenticateToken, authorizeAdmin, async (req: Request, res: Response) => {
    try {
        const newProduct = await saveProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Error creating product');
    }
});

router.put('/:id', authenticateToken, authorizeAdmin, async (req: Request, res: Response) => {
    try {
        if (req.params.id !== req.body.id) {
            return res.status(400).send('Product ID mismatch');
        }
        const updatedProduct = await saveProduct(req.body);
        res.json(updatedProduct);
    } catch (error) {
        console.error(`Error updating product ${req.params.id}:`, error);
        res.status(500).send('Error updating product');
    }
});

router.delete('/:id', authenticateToken, authorizeAdmin, async (req: Request, res: Response) => {
    try {
        await deleteProduct(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting product ${req.params.id}:`, error);
        res.status(500).send('Error deleting product');
    }
});

export default router;
