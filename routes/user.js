const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const isAuth = require('../middleware/isAuth');

// Get followers
router.get("/followers", isAuth, userController.getFollowers);

// Get followees
router.get("/followees", isAuth, userController.getFollowees);

// Get follow requests
router.get("/requests", isAuth, userController.getFollowRequests);

// Send follow request
router.post("/follow/:userId", isAuth, userController.sendFollowRequest);

// Accept follow request
router.post("/follow/accept/:toFollow/:newFollower", userController.acceptFollowRequest);

// Reject follow request
router.post("/follow/reject/:toFollow/:newFollower", userController.rejectFollowRequest);

// Get user's trades
router.get("/trades/:user_id", userController.getTrades);

module.exports = router;