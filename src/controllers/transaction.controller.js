import mongoose, { Mongoose } from "mongoose";
import { Transaction } from "../models/transaction.model.js"
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// function to create transaction 
export const createTransaction = asyncHandler(async(req,res)=>{
     const { title, amount, type, category, note, date } = req.body;

     if(!title || !amount || !type || !category || !date)
        throw new ApiError(400 , "All fields are required");
     
     if(amount<0) throw new ApiError(400 , "amountmust be greater than 0");

     const transaction = await Transaction.create({
        title,
        amount,
        type,
        category,
        note,
        date,
        createdBy: req.user._id,
     });

     return res.
            status(201)
            .json(
                new ApiResponse(201 , transaction , "Transaction Created Successfully")
            );
});

//function to get all the transactions with filters

export const getTransactions = asyncHandler(async (req, res)=>{
     
   let {
         page = 1,
         limit = 10,
         sort = "-createdAt",
         type,
         status,
         category,
         startDate,
         endDate,
      }=req.query;
   
   page = Math.max(1 , Number(page));
   limit = Math.min(50 , Number(limit));

   const skip = (page-1)*limit;
   const filter = {};

   if(type) filter.type=type;
   if(status) filter.status=status;
   if(category) filter.category=category;

   if(startDate || endDate){
      filter.date ={}

      if(startDate) {
         const start = new Date(startDate);
         if(isNaN(start)) throw new ApiError(400 , "Invalid Start Date");
         filter.date.$gte=start;
      } 

      if(endDate){
         const end = new Date(endDate);
         if(isNaN(end)) throw new ApiError(400 , "Invalid End Date");
         end.setHours(23,59,59,999);
         filter.date.$lte=end;
      }
   }

    const total = await Transaction.countDocuments(filter);
      
    const transactions = await Transaction.find(filter)
      .populate("createdBy", "username  email")
      .sort(sort)
      .skip(skip)
      .limit(limit);

   
   return res.status(200).json(
      new ApiResponse(
         200 , {
            total,
            page,
            limit,
            totalPages : Math.ceil(total/limit),
            results : transactions,
         },
         "Transactions Fetched Successfully"
      )
   );
});

// function to delete transaction
export const deleteTransaction = asyncHandler(async (req,res)=>{
   const {id}=req.params;

   if(!id) throw new ApiError(400 , "Invalid Transaction Id");

   const transaction = await Transaction.findByIdAndDelete(id);

   if(!transaction) throw new ApiError(404 , "Transaction not found");

   return res.status(200).json(
      new ApiResponse(200,
         null,
         "Transaction deleted successfully"
      )
   );

});

//function to update transaction 
export const updateTransaction = asyncHandler(async(req,res)=>{
   const {id} = req.params;

   if(!id) throw new ApiError(400 , "Invalid transaction id");

   const {
      title,
      amount, 
      type,
      category,
      note
   }=req.body;

   const updateFields = {};

   if(title) updateFields.title=title;
   if(amount) updateFields.amount=amount;
   if(type) updateFields.type=type;
   if(category) updateFields.category=category;
   if(note) updateFields.note=note;

   if(Object.keys(updateFields).length==0) throw new ApiError(400 , "no fields provided for update");

   const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      {$set : updateFields },
      {
         returnDocument: "after",
         runValidators :true,
      }
   );

   if(!updatedTransaction) throw new ApiError(404 , "Transaction not found");

   return res.status(200).json(
      new ApiResponse(200,
      updatedTransaction,
      "Transaction updated successfully")
   );
});


//function to give the insigts of the transactions
export const getInsights = asyncHandler(async (req, res) => {
  const insights = await Transaction.aggregate([
    {
      $facet: {
        // 1. Totals
        totals: [
          {
            $group: {
              _id: "$type",
              total: { $sum: "$amount" }
            }
          }
        ],

        // 2. Category-wise expense
        categoryExpense: [
          { $match: { type: "expense" } },
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" }
            }
          },
          { $sort: { total: -1 } }
        ],

        // 3. Category-wise income
        categoryIncome: [
          { $match: { type: "income" } },
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" }
            }
          },
          { $sort: { total: -1 } }
        ],

        // 4. Monthly trends
        monthlyTrends: [
          {
            $group: {
              _id: {
                year: { $year: "$date" },
                month: { $month: "$date" },
                type: "$type"
              },
              total: { $sum: "$amount" }
            }
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } }
        ],

        // 5. Weekly trends
        weeklyTrends: [
          {
            $group: {
              _id: {
                year: { $year: "$date" },
                week: { $week: "$date" },
                type: "$type"
              },
              total: { $sum: "$amount" }
            }
          },
          { $sort: { "_id.year": 1, "_id.week": 1 } }
        ],

        // 6. Top 5 spending categories
        topExpenseCategories: [
          { $match: { type: "expense" } },
          {
            $group: {
              _id: "$category",
              total: { $sum: "$amount" }
            }
          },
          { $sort: { total: -1 } },
          { $limit: 5 }
        ],

        // 7. Overall stats
        stats: [
          {
            $group: {
              _id: null,
              totalTransactions: { $sum: 1 },
              avgTransaction: { $avg: "$amount" }
            }
          }
        ]
      }
    }
  ]);

  const data = insights[0];

  // Post-process totals
  let totalIncome = 0;
  let totalExpense = 0;

  data.totals.forEach(item => {
    if (item._id === "income") totalIncome = item.total;
    if (item._id === "expense") totalExpense = item.total;
  });

  const netBalance = totalIncome - totalExpense;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalIncome,
        totalExpense,
        netBalance,
        totalTransactions: data.stats[0]?.totalTransactions || 0,
        avgTransaction: data.stats[0]?.avgTransaction || 0,
        categoryExpense: data.categoryExpense,
        categoryIncome: data.categoryIncome,
        monthlyTrends: data.monthlyTrends,
        weeklyTrends: data.weeklyTrends,
        topExpenseCategories: data.topExpenseCategories
      },
      "insights fetched successfully"
    )
  );
});