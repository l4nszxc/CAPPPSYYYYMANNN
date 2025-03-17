const db = require('../config/db');
const Staff = require('../models/staffModel');
const Order = require('../models/orderModel');
const emailService = require('../services/emailService');

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

        // Get order details with user email
        const [orderResult] = await db.execute(
            `SELECT o.*, u.email, u.username as customer_name 
             FROM orders o 
             JOIN users u ON o.user_id = u.id 
             WHERE o.order_id = ?`,
            [orderId]
        );

        const order = orderResult[0]; // Get the first row

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Get order items
        const [items] = await db.execute(
            `SELECT oi.*, p.name, pc.name as choice_name,
                    p.image, COALESCE(pc.image, p.image) as actual_image
             FROM order_items oi 
             LEFT JOIN products p ON oi.product_id = p.products_id
             LEFT JOIN product_choices pc ON oi.choice_id = pc.choice_id 
             WHERE oi.order_id = ?`,
            [orderId]
        );

        // Update status
        await db.execute(
            'UPDATE orders SET status = ? WHERE order_id = ?',
            [status, orderId]
        );

        // Calculate subtotal
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Format items for email
        const formattedItems = items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            name: item.choice_name ? `${item.name} (${item.choice_name})` : item.name,
            choice_name: item.choice_name,
            image: item.actual_image || item.image
        }));

        // Prepare order details for email
        const orderDetails = {
            ...order,
            items: formattedItems,
            subtotal,
            order_id: orderId,
            total_amount: order.total_amount,
            discount_amount: parseFloat(order.discount_amount) || 0
        };

        // Send email for specific statuses
        if (['preparing', 'ready for pickup', 'paid'].includes(status.toLowerCase())) {
            try {
                console.log('Sending email to:', order.email); // Debug log
                await emailService.sendOrderStatusReceipt(order.email, orderDetails, status);
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }
        }

        res.json({ 
            message: 'Order status updated successfully',
            email: order.email // Return email in response for debugging
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
};
exports.acceptOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const staffId = req.user.id;

        // Get order details with user email
        const [orderResult] = await db.execute(
            `SELECT o.*, u.email, u.username as customer_name 
             FROM orders o 
             JOIN users u ON o.user_id = u.id 
             WHERE o.order_id = ?`,
            [orderId]
        );

        const order = orderResult[0]; // Get the first row

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Get order items
        const [items] = await db.execute(
            `SELECT oi.*, p.name, pc.name as choice_name,
                    p.image, COALESCE(pc.image, p.image) as actual_image
             FROM order_items oi 
             LEFT JOIN products p ON oi.product_id = p.products_id
             LEFT JOIN product_choices pc ON oi.choice_id = pc.choice_id 
             WHERE oi.order_id = ?`,
            [orderId]
        );

        // Update order status and assign staff
        await db.execute(
            `UPDATE orders 
             SET status = 'preparing', 
                 accepted_by = ?, 
                 accepted_at = CURRENT_TIMESTAMP 
             WHERE order_id = ?`,
            [staffId, orderId]
        );

        // Calculate subtotal
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Format items for email
        const formattedItems = items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            name: item.choice_name ? `${item.name} (${item.choice_name})` : item.name,
            choice_name: item.choice_name,
            image: item.actual_image || item.image
        }));

        // Prepare order details for email
        const orderDetails = {
            ...order,
            items: formattedItems,
            subtotal,
            order_id: orderId,
            total_amount: order.total_amount,
            discount_amount: parseFloat(order.discount_amount) || 0
        };

        // Send email notification
        try {
            console.log('Sending email to:', order.email); // Debug log
            await emailService.sendOrderStatusReceipt(order.email, orderDetails, 'preparing');
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }

        res.json({ 
            message: 'Order accepted successfully',
            email: order.email // Return email in response for debugging
        });
    } catch (error) {
        console.error('Error accepting order:', error);
        res.status(500).json({ message: 'Error accepting order' });
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