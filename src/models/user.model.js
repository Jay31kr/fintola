import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },
    password : {
        type : String,
        required : true,
        minlength : 8,
    },
    role:{
        type : String,
        role : ["viewer", "analyst", "admin"],
        default : "viewer",
    },

    status : {
        type : String,
        enum : ["active" , "inactive"],
        default : "active",
    },

    approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
},{
    timestamps : true
});

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return;

    this.password = await  bcrypt.hash(this.password , 10);
    return;
});

userSchema.methods.isPasswordCorrect = async function(password){
     return await bcrypt.compare(password, this.password);
};


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email:this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};


userSchema.index({ role: 1, status: 1 });

export const User = mongoose.model("User" , userSchema);
