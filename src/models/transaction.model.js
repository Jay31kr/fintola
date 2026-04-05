import mongoose ,  {Schema} from "mongoose";

const transactionSchema =  new Schema({
    title : {
        type: String,
        required: true,
    },

    amount : {
        type : Number,
        required : true,
    },

    type: {
        type: String,
        enum: ["expense" , "income"],
        required : true,
    },

    category: {
        type: String,
        enum: ["marketing" , "HRExpense" , "Utilities" , "payroll" , "others"],
        required:true,
    },

    status : {
        type : String,
        enum:["pending" , "approved" , "reject"],
        default : "pending",
    },

    note : {
        type : String,
        trim : true,
    },

    date: {
    type: Date,
    required: true
    },

    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
},{
    timeStamps :true,
});

export const Trnasaction = mongoose.model("Transaction" , transactionSchema);