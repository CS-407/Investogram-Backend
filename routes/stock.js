const express = require('express');
const router = express.Router();

const stockController = require('../controllers/stock');
const isAuth = require('../middleware/isAuth');

// Buy stock
router.post("/buy/:id", isAuth, stockController.buy);

// Sell stock
router.post("/sell/:id", isAuth, stockController.sell);

// Get Trades
router.get("/trades", isAuth, stockController.getTrades);

// Get Leaderboard
router.get("/leaderboard", isAuth, stockController.getLeaderboard);

module.exports = router;