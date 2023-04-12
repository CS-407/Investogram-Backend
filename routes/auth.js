const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/auth');

// Login
router.post('/login', body('email').isEmail(), body('password').isLength({ min: 6 }), authController.login);

// Register
router.post('/signup', body('email').isEmail(), body('password').isLength({ min: 6 }), authController.signup);

// ForgotPass
router.post('/forgot', authController.forgotpass);

// ResetPass
router.patch('/resetpass', authController.resetpass);

// ResetUser
router.post('/resetuser', authController.resetuser);

// Verify
router.post('/verify', authController.verify);

module.exports = router;