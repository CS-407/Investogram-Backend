const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

// Get followers
router.get("/followers", userController.getFollowers);

// Get followees
router.get("/followees", userController.getFollowees);

// Send follow request
router.post("/follow", userController.sendFollowRequest);

// Accept follow request
router.post("/follow/accept/:toFollow/:newFollower", userController.acceptFollowRequest);

// Reject follow request
router.post("/follow/reject/:toFollow/:newFollower", userController.rejectFollowRequest);

// Get user's trades
router.get("/trades/:user_id", userController.getTrades);

module.exports = router;