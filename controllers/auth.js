const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const dotenv = require("dotenv");
const { sendForgotMail } = require("../services/email");
dotenv.config();

exports.login = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { username, password } = req.body;

	try {
		const existingUser = await User.findOne({ username: username });

		if (!existingUser) {
			return res.status(404).json({ msg: "User not found" });
		}

		const isEqual = await bcrypt.compare(password, existingUser.password);

		if (!isEqual) {
			return res.status(401).json({ msg: "Password incorrect" });
		}

		const payload = {
			user: {
				id: existingUser._id,
			},
		};

		jwt.sign(
			payload,
			process.env.SECRET,
			{
				expiresIn: 3600,
			},
			(err, token) => {
				if (err) throw err;
				res.status(200).json({ token: token, user: existingUser });
			}
		);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error" });
	}
}

exports.signup = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, username, password, password2, profile_pic } = req.body;

	if (password !== password2) {
		return res.status(401).json({ msg: "Passwords do not match" });
	}

	try {
		let existingUser = await User.findOne({ username: username });
		
		if (existingUser) {
			return res.status(401).json({ msg: "Username is taken" });
		}

		existingUser = await User.findOne({ email: email });
		
		if (existingUser) {
			return res.status(401).json({ msg: "Email already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const newUser = new User({
			email: email,
			username: username,
			password: hashedPassword,
			profile_pic: profile_pic
		});

		await newUser.save();

		// Sign in user with jwt
		const payload = {
			user: {
				id: newUser.id,
			},
		};

		jwt.sign(
			payload,
			process.env.SECRET,
			{
				expiresIn: 3600,
			},
			(err, token) => {
				if (err) throw err;
				res.status(200).json({ user: newUser, token });
			}
		);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error" });
	}
};

exports.forgot = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ msg: "No user with that email found" });
		}

		const new_reset_token = Math.floor((1 + Math.random()) * 10000);

		user.reset_token = new_reset_token;

		await user.save();

		sendForgotMail(email, new_reset_token);

		res.status(200).json({ msg: "Mail sent" });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error" });
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const { email, password, password2, reset_token } = req.body;

		if (password !== password2) {
			return res.status(401).json({ msg: "Passwords do not match" });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ msg: "No user with that email found" });
		}

		if (user.reset_token != reset_token) {
			return res.status(401).json({ msg: "Invalid reset token" });
		}

		user.reset_token = 0;
		const hashedPassword = await bcrypt.hash(password, 12);

		user.password = hashedPassword;

		await user.save();

		console.log("Reset password successfully");
		res.status(200).json({ msg: "Updated Successfully" });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error" });
	}
};

exports.resetUsername = async (req, res) => {
	console.log("resetuser");
	try {
		const { email, username, reset_token } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ msg: "No user with that email found" });
		}

		if (user.reset_token != reset_token) {
			return res.status(401).json({ msg: "Invalid reset token" });
		}

		user.reset_token = 0;
		user.username = username;

		await user.save();

		res.status(200).json({ msg: "Updated Successfully" });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error" });
	}
};

exports.updatePassword = async (req, res) => {
	const { new_password, new_password_2 } = req.body;

	try {
		if (new_password !== new_password_2) {
			return res.status(401).json({ msg: "Passwords do not match" });
		}

		const user = await User.findById(req.user.id);

		const hashedPassword = await bcrypt.hash(new_password, 12);

		user.password = hashedPassword;

		await user.save();

		res.status(200).json({ msg: "Updated Successfully" });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error" });
	}
};

exports.updateUsername = async (req, res) => {
	const { new_username } = req.body;

	try {
		const existingUser = await User.findOne({ username: new_username }).select('username');

		if (existingUser) {
			return res.status(401).json({ msg: "Username is taken" });
		}

		const user = await User.findById(req.user.id);

		user.username = new_username;

		await user.save();

		res.status(200).json({ msg: "Updated Successfully" });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ msg: "Server Error" });
	}
}