const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    current_balance: {
        type: mongoose.SchemaTypes.Number, // Float
        default: 25000.00
    },
    followers: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    following: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },
    followers_list: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        default: []
    },
    following_list: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        default: []
    },
    requests: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        default: []
    }
});

module.exports = mongoose.model('User', UserSchema);