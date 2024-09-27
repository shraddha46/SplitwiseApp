const Expense = require('../Models/expense');
const ExpenseDetail = require('../Models/expenseDetail');
const TempUser = require('../Models/tempUser');

const addExpense = async (req, res) => {
  try {
    const {description, amount, createdBy, date, tempUsers, expenseDetail} = req.body;
    // Create the expense
    const newExpense = new Expense({description, amount, createdBy, date});
    await newExpense.save();

    // Save temporary users
    var savedTempUsers = [];
    if(tempUsers.length > 0)
      savedTempUsers = await TempUser.insertMany(tempUsers);

    // Save expense details
    const savedExpenseDetail = await ExpenseDetail.insertMany(expenseDetail.map(detail => {
      console.log("id",detail.userId ? null : savedTempUsers.length > 0 ? savedTempUsers.filter(user => user.username === detail.username)[0]._id : null)
      return ({
      expenseId: newExpense._id,
      userId: detail.userId || null,
      tempUserId: detail.userId ? null : savedTempUsers.length > 0 ? savedTempUsers.filter(user => user.username === detail.username)[0]._id : null,
      paidBy: detail.paidBy || 0.00,
      owedBy: detail.owedBy || 0.00
    })}));

    return res.status(200).json({newExpense, tempUsers: savedTempUsers, expenseDetail: savedExpenseDetail});
  } catch (error) {
    return res.status(500).send('an error occured while create expense');
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
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
              as: 'paidByUser',
          },
      },
      {
          $lookup: {
              from: 'TempUser',
              localField: 'expenseDetail.tempUserId',
              foreignField: '_id',
              as: 'owedByUser',
          },
      },
      {
          $group: {
              _id: '$_id',
              description: { $first: '$description' },
              amount: { $first: { $toDouble: '$amount' } },
              createdBy: { $first: '$createdBy' },
              date: { $first: '$date' },
              createdAt: { $first: '$createdAt' },
              expenseDetail: {
                  $push: {
                      _id: '$expenseDetail._id',
                      expenseId: '$expenseDetail.expenseId',
                      userId: '$expenseDetail.userId',
                      tempUserId: '$expenseDetail.tempUserId',
                      paidBy: { $toDouble: '$expenseDetail.paidBy' },
                      owedBy: { $toDouble: '$expenseDetail.owedBy' },
                      userName: { $arrayElemAt: ['$paidByUser.username', 0] },
                      tempUserName: { $arrayElemAt: ['$owedByUser.username', 0] }
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
    console.log("error",error)
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  addExpense,
  getAllExpenses
}