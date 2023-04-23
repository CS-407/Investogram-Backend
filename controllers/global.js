const User = require('../models/user');
const Stock = require("../models/stock");
const Transaction = require("../models/transaction");
const Global = require("../models/global");
const Leaderboard = require('../models/leaderboard');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("username");

        res.status(200).json({ "users": users });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getStocks = async (req, res) => {
    try {
        const stocks = await Stock.find();

        res.status(200).json({ "stocks": stocks });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

exports.getOneUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select("-password -reset_token");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ "user": user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
} 

exports.getLeaderboard = async (req, res) => {
    try {
        // -----------------------------------------
        // Check when leaderboard was last updated
        // -----------------------------------------
        
        const latest = await Global.findOne();

        const cur_date = new Date();

        const t1 = latest.last_update.getTime() / 1000;
        const t2 = cur_date.getTime() / 1000;

        const diff_in_seconds = t2 - t1;
        const diff_in_hours = Math.floor(diff_in_seconds / 3600);
        const diff_in_days = Math.floor(diff_in_hours / 24);

        // --------------------------------------------------------------------
        // If leaderboard was updated less than 7 days ago, return leaderboard
        // --------------------------------------------------------------------

        if (diff_in_days < 7) {
            const leaderboard = await Leaderboard.find().populate("user_id", "username").sort({ position: 1 });

            return res.status(200).json({ msg: "Leaderboard recently updated", leaderboard: leaderboard });
        }

        latest.last_update = new Date();

        await latest.save();

        // -------------------------------------------
        // Update leaderboard based on recent trades
        // -------------------------------------------
        
        const trades = await Transaction.find().populate("user_id", "username");

        const user_obj = {};
        let cur_user, cur_username;

        trades.forEach((trade) => {
            cur_username = trade.user_id.username;

            if (user_obj[cur_username]) {
                cur_user = user_obj[cur_username];
            } else {
                cur_user = {
                    user_id: trade.user_id._id,
                    loss: 0,
                    revenue: 0,
                    num_trades: 0
                }
                user_obj[cur_username] = cur_user;
            }

            if (trade.buy == true) {
                cur_user.loss += trade.amount_usd;
            } else {
                cur_user.revenue += trade.amount_usd;
            }
            cur_user.num_trades += 1;
        });

        for (const [key, value] of Object.entries(user_obj)) {
            user_obj[key].profit = value.revenue - value.loss;
        }

        const leaderboard = Object.values(user_obj);

        leaderboard.sort((user_1, user_2) => {
            return user_2.profit - user_1.profit;
        });

        leaderboard.forEach((user, index) => {
            user.position = index + 1;
        });

        // ---------------------------
        // Credit top 10 performers
        // ---------------------------

        leaderboard.forEach(async (user) => {
            if (user.position < 10) {
                const cur_user = await User.findById(user.user_id);
    
                if (user.position == 1) {
                    cur_user.current_balance += 10000;
                } else if (user.position == 2) {
                    cur_user.current_balance += 7500;
                } else if (user.position == 3) {
                    cur_user.current_balance += 5000;
                } else {
                    cur_user.current_balance += 2000;
                }
    
                await cur_user.save();
            }
        });

        await Leaderboard.deleteMany();

        await Leaderboard.insertMany(leaderboard);

        const updated_leaderboard = await Leaderboard.find().populate("user_id", "username").sort({ position: 1 });

        return res.status(200).json({ msg: "Leaderboard updated", leaderboard: updated_leaderboard });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}