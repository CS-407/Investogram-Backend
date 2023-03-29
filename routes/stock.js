const express = require('express');
const router = express.Router();

const stockController = require('../controllers/stock');
const isAuth = require('../middleware/isAuth');

// Buy stock
router.post("/buy", stockController.buy);

// Sell stock
router.post("/sell", stockController.sell);

// Get Trades
router.get("/trades/:user_id/:stock_id", stockController.getTrades);

// Graph
router.get("/history/:stock_id", stockController.getHistory);

// Get Leaderboard
router.get("/leaderboard", isAuth, stockController.getLeaderboard);

// Populate Stock Prices
router.get("/populate", stockController.populateStockPrices);

module.exports = router;