const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const isAuth = require('../middleware/isAuth');

// Get followers
router.get("/followers", isAuth, userController.getFollowers);

// Get followees
router.get("/followees", isAuth, userController.getFollowees);

// Send follow request
router.post("/follow/:userId", isAuth, userController.sendFollowRequest);

// Accept follow request
router.post("/follow/accept", isAuth, userController.acceptFollowRequest);

// Reject follow request
router.post("/follow/reject", isAuth, userController.rejectFollowRequest);

// Get user's trades
router.get("/trades", isAuth, userController.getTrades);

module.exports = router;