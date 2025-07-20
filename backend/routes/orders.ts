import { Router, Request, Response } from 'express';
import { getData, findOrder, saveOrder, findUser } from '../data';
import type { Order, Product } from '../data';
import { authenticateToken, authorizeAdmin, AuthRequest } from '../middleware/auth';


const router = Router();

// GET all orders (Admin only)
router.get('/', authenticateToken, authorizeAdmin, (req: Request, res: Response) => {
    res.json(getData().orders);
});

// POST a new order (Any authenticated user)
router.post('/', authenticateToken, (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const { userId, items } = req.body as { userId: string, items: (Product & { quantity: number })[] };

    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ error: 'User ID and items are required.' });
    }
    
    // Ensure the user creating the order is the logged-in user
    if (authReq.user?.id !== userId) {
        return res.status(403).json({ error: 'Forbidden: You can only create orders for yourself.'});
    }

    const user = findUser(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 5.00 : 0;
    const taxes = subtotal * 0.08;
    const finalTotal = subtotal + shipping + taxes;

    const newOrder: Order = {
        id: `KYT-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        customerName: user.fullName,
        userId: user.id,
        status: 'Processing',
        items: items,
        total: finalTotal,
    };

    const savedOrder = saveOrder(newOrder);
    res.status(201).json(savedOrder);
});

// PUT update order status (Admin only)
router.put('/:id/status', authenticateToken, authorizeAdmin, (req: Request, res: Response) => {
    const { status } = req.body;
    const order = findOrder(req.params.id);
    if (order) {
        order.status = status as Order['status'];
        saveOrder(order);
        res.json(order);
    } else {
        res.status(404).send('Order not found');
    }
});

export default router;