import mongoose from "mongoose";

const OrderHeaderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    orderDate:{
        type:Date,required:true,
    },
    shippingDate:{
        type:Date,required:true,
    },
    orderTotal:{
        type:String,required:true,
    },
    orderStatus:{
        type:String,required:true,default:"Pending",
    },
    paymentStatus:{
        type:String,required:true,default:"Pending",
    },
    paymentDate:{
        type:Date,required:true,
    },
    transactionId:{
        type:String,required:true,
    },
    name:{
        type:String,required:true,
    },
    address:{
        type:String,required:true,
    },
    phone:{
        type:String,required:true,
    },
    city:{
        type:String,required:true,
    },
    state:{
        type:String,required:true,
    },
    postalCode:{
        type:String,required:true,
    },
    active:{
        type:Boolean,default:true,required:true
    },
},{timestamps:true});
const OrderHeaderModel = mongoose.model("orderHeader",OrderHeaderSchema);
export default OrderHeaderModel;