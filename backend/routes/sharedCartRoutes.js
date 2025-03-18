const express = require('express');
const router = express.Router();
const sharedCartController = require('../controllers/sharedCartController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/share', sharedCartController.createShareLink);
router.get('/:shareId', sharedCartController.getSharedCart);
router.post('/:shareId/accept', sharedCartController.acceptSharedCart);

module.exports = router;