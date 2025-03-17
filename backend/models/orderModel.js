const db = require('../config/db');

class Order {
    static generateOrderId() {
        return Math.floor(1000000 + Math.random() * 9000000).toString();
    }

    static async create(userId, items, totalAmount) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            const orderId = this.generateOrderId();
            
            // Create order
            await connection.execute(
                'INSERT INTO orders (order_id, user_id, total_amount) VALUES (?, ?, ?)',
                [orderId, userId, totalAmount]
            );
    
            // Create order items
            for (const item of items) {
                // Make sure price is a valid number
                const price = parseFloat(item.price || 0);
                
                await connection.execute(
                    'INSERT INTO order_items (order_id, product_id, quantity, price, choice_id) VALUES (?, ?, ?, ?, ?)',
                    [
                        orderId, 
                        item.product_id, 
                        item.quantity, 
                        price,
                        item.choice_id || null
                    ]
                );
    
                // Handle stock reduction appropriately
                if (item.choice_id) {
                    // Reduce choice stock if it's a choice item
                    await connection.execute(
                        'UPDATE product_choices SET stock = stock - ? WHERE choice_id = ?',
                        [item.quantity, item.choice_id]
                    );
                } else {
                    // Reduce main product stock if it's not a choice
                    await connection.execute(
                        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE products_id = ?',
                        [item.quantity, item.product_id]
                    );
                }
            }
    
            // Clear cart items
            await connection.execute(
                'DELETE FROM cart WHERE user_id = ?',
                [userId]
            );
    
            await connection.commit();
            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    static calculateEstimatedTime(items) {
        try {
            // Base preparation time in minutes
            const baseTime = 15;
            // Additional time per item in minutes
            const timePerItem = 5;
            
            const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
            const estimatedMinutes = baseTime + (timePerItem * totalQuantity);
            
            // Create a date object with the estimated completion time
            const estimatedTime = new Date();
            estimatedTime.setMinutes(estimatedTime.getMinutes() + estimatedMinutes);
            
            // Return ISO string for consistent date formatting
            return estimatedTime.toISOString();
        } catch (error) {
            console.error('Error calculating estimated time:', error);
            return null;
        }
    }
    static async getUserOrders(userId) {
        try {
            const [orders] = await db.query(
                `SELECT o.*, 
                    ad.amount as discount_amount,
                    (SELECT SUM(oi.price * oi.quantity) 
                     FROM order_items oi 
                     WHERE oi.order_id = o.order_id) as subtotal
                FROM orders o
                LEFT JOIN available_discounts ad ON o.order_id = ad.order_id AND ad.used = TRUE
                WHERE o.user_id = ?
                ORDER BY o.created_at DESC`,
                [userId]
            );
    
            // Fetch items for each order
            for (let order of orders) {
                const [items] = await db.query(
                    `SELECT oi.*, p.name, p.image, pc.name as choice_name
                    FROM order_items oi
                    JOIN products p ON oi.product_id = p.products_id
                    LEFT JOIN product_choices pc ON oi.choice_id = pc.choice_id
                    WHERE oi.order_id = ?`,
                    [order.order_id]
                );
                order.items = items;
            }
    
            return orders;
        } catch (error) {
            throw error;
        }
    }
    static async cancelOrder(orderId, reason) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
    
            // Get order items to restore stock
            const [orderItems] = await connection.execute(
                'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
                [orderId]
            );
    
            // Restore stock quantities
            for (const item of orderItems) {
                await connection.execute(
                    'UPDATE products SET stock_quantity = stock_quantity + ? WHERE products_id = ?',
                    [item.quantity, item.product_id]
                );
            }
    
            // Update order status and reason
            await connection.execute(
                'UPDATE orders SET status = ?, cancel_reason = ? WHERE order_id = ?',
                ['cancelled', reason, orderId]
            );
    
            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
   
}

module.exports = Order;