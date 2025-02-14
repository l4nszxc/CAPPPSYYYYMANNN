const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create(username, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  static async updateOTP(email, otp) {
    try {
        const [result] = await db.execute(
            'UPDATE users SET otp = ?, otp_expires = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE email = ?',
            [otp, email]
        );
        return result;
    } catch (error) {
        throw error;
    }
}

static async verifyOTP(email, otp) {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ? AND otp = ? AND otp_expires > NOW()',
            [email, otp]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
}

static async markEmailAsVerified(email) {
    try {
        const [result] = await db.execute(
            'UPDATE users SET email_verified = 1, otp = NULL, otp_expires = NULL WHERE email = ?',
            [email]
        );
        return result;
    } catch (error) {
        throw error;
    }
}
}

module.exports = User;