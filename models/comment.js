const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
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