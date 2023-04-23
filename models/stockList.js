const mongoose = require('mongoose');

const StockListSchema = mongoose.Schema({
    list_name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    stocks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'stocks',
        required: true
    }
});

module.exports = mongoose.model('StockList', StockListSchema, "stocklists");