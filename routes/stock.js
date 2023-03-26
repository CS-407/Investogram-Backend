const express = require('express');
const router = express.Router();

const stockController = require('../controllers/stock');

// Buy stock
router.post("/buy", stockController.buy);

// Sell stock
router.post("/sell", stockController.sell);

// Get Trades
router.get("/trades/:user_id/:stock_id", stockController.getTrades);

// Graph
router.get("/history/:stock_id", stockController.getHistory);

// Get Leaderboard
router.get("/leaderboard", stockController.getLeaderboard);

module.exports = router;