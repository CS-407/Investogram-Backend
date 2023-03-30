
const { Model } = require("mongoose");
const { findById } = require("../models/stock");
const post = require("../models/post");
const User = require("../models/user");
const server = require("../server");
const stock = require("../models/stock");
const stockPrice = require("../models/stockPrice");
const transaction = require("../models/transaction");

exports.add = async (req, res) => {
    try {
        const { stock_ticker, stock_name } = req.body;

        const newStock = new stock({
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

    const { startSession } = require('mongoose')
    const session = await startSession();
    session.startTransaction();

    try {
            

        // Balance logic
        uid = req.body.user_id
        const user = await User.findById(uid);
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        if (user.current_balance < req.body.amount_usd) { 
            return res.status(400).json({ msg: 'Insufficient balance' });
        }
        user.current_balance = user.current_balance - req.body.amount_usd;
        user.save();

        const timestamp = new Date().toISOString();
        let newPost = { "user_id": req.body.user_id, "type": "StockBuy", "content": "Bought "+req.body.no_of_shares+" shares" , "timestamp": timestamp };
        const postObj = await post.create(newPost);
        if (!postObj) {
            return res.status(400).json({ msg: 'Post creation failed' });
        }
        req.body.timestamp = timestamp;
        req.body.post_id = postObj._id;
        const transactionObj = transaction.create(req.body);
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
    const { startSession } = require('mongoose')
    const session = await startSession();
    session.startTransaction();

    try {
        // Balance logic
        uid = req.body.user_id
        const user = await User.findById(uid);
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }
        user.current_balance = user.current_balance + req.body.amount_usd;
        user.save();

        const timestamp = new Date().toISOString();
        let newPost = { "user_id": req.body.user_id, "type": "StockSale", "content": "Sold "+req.body.no_of_shares+" shares" , "timestamp": timestamp };
        const postObj = await post.create(newPost);
        if (!postObj) {
            return res.status(400).json({ msg: 'Post creation failed' });
        }
        req.body.timestamp = timestamp;
        req.body.post_id = postObj._id;
        const transactionObj = transaction.create(req.body);
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
            const mongoose = require('mongoose');
            let uid = req.params.user_id
            let stock_id = req.params.stock_id
            transaction.aggregate([
                {
                  $match: {
                      stock_id: mongoose.Types.ObjectId(stock_id),
                      user_id: mongoose.Types.ObjectId(uid)
                  }
                },
                {
                    $lookup: {
                        from: stock.collection.name,
                        localField: 'stock_id',
                        foreignField: '_id',
                        as: 'StockData',
                    }
                },
                {
                    $lookup: {
                        from: stockPrice.collection.name,
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

exports.getLeaderboard = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        let uid = req.params.user_id
        let stock_id = req.params.stock_id

        transaction.aggregate([
            {
              $match: {
                  stock_id: mongoose.Types.ObjectId(stock_id),
                  user_id: mongoose.Types.ObjectId(uid)
              }
            },
            {
                $lookup: {
                    from: stock.collection.name,
                    localField: 'stock_id',
                    foreignField: '_id',
                    as: 'StockData',
                }
            },
            {
                $lookup: {
                    from: stockPrice.collection.name,
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
        stockPrice.where('stock_id').equals(stock_id).exec(function (err, result) {
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

exports.getStockPrice = async (req, res) => {
    try {
        const { startSession } = require('mongoose')
        const session = await startSession();
        const data = await stockPrice.find();
        res.json(data)

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getPrice = async (req,res) => {
    try{
        const mongoose = require('mongoose');
        const id = req.params.stock_id
        stockPrice.aggregate([
            {
              $match: {
                  stock_id: mongoose.Types.ObjectId(id)
              } 
            }
          ]).exec(function (err, result) {
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

exports.getPurchases = async (req, res) => {
    try {

        const mongoose = require('mongoose');
        const id = req.params.stock_id
        transaction.aggregate([
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
        const mongoose = require('mongoose');
        transaction.aggregate([
            {
                $lookup: {
                    from: stock.collection.name,
                    localField: 'stock_id',
                    foreignField: '_id',
                    as: 'StockData',
                }
            },
            {
                $lookup: {
                    from: stockPrice.collection.name,
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
        const stocks = await stock.find();
        const tickers = stocks.map(stock => stock.stock_ticker);
        if (!tickers.length || tickers.length == 0) {
            res.status(400).json({ msg: 'No stocks found' });
            return
        }

        var weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        var yahooFinance = require('yahoo-finance');
        var result = await yahooFinance.historical({
            symbols: tickers,
            from: weekAgo.toISOString(),
            to: new Date().toISOString()
        });
        //console.log(result)
        for (resultTicker in result) {
            var resultData = result[resultTicker]
            var stockId = stocks.find(look => look.stock_ticker == resultTicker)._id;
            for (priceInd in resultData) {
                let price = resultData[priceInd];
                let newPrice = { "stock_id": stockId, "current_price": price.close, "time_pulled": price.date };
                console.log(newPrice)
                //stockPrice.create(newPrice);
            }
        }
        res.status(200).json({ msg: 'Success' });
        return
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}