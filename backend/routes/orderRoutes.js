const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.post('/', orderController.createOrder);
router.get('/history', orderController.getUserOrders);


module.exports = router;