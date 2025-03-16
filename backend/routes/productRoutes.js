const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// Product routes
router.get('/', productController.getAllProducts);
router.get('/category/:category', productController.getProductsByCategory);
// Put specific routes like 'choices' before parameterized routes like ':id'
router.put('/choices/:choiceId', productController.uploadMiddleware, productController.updateProductChoice);
router.delete('/choices/:choiceId', productController.deleteProductChoice); // Add this line
router.post('/', productController.uploadMiddleware, productController.insertProduct);
router.put('/:id', productController.uploadMiddleware, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;