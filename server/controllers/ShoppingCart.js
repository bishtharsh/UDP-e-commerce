import ShoppingCartModel from "../models/ShoppingCart.js";
import OrderHeaderModel from "../models/OrderHeader.js";
import OrderDetailsModel from "../models/OrderDetail.js";

import Stripe from 'stripe';


export const CreateItem = async(req,res)=>{
    try{
        let userInDb = await ShoppingCartModel.findOne({user:req.body.user,product:req.body.product}).populate("product");
        
        if(userInDb && userInDb.product.qyt >= req.body.quantity){
            let quantity = (Number(userInDb.quantity) + Number(req.body.quantity));
            const prdData = await ShoppingCartModel.findByIdAndUpdate({_id:userInDb.id},
                {quantity:quantity});
            if(prdData)
                res.status(201).send({status:'success',message:req.body.quantity+" more quantity is updated !!!"});
            else
                res.status(201).send({status:'error',message:"Enable to Add Product Quantity !!!"});
            return;
        }

        let cartData = await ShoppingCartModel.create({...req.body});
        if(cartData){
            res.status(201).send({status:'success',message:"Product is Successfully Added !!!"});
        }else{
            res.status(201).send({status:'error',message:"enable to Add Product !!!"});
        } 
    } catch (error) {
        res.status(404).send({error:error?.message});
    }
}

export const GetItemsByUserId = async(req,res)=>{
    try{
        const cartData = await ShoppingCartModel.find({user:req.query.id}).populate("product");
        res.status(201).send({cartData});
    } catch (error) {
        res.status(404).send({error:error?.message});
    }
}

export const GetItemsByUserIdActive = async(req,res)=>{
    try{
        const cartData = await ShoppingCartModel.find({user:req.query.id,active:req.query.active}).populate("product");
        res.status(201).send({cartData});
    } catch (error) {
        res.status(404).send({error:error?.message});
    }
}

export const DeleteItem = async(req,res)=>{
    try {
        const cartData = await ShoppingCartModel.deleteOne({_id:req.query.id});
        if(cartData){
            res.status(201).send({status:'success',message:"Item delete !!!"});
        }else{
            res.status(404).send({status:'error',message:"enable to delete Item !!!"});
        }  
    } catch (error) {
        res.status(404).send({error:error?.message});     
    }
}

export const UpdateCartItemQuantityByOne = async(req,res)=>{
    try {
        let cartItem = await ShoppingCartModel.findOne({_id:req.query.id}).populate("product");
        if(cartItem && "increment" === req.query.action){
            if(cartItem.product.qyt > 0){
                cartItem.quantity += 1;
                await cartItem.save();
                res.status(201).send({status:'success',message:"+1 quantity is updated !!!"});
            }else{
                res.status(201).send({status:'error',message:"Quanity is not Available!!!"});   
            }
        }else if(cartItem && "decrement" === req.query.action){
            if(cartItem.quantity > 1){
                cartItem.quantity -= 1;
                await cartItem.save();
                res.status(201).send({status:'success',message:"-1 quantity is updated !!!"});
            }else
            {
                res.status(201).send({status:'error',message:"enable to update Product quantity !!!"});   
            }
        }else{
            res.status(404).send({status:'error',message:"enable to update Product quantity !!!"});
        }
    } catch (error) {
        res.status(404).send({error:error?.message});     
    }
}
export const ActiveItem = async(req,res)=>{
    try {
        let cartItem = await ShoppingCartModel.findOne({ _id: req.query.id });
        if (cartItem && false === cartItem.active) {
            cartItem.active = true;
            await cartItem.save();
            res.status(201).send({message:true});
        } else {
            cartItem.active = false;
            await cartItem.save();
            res.status(201).send({message:false});
        }
    } catch (error) {
        res.status(404).send({ error: error?.message });
    }
}


//checkout
export const CheckOut = async (req, res) => {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);  // Initialize stripe with secret key
        let transactionId = null;
        let paymentStatus = "Pending";

        const currentDateTime = new Date();
        
        // Add 3 days to the current date
        const shippingDate = new Date(currentDateTime);
        shippingDate.setDate(currentDateTime.getDate() + 3);

        const stripeToken = req.body.stripetoken;
        console.log("Start processing payment");

        if (stripeToken) {
            console.log("Processing payment...");
            
            const payment = await stripe.charges.create({
                amount: req.body.orderTotal * 100,  // Convert to cents
                currency: "usd",
                description: `Order for user: ${req.body.user}`,
                source: stripeToken,
            });

            console.log("Payment processed");

            if (payment.status === "succeeded") {
                transactionId = payment.balance_transaction;
                paymentStatus = "Approved";
                console.log("Payment approved");

                const orderData = await OrderHeaderModel.create({
                    user: req.body.user,
                    orderTotal: req.body.orderTotal,
                    orderDate: currentDateTime.toLocaleString(),
                    shippingDate: shippingDate.toLocaleDateString(), // Correct way to format shipping date
                    paymentDate: currentDateTime.toLocaleString(),
                    paymentStatus: paymentStatus,
                    transactionId: transactionId,
                    orderStatus: "Shipped", // Assuming you're marking the order as 'shipped'
                    name: req.body.name,
                    address: req.body.address,
                    phone: req.body.phone,
                    city: req.body.city,
                    state: req.body.state,
                    postalCode: req.body.postal,
                });

                if (orderData) {
                    res.status(201).send({ status: 'success', orderId: orderData._id, transactionId, shipping:orderData.shippingDate});
                } else {
                    res.status(404).send({ status: 'error', message: 'Failed to create order in database.' });
                }
            } else {
                paymentStatus = "Rejected";
                res.status(400).send({ status: 'error', message: 'Payment failed. Payment status: ' + paymentStatus });
            }
        } else {
            res.status(400).send({ status: 'error', message: 'Stripe token is missing.' });
        }
    } catch (error) {
        console.error("Error processing payment:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const GetOrderHeaderByUserId = async(req,res)=>{
    try{
        const headData = await OrderHeaderModel.find({user:req.query.id});
        res.status(201).send({headData});
    } catch (error) {
        res.status(404).send({error:error?.message});
    }
}

export const GetAllOrderHeader = async(req,res)=>{
    try{
        const headData = await OrderHeaderModel.find();
        res.status(201).send({headData});
    } catch (error) {
        res.status(404).send({error:error?.message});
    }
}

export const OrderInOut = async(req,res)=>{
    try {
       const orderHId = await OrderHeaderModel.findOne({_id:req.query.id});
       if (orderHId && false === orderHId.active) {
        orderHId.active = true;
            await orderHId.save();
            res.status(201).send({message:true});
        } else {
            orderHId.active = false;
            await orderHId.save();
            res.status(201).send({message:false});
        }
    } catch (error) {
        res.status(404).send({error:error?.message});
    }
}

//OrderDetails
export const CreateDetails = async(req,res)=>{
    try{
        let cartData = await OrderDetailsModel.create({
            orderHeader: req.body.orderId,
            product: req.body.product,
            quantity: req.body.quantity,
            price: req.body.price,
        });
        if(cartData){
            res.status(201).send({status:'success',message:"Product is Successfully Added !!!"});
        }else{
            res.status(400).send({status:'error',message:"enable to Add Product !!!"});
        } 
    } catch (error) {
        res.status(404).send({error:error?.message});
    }
}

export const GetOrderDetailsByOrderId = async(req,res)=>{
    try{
        const orderData = await OrderDetailsModel.find({orderHeader:req.query.id}).populate("product");
        res.status(201).send({orderData});
    } catch (error) {
        res.status(404).send({error:error?.message});
    }
}
