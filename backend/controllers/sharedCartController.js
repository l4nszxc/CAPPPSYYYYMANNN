const SharedCart = require('../models/sharedCartModel');
const Cart = require('../models/cartModel');

exports.createShareLink = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await SharedCart.createShareLink(userId);
        res.json(result);
    } catch (error) {
        console.error('Error creating share link:', error);
        res.status(500).json({ message: 'Failed to create share link' });
    }
};

exports.getSharedCart = async (req, res) => {
    try {
        const { shareId } = req.params;
        const result = await SharedCart.getSharedCart(shareId);
        res.json(result);
    } catch (error) {
        console.error('Error getting shared cart:', error);
        res.status(404).json({ message: 'Shared cart not found or expired' });
    }
};

exports.acceptSharedCart = async (req, res) => {
    try {
        const { shareId } = req.params;
        const userId = req.user.id;
        
        // Accept the shared cart invitation
        const { ownerId } = await SharedCart.acceptSharedCart(shareId, userId);
        
        // Get owner's cart items
        const ownerItems = await Cart.getCart(ownerId);
        
        // Remove current items from receiver's cart
        const receiverItems = await Cart.getCart(userId);
        for (const item of receiverItems) {
            await Cart.removeFromCart(userId, item.id);
        }
        
        // Copy items to receiver's cart
        for (const item of ownerItems) {
            await Cart.addToCart(userId, item.product_id, item.quantity, item.choice_id);
        }
        
        res.json({ message: 'Cart items synchronized successfully' });
    } catch (error) {
        console.error('Error accepting shared cart:', error);
        res.status(500).json({ message: 'Failed to accept shared cart' });
    }
};

exports.getActiveShare = async (req, res) => {
    try {
        const userId = req.user.id;
        const activeShare = await SharedCart.getActiveSharedCart(userId);
        res.json(activeShare || { active: false });
    } catch (error) {
        console.error('Error getting active share:', error);
        res.status(500).json({ message: 'Error checking active share status' });
    }
};