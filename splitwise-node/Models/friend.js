const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['invited', 'confirmed'],
        default: 'invited',
    },
}, {
    collection: 'Friend',
    timestamps: true
});

module.exports = mongoose.model('Friend', friendSchema);