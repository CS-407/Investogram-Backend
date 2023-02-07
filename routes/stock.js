const express = require('express');
const router = express.Router();

const stockController = require('../controllers/stock');

// Buy stock
router.post("/buy/:id", stockController.buy);

// Sell stock
router.post("/sell/:id", stockController.sell);

// Get Trades
router.get("/trades", stockController.getTrades);

// Get Leaderboard
router.get("/leaderboard", stockController.getLeaderboard);

module.exports = router;