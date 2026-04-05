import mongoose, { Mongoose } from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AdminRequest } from "../models/adminRequest.model.js";


//function to signup user
export const signUpUser = asyncHandler(async (req , res, next)=>{
    const {username , email , password , role} = req.body;

    //validations 
    if(!username || !email || !password) throw new ApiError(400 , "All fields are reuired");

    //check existing user
    const existedUser = await User.findOne({$or : [{username} , {email}]});
    if(existedUser) throw new ApiError(409 , "user with the same username or email already exist");

    //create user
    const user = await User.create({
        username,
        email,
        password,
        role : role || "viewer"
    })

    //remove sensitive fields
    const createdUser = await User.findById(user._id).select("-password");
    
    if(!createdUser) throw new ApiError(500, "user registration failed");

    //response
    return res.status(201).json(
        new ApiResponse(201 , createdUser , "user registered successfully")
    );

})