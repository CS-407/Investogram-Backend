const Post = require("../models/post");
const User = require("../models/user");
const Stock = require("../models/stock");
const StockPrice = require("../models/stockPrice");
const Transaction = require("../models/transaction");
const Global = require("../models/global");
const mongoose = require('mongoose');
const { startSession } = require('mongoose');

exports.getStock = async (req, res) => {
    try {
        stockInfo = await Stock.findById(req.params.id);
        res.status(200).json({ msg: 'Success' , data: stockInfo});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.add = async (req, res) => {
    try {
        const { stock_ticker, stock_name } = req.body;

        const newStock = new Stock({
            stock_ticker: stock_ticker,
            stock_name: stock_name
        });

        await newStock.save();

        res.status(200).json({ msg: 'Success' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.buy = async (req, res) => {

    const session = await startSession();
    session.startTransaction();

    try {
        // Balance logic
        uid = req.user.id;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        if (user.current_balance < req.body.amount_usd) { 
            return res.status(400).json({ msg: 'Insufficient balance' });
        }
        user.current_balance = user.current_balance - Number(req.body.amount_usd);
        user.save();
        const timestamp = new Date().toISOString();

        let newPost = { "user_id": uid, "type": "StockBuy", "content": "Bought "+req.body.no_of_shares+" shares" , "timestamp": timestamp };
        const postObj = await Post.create(newPost);

        if (!postObj) {
            return res.status(400).json({ msg: 'Post creation failed' });
        }
        req.body.timestamp = timestamp;
        req.body.post_id = postObj._id;

        req.body.user_id = uid;
        const transactionObj = Transaction.create(req.body);

        if (!transactionObj) {
            return res.status(400).json({ msg: 'Transaction creation failed' });
        }
        res.status(200).json({ msg: 'Success' });
        session.commitTransaction();
        session.endSession();
        return
    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.sell = async (req, res) => {
    const session = await startSession();
    session.startTransaction();

    try {
        // Balance logic
        uid = req.user.id;
        const user = await User.findById(uid);
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        user.current_balance = user.current_balance + Number(req.body.amount_usd);
        user.save();

        const timestamp = new Date().toISOString();

        let newPost = { "user_id": uid, "type": "StockSale", "content": "Sold "+req.body.no_of_shares+" shares" , "timestamp": timestamp };
        const postObj = await Post.create(newPost);

        if (!postObj) {
            return res.status(400).json({ msg: 'Post creation failed' });
        }
        req.body.timestamp = timestamp;
        req.body.post_id = postObj._id;

        req.body.user_id = uid;
        const transactionObj = Transaction.create(req.body);

        if (!transactionObj) {
            return res.status(400).json({ msg: 'Transaction creation failed' });
        }
        res.status(200).json({ msg: 'Success' });
        session.commitTransaction();
        session.endSession();
        return
    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getTrades = async (req, res) => {
    try {
        const stockId = req.params.stockId;

        const trades = await Transaction.find({ stock_id: stockId }).populate('user_id', 'name').sort({ timestamp: -1 });

        if (!trades) {
            return res.status(404).json({ msg: 'Trades not found' });
        }

        if (trades.length == 0) {
            return res.status(200).json({ msg: 'No trades made' });
        }

        res.status(200).json({ msg: 'Success', data: trades });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getUserTrades = async (req, res) => {
        try {
            let uid = req.params.user_id
            let stock_id = req.params.stock_id
            let fetched = await Transaction.find({ user_id: uid, stock_id: stock_id }).populate('stock_id', '-__v').populate("stock_price_id", '-__v');
            res.status(200).json({ msg: 'Success', data: fetched });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: 'Server Error' });
        }
}

exports.getTradesForCurrentUser = async (req, res) => {
    try {
        let uid = req.user.id;
        let stock_id = req.params.stock_id
        let fetched = await Transaction.find({ user_id: uid, stock_id: stock_id }).populate('stock_id', '-__v').populate("stock_price_id", '-__v');
        res.status(200).json({ msg: 'Success', data: fetched });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getLeaderboard = async (req, res) => {
    try {
        let uid = req.params.user_id
        let stock_id = req.params.stock_id

        Transaction.aggregate([
            {
              $match: {
                  stock_id: mongoose.Types.ObjectId(stock_id),
                  user_id: mongoose.Types.ObjectId(uid)
              }
            },
            {
                $lookup: {
                    from: Stock.collection.name,
                    localField: 'stock_id',
                    foreignField: '_id',
                    as: 'StockData',
                }
            },
            {
                $lookup: {
                    from: StockPrice.collection.name,
                    localField: 'stock_price_id',
                    foreignField: '_id',
                    as: 'StockPriceData',
                }
            }
          ]).exec(function (err, result) {
            if (err) {
                console.log(err)
                res.status(500).json({ msg: 'Server Error' });
                return
            } else {
                res.status(200).json({ msg: 'Success', data: result});
                return
            }
          });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getHistory = async (req, res) => {
    try {
        let stock_id = req.params.stock_id
        StockPrice.where('stock_id').equals(stock_id).exec(function (err, result) {
            if (err) {
                console.log(err)
                res.status(500).json({ msg: 'Server Error' });
                return
            } else {
                res.status(200).json({ msg: 'Success', data: result});
                return
            }
          });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getPrice = async (req,res) => {
    try{
        const id = req.params.stock_id
        
        const stockPrices = await StockPrice.find({stock_id: id}).sort({ time_pulled: -1 }).limit(1);

        if (!stockPrices || stockPrices.length == 0) {
            return res.status(404).json({ msg: 'No stock price found' });
        }

        res.status(200).json({ msg: 'Success', data: stockPrices });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getPurchases = async (req, res) => {
    try {
        const id = req.params.stock_id
        Transaction.aggregate([
            {
              $match: {
                  stock_id: mongoose.Types.ObjectId(id),
                  buy: {$in: ["true", true]}
              }
             
            }, 
            { 
                $count: "purchases"
            }
          ])
          .exec(function (err, result) {
            if (err) {
                console.log(err)
                res.status(500).json({ msg: 'Server Error' });
                return
            } else {
                res.status(200).json({msg:"Success", data: result});
                return
            }
          });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getPopularStocks = async (req, res) => {
    try {
        Transaction.aggregate([
            {
                $lookup: {
                    from: Stock.collection.name,
                    localField: 'stock_id',
                    foreignField: '_id',
                    as: 'StockData',
                }
            },
            {
                $lookup: {
                    from: StockPrice.collection.name,
                    localField: 'stock_price_id',
                    foreignField: '_id',
                    as: 'StockPriceData',
                }
            },
            {
                $group: {
                    _id: {
                    stock_id: "$stock_id",
                    stock_name: "$StockData.stock_name",
                    stock_ticker: "$StockData.stock_ticker"},
                    totalTransactions: {$sum: "$no_of_shares"}
                }
            },
            {
                $sort: {totalTransactions: -1}
            }
            
          ])
          .exec(function (err, result) {
            if (err) {
                console.log(err)
                res.status(500).json({ msg: 'Server Error' });
                return
            } else {
                res.status(200).json({msg:"Success", data: result});
                return
            }
          });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.populateStockPrices = async (req, res) => {
    try {
        // ------------------------------------
        // Check when prices were last updated
        // ------------------------------------
        
        const latest = await Global.findOne();

        if (!latest) {
            const new_latest = new Global({
                last_pull: new Date()
            });

            await new_latest.save();
        }
        
        const cur_date = new Date();

        const t1 = latest.last_pull.getTime() / 1000;
        const t2 = cur_date.getTime() / 1000;

        const diff_in_seconds = t2 - t1;
        const diff_in_hours = Math.floor(diff_in_seconds / 3600);

        if (diff_in_hours < 24) {
            return res.status(400).json({ "msg": "Prices recently updated" });
        }

        latest.last_pull = new Date();

        await latest.save();

        // -------------------------------------------
        // Only update stocks if last_pull was updated
        // -------------------------------------------

        const stocks = await Stock.find();
        const tickers = stocks.map(stock => stock.stock_ticker);
        if (!tickers.length || tickers.length == 0) {
            return res.status(400).json({ msg: 'No stocks found' });
        }

        var weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        var yahooFinance = require('yahoo-finance');
        var result = await yahooFinance.historical({
            symbols: tickers,
            from: weekAgo.toISOString(),
            to: new Date().toISOString()
        });
        
        for (resultTicker in result) {
            var resultData = result[resultTicker]
            var stockId = stocks.find(look => look.stock_ticker == resultTicker)._id;
            for (priceInd in resultData) {
                let price = resultData[priceInd];
                let newPrice = new StockPrice({ "stock_id": stockId, "current_price": price.close, "time_pulled": price.date });
                
                await newPrice.save();
            }
        }

        res.status(200).json({ msg: 'Success' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

// Don't use me again
exports.setCategories = async (req, res) => {
    /*
    try {
        await Stock.updateMany({}, { categories: []});
        res.status(200).json({ msg: 'Success' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
    */
    try {
        await User.updateMany({}, { profile_pic: 1 });
        res.status(200).json({ msg: 'Success' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getGroupedCategories = async (req, res) => {
    try {
        const completeStocks = await Stock.find();
        const categories = completeStocks.map(stock => stock.categories);
        const flattened = [].concat.apply([], categories);
        const unique = [...new Set(flattened)];
        const grouped = unique.map(cat => {
            return {
                category: cat,
                count: completeStocks.filter(stock => stock.categories.includes(cat)).length,
                stocks: completeStocks.filter(stock => stock.categories.includes(cat))
            }
        });
        const sorted = grouped.sort((a, b) => b.count - a.count);
        res.status(200).json({ msg: 'Success', data: sorted });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}