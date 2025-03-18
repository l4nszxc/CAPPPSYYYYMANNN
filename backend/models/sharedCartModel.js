const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class SharedCart {
    static async createShareLink(ownerId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const shareId = uuidv4();
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24); // Link expires in 24 hours

            await connection.execute(
                'INSERT INTO shared_carts (share_id, owner_id, expires_at) VALUES (?, ?, ?)',
                [shareId, ownerId, expiresAt]
            );

            // Get owner's cart items
            const [cartItems] = await connection.execute(
                `SELECT c.*, p.name, p.image, pc.name as choice_name, pc.image as choice_image
                 FROM cart c
                 JOIN products p ON c.product_id = p.products_id
                 LEFT JOIN product_choices pc ON c.choice_id = pc.choice_id
                 WHERE c.user_id = ?`,
                [ownerId]
            );

            await connection.commit();
            return { shareId, cartItems, expiresAt };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getSharedCart(shareId) {
        const [share] = await db.execute(
            `SELECT sc.*, u.username as owner_name 
             FROM shared_carts sc
             JOIN users u ON sc.owner_id = u.id
             WHERE sc.share_id = ? AND sc.status = 'active' AND sc.expires_at > NOW()`,
            [shareId]
        );

        if (!share[0]) {
            throw new Error('Shared cart not found or expired');
        }

        const [cartItems] = await db.execute(
            `SELECT c.*, p.name, p.image, pc.name as choice_name, pc.image as choice_image
             FROM cart c
             JOIN products p ON c.product_id = p.products_id
             LEFT JOIN product_choices pc ON c.choice_id = pc.choice_id
             WHERE c.user_id = ?`,
            [share[0].owner_id]
        );

        return {
            share: share[0],
            items: cartItems
        };
    }

    static async acceptSharedCart(shareId, userId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Get shared cart details
            const [share] = await connection.execute(
                'SELECT * FROM shared_carts WHERE share_id = ? AND status = "active"',
                [shareId]
            );

            if (!share[0]) {
                throw new Error('Invalid or expired share link');
            }

            // Get cart items from owner
            const [ownerItems] = await connection.execute(
                'SELECT * FROM cart WHERE user_id = ?',
                [share[0].owner_id]
            );

            // Copy items to recipient's cart
            for (const item of ownerItems) {
                await connection.execute(
                    'INSERT INTO cart (user_id, product_id, quantity, choice_id) VALUES (?, ?, ?, ?)',
                    [userId, item.product_id, item.quantity, item.choice_id]
                );
            }

            // Update share status
            await connection.execute(
                'UPDATE shared_carts SET status = "used", shared_with = ? WHERE share_id = ?',
                [userId, shareId]
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

module.exports = SharedCart;