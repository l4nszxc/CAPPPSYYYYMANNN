const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

router.get('/stats', isAdmin, adminController.getStats);
router.get('/users', isAdmin, adminController.getAllUsers);

module.exports = router;