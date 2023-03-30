const { Model } = require("mongoose");
const { findById } = require("../models/stock");
//
const post = require("../models/post");
const User = require("../models/user");
const server = require("../server");
//
const stock = require("../models/stock");
const stockPrice = require("../models/stockPrice");
const transaction = require("../models/transaction");

exports.buy = async (req, res) => {
    try {
            

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.sell = async (req, res) => {
    try {

    } catch (err) {
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