const mongoose = require('mongoose');

const GlobalSchema = mongoose.Schema({
    last_pull: {
        type: mongoose.Schema.Types.Date,
        default: new Date().toISOString()
    }
});

module.exports = mongoose.model('Global', GlobalSchema);