import UniversityModel from "../models/University.js";

export const CreateUniversity = async(req,res)=>{
    try{
        const univData = await UniversityModel.create({
            name:req.body.name,image:req?.file?.filename,
        });
        if(univData){
            res.status(201).send({message:"University created!!!"});
        }else{
            res.status(404).send({message:"enable to create University!!!"});
        }
    }catch(error)
    {
        console.log("Fail to submit data !! u1");
    }
};

export const UpdateUniversity = async(req,res)=>{
    try{
        const univData = await UniversityModel.findByIdAndUpdate({_id:req.body.id},{
            name:req.body.name,image:req?.file?.filename,
        });
        if(univData){
            res.status(201).send({message:"University Updated!!! "});
        }else{
            res.status(404).send({message:"enable to update University!!!"});
        }
    }catch(error)
    {
        console.log("Fail to submit data !! u2");
    }
};

export const DeleteUniversity = async(req,res)=>{
    try{
        const univData = await UniversityModel.deleteOne({_id:req.body.id});
        if(univData){
            res.status(201).send({message:"University Deleted!!!"});
        }else{
            res.status(404).send({message:"enable to delete University!!!"});
        }
    }catch(error)
    {
        console.log("Fail to submit data !! u3");
    }
};

export const GetUniversity = async(req,res)=>{
    try{
        const univData = await UniversityModel.find();
        res.status(201).send({univData});
    }catch(error)
    {
        console.log("Fail to submit data !! u4");
    }
};