const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Product routes
router.get('/', productController.getAllProducts);
router.get('/category/:category', productController.getProductsByCategory);

// Fix: Apply proper middleware for the choices route - use single upload for choice images
router.put('/choices/:choiceId', productController.uploadMiddleware, productController.updateProductChoice);
router.post('/', productController.uploadMiddleware, productController.insertProduct);
router.put('/:id', productController.uploadMiddleware, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;