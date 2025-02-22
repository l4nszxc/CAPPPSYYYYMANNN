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
                await connection.execute(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.price]
                );

                // Update product stock
                await connection.execute(
                    'UPDATE products SET stock_quantity = stock_quantity - ? WHERE products_id = ?',
                    [item.quantity, item.product_id]
                );
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

    static async getUserOrders(userId) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    o.order_id,
                    o.status,
                    o.total_amount,
                    o.created_at,
                    o.cancel_reason,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'product_id', oi.product_id,
                            'quantity', oi.quantity,
                            'price', oi.price,
                            'name', p.name,
                            'image', p.image
                        )
                    ) as items
                FROM orders o
                JOIN order_items oi ON o.order_id = oi.order_id
                JOIN products p ON oi.product_id = p.products_id
                WHERE o.user_id = ?
                GROUP BY o.order_id, o.status, o.total_amount, o.created_at, o.cancel_reason
                ORDER BY o.created_at DESC`,
                [userId]
            );
    
            return rows.map(order => ({
                ...order,
                items: Array.isArray(order.items) ? order.items : JSON.parse(order.items),
                total_amount: Number(order.total_amount)
            }));
        } catch (error) {
            console.error('Error in getUserOrders:', error);
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