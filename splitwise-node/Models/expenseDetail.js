const mongoose = require("mongoose");

const expenseDetailSchema = new mongoose.Schema({
    expenseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    paidBy: {
        type: mongoose.Types.Decimal128,
        required: true,
    },
    owedBy: {
        type: mongoose.Types.Decimal128,
        required: true,
    },
}, {
    collection: 'ExpenseDetail',
    timestamps: true
});

module.exports = mongoose.model('ExpenseDetail', expenseDetailSchema);