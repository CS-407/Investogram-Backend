const mongoose = require('mongoose');

const StockPriceSchema = mongoose.Schema({
    stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stocks',
        required: true
    },
    current_price: {
        type: mongoose.Schema.Types.Number,
        required: true
    },
    time_pulled: {
        type: mongoose.Schema.Types.Date,
        default: new Date().toISOString()
    }
});

module.exports = mongoose.model('StockPrice', StockPriceSchema);