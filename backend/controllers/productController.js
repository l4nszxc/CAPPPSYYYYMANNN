const Product = require('../models/productModel');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const productUploadsPath = 'uploads/products/'; // Store uploaded files in the 'uploads/products' directory
        // Ensure the directory exists
        const fs = require('fs');
        if (!fs.existsSync(productUploadsPath)) {
            fs.mkdirSync(productUploadsPath, { recursive: true });
        }
        cb(null, productUploadsPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Rename the file to avoid conflicts
    }
});

const upload = multer({ storage: storage });

exports.insertProduct = [
    upload.single('image'), // 'image' should match the name of the file input in the frontend
    async (req, res) => {
        try {
            const { name, description, price, stock_quantity, category } = req.body;
            const image = req.file ? 'products/' + req.file.filename : null; // Get the filename of the uploaded image

            // Validate input data
            if (!name || !description || !price || !stock_quantity || !category) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Create the product
            await Product.create(name, description, price, stock_quantity, category, image);

            res.status(201).json({ message: 'Product added successfully' });
        } catch (error) {
            console.error('Product insertion error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
];