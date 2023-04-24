const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const authController = require("../controllers/auth");
const isAuth = require("../middleware/isAuth");

// Login
router.post(
	"/login",
	body("password").isLength({ min: 6, max: 10 }),
	authController.login
);

// Register
router.post(
	"/signup",
	body("email").isEmail(),
	body("password").isLength({ min: 6, max: 10 }),
	authController.signup
);

// Forgot
router.post("/forgot", body("email").isEmail(), authController.forgot);

// Reset password
router.patch(
	"/resetpass",
	body("email").isEmail(),
	authController.resetPassword
);

// Reset username
router.patch(
	"/resetusername",
	isAuth,
	authController.resetUsername
);

// Update password
router.patch(
	"/updatepass",
	body("new_password").isLength({ min: 6, max: 10 }),
	body("new_password_2").isLength({ min: 6, max: 10 }),
	isAuth,
	authController.updatePassword
);

// Update username
router.patch("/updateusername", isAuth, authController.updateUsername);

module.exports = router;
