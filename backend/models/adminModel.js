const db = require('../config/db');

class Admin {
    static async getUserStats() {
        try {
            const [result] = await db.execute(`
                SELECT COUNT(*) as totalUsers
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
                SELECT id, username, email, created_at 
                FROM users 
                WHERE role = 'user'
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
}

module.exports = Admin;