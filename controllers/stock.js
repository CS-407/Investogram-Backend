const post = require("../models/post");
const transaction = require("../models/transaction");

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