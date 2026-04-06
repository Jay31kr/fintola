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