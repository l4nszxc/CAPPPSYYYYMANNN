const Product = require('../models/productModel');
const Admin = require('../models/adminModel');
const multer = require('multer');
const { uploadToImgBB } = require('../services/imgbbService');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'choiceImage', maxCount: 10 } // Allow up to 10 choice images
]);
exports.uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
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
            const choiceImages = req.files.choiceImage || [];
            
            for (let i = 0; i < choicesArray.length; i++) {
                const choice = choicesArray[i];
                let choiceImageUrl = null;
                
                // Upload choice image if provided
                if (choiceImages[i]) {
                    choiceImageUrl = await uploadToImgBB(choiceImages[i].buffer);
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
        
        // Debug logs
        console.log('Updating product with ID:', id);
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        
        let imageUrl = null;
        
        // Upload new image to ImgBB if provided
        if (req.file) {
            console.log('Processing image file for product update:', req.file);
            imageUrl = await uploadToImgBB(req.file.buffer);
            console.log('New product image uploaded to ImgBB:', imageUrl);
        }

        // Create updates object with only defined values
        const updates = {};
        if (name) updates.name = name;
        if (description) updates.description = description;
        if (price) updates.price = parseFloat(price);
        if (stock_quantity) updates.stock_quantity = parseInt(stock_quantity);
        if (category) updates.category = category;
        if (imageUrl) updates.image = imageUrl;

        console.log('Updates to be applied:', updates);

        // Update the product
        await Product.update(id, updates);

        res.json({ 
            message: 'Product updated successfully',
            imageUrl: imageUrl // Always return the imageUrl if it exists
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
        await Admin.deleteProduct(id); // Change Product.delete to Admin.deleteProduct
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
exports.updateProductChoice = async (req, res) => {
    try {
        const { choiceId } = req.params;
        const { name, stock, price } = req.body;
        
        // Create updates object with only defined values
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (stock !== undefined) updates.stock = parseInt(stock);
        if (price !== undefined) updates.price = parseFloat(price);
        
        // Handle image upload if provided
        if (req.file) {
            console.log('Image file received for product choice update:', req.file);
            const imageUrl = await uploadToImgBB(req.file.buffer);
            if (imageUrl) {
                console.log('Image uploaded to ImgBB:', imageUrl);
                updates.image = imageUrl;
            }
        } else {
            console.log('No image file received for product choice update');
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No valid updates provided' });
        }

        console.log('Updating product choice with:', updates);
        // Update the choice
        await Product.updateChoice(choiceId, updates);

        res.json({ 
            message: 'Product choice updated successfully',
            updates 
        });
    } catch (error) {
        console.error('Error updating product choice:', error);
        res.status(500).json({ message: 'Error updating product choice', error: error.message });
    }
};
exports.deleteProductChoice = async (req, res) => {
    try {
        const { choiceId } = req.params;
        
        if (!choiceId) {
            return res.status(400).json({ message: 'Choice ID is required' });
        }

        // Delete the choice
        await Product.deleteChoice(choiceId);

        res.json({ message: 'Product choice deleted successfully' });
    } catch (error) {
        console.error('Error deleting product choice:', error);
        res.status(500).json({ message: 'Error deleting product choice', error: error.message });
    }
};