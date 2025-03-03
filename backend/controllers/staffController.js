const db = require('../config/db');
const Staff = require('../models/staffModel');
const Order = require('../models/orderModel');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Staff.getAllOrders();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const orderDetails = await Staff.getOrderDetails(orderId);
        
        if (!orderDetails) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(orderDetails);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Error fetching order details' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'preparing', 'ready for pickup', 'paid', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        await Staff.updateOrderStatus(orderId, status);
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
};
exports.acceptOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const staffId = req.user.id;

        await db.execute(`
            UPDATE orders 
            SET status = 'preparing', 
                accepted_by = ?, 
                accepted_at = CURRENT_TIMESTAMP 
            WHERE order_id = ?
        `, [staffId, orderId]);

        res.status(200).json({ message: 'Order accepted successfully' });
    } catch (error) {
        console.error('Error accepting order:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.getAcceptedOrders = async (req, res) => {
    try {
        const staffId = req.user.id;
        const orders = await Staff.getAcceptedOrders(staffId);
        
        const ordersWithEstimatedTime = orders.map(order => {
            const estimatedTime = Order.calculateEstimatedTime(order.items);
            return {
                ...order,
                estimatedPickupTime: estimatedTime
            };
        });

        res.json(ordersWithEstimatedTime);
    } catch (error) {
        console.error('Error fetching accepted orders:', error);
        res.status(500).json({ message: 'Error fetching accepted orders' });
    }
};