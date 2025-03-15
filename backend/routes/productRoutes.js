const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Product routes
router.get('/', productController.getAllProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.post('/', productController.uploadMiddleware, productController.insertProduct);
router.put('/:id', productController.uploadMiddleware, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.put('/choices/:choiceId', authenticate, productController.updateProductChoice);

module.exports = router;