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
        nullable: true,
    },
    tempUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TempUser',
        nullable: true,
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