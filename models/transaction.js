const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stocks',
        required: true
    },
    stock_price_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stockprices',
        required: true
    },
    num_shares: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    amount: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    timestamp: {
        type: mongoose.Schema.Types.Date,
        default: new Date().toISOString()
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts'
    }
})

module.exports = mongoose.model('Transaction', TransactionSchema);