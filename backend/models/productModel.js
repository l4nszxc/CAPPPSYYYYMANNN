// filepath: backend/models/productModel.js
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

    static async getAll() {
        try {
            const [rows] = await db.execute('SELECT * FROM products');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getByCategory(category) {
        try {
            const [rows] = await db.execute('SELECT * FROM products WHERE category = ?', [category]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Product;