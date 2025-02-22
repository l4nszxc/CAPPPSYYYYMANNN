const db = require('../config/db');

class Admin {
    static async getUserStats() {
        try {
            const [result] = await db.execute(`
                SELECT 
                    COUNT(*) as totalUsers,
                    SUM(CASE WHEN email_verified = 1 THEN 1 ELSE 0 END) as verifiedUsers,
                    SUM(CASE WHEN email_verified = 0 THEN 1 ELSE 0 END) as unverifiedUsers
                FROM users
                WHERE role = 'user'
            `);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    static async getAllUsers() {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    id, 
                    username, 
                    firstname,
                    middlename,
                    lastname,
                    gender,
                    phone_number,
                    address,
                    birthdate,
                    email, 
                    created_at, 
                    email_verified, 
                    role
                FROM users 
                WHERE role = 'user'
                ORDER BY created_at DESC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async isAdmin(userId) {
        try {
            const [rows] = await db.execute(
                'SELECT role FROM users WHERE id = ?',
                [userId]
            );
            return rows[0]?.role === 'admin';
        } catch (error) {
            throw error;
        }
    }
    static async getDashboardStats() {
        try {
            const [salesStats] = await db.execute(`
                SELECT 
                    COUNT(DISTINCT o.order_id) as totalOrders,
                    SUM(o.total_amount) as totalSales,
                    COUNT(DISTINCT p.products_id) as totalProducts,
                    SUM(p.stock_quantity) as totalStock,
                    (
                        SELECT GROUP_CONCAT(
                            JSON_OBJECT(
                                'name', p2.name,
                                'quantity', SUM(oi2.quantity),
                                'total', SUM(oi2.price * oi2.quantity)
                            )
                        )
                        FROM order_items oi2
                        JOIN products p2 ON oi2.product_id = p2.products_id
                        GROUP BY p2.products_id
                        ORDER BY SUM(oi2.quantity) DESC
                        LIMIT 5
                    ) as topProducts
                FROM orders o
                LEFT JOIN order_items oi ON o.order_id = oi.order_id
                LEFT JOIN products p ON oi.product_id = p.products_id
                WHERE o.status = 'paid'
            `);

            const [lowStock] = await db.execute(`
                SELECT 
                    products_id,
                    name,
                    stock_quantity,
                    price
                FROM products 
                WHERE stock_quantity <= 10
                ORDER BY stock_quantity ASC
                LIMIT 5
            `);

            return {
                ...salesStats[0],
                topProducts: salesStats[0].topProducts ? JSON.parse(`[${salesStats[0].topProducts}]`) : [],
                lowStock
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Admin;