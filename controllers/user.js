const User = require('../models/user');
const Transaction = require('../models/transaction');
const Stock = require("../models/stock");
const StockPrice = require("../models/stockPrice");
const mongoose = require('mongoose');

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

        followUser.requests.forEach(_id => {
            if (_id.toString() === id) {
                return res.status(404).json({ msg: 'Request already sent' });
            }
        })

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
        let newFollower = req.params.toFollow
        let toFollow = req.user.id;
        let toFollowObj = await User.findById(toFollow)
        toFollowObj.followers += 1
        toFollowObj.followers_list.push(newFollower)
        toFollowObj.requests = toFollowObj.requests.filter(e => e.toString() !== newFollower)
        await toFollowObj.save()
        let newFollowerObj = await User.findById(newFollower)
        newFollowerObj.following_list.push(toFollow)
        newFollowerObj.following += 1
        await newFollowerObj.save()
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.rejectFollowRequest = async (req, res) => {
    try {
        let toFollow = req.params.toReject
        let newFollower = req.user.id;
        let toFollowObj = await User.findById(newFollower)
        toFollowObj.requests = toFollowObj.requests.filter(e => e.toString() !== toFollow)
        await toFollowObj.save()
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getFollowers = async (req, res) => {
    try {
        const followers = await User.findById(req.user.id).select("followers_list").populate("followers_list", "username");

        return res.status(200).json({ "followers": followers.followers_list });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getFollowees = async (req, res) => {
    try {
        const followees = await User.findById(req.user.id).select("following_list").populate("following_list", "username");

        return res.status(200).json({ "followees": followees.following_list });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getTrades = async (req, res) => {
    try {
        const id = req.params.user_id;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const trades = await Transaction.find({ user_id: id }).populate('stock_id').sort({ timestamp: -1 });

        if (!trades) {
            return res.status(404).json({ msg: 'Trades not found' });
        }

        // -------------------------------------------------
        // Get number of stocks owned for each stock ticker
        // -------------------------------------------------

        const stock_info = {};
        let amt;

        trades.forEach(trade => {
            amt = trade.no_of_shares;
            if (!trade.buy) {
                amt = 0 - amt;
            }

            if (stock_info[trade.stock_id.stock_ticker]) {
                stock_info[trade.stock_id.stock_ticker]['owned'] += amt;
            } else {
                stock_info[trade.stock_id.stock_ticker] = {
                    'stock_name': trade.stock_id.stock_name,
                    'owned': amt
                };
            }
        });

        // ------------------------
        // Get gains made by user
        // ------------------------

        let sells = trades.filter((trade) => trade.buy === false);
        let revenue = sells.reduce((total, item) => total + item.amount_usd, 0);

        // ------------------------
        // Get losses made by user
        // ------------------------

        let buys = trades.filter((trade) => trade.buy === true);
        let loss = buys.reduce((total, item) => total + item.amount_usd, 0);

        // -------------------------------
        // Get total revenue made by user
        // -------------------------------

        let profit = revenue - loss;

        const revenue_obj = {
            'purchases': buys.length,
            'sales': sells.length,
            'revenue': revenue,
            'loss': loss,
            'profit': profit
        }

        res.status(200).json({ msg: 'Success', trades: trades, stock_info: stock_info, monetary_info: revenue_obj });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}