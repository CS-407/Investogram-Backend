const mongoose = require('mongoose');
const User = require('../models/user');
const Stock = require('../models/stock');

const StockListSchema = mongoose.Schema({
    list_name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    list_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User.modelName,
        required: true
    },
    stocks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Stock.modelName,
    }]
});

module.exports = mongoose.model('StockList', StockListSchema, "stocklists");