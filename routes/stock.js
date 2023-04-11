const express = require('express');
const router = express.Router();

const stockController = require('../controllers/stock');
const isAuth = require('../middleware/isAuth');

// Add stock
router.post("/add", stockController.add);

// Buy stock
router.post("/buy", isAuth, stockController.buy);

// Sell stock
router.post("/sell", isAuth, stockController.sell);

// Get Trades (for a particular stock across all users)
router.get("/trades/:stock_id", stockController.getTrades);

// Get Trades (for a particular user on a particular stock)
router.get("/trades/:user_id/:stock_id", stockController.getUserTrades);

// Get Trades for current user
router.get("/userTrades/:stock_id", isAuth, stockController.getTradesForCurrentUser);

// Graph
router.get("/history/:stock_id", stockController.getHistory);

// Get Leaderboard
router.get("/leaderboard", isAuth, stockController.getLeaderboard);

// Populate Stock Prices
router.get("/populate", stockController.populateStockPrices);

//sprint1 - get stock price
router.get("/price/:stock_id", stockController.getPrice);

//sprint1 - get number of purchases
router.get("/purchases/:stock_id", stockController.getPurchases);

//sprint1 - get popular stocks
router.get("/popularstocks", stockController.getPopularStocks);

// Get a single stock info
router.get("/get/:id", stockController.getStock);

module.exports = router;