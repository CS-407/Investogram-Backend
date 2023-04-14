const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
	try {
		// Get Authorization header
		const authHeader = req.header("Authorization");

		// Check if header exists
		if (!authHeader) {
			return res.status(401).json({ msg: "Not authorized" });
		}

		// Get token from header
		const token = authHeader.split(" ")[1];

		// Check if token exists
		if (!token) {
			return res.status(401).json({ msg: "Not authorized" });
		}

		console.log("token", token);

		// Decode token
		const decoded = jwt.verify(token, process.env.SECRET);

		// Set user and proceed
		req.user = decoded.user;
		next();
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: "Not authorized" });
	}
};
