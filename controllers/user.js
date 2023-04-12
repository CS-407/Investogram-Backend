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
        res.status(200).json({ msg: 'Success' });
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
        res.status(200).json({ msg: 'Success' });
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

exports.getFollowing = async (req, res) => {
    try {
        const following = await User.findById(req.user.id).select("following_list").populate("following_list", "username");

        return res.status(200).json({ "following": following.following_list });
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

        const trades = await Transaction.find({ user_id: id }).populate('stock_id', '-__v').populate("stock_price_id", '-__v').sort({ timestamp: -1 }).select("-__v");

        if (!trades) {
            return res.status(404).json({ msg: 'Trades not found' });
        }

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
                    '_id': trade.stock_id._id,
                    'stock_ticker': trade.stock_id.stock_ticker,
                    'stock_name': trade.stock_id.stock_name,
                    'owned': amt
                };
            }
        });

        for (const [key, value] of Object.entries(stock_info)) {
            const cur_price = await StockPrice.find({ stock_id: stock_info[key]['_id'] }).sort({ time_pulled: -1 });
            stock_info[key]['current_price'] = cur_price[0].current_price;
        }

        res.status(200).json({ msg: 'Success', trades: trades, stock_info: Object.values(stock_info), monetary_info: revenue_obj });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getBalance = async (req, res) => {
    try {
        const userData = await User.findById(req.user.id);
        res.status(200).json({ msg: 'Success', balance: userData.current_balance });
        return
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.deleteAcc = async(req, res) => {
    console.log("Check delete");
    try {
        const id = req.body.user_id;
        const password = req.body.password;
        const user = await User.findById(id);
        //const transaction = await Transaction.findByIdAndDelete(id);
        //const posts = await posts.findByIdAndDelete(id);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ msg: 'User not found' });
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            console.log("Password not matching");
            return res.status(401).json({ msg: 'Password incorrect' });
        }
        const delUser = await User.findByIdAndDelete(id);
        if (!delUser) {
            return res.status(404).json({ msg: 'Delete failed' });
        }
        res.status(200).json({ msg: 'Success' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}