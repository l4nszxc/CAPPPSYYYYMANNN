const db = require('../config/db');

class Cart {
    static async getCart(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }

        try {
            const [rows] = await db.execute(
                `SELECT 
                    c.product_id, 
                    c.quantity, 
                    p.name, 
                    CAST(p.price AS DECIMAL(10,2)) as price, 
                    p.image 
                FROM cart c
                JOIN products p ON c.product_id = p.products_id
                WHERE c.user_id = ?`,
                [userId]
            );
            
            // Convert price strings to numbers
            return rows.map(item => ({
                ...item,
                price: parseFloat(item.price)
            }));
        } catch (error) {
            throw error;
        }
    }

    static async addToCart(userId, productId, quantity) {
        if (!userId || !productId || !quantity) {
            throw new Error('User ID, product ID, and quantity are required');
        }

        try {
            const [existing] = await db.execute(
                'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );

            if (existing.length > 0) {
                await db.execute(
                    'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                    [quantity, userId, productId]
                );
            } else {
                await db.execute(
                    'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                    [userId, productId, quantity]
                );
            }
        } catch (error) {
            throw error;
        }
    }

    static async updateQuantity(userId, productId, quantity) {
        if (!userId || !productId || !quantity) {
            throw new Error('User ID, product ID, and quantity are required');
        }

        try {
            await db.execute(
                'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [quantity, userId, productId]
            );
        } catch (error) {
            throw error;
        }
    }

    static async removeFromCart(userId, productId) {
        if (!userId || !productId) {
            throw new Error('User ID and product ID are required');
        }

        try {
            await db.execute(
                'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Cart;