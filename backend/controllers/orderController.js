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
