const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/verify-otp', userController.verifyOTP); 
router.get('/getUsername', userController.getUsername);

module.exports = router;