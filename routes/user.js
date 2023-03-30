const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

// Get followers
router.get("/followers/:_id", userController.getFollowers);

// Get followees
router.get("/followees/:_id", userController.getFollowees);

// Send follow request
router.post("/follow", userController.sendFollowRequest);

// Accept follow request
router.post("/follow/accept", userController.acceptFollowRequest);

// Reject follow request
router.post("/follow/reject", userController.rejectFollowRequest);

// Get user's trades
router.get("/trades", userController.getTrades);

module.exports = router;