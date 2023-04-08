const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const isAuth = require('../middleware/isAuth');

// Get followers
router.get("/followers", isAuth, userController.getFollowers);

// Get followees
router.get("/following", isAuth, userController.getFollowing);

// Get follow requests
router.get("/requests", isAuth, userController.getFollowRequests);

// Send follow request
router.post("/follow/:userId", isAuth, userController.sendFollowRequest);

// Accept follow request
router.post("/follow/accept/:toFollow/", isAuth, userController.acceptFollowRequest);

// Reject follow request
router.post("/follow/reject/:toReject/", isAuth, userController.rejectFollowRequest);

// Get user's trades
router.get("/trades/:user_id", userController.getTrades);

module.exports = router;