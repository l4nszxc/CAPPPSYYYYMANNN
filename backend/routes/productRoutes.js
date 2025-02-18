const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getAllProducts); // Get all products
router.get('/products/category/:category', productController.getProductsByCategory); // Get products by category

module.exports = router;