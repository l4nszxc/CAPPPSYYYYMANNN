const Cart = require('../models/cartModel');

exports.getCart = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const cartItems = await Cart.getCart(req.user.id);
        res.json(cartItems);
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ message: 'Error getting cart items' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        await Cart.addToCart(req.user.id, productId, quantity);
        res.status(201).json({ message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding product to cart' });
    }
};

exports.updateQuantity = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { productId } = req.params;
        const { quantity } = req.body;
        
        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        await Cart.updateQuantity(req.user.id, productId, quantity);
        res.json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Error updating cart' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        await Cart.removeFromCart(req.user.id, productId);
        res.json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Error removing product from cart' });
    }
};