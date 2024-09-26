const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
    },
    inviteBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    collection: 'TempUser',
    timestamps: true
});

module.exports = mongoose.model('TempUser', tempUserSchema);