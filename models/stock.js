const mongoose = require('mongoose');

const StockSchema = mongoose.Schema({
    stock_ticker: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    stock_name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    categories: {
        type: [mongoose.Schema.Types.String],
        required: true
    }
});

module.exports = mongoose.model('Stock', StockSchema, "stocks");