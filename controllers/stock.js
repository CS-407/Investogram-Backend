const post = require("../models/post");
const transaction = require("../models/transaction");
const stock = require("../models/stock");
const stockPrice = require("../models/stockPrice");

exports.buy = async (req, res) => {
    try {
        const timestamp = new Date().toISOString();
        let newPost = { "user_id": req.body.user_id, "type": "StockBuy", "content": "Bought "+req.body.no_of_shares+" shares" , "timestamp": timestamp };
        console.log(newPost)
        post.create(newPost, function (err, success) {
            if (err) { 
                console.log(err)
                res.status(500).json({ msg: 'Server Error' });
                return
            } else  { // Successfully created post
                req.body.timestamp = timestamp;
                req.body.post_id = success._id;
                transaction.create(req.body, function (err, success) {
                    if (err) { // Error in creating transaction
                        console.log(err)
                        res.status(500).json({ msg: 'Server Error' });
                        return
                    } else { // Overall success
                        console.log(success)
                        res.status(200).json({ msg: 'Success' });
                        return
                    }
                });
            }
        });
        
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