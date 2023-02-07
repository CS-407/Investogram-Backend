const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

// Login
router.post('/login', authController.login);

// Register
router.post('/signup', authController.signup);

// Forgot
router.post('/forgot', authController.forgot);

// Reset
router.patch('/reset', authController.reset);

// Verify
router.post('/verify', authController.verify);

module.exports = router;