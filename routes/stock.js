const express = require('express');
const router = express.Router();

const stockController = require('../controllers/stock');
const isAuth = require('../middleware/isAuth');

// Add stock
router.post("/add", stockController.add);

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

// TESTING -> not used for sprint 1
router.get("/stockPrice", stockController.getStockPrice);

//sprint1 - get stock price
router.get("/price/:stock_id", stockController.getPrice);

//sprint1 - get number of purchases
router.get("/purchases/:stock_id", stockController.getPurchases);

//sprint1 - get popular stocks
router.get("/popularstocks", stockController.getPopularStocks);

// Get a single stock info
router.get("/get/:id", stockController.getStock);

module.exports = router;