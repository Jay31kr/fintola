import { ApiError } from "../utils/apiError.js";

export const authorizeRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.user) throw new ApiError(401,"User not authenticated");

        if(!allowedRoles.includes(req.user.role)) throw new ApiError(403 ,  `Access denied. Required role: ${allowedRoles.join(", ")}`)

        next();
    }
}