import UserModel from "../models/User.js";
export const Register = async(req,res)=>{
    try {
        let userInDb = await UserModel.findOne({email:req.body.email});
        
        if(userInDb){
            res.status(201).send({status:'error',message:"User already created with this email"});
            return;
        }else{
            let userData = await UserModel.create({...req.body,profilePic:req?.file?.filename,});
            if(userData){
                res.status(201).send({status:'success',message:"User created !!!",id:userData.id});
            }else{
                res.status(201).send({status:'error',message:"Enable to create User !!!"});
            } 
        }
    } catch (error) {
        res.status(404).send({error:error?.message});
    }
}

export const Login = async(req,res)=>{
    try {
        let userInDb = await UserModel.findOne({email:req.body.email,password:req.body.password});
        if(userInDb){
            if (false === userInDb.active){
                res.status(201).send({status:'success',active:userInDb.active});
            }else{
                res.status(201).send({status:'success',id:userInDb.id,phone:userInDb.phone,active:userInDb.active,message:"Welcome " + userInDb.firstname.toUpperCase()});
            }
        }else{
            res.status(201).send({ status:'error',message:"wrong User/Pwd !!!"});
        } 
    } catch (error) {
        res.status(404).send({error:error?.message});
    }
}

export const Profile = async(req,res)=>{
    try {
        let userData = await UserModel.findOne({_id:req.query.id});
        res.status(201).send({userData});
    } catch (error) {
        res.status(404).send({error:error?.message});
    }
}
export const ProfileInOut = async(req,res)=>{
    try {
       const user = await UserModel.findOne({_id:req.query.id});
       if (user && false === user.active) {
            user.active = true;
            await user.save();
            res.status(201).send({message:true});
        } else {
            user.active = false;
            await user.save();
            res.status(201).send({message:false});
        }
    } catch (error) {
        res.status(404).send({error:error?.message});
    }
}

export const GetAllUser = async(req,res)=>{
    try {
        const userData = await UserModel.find({role:req.query.role});
        res.status(201).send({userData}); 
    } catch (error) {
        res.status(404).send({error:error?.message});
    }
}

export const changePassword = async(req,res)=>{
//     try {
        
//         let passData = await UserModel.findByIdAndUpdate({_id:req.query.id},{password:req.body.new});
//         if (passData) 
//             res.status(200).send({status:'success', message: "New Password Updated" });
//         else 
//             res.status(404).send({status:'error', message: "Unable to update password" });
//     } catch (error) {
//         res.status(404).send({error:error?.message});
//     }
}

// export const editProfile = async(req,res)=>{
//     try {
//         let passData = await UserModel.findByIdAndUpdate({_id:req.query.id},{
//             phone:req.body.phone,
//             address:req.body.address,
//             country:req.body.country,
//             state:req.body.state,
//             city:req.body.city,
//         });
//         if (passData) 
//             res.status(200).send({status:'success', message: "Profile Updated" });
//         else 
//             res.status(404).send({status:'error', message: "Unable to update Profile" });
//     } catch (error) {
//         res.status(404).send({error:error?.message});
//     }
// }
