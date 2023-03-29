const User = require('../models/user');
const Transaction = require('../models/transaction');

exports.setProfilePic = async (req, res) => {
    try {

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
        const id = req.user.id;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const trades = await Transaction.find({ user_id: id }).populate('stock_id');

        if (!trades) {
            return res.status(404).json({ msg: 'Trades not found' });
        }

        res.status(200).json({ trades: trades });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}