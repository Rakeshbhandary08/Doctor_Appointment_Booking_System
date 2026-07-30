import validator from "validator"
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken"

//API FOR ADDING DOCTORs
const addDoctor=async(req,res)=>{
   try{
     const {name,email,password,speciality,degree,experience,about,fees,address}=req.body;
     const imageFile=req.file;
     
     //check for all data to add doctor
     if(!name || !email || !about || !password || !speciality || !degree || !experience || !fees || !address){
          return res.json({success:"false",message:"Missing Details"})
     }

      //validate the email formate
      if(!validator.isEmail(email)){
        return res.json({success:false,message:"Please enter the valid email"})
      }

      //validate the password
      if(password.length < 8){
        return res.json({success:false,message:"Please enter the strong Password"})
      }

      //bcrypt/hass the password
      const salt=await bcrypt.genSalt(10);
      const hassedPassword=await bcrypt.hash(password,salt);

      //Upload image to cloudinary
      const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
      const imageUrl=imageUpload.secure_url;

      const doctorData={
        name,
        email,password:hassedPassword,image:imageUrl,
        speciality,degree,experience,about,fees,address:JSON.parse(address),
        date:Date.now()
      }

      const newDoctor=new doctorModel(doctorData)
      await newDoctor.save()
     
      return res.json({success:true,message:"Doctor added successfully"})
  }
   catch(error){
    console.log(error);
    res.json({success: false, message: error.message});
}
}

//API FOR THE ADMIN LOGGIN
const loginAdmin=async (req,res)=>{
   try{
     const {email,password}=req.body;
     if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
         const token=jwt.sign(email+password,process.env.JWT_SECRET);
         res.cookie('aToken',token)
         return res.json({success:true,message:token})
     }
     else{
        return res.json({success:false,message:"Invalid Credentials"})
     }
   }
   catch(error){
    console.log(error);
    res.json({success:false,message:error.message})
   }
}


//API to get all the doctors list for admin Panel

const allDoctors=async(req,res)=>{
    try{
       const doctors = await doctorModel.find({}).select({password:0})
       return res.json({success:true,message:doctors})
       console.log(doctors)
    }
    catch(error){
      console.log(error)
      return res.json({success:false,message:error.message})
    }
}

export {addDoctor,loginAdmin,allDoctors};