const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const otpGenerator = require('otp-generator');
const emailService = require('../services/emailService.js');

exports.register = async (req, res) => {
  try {
      const { username, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
          return res.status(400).json({ message: 'Email already registered' });
      }

      // Create user
      await User.create(username, email, password);

      // Generate OTP
      const otp = otpGenerator.generate(6, { 
          digits: true, 
          alphabets: false, 
          upperCase: false, 
          specialChars: false 
      });

      // Save OTP
      await User.updateOTP(email, otp);

      // Send OTP email
      await emailService.sendOTP(email, otp);

      res.status(201).json({ 
          message: 'Registration successful. Please check your email for OTP verification.',
          email
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};
exports.verifyOTP = async (req, res) => {
  try {
      const { email, otp } = req.body;

      // Check if the OTP is valid
      const user = await User.verifyOTP(email, otp);
      if (!user) {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      // Mark email as verified
      await User.markEmailAsVerified(email);

      res.status(200).json({ 
          message: 'Email verified successfully',
          success: true
      });
  } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({ 
          message: 'Error verifying OTP',
          success: false
      });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if email is verified
    const isVerified = await User.isEmailVerified(email);
    if (!isVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email before logging in',
        needsVerification: true,
        email: email
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Set user session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add logout controller
exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
};
exports.getUsername = async (req, res) => {
  try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
          return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, 'your-secret-key');
      const user = await User.findByEmail(decoded.email);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.json({
          username: user.username
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};