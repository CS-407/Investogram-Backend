const User = require('../models/user');
const Transaction = require('../models/transaction');
const bcrypt = require('bcryptjs');

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

        const followId = req.body.userId;

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