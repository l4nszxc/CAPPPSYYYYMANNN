const db = require('../config/db');
const Order = require('../models/orderModel.js');

exports.createOrder = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { items, totalAmount } = req.body;
        if (!items || !items.length || !totalAmount) {
            return res.status(400).json({ message: 'Invalid order data' });
        }

        const orderId = await Order.create(req.user.id, items, totalAmount);
        res.status(201).json({ orderId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const orders = await Order.getUserOrders(req.user.id);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({ message: 'Cancellation reason is required' });
        }

        // Verify order belongs to user
        const [order] = await db.execute(
            'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
            [orderId, req.user.id]
        );

        if (!order.length) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order[0].status !== 'pending') {
            return res.status(400).json({ 
                message: 'Only pending orders can be cancelled' 
            });
        }

        await Order.cancelOrder(orderId, reason);
        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ message: 'Error canceling order' });
    }
};