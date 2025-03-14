const db = require('../config/db');
const Admin = require('../models/adminModel');
const Staff = require('../models/staffModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.getStats = async (req, res) => {
    try {
        const stats = await Admin.getUserStats();
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await Admin.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllStaff = async (req, res) => {
    try {
        const staff = await Admin.getAllStaff();
        res.json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'Error fetching staff' });
    }
};
exports.recruitStaff = async (req, res) => {
    try {
        const staffData = req.body;

        // Check if user exists
        const existingUser = await User.findByEmail(staffData.email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create staff user
        await Admin.createStaff(staffData);

        res.status(201).json({ 
            message: 'Staff member registered successfully'
        });
    } catch (error) {
        console.error('Staff registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await Admin.getDashboardStats();
        res.json(stats);
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({ message: 'Error getting dashboard stats' });
    }
};
exports.updateStaff = async (req, res) => {
    try {
        const staffId = req.params.id;
        const staffData = req.body;
        await Admin.updateStaff(staffId, staffData);
        res.json({ message: 'Staff updated successfully' });
    } catch (error) {
        console.error('Error updating staff:', error);
        res.status(500).json({ message: 'Error updating staff' });
    }
};

exports.deleteStaff = async (req, res) => {
    try {
        const staffId = req.params.id;
        await Admin.deleteStaff(staffId);
        res.json({ message: 'Staff deleted successfully' });
    } catch (error) {
        console.error('Error deleting staff:', error);
        res.status(500).json({ message: 'Error deleting staff' });
    }
};
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Admin.getAllOrders();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const orderDetails = await Admin.getOrderDetails(orderId);
        
        if (!orderDetails) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(orderDetails);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Error fetching order details' });
    }
};
exports.processPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        // Update order status without paid_at field
        const [result] = await db.execute(
            'UPDATE orders SET status = ? WHERE order_id = ?',
            ['paid', orderId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Get updated order details
        const [updatedOrder] = await db.execute(
            `SELECT 
                o.*, 
                u.username as customer_name,
                s.username as staff_name
             FROM orders o
             JOIN users u ON o.user_id = u.id
             LEFT JOIN users s ON o.accepted_by = s.id
             WHERE o.order_id = ?`,
            [orderId]
        );

        res.json({ 
            message: 'Payment processed successfully',
            order: updatedOrder[0]
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Error processing payment' });
    }
};
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await Admin.deleteProduct(productId);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};