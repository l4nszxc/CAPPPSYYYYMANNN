const db = require('../config/db');
const Order = require('../models/orderModel.js');
const Reward = require('../models/rewardModel.js');

exports.createOrder = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { items, totalAmount, discountId } = req.body;
        const userId = req.user.id;

        let finalAmount = totalAmount;
        let appliedDiscount = 0;

        // Apply discount if provided
        if (discountId) {
            try {
                appliedDiscount = await Reward.applyDiscount(userId, null, discountId);
                finalAmount = Math.max(0, totalAmount - appliedDiscount);
            } catch (error) {
                console.error('Error applying discount:', error);
            }
        }

        // Generate order ID
        const orderId = Math.random().toString().slice(2, 9);

        // Insert order with final amount
        await connection.query(
            'INSERT INTO orders (order_id, user_id, total_amount, status) VALUES (?, ?, ?, ?)',
            [orderId, userId, finalAmount, 'pending']
        );

        // If discount was applied, update the order_id in available_discounts
        if (discountId) {
            await connection.query(
                'UPDATE available_discounts SET order_id = ? WHERE id = ?',
                [orderId, discountId]
            );
        }

        // Insert order items
        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price, choice_id) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price, item.choice_id]
            );
        }

        // Clear cart
        if (items.length > 0) {
            const itemIds = items.map(item => item.id).filter(id => id);
            if (itemIds.length > 0) {
                await connection.query('DELETE FROM cart WHERE id IN (?)', [itemIds]);
            }
        }

        await connection.commit();

        // Add reward points for the final amount paid
        let pointsEarned = 0;
        try {
            pointsEarned = await Reward.addPoints(userId, orderId, finalAmount);
        } catch (error) {
            console.error('Error adding reward points:', error);
        }

        res.status(201).json({ 
            orderId,
            pointsEarned,
            appliedDiscount,
            finalAmount,
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