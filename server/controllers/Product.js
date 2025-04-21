import ProductModel from "../models/Product.js";

export const CreateProduct = async(req,res)=>{
    try {
        let images= req?.files?.map((item)=>{return item.filename;});
        const prdData = await ProductModel.create({
            name:req.body.name,
            description:req.body.description,
            price:req.body.price,
            qyt:req.body.qyt,
            images: images,
            department:req.body.departmentId,
        });
        if(prdData)
            res.status(201).send({message:"Product Created !!!"});
        else
            res.status(404).send({message:"enable to Create Product !!!"});
    } catch (error) {
        console.log("Fail to submit data !!!");
    }
} 

export const UpdateProduct = async(req,res)=>{
    try {
        let images = req?.files?.map((item)=>{
            return item.filename;
        });
        const prdData = await ProductModel.findByIdAndUpdate({_id:req.body.id},
            {
                name:req.body.name,
                description:req.body.description,
                price:req.body.price,
                qyt:req.body.qyt,
                images: images,
                department:req.body.departmentId,
            }    
        );
        if(prdData)
            res.status(201).send({message:"Product Updated !!!"});
        else
            res.status(404).send({message:"enable to update Product !!!"});
    } catch (error) {
        console.log("Fail to submit data !!! p");
    }
}

export const DeleteProduct = async(req,res)=>{
    try {
        const prdData = await ProductModel.deleteOne({_id:req.body.id});
        if(prdData)
            res.status(201).send({message:"Product Updated !!!"});
        else
            res.status(404).send({message:"enable to update Product !!!"});
    } catch (error) {
        console.log("Fail to submit data !!! ");
    }
}

export const GetProductsByDepartmentId = async(req,res)=>{
    try {
        const prdData = await ProductModel.find({department:req.query.departmentId}).populate({path:"department",populate:[{path:"university"}]});
        res.status(201).send({prdData});
    } catch (error) {
        console.log("Fail to submit data !!!");
    }
}

export const GetProductDetails = async(req,res)=>{
    try {
        const prdData = await ProductModel.findOne({_id:req.query.id}).populate({path:"department",populate:[{path:"university"}]});
        res.status(201).send({prdData});
    } catch (error) {
        console.log("Fail to submit data !!!p");
    }
}

export const UpdateProductQyt = async(req,res)=>{
    try {
        let productInDb = await ProductModel.findOne({_id:req.query.id});
        let active = true;

        if(productInDb.qyt-req?.query.qyt >= 0){
            if(productInDb.qyt-req?.query.qyt<=0) active = false;
            const prdData = await ProductModel.findByIdAndUpdate({_id:req.query.id},{
                qyt:productInDb.qyt-req?.query.qyt,
                active : active,
            });
            if(prdData)
                res.status(201).send({status:"success",message:"Product Qyt Updated !!!"});
            else
                res.status(201).send({message:"enable to update Product Qyt !!!"});
        }else{
            res.status(201).send({status:"success",message:"Product Qyt is 0 !!!"});
        }
        
    } catch (error) {
        console.log("Fail to submit data !!!");
    }
}