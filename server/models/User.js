import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firstname:{
        type:String,required:true,
    },
    lastname:{
        type:String,required:true,
    },
    profilepic:{
        type:String,
    },
    email:{
        type:String,required:true,
    },
    phone:{
        type:String,required:true,
    },
    password:{
        type:String,required:true,
    },
    role:{
        type:String,default:"user",required:true
    },
    active:{
        type:Boolean,default:true,required:true
    }
},
{
    timestamps:true
});
const UserModel = mongoose.model("user",UserSchema);
export default UserModel;