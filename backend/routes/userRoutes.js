const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/verify-otp', userController.verifyOTP); 
router.get('/getUsername', userController.getUsername);
router.post('/resend-otp', userController.resendOTP);


router.post('/forgot-password', userController.forgotPassword);
router.post('/verify-password-reset', userController.verifyPasswordReset);
router.post('/reset-password', userController.resetPassword);


module.exports = router;