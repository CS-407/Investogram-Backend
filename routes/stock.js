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

// Get Leaderboard
router.get("/leaderboard", isAuth, stockController.getLeaderboard);

module.exports = router;