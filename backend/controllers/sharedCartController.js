const SharedCart = require('../models/sharedCartModel');

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
        await SharedCart.acceptSharedCart(shareId, userId);
        res.json({ message: 'Cart items copied successfully' });
    } catch (error) {
        console.error('Error accepting shared cart:', error);
        res.status(500).json({ message: 'Failed to accept shared cart' });
    }
};