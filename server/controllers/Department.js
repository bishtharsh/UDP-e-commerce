import DepartmentModel from "../models/Department.js";

export const CreateDepartment = async(req,res)=>{
    try{
        const depData = await DepartmentModel.create({
            name:req.body.name,
            image:req?.file?.filename,
            university: req.body.universityId,
        });
        if(depData){
            res.status(201).send({message:"Department created !!!"});
        }else{
            res.status(404).send({message:"enable to create Department !!!"});
        }
    }catch(error){
        console.log("Fail to submit data !!!d");
    }
}

export const UpdateDepartment = async(req,res)=>{
    try{
        const depData = await DepartmentModel.findByIdAndUpdate({_id:req.body.id},{
            name:req.body.name,
            image:req?.file?.filename,
            university: req.body.universityId,
        });
        if(depData){
            res.status(201).send({message:"Department updated !!!"});
        }else{
            res.status(404).send({message:"enable to update Department !!!"});
        }
    }catch(error){
        console.log("Fail to submit data !!!d");
    }
}

export const DeleteDepartment = async(req,res)=>{
    try {
        const depData = await DepartmentModel.deleteOne({_id:req.body.id});
        if(depData){
            res.status(201).send({message:"Department delete !!!"});
        }else{
            res.status(404).send({message:"enable to delete Department !!!"});
        }
    } catch (error) {
        console.log("Fail to submit data !!!d");
    }
}

export const GetDepartment = async(req,res)=>{
    try {
        const depData = await DepartmentModel.find({university:req.query.universityId}).populate("university");
        res.status(201).send({depData});
    } catch (error) {
        console.log("Fail to submit data !!!d");
    }
}