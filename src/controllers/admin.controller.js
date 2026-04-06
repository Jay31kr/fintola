import mongoose from "mongoose";
import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";
import { AdminRequest } from "../models/adminRequest.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


//function tofetch all users with filter
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


//function to fetch all the pending requests
export const getPendingAdminRequests = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;

  
  page = Math.max(1, Number(page) || 1);
  limit = Math.min(50, Number(limit) || 10);

  const skip = (page - 1) * limit;

  const filter = {
    status: "pending"
  };

  const total = await AdminRequest.countDocuments(filter);

  const requests = await AdminRequest.find(filter)
    .populate("user", "username email role status")
    .sort("-requestedAt")
    .skip(skip)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        requests
      },
      "Pending admin requests fetched successfully"
    )
  );
});

//function to handle admin requests
export const handleAdminRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; 
 
  if (!id ) throw new ApiError(400, "Invalid request ID");
  
  const request = await AdminRequest.findById(id);
  if (!request) throw new ApiError(404, "Request not found");
  
  if (request.status !== "pending") throw new ApiError(400, "Request already processed");
  
  if (action === "approve") {
    
    await User.findByIdAndUpdate(request.user, {
      role: "admin",
      status: "active",
      approvedBy : req.user._id,
    });
    request.status = "approved";  
  }

  if (action === "reject") {
    request.status = "rejected";
  }

  // 6. review metadata
  request.reviewedBy = req.user._id;
  request.reviewedAt = new Date();

  await request.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      request,
      `Request ${action} successfully`
    )
  );
});