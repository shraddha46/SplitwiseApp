const Expense = require('../Models/expense');
const ExpenseDetail = require('../Models/expenseDetail');
const TempUser = require('../Models/tempUser');

const addExpense = async (req, res) => {
  try {
    const {description, amount, createdBy, splitMethod, date, tempUsers, expenseDetail} = req.body;
    // Create the expense
    const newExpense = new Expense({description, amount, createdBy, splitMethod, date});
    await newExpense.save();

    // Save temporary users
    var savedTempUsers = [];
    const findTempUser = await TempUser.find({inviteBy: req.userId});

    if(tempUsers.length > 0) {
      let addTempUsers = tempUsers;
      if(findTempUser.length > 0) {
        addTempUsers = addTempUsers.filter(val => !findTempUser.some(v => v.email === val.email));
      }
      savedTempUsers = await TempUser.insertMany(addTempUsers);
    }

    // Save expense details
    const savedExpenseDetail = await ExpenseDetail.insertMany(expenseDetail.map(detail => {
      return ({
      expenseId: newExpense._id,
      userId: detail.userId || null,
      tempUserId: detail.userId ? null : findTempUser.length > 0 ? findTempUser.filter(u => u.email === detail.email)[0]._id : savedTempUsers.length > 0 ? savedTempUsers.filter(user => user.email === detail.email)[0]._id : null,
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
              splitMethod: { $first: '$splitMethod' },
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

const getAllDebts = async (req, res) => {
  try {

const allDebts = await Expense.aggregate([
    {
        $lookup: {
            from: "ExpenseDetail", // Name of the ExpenseDetail collection
            localField: "_id",      // Field from the Expense collection
            foreignField: "expenseId", // Field from the ExpenseDetail collection
            as: "details"           // Output array field
        }
    },
    {
        $unwind: {
            path: "$details",      // Unwind the details array
            preserveNullAndEmptyArrays: true // Keep records without details
        }
    },
    // {
    //     $match: {
    //         $in : {"createdBy": "66ed20c2546913c5dc37357f"} // Match specific expenseId
    //     }
    // },
    {
        $group: {
            _id: "$_id",
            description: { $first: "$description" },
            totalAmount: { $sum: "$amount" },
            totalPaid: { $sum: "$details.paidBy" },
            totalOwed: { $sum: "$details.owedBy" },
            createdBy: { $first: "$createdBy" },
            splitMethod: { $first: "$splitMethod" }
        }
    },
    {
        $project: {
            userId: "$_id",
            description: 1,
            totalAmount: 1,
            totalPaid: 1,
            totalOwed: 1,
            createdBy: 1,
            splitMethod: 1,
            netOwed: { $subtract: ["$totalOwed", "$totalPaid"] } // Calculate net owed
        }
    },
    {
        $sort: { netOwed: -1 } // Sort by net owed
    }
]);

console.log("Matched Records:", allDebts);

    // const allDebts = await ExpenseDetail.aggregate([
    //   {
    //     $group: {
    //       _id: {
    //         $cond: {
    //           if: { $ne: ["$userId", null] },
    //           then: "$userId",
    //           else: "$tempUserId"
    //         }
    //       },
    //       totalPaid: { $sum: "$paidBy" },
    //       totalOwed: { $sum: "$owedBy" }
    //     }
    //   },
    //   {
    //     $project: {
    //       userId: "$_id",
    //       netOwed: {$subtract: ["$totalOwed", "$totalPaid"]}
    //     }
    //   },
    //   {
    //     $sort: { netOwed: -1 }
    //   }
    // ]);

    return res.status(200).json(allDebts);
  } catch (error) {
    console.log("error",error)
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  addExpense,
  getAllExpenses,
  getAllDebts
}