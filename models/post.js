const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    content: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    likes: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    timestamp: {
        type: mongoose.SchemaTypes.Date,
        default: new Date().toISOString()
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment',
        default: []
    }
});

module.exports = mongoose.model('Post', PostSchema, "posts");