const Product = require('../models/productModel');
const multer = require('multer');
const { uploadToImgBB } = require('../services/imgbbService');

// Configure multer for memory storage instead of disk storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
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

// This middleware will handle both the main product image and multiple choice images
exports.uploadMiddleware = (req, res, next) => {
    const multerFields = [
        { name: 'image', maxCount: 1 }
    ];
    
    // Add fields for choice images dynamically
    if (req.headers['content-type'].includes('multipart/form-data')) {
        for (let i = 0; i < 10; i++) { // Limit to 10 choices max
            multerFields.push({ name: `choiceImage_${i}`, maxCount: 1 });
        }
    }
    
    const uploadMultiple = upload.fields(multerFields);
    
    uploadMultiple(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(500).json({ message: `Server error: ${err.message}` });
        }
        next();
    });
};

exports.insertProduct = async (req, res) => {
    try {
        const { name, description, price, stock_quantity, category, hasChoices, choices } = req.body;
        let imageUrl = null;

        // Upload main product image to ImgBB if provided
        if (req.files && req.files.image && req.files.image[0]) {
            imageUrl = await uploadToImgBB(req.files.image[0].buffer);
        }

        // Validate input data
        if (!name || !description || !price || !stock_quantity || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create the product
        const productId = await Product.create({
            name,
            description,
            price,
            stock_quantity,
            category,
            image: imageUrl
        });

        // Handle product choices if they exist
        if (hasChoices && choices) {
            const choicesArray = JSON.parse(choices);
            
            for (let i = 0; i < choicesArray.length; i++) {
                const choice = choicesArray[i];
                let choiceImageUrl = null;
                
                // Upload choice image if provided
                if (req.files && req.files[`choiceImage_${i}`] && req.files[`choiceImage_${i}`][0]) {
                    choiceImageUrl = await uploadToImgBB(req.files[`choiceImage_${i}`][0].buffer);
                }
                
                // Create the choice
                await Product.createChoice({
                    productId,
                    name: choice.name,
                    price: choice.price,
                    stock: choice.stock,
                    image: choiceImageUrl
                });
            }
        }

        res.status(201).json({ 
            message: 'Product added successfully',
            productId,
            imageUrl
        });
    } catch (error) {
        console.error('Product insertion error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update the existing routes to fetch product choices too
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

        // Create updates object with only defined values
        const updates = {};
        if (name) updates.name = name;
        if (description) updates.description = description;
        if (price) updates.price = parseFloat(price);
        if (stock_quantity) updates.stock_quantity = parseInt(stock_quantity);
        if (category) updates.category = category;
        if (imageUrl) updates.image = imageUrl;

        // Update the product
        await Product.update(id, updates);

        res.json({ 
            message: 'Product updated successfully',
            imageUrl: imageUrl || undefined
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ 
            message: 'Error updating product',
            error: error.message 
        });
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