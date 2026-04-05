import mongoose, { Mongoose } from "mongoose";
import { Transaction } from "../models/transaction.model.js"
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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
