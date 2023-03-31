const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/auth');

// Login
router.post('/login', body('email').isEmail(), body('password').isLength({ min: 6 }), authController.login);

// Register
router.post('/signup', body('email').isEmail(), body('password').isLength({ min: 6 }), authController.signup);

// Forgot
router.post('/forgot', body('email').isEmail(), authController.forgot);

// Reset password
router.patch('/resetpass', body('email').isEmail(), authController.resetPassword);

// Reset username
router.patch('/resetusername', body('email').isEmail(), authController.resetUsername);

// Verify
router.post('/verify', authController.verify);

module.exports = router;