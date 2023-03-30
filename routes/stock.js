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

// TESTING -> not used for sprint 1
router.get("/stockPrice", stockController.getStockPrice);

//sprint1 - get stock price
router.get("/price/:stock_id", stockController.getPrice);

//sprint1 - get number of purchases
router.get("/purchases/:stock_id", stockController.getPurchases);

//sprint1 - get popular stocks
router.get("/popularstocks", stockController.getPopularStocks);

module.exports = router;