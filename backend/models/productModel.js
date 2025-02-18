const db = require('../config/db');

class Product {
    static async create(name, description, price, stock_quantity, category, image) {
        try {
            const [result] = await db.execute(
                'INSERT INTO products (name, description, price, stock_quantity, category, image) VALUES (?, ?, ?, ?, ?, ?)',
                [name, description, price, stock_quantity, category, image]
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Product;