const db = require('../config/db');
const bcrypt = require('bcryptjs'); 

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
    static async createStaff(staffData) {
        try {
            const hashedPassword = await bcrypt.hash(staffData.password, 10);
            
            const [result] = await db.execute(`
                INSERT INTO users (
                    username,
                    firstname, 
                    middlename, 
                    lastname, 
                    gender, 
                    civil_status, 
                    phone_number, 
                    address, 
                    birthdate, 
                    email, 
                    role, 
                    password,
                    email_verified
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'staff', ?, 1)
            `, [
                staffData.username,
                staffData.firstname,
                staffData.middlename,
                staffData.lastname,
                staffData.gender,
                staffData.civilStatus,
                staffData.phoneNumber,
                staffData.address,
                staffData.birthdate,
                staffData.email,
                hashedPassword
            ]);
            return result;
        } catch (error) {
            throw error;               
        }
    }
    static async updateStaff(staffId, staffData) {
        try {
            const [result] = await db.execute(`
                UPDATE users 
                SET 
                    username = ?,
                    firstname = ?,
                    middlename = ?,
                    lastname = ?,
                    gender = ?,
                    civil_status = ?,
                    phone_number = ?,
                    address = ?,
                    email = ?
                WHERE id = ? AND role = 'staff'
            `, [
                staffData.username,
                staffData.firstname,
                staffData.middlename,
                staffData.lastname,
                staffData.gender,
                staffData.civilStatus,
                staffData.phoneNumber,
                staffData.address,
                staffData.email,
                staffId
            ]);
            return result;
        } catch (error) {
            throw error;
        }
    }
    
    static async deleteStaff(staffId) {
        try {
            const [result] = await db.execute(
                'DELETE FROM users WHERE id = ? AND role = "staff"',
                [staffId]
            );
            return result;
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
    static async getAllStaff() {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    u.id as user_id,
                    u.username,
                    u.firstname,
                    u.middlename,
                    u.lastname,
                    CONCAT(u.firstname, ' ', COALESCE(u.middlename, ''), ' ', u.lastname) as fullname,
                    u.gender,
                    u.civil_status,
                    u.phone_number,
                    u.address,
                    u.email,
                    u.role as position,
                    CASE 
                        WHEN u.email_verified = 1 THEN 'active'
                        ELSE 'inactive'
                    END as status,
                    u.created_at
                FROM users u
                WHERE u.role = 'staff'
                ORDER BY u.created_at DESC
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
            // Get main stats
            const [salesStats] = await db.execute(`
                SELECT 
                    COUNT(DISTINCT o.order_id) as totalOrders,
                    COALESCE(SUM(o.total_amount), 0) as totalSales,
                    (SELECT COUNT(*) FROM products) as totalProducts,
                    (SELECT SUM(stock_quantity) FROM products) as totalStock,
                    (SELECT COUNT(*) FROM users WHERE role = 'user') as totalUsers
                FROM orders o
                WHERE o.status = 'paid'
            `);
    
            // Get top products with consistent calculation
            const [topProducts] = await db.execute(`
                SELECT 
                    p.name,
                    SUM(CASE WHEN o.status = 'paid' THEN oi.quantity ELSE 0 END) as quantity,
                    SUM(CASE WHEN o.status = 'paid' THEN (oi.price * oi.quantity) ELSE 0 END) as total
                FROM order_items oi
                JOIN products p ON oi.product_id = p.products_id
                JOIN orders o ON oi.order_id = o.order_id
                GROUP BY p.products_id, p.name
                HAVING quantity > 0
                ORDER BY quantity DESC
                LIMIT 5
            `);
    
            // Get low stock products
            const [lowStock] = await db.execute(`
                SELECT products_id, name, description, stock_quantity, price, category
                FROM products
                WHERE stock_quantity <= 10
                ORDER BY stock_quantity ASC
            `);
            const [topStaff] = await db.execute(`
                SELECT 
                    u.username,
                    COUNT(DISTINCT o.order_id) as orders_handled,
                    COALESCE(SUM(o.total_amount), 0) as total_sales
                FROM users u
                LEFT JOIN orders o ON u.id = o.accepted_by
                WHERE u.role = 'staff'
                AND o.status IN ('ready for pickup', 'paid')
                GROUP BY u.id, u.username
                ORDER BY orders_handled DESC, total_sales DESC
                LIMIT 5
            `);
    
            return {
                ...salesStats[0],
                topProducts: topProducts || [],
                lowStock: lowStock || [],
                topStaff: topStaff || []
            };
        } catch (error) {
            console.error('Error in getDashboardStats:', error);
            throw error;
        }
    }
    static async getAllOrders() {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    o.order_id,
                    u.username as customer_name,
                    o.status,
                    o.total_amount,
                    o.created_at,
                    o.cancel_reason,
                    o.accepted_by,
                    o.accepted_at,
                    s.username as staff_name
                FROM orders o
                JOIN users u ON o.user_id = u.id
                LEFT JOIN users s ON o.accepted_by = s.id
                ORDER BY o.created_at DESC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    
    static async getOrderDetails(orderId) {
        try {
            const [orderDetails] = await db.execute(`
                SELECT 
                    o.order_id,
                    o.status,
                    o.total_amount,
                    o.created_at,
                    o.cancel_reason,
                    o.accepted_by,
                    o.accepted_at,
                    u.username as customer_name,
                    s.username as staff_name
                FROM orders o
                JOIN users u ON o.user_id = u.id
                LEFT JOIN users s ON o.accepted_by = s.id
                WHERE o.order_id = ?
            `, [orderId]);
    
            const [orderItems] = await db.execute(`
                SELECT 
                    oi.product_id,
                    oi.quantity,
                    oi.price,
                    p.name,
                    p.image
                FROM order_items oi
                JOIN products p ON oi.product_id = p.products_id
                WHERE oi.order_id = ?
            `, [orderId]);
    
            if (!orderDetails[0]) {
                return null;
            }
    
            return {
                ...orderDetails[0],
                items: orderItems
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Admin;