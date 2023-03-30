const { Model } = require("mongoose");
const { findById } = require("../models/stock");
//
const post = require("../models/post");
const User = require("../models/user");
const server = require("../server");
//

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

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
}