const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController'); // Import product controller
const { isAdmin } = require('../middleware/auth');

router.get('/stats', isAdmin, adminController.getStats);
router.get('/users', isAdmin, adminController.getAllUsers);
router.post('/recruit-staff', isAdmin, adminController.recruitStaff);
router.post('/products', isAdmin, productController.insertProduct); // Add product route

module.exports = router;