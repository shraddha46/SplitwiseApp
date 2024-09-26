const Expense = require('../Models/expense');

const addExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    return res.status(200).json(expense);
  } catch (error) {
    return res.status(500).send('an error occured while create expense');
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      {
        $lookup: {
          from: 'User',
          localField: 'paidBy',
          foreignField: '_id',
          as: 'userDetail',
        },
      },
      {
        $unwind: '$userDetail'
      },
      // {
      //     $unwind: {
      //       path: '$paidBy',
      //       preserveNullAndEmptyArrays: true,
      //     },
      //   },
      {
        $project: {
          '_id': 1,
          'description': 1,
          'amount': 1,
          'date': 1,
          'paidBy': 1,
          'createdAt': 1,
          'paidByUser': '$userDetail.username',
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  addExpense,
  getAllExpenses
}