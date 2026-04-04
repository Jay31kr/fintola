import mongoose , {Schema} from "mongoose";

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
    },
    password : {
        type : String,
        required : true,
        minlength : 8,
    },
    role:{
        type : String,
        role : ["viewer", "analyst", "admin"],
        default : viwer,
    },

    approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
},{
    timestamps : true
});

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next();

    this.password =  bcrypt.hash(this.password , 10);
    next();
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

export const User = mongoose.model("User" , userSchema);
