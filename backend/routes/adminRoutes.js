const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController'); 
const { authenticate, isAdmin } = require('../middleware/auth');

router.get('/stats', authenticate, isAdmin, adminController.getStats);
router.get('/users', authenticate, isAdmin, adminController.getAllUsers);
router.get('/staff', authenticate, isAdmin, adminController.getAllStaff);
router.post('/recruit-staff', authenticate, isAdmin, adminController.recruitStaff);
router.post('/products', authenticate, isAdmin, productController.insertProduct);
router.get('/dashboard-stats', authenticate, isAdmin, adminController.getDashboardStats);
router.put('/products/:id', authenticate, isAdmin, productController.updateProduct);
router.put('/staff/:id', authenticate, isAdmin, adminController.updateStaff);
router.delete('/staff/:id', authenticate, isAdmin, adminController.deleteStaff);
module.exports = router;