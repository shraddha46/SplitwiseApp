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

    if (friend.length > 0) {
      const findInviteUser = friend.filter(v => !('userId' in v));
  
      if (findInviteUser.length > 0) {
          try {
              const savedInviteUser = await User.insertMany(findInviteUser);
              
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
        userId: detail.userId ? detail.userId : savedFriend.length > 0 ? savedFriend.find(u => u.email === detail.email)?._id : null,
        paidBy: detail.paidBy || 0.00,
        owedBy: detail.owedBy || 0.00
      })
    }));

    return res.status(200).json({ newExpense, friend: savedFriend, expenseDetail: savedExpenseDetail });
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
                  {$gt:[{$toDouble: '$expenseDetail.paidBy'},0]},
                  {
                    userId: '$expenseDetail.userId',
                    amount: {$toDouble: '$expenseDetail.paidBy'},
                    username: { $arrayElemAt: ['$userDetail.username', 0]}
                  },
                  null,
                ],
              },
              owedByUsers: {
                $cond: [
                  {$gt:[{$toDouble: '$expenseDetail.owedBy'},0]},
                  {
                    userId: '$expenseDetail.userId',
                    amount: {$toDouble: '$expenseDetail.owedBy'},
                    username: { $arrayElemAt: ['$userDetail.username', 0]}
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
    const allDebts = await ExpenseDetail.aggregate([
      {
        $group: {
          _id: {
            userId: '$userId', // Group by userId
            expenseId: '$expenseId' // and expenseId
          },
         // expenseId: '$expenseId',
          //_id: '$userId', // Group by expenseId to gather all details for each transaction
          totalPaid: {
            $sum: { $toDouble: '$paidBy' }
          },
          totalOwed: {
            $sum: { $toDouble: '$owedBy' }
          },
          // payers: { $addToSet: '$userId' }, // Collect all payers for the transaction
          // payee: { $first: '$userId' },
        },
        //   {
    //     $group: {
    //       _id: "$userId",
    //       //totalPaid: { $sum: { $toDouble: '$paidBy' } },
    //       //totalOwed: { $sum: { $toDouble: '$owedBy' } }
    //     }
    //   },
      },
      // {
      //   $unwind: {
      //     path: '$payers',
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      // {
      //   $lookup: {
      //     from: 'User', // Assuming you have a User collection to get usernames
      //     localField: 'payers',
      //     foreignField: '_id',
      //     as: 'payerDetails',
      //   },
      // },
      // {
      //   $unwind: {
      //     path: '$payerDetails',
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
      {
        $project: {
          _id:0,
          userId: "$_id.userId",
          expanseId: "$_id.expenseId",
         // from: { $arrayElemAt: ['$payers', 0] }, // Adjust to select the first payer
          //to: '$payee', // Adjust according to your schema
               totalPaid: '$totalPaid',
          totalOwed: '$totalOwed',
          amount: { $toString: { $subtract: ['$totalOwed', '$totalPaid'] } }, // Amount owed
        },
      },
      // {
      //   $project: {
      //     expenseId: '$expenseId',
      //     _id: 0,
      //    // payer: '$payerDetails._id', // Assuming this is the payer ID
      //     payee: '$userId', // You may need to adjust this depending on your schema
      //     totalPaid: '$totalPaid',
      //     totalOwed: '$totalOwed',
      //     //netOwed: { $subtract: ['$totalOwed', '$totalPaid'] }, // Calculate net owed
      //   },
      // },
      // {
      //   $match: {
      //     netOwed: { $ne: 0 }, // Exclude transactions where netOwed is zero
      //   },
      // },
      // {
      //   $sort: { netOwed: -1 }, // Sort by netOwed in descending order
      // },
    ]);
    
//    console.log(allDebts);
    
    // const allDebts = await ExpenseDetail.aggregate([
    //   // {
    //   //   $match: {
    //   //      userId: new mongoose.Types.ObjectId(req.userId)
    //   //   },
    //   // },
    //   {
    //     $lookup: {
    //       from: 'Expense',
    //       localField: 'expenseId',
    //       foreignField: '_id',
    //       as: 'expense',
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: '$expense',
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$userId",
    //       //totalPaid: { $sum: { $toDouble: '$paidBy' } },
    //       //totalOwed: { $sum: { $toDouble: '$owedBy' } }
    //     }
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       userId: "$_id",
    //       totalPaid: "$totalPaid",
    //       totalOwed: "$totalOwed",
    //       netOwed: { $toDouble: { $subtract: ["$totalPaid", "$totalOwed"] } }
    //     }
    //   },
    //   {
    //     $sort: { netOwed: -1 }
    //    },
    // ]);
  //    const allDebts = await ExpenseDetail.aggregate([
  //     {
  //       $lookup: {
  //         from: 'Expense',
  //         localField: '_id',
  //         foreignField: 'expenseId',
  //         as: 'expenseDetail',
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: '$expenseDetail',
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  // ]);
//     const allDebts = await ExpenseDetail.aggregate([
//       {
//         $group: {
//           // _id: {
//           //   $cond: {
//           //     if: { $ne: ["$userId", null] },
//           //     then: "$userId",
//           //     else: "$tempUserId"
//           //   }
//           // },
//           _id:"$tempUserId",
//           totalOwed: { $sum: "$owedBy" },  // Total amount owed by this user
//           totalPaid: { $sum: "$paidBy" }   // Total amount paid by this user
//         }
//       },
// {
//     $lookup: {
//       from: "User", // Replace with your actual users collection name
//       localField: "_id", // The field in the ExpenseDetail collection
//       foreignField: "_id", // The field in the Users collection
//       as: "oweToUser" // This will hold the matching user documents
//     }
//   },
//   {
//     $unwind: {
//       path: "$oweToUser",
//       preserveNullAndEmptyArrays: true // Keep records even if no match is found
//     }
//   },
//       {
//         $project: {
//           oweTo: "$oweToUser._id",
//           owedTo: "$_id",
//           netOwed: { $subtract: ["$totalOwed", "$totalPaid"] } // Calculate net owed
//         }
//       },
//       // {
//       //   $match: {
//       //     netOwed: { $gt: 0 } // Only include users who owe money
//       //   }
//       // },
//       // {
//       //   $lookup: {
//       //     from: "ExpenseDetail", // Joining with the same collection
//       //     localField: "userId",
//       //     foreignField: "tempUserId", // Adjust as needed based on your schema
//       //     as: "debts" // This will contain records of who this user owes money to
//       //   }
//       // },
//       // {
//       //   $unwind: "$debts" // Flatten the array to get individual records
//       // },
//       // {
//       //   $project: {
//       //     payer: "$userId",
//       //     payee: "$debts.userId", // Adjust according to the relation in your schema
//       //     amount: "$debts.owedBy" // Amount owed
//       //   }
//       // },
//       // {
//       //   $group: {
//       //     _id: {
//       //       payer: "$payer",
//       //       payee: "$payee"
//       //     },
//       //     totalAmount: { $sum: "$amount" } // Total amount owed between payer and payee
//       //   }
//       // }
//     ]);
    
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