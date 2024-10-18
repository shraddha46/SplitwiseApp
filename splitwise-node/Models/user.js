const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
    },
    registration_status: {
        type: String,
        enum: ['confirmed', 'invited'],
        default: 'invited'
    },
},{
    collection: 'User',
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);