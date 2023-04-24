const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    content: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    timestamp: {
        type: mongoose.Schema.Types.Date,
        default: new Date().toISOString()
    }
});

module.exports = mongoose.model('Comment', CommentSchema, "comments");