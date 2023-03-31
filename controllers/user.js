const User = require('../models/user');
const Transaction = require('../models/transaction');
const stock = require("../models/stock");
const stockPrice = require("../models/stockPrice");

exports.setProfilePic = async (req, res) => {
    try {

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getFollowRequests = async (req, res) => {
    try {
        const id = req.user.id;

        const user = await User.findById(id).select("requests").populate("requests", "username");

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        return res.status(200).json({ "users": user.requests });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.sendFollowRequest = async (req, res) => {
    try {
        const id = req.user.id;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const followId = req.params.userId;

        if (id === followId) {
            return res.status(401).json({ msg: 'Cannot follow self' });
        }

        const followUser = await User.findById(followId);

        if (!followUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        followUser.requests.push(id);

        await followUser.save();

        res.status(200).json({ msg: 'Follow Request Sent' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.acceptFollowRequest = async (req, res) => {
    try {
        let toFollow = req.params.toFollow
        let newFollower = req.params.newFollower
        let toFollowObj = user.findById(toFollow)
        toFollowObj.followers.push(newFollower)
        toFollowObj.requests.filter(e => e !== newFollower)
        toFollowObj.save()
        let newFollowerObj = user.findById(newFollower)
        newFollowerObj.followees.push(toFollow)
        newFollowerObj.save()
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.rejectFollowRequest = async (req, res) => {
    try {
        let toFollow = req.params.toFollow
        let newFollower = req.params.newFollower
        let toFollowObj = user.findById(toFollow)
        toFollowObj.requests.filter(e => e !== newFollower)
        toFollowObj.save()
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getFollowers = async (req, res) => {
    try {

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getFollowees = async (req, res) => {
    try {

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