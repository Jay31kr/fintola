import mongoose from "mongoose";
import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";
import { AdminRequest } from "../models/adminRequest.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getUsers = asyncHandler(async(req,res)=>{
    let {
        page=1,
        limit=10,
        role,
        status,
    }=req.query;

     page = Math.max(1 , Number(page) || 1);
     limit=Math.min(50,Number(limit) || 10);

     const skip = (page-1)*limit;

     const filter = {};

     if(role) filter.role=role;
     if(status) filter.status=status;

     const total = await User.countDocuments(filter);

     const users = await User.find(filter)
        .skip(skip)
        .limit(limit)
        .select("-password");

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                total,
                page,
                limit,
                totalPages : Math.ceil(total/limit),
                users 
            },
            "users fetched successfully"
        )
    );
});

