const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

router.use(authenticate);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile-pictures')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/verify-otp', userController.verifyOTP); 
router.get('/getUsername', userController.getUsername);
router.post('/resend-otp', userController.resendOTP);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

router.post('/forgot-password', userController.forgotPassword);
router.post('/verify-password-reset', userController.verifyPasswordReset);
router.post('/reset-password', userController.resetPassword);
router.post('/upload-profile-picture', userController.uploadMiddleware, userController.uploadProfilePicture);
router.delete('/remove-profile-picture', userController.removeProfilePicture);


module.exports = router;