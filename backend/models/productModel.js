const db = require('../config/db');

class Product {
    static async create({ name, description, price, stock_quantity, category, image }) {
        try {
            const [result] = await db.execute(
                'INSERT INTO products (name, description, price, stock_quantity, category, image) VALUES (?, ?, ?, ?, ?, ?)',
                [name, description, price, stock_quantity, category, image]
            );
            return result.insertId;
        } catch (error) {
            console.error('Database error:', error);
            throw error;
        }
    }

    static async getAll() {
        try {
            const [rows] = await db.execute(`
                SELECT p.*, COALESCE(SUM(CASE WHEN o.status = 'paid' THEN oi.quantity ELSE 0 END), 0) as total_sold
                FROM products p
                LEFT JOIN order_items oi ON p.products_id = oi.product_id
                LEFT JOIN orders o ON oi.order_id = o.order_id
                GROUP BY p.products_id
            `);
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
    
    
    
    static async getProductsByCategory(category) {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    p.*,
                    COALESCE(SUM(oi.quantity), 0) as total_sold
                FROM products p
                LEFT JOIN order_items oi ON p.products_id = oi.product_id
                LEFT JOIN orders o ON oi.order_id = o.order_id
                WHERE (o.status = 'paid' OR o.status IS NULL)
                AND p.category = ?
                GROUP BY p.products_id
                ORDER BY p.created_at DESC
            `, [category]);
    
            return rows.map(product => ({
                ...product,
                total_sold: parseInt(product.total_sold) || 0
            }));
        } catch (error) {
            console.error('Error getting products by category:', error);
            throw error;
        }
    }
    static async update(id, updates) {
        try {
            // Filter out undefined values
            const validUpdates = Object.entries(updates)
                .filter(([_, value]) => value !== undefined)
                .reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {});

            if (Object.keys(validUpdates).length === 0) {
                throw new Error('No valid updates provided');
            }

            const setClause = Object.keys(validUpdates)
                .map(key => `${key} = ?`)
                .join(', ');
            const values = [...Object.values(validUpdates), id];
            
            await db.execute(
                `UPDATE products SET ${setClause} WHERE products_id = ?`,
                values
            );
        } catch (error) {
            console.error('Database error:', error);
            throw error;
        }
    }
}

module.exports = Product;