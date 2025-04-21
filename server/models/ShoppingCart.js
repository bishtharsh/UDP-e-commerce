import mongoose from "mongoose";

const ShoppingCartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
        required:true, 
    },
    quantity:{
        type:Number,required:true,
    },
    price:{
        type:String,required:true,
    },
    active:{
        type:Boolean,
        default:true,
        required:true,
    }

},{timestamps:true});
const ShoppingCartModel = mongoose.model("shoppingCart",ShoppingCartSchema);
export default ShoppingCartModel;