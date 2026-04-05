import mongoose, { Mongoose } from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AdminRequest } from "../models/adminRequest.model.js";


//function to signup user
export const signUpUser = asyncHandler(async (req , res)=>{
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
        role : "viwer"
    })

    //remove sensitive fields
    const createdUser = await User.findById(user._id).select("-password");
    
    if(!createdUser) throw new ApiError(500, "user registration failed");

   if (role && ["analyst", "admin"].includes(role)) {
    await AdminRequest.create({
        user: createdUser._id,
        requestRole: role
    });
}

    //response
    return res.status(201).json(
        new ApiResponse(201 , createdUser , "user registered successfully")
    );

})

//function for user SignIn 
export const signInUser = asyncHandler(async (req,res)=>{
    const {username , email , password}= req.body;

    if((!username && !email) || !password) throw new ApiError(400 , "All fields are required");

    const user = await User.findOne({$or : [{username} , {email}]});
    if(!user) throw new ApiError(404 , "user doesn't exist");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) throw new ApiError(401 , "Incorrect Credentials!!");

    const signedInUser = user.toObject();
    delete signedInUser.password;

    const accessToken = user.generateAccessToken();

    const options = {
        httpOnly: true,
        secure: false
    }

    return res.status(200)
    .cookie("accessToken" , accessToken , options)
    .json(
        new ApiResponse(200,
            {
                user:signedInUser,
            },
            "user signned in sucessfully"
        )
    );
});

//function to signout user
export const signOutUser = asyncHandler(async(req,res)=>{
     const options = {
        httpOnly: true,
        secure: false
    }

    return res.status(200)
        .clearCookie("accessToken" , options)
        .json(
            new ApiResponse(200 , {} , "user signed out successfully!!")
        );

});

//function get info of current loggedin user
export const getMe = asyncHandler(async (req,res)=>{
    return res.status(200)
           .json(
            new ApiResponse(200, req.user ,  "user details fetched successfully")
           );
});