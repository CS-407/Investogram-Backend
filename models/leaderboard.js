const mongoose = require('mongoose');

const LeaderboardSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    position: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    loss: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    revenue: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    profit: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    num_trades: {
        type: mongoose.Schema.Types.Number,
        required: true
    }
});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema, "leaderboards");