import mongoose , {Schema}  from "mongoose";

const adminRequestSchema = new Schema({
    user  :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required :true,
    },

    requestRole : {
        type:String,
        enum : ["admin" , "analyst"],
        required : true,
    },

    status : {
        type: String,
        enum : ["pending" , "approved" , "rejected"],
        default :"pending",
    },

    requestedAt : {
        type: Date,
        default : Date.now,
    },

    reviewedBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    reviewedAt : {
        type : Date,
        default : Date.now,
    }
});

adminRequestSchema.index({ user: 1 });
adminRequestSchema.index({ status: 1 });

export const AdminRequest = mongoose.model("AdminRequest" , adminRequestSchema);
