const Expense = require('../Models/expense');
const ExpenseDetail = require('../Models/expenseDetail');
const TempUser = require('../Models/tempUser');

const addExpense = async (req, res) => {
  try {
    const { description, amount, createdBy, splitMethod, date, tempUsers, expenseDetail } = req.body;
    // Create the expense
    const newExpense = new Expense({ description, amount, createdBy, splitMethod, date });
    await newExpense.save();

    // Save temporary users
    var savedTempUsers = [];
    const findTempUser = await TempUser.find({ inviteBy: req.userId });

    if (tempUsers.length > 0) {
      let addTempUsers = tempUsers;
      if (findTempUser.length > 0) {
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
      })
    }));

    return res.status(200).json({ newExpense, tempUsers: savedTempUsers, expenseDetail: savedExpenseDetail });
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
    console.log("error", error)
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const getAllDebts = async (req, res) => {
  try {

    const allDebts = await ExpenseDetail.aggregate([
      {
        $group: {
          // _id: {
          //   $cond: {
          //     if: { $ne: ["$userId", null] },
          //     then: "$userId",
          //     else: "$tempUserId"
          //   }
          // },
          _id:"$tempUserId",
          totalOwed: { $sum: "$owedBy" },  // Total amount owed by this user
          totalPaid: { $sum: "$paidBy" }   // Total amount paid by this user
        }
      },
{
    $lookup: {
      from: "User", // Replace with your actual users collection name
      localField: "_id", // The field in the ExpenseDetail collection
      foreignField: "_id", // The field in the Users collection
      as: "oweToUser" // This will hold the matching user documents
    }
  },
  {
    $unwind: {
      path: "$oweToUser",
      preserveNullAndEmptyArrays: true // Keep records even if no match is found
    }
  },
      {
        $project: {
          oweTo: "$oweToUser._id",
          owedTo: "$_id",
          netOwed: { $subtract: ["$totalOwed", "$totalPaid"] } // Calculate net owed
        }
      },
      // {
      //   $match: {
      //     netOwed: { $gt: 0 } // Only include users who owe money
      //   }
      // },
      // {
      //   $lookup: {
      //     from: "ExpenseDetail", // Joining with the same collection
      //     localField: "userId",
      //     foreignField: "tempUserId", // Adjust as needed based on your schema
      //     as: "debts" // This will contain records of who this user owes money to
      //   }
      // },
      // {
      //   $unwind: "$debts" // Flatten the array to get individual records
      // },
      // {
      //   $project: {
      //     payer: "$userId",
      //     payee: "$debts.userId", // Adjust according to the relation in your schema
      //     amount: "$debts.owedBy" // Amount owed
      //   }
      // },
      // {
      //   $group: {
      //     _id: {
      //       payer: "$payer",
      //       payee: "$payee"
      //     },
      //     totalAmount: { $sum: "$amount" } // Total amount owed between payer and payee
      //   }
      // }
    ]);
    
    return res.status(200).json(allDebts);
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
          $or: [
            { userId: req.userId },
            { userId: null }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $ne: ["$userId", null] },
              then: "$userId",
              else: "$tempUserId"
            }
          },
          totalPaid: { $sum: "$paidBy" },
          totalOwed: { $sum: "$owedBy" }
        }
      },
      {
        $project: {
          userId: "$userId",
          netOwed: { $toDouble: { $subtract: ["$totalOwed", "$totalPaid"] } }
        }
      },
      {
        $sort: { netOwed: -1 }
      }
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