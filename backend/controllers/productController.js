const Product = require('../models/productModel');
const multer = require('multer');
const { uploadToImgBB } = require('../services/imgbbService');

// Configure multer for memory storage instead of disk storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

exports.uploadMiddleware = upload.single('image');

exports.insertProduct = async (req, res) => {
    try {
        const { name, description, price, stock_quantity, category } = req.body;
        let imageUrl = null;

        // Upload image to ImgBB if a file was provided
        if (req.file) {
            imageUrl = await uploadToImgBB(req.file.buffer);
        }

        // Validate input data
        if (!name || !description || !price || !stock_quantity || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create the product with ImgBB URL
        await Product.create({
            name,
            description,
            price,
            stock_quantity,
            category,
            image: imageUrl
        });

        res.status(201).json({ 
            message: 'Product added successfully',
            imageUrl
        });
    } catch (error) {
        console.error('Product insertion error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.getByCategory(category);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock_quantity, category } = req.body;
        let imageUrl = null;

        // Upload new image to ImgBB if provided
        if (req.file) {
            imageUrl = await uploadToImgBB(req.file.buffer);
        }

        const updates = {
            name,
            description,
            price,
            stock_quantity,
            category
        };

        if (imageUrl) {
            updates.image = imageUrl;
        }

        await Product.update(id, updates);
        res.json({ 
            message: 'Product updated successfully',
            imageUrl: imageUrl || undefined
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.delete(id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.getById(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
};