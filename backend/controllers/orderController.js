const db = require('../config/db');
const Order = require('../models/orderModel.js');
const Reward = require('../models/rewardModel.js');

exports.createOrder = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { items, totalAmount } = req.body;
        const userId = req.user.id;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Invalid items data' });
        }

        // Generate order ID
        const orderId = Math.random().toString().slice(2, 9);

        // Insert order
        await connection.query(
            'INSERT INTO orders (order_id, user_id, total_amount, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [orderId, userId, totalAmount, 'pending']
        );

        // Insert order items and clear cart items
        for (const item of items) {
            // Add to order_items
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price, choice_id) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price, item.choice_id]
            );

            // Remove from cart if cart item ID is provided
            if (item.id) {
                await connection.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [item.id, userId]);
            }
        }

        await connection.commit();

        // Add reward points after successful order creation
        let pointsEarned = 0;
        try {
            pointsEarned = await Reward.addPoints(userId, orderId, totalAmount);
        } catch (error) {
            console.error('Error adding reward points:', error);
        }

        res.status(201).json({ 
            orderId,
            pointsEarned,
            message: 'Order created successfully'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    } finally {
        connection.release();
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