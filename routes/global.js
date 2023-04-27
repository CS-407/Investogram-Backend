const express = require('express');
const router = express.Router();

const globalController = require('../controllers/global');

// Get users
router.get("/users", globalController.getUsers);

// Get stocks
router.get("/stocks", globalController.getStocks);

// Get trade info
router.get("/tradeinfo", globalController.getTradeInfo);

// Get specific user
router.get("/user/:id", globalController.getOneUser);

// Get leaderboard
router.get("/leaderboard", globalController.getLeaderboard);

module.exports = router;