const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Staff {
    static async create(fullname, email, position, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await db.execute(
                'INSERT INTO staff (fullname, email, position, password) VALUES (?, ?, ?, ?)',
                [fullname, email, position, hashedPassword]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const [rows] = await db.execute('SELECT * FROM staff WHERE email = ?', [email]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Staff;