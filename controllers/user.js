const { Model } = require("mongoose");
const { findById } = require("../models/stock");
//
const post = require("../models/post");
const User = require("../models/user");
const server = require("../server");
//
const stock = require("../models/stock");
const stockPrice = require("../models/stockPrice");
const Transaction = require("../models/transaction");

exports.setProfilePic = async (req, res) => {
    try {

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.sendFollowRequest = async (req, res) => {
    try {

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.acceptFollowRequest = async (req, res) => {
    try {

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.rejectFollowRequest = async (req, res) => {
    try {

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getFollowers = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const id = req.params._id
        User.aggregate([
            {
              $match: {
                  _id: mongoose.Types.ObjectId(id)
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

exports.getFollower = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        //const userId = req.user.id;
        const userId = req.params._id;
        console.log("userId\n");

        const user = await User.findById(userId).populate("followers_list", "username");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        console.log("user successful\n");
        //const user = await User.findById(id).select("requests").populate("requests", "username");
        /*const followers_array = user.followers_list;
        var obj = [];

        followers_array.forEach(followerid => {
            var follower = User.findById(followerid);
            if (!user) {
                return res.status(404).json({ msg: "Follower not found" });
            }
            obj.push({
                id: follower._id,
                username: follower.username
            });
        });*/
        console.log("returning followers list\n");

        return res.status(200).json({ "followers": user.followers_list });


    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getFollowees = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const id = req.params._id
        User.aggregate([
            {
              $match: {
                  _id: mongoose.Types.ObjectId(id)
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

exports.getTrades = async (req, res) => {
    try {

        const mongoose = require('mongoose');

        const id = req.params.user_id;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const trades = await Transaction.aggregate([
            {
              $match: {
                  user_id: mongoose.Types.ObjectId(id)
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
          ]).exec()

        if (!trades) {
            return res.status(404).json({ msg: 'Trades not found' });
        }
        res.status(200).json({ msg: 'Success', data: trades });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

//for viewing friends losses/gains

exports.getValidFriend = async (req, res) => {
    try {
        

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }

}