import mongoose from "mongoose";

const OrderDetailSchema = new mongoose.Schema({
    orderHeader:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"orderHeader",
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
},{timestamps:true});
const OrderDetailModel = mongoose.model("orderDetail",OrderDetailSchema);
export default OrderDetailModel;