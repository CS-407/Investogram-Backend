const User = require('../models/user');
const Stock = require("../models/stock");

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

        const user = await User.findById(userId).select("-password -requests");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({ "user": user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}

//Preksha- new
exports.getVariousStocks = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        //const session = await startSession();
        const data = await Stock.find();

        if (!data) {
            return res.status(404).json({ msg: 'Server Error' });
        }

        res.status(200).json({ msg: 'Success', data: data});
        return
        //res.json(data)

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}