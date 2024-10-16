const mongoose = require('mongoose');
const User = require('../Models/user');
const Expense = require('../Models/expense');
const ExpenseDetail = require('../Models/expenseDetail');
const Friend = require('../Models/friend');

const addExpense = async (req, res) => {
  try {
    const { description, amount, createdBy, splitMethod, date, friend, expenseDetail } = req.body;

    // Create the expense
    const newExpense = new Expense({ description, amount, createdBy, splitMethod, date });
    await newExpense.save();

    // Save friend
    var savedFriend = [];
    var savedInviteUser = [];

    if (friend.length > 0) {
      const findInviteUser = friend.filter(v => !('userId' in v));

      if (findInviteUser.length > 0) {
        try {
          savedInviteUser = await User.insertMany(findInviteUser);

          if (savedInviteUser.length > 0) {
            savedFriend = await Friend.insertMany(
              savedInviteUser.map(item => ({ userId: req.userId, friendId: item._id }))
            );
          }
        } catch (error) {
          console.error("Error inserting invite users:", error);
          return res.status(500).send('Error saving invite users');
        }
      } else {
        console.log("No invite users to save.");
      }
    }

    // Save expense details
    const savedExpenseDetail = await ExpenseDetail.insertMany(expenseDetail.map(detail => {
      return ({
        expenseId: newExpense._id,
        userId: detail.userId ? detail.userId : savedInviteUser.length > 0 ? savedInviteUser.find(u => u.email === detail.email)?._id : null,
        paidBy: detail.paidBy || 0.00,
        owedBy: detail.owedBy || 0.00
      })
    }));

    return res.status(200).json({ newExpense, friend: savedFriend, expenseDetail: savedExpenseDetail });
  } catch (error) {
    console.log("error", error)
    return res.status(500).send('an error occured while create expense');
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenseIds = await ExpenseDetail.distinct("expenseId", { userId: req.userId });
    const expenses = await Expense.aggregate([
      {
        $match: { _id: { $in: expenseIds } }
      },
      {
        $lookup: {
          from: 'ExpenseDetail',
          localField: '_id',
          foreignField: 'expenseId',
          as: 'expenseDetail',
        },
      },
      {
        $unwind: {
          path: '$expenseDetail',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'User',
          localField: 'expenseDetail.userId',
          foreignField: '_id',
          as: 'userDetail',
        },
      },
      {
        $group: {
          _id: '$_id',
          description: { $first: '$description' },
          amount: { $first: { $toDouble: '$amount' } },
          createdBy: { $first: '$createdBy' },
          splitMethod: { $first: '$splitMethod' },
          date: { $first: '$date' },
          createdAt: { $first: '$createdAt' },
          expenseDetail: {
            $push: {
              _id: '$expenseDetail._id',
              expenseId: '$expenseDetail.expenseId',
              userId: '$expenseDetail.userId',
              paidBy: { $toDouble: '$expenseDetail.paidBy' },
              owedBy: { $toDouble: '$expenseDetail.owedBy' },
              paidByUsers: {
                $cond: [
                  { $gt: [{ $toDouble: '$expenseDetail.paidBy' }, 0] },
                  {
                    userId: '$expenseDetail.userId',
                    amount: { $toDouble: '$expenseDetail.paidBy' },
                    username: { $arrayElemAt: ['$userDetail.username', 0] }
                  },
                  null,
                ],
              },
              owedByUsers: {
                $cond: [
                  { $gt: [{ $toDouble: '$expenseDetail.owedBy' }, 0] },
                  {
                    userId: '$expenseDetail.userId',
                    amount: { $toDouble: '$expenseDetail.owedBy' },
                    username: { $arrayElemAt: ['$userDetail.username', 0] }
                  },
                  null,
                ],
              },
            },
          },
        },
      },
      {
        $sort: { date: -1 },
      },
    ]);

    return res.status(200).json(expenses);
  } catch (error) {
    console.log("error", error)
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const getAllDebts = async (req, res) => {
  try {
    const expenseIds = await ExpenseDetail.distinct("expenseId", { userId: req.userId });
    const allDebts = await ExpenseDetail.aggregate([
      {
        $match: {
          expenseId: { $in: expenseIds }
        },
      },
      {
        $lookup: {
          from: 'Expense',
          localField: 'expenseId',
          foreignField: '_id',
          as: 'expense',
        },
      },
      {
        $unwind: {
          path: '$expense',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'User',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetail',
        },
      },
      {
        $unwind: {
          path: '$userDetail',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$userId",
          userName: { $first: "$userDetail.username" },
          totalPaid: { $sum: { $toDouble: '$paidBy' } },
          totalOwed: { $sum: { $toDouble: '$owedBy' } }
        }
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          userName: "$userName",
          totalPaid: "$totalPaid",
          netOwed: { $toDouble: { $subtract: ["$totalPaid", "$totalOwed"] } }
        }
      },
      {
        $sort: { netOwed: -1 }
      },
    ]);

    const creditors = allDebts.filter(user => user.netOwed > 0);
    const debtors = allDebts.filter(user => user.netOwed < 0);

    const debtsList = [];

    creditors.forEach(creditor => {
      let remainingBalance = creditor.netOwed;

      debtors.forEach(debtor => {
        if (remainingBalance > 0 && Math.abs(debtor.netOwed) > 0) {

          const transferAmount = Math.min(remainingBalance, Math.abs(debtor.netOwed));

          debtsList.push({
            from: {userId: debtor.userId, userName: debtor.userName},
            to: {userId: creditor.userId, userName: creditor.userName},
            balance: transferAmount
          });

          remainingBalance -= transferAmount;
          debtor.netOwed += transferAmount;
        }
      });
    });
    return res.status(200).json(debtsList);
  } catch (error) {
    console.log("error", error)
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const getOwnBalance = async (req, res) => {
  try {

    const ownBalance = await ExpenseDetail.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId)
        },
      },
      {
        $lookup: {
          from: 'Expense',
          localField: 'expenseId',
          foreignField: '_id',
          as: 'expense',
        },
      },
      {
        $unwind: {
          path: '$expense',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$userId",
          totalPaid: { $sum: { $toDouble: '$paidBy' } },
          totalOwed: { $sum: { $toDouble: '$owedBy' } }
        }
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          totalPaid: "$totalPaid",
          netOwed: { $toDouble: { $subtract: ["$totalPaid", "$totalOwed"] } }
        }
      },
      {
        $sort: { netOwed: -1 }
      },
    ]);

    return res.status(200).json(ownBalance);
  } catch (error) {
    console.log("error", error)
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  addExpense,
  getAllExpenses,
  getAllDebts,
  getOwnBalance
}