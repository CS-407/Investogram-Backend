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

// Get user
router.get("/getBalance", isAuth, userController.getBalance);

// Delete trades for a stock
router.delete("/deleteTrades/:user_id/:stock_id", userController.deleteTrades);

// Send delete Request
router.delete("/deleteAcc", userController.deleteAcc);

// Get friends' trades
router.get("/friendsTrades", isAuth, userController.getFriendsTrades);

module.exports = router;