const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    splitMethod: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, {
    collection: 'Expense',
    timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);