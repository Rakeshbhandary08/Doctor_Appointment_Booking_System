import validator from "validator"
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken"
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js"

//API FOR ADDING DOCTORs
const addDoctor=async(req,res)=>{
   try{
     const {name,email,password,speciality,degree,experience,about,fees,address}=req.body;
     const imageFile=req.file;
     
     //check for all data to add doctor
     if(!name || !email || !about || !password || !speciality || !degree || !experience || !fees || !address){
          return res.json({success:"false",message:"Missing Details"})
     }

     let fixEmail=email.trim().toLowerCase();

      //validate the email formate
      if(!validator.isEmail(fixEmail)){
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
        email:fixEmail,password:hassedPassword,image:imageUrl,
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

//API TO GET ALL THE APPOINTMENT LIST
const appointmentsAdmin = async(req,res)=>{
    try{
       const appoinments=await appointmentModel.find({})

       if(appoinments.length === 0) return res.json({success:false,message:"No Appointments Found"})

        let newAppointments=[...appoinments].reverse()

       return res.json({success:true,message:newAppointments})
    }
    catch(error){
      console.log(error);
      return res.json({success:false,message:error.message})
    }
}

const clickCancel= async (req,res)=>{
   try{
   const {appointmentId}=req.body;
   const appointmentData=await appointmentModel.findById(appointmentId)

   if(!appointmentData){
    return res.json({success:false,message:"Appointments not found"})
   }

   //IF A PARTICULAR APPOINMENT IS ALREADY TRUE
   if(appointmentData.cancelled){
    return res.json({success:false,message:"Appointment has already been cancelled"})}

   await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

   //// Release doctor's booked time slot
   const {docId,slotTime,slotDate}=appointmentData;

   const docData=await doctorModel.findById(docId);

   //IF docData , Date and time all are present
   if(docData && docData.slots_booked){
     let slots_booked=docData.slots_booked

     if(slots_booked[slotDate]){
       slots_booked[slotDate]=slots_booked[slotDate].filter((time) =>time !== slotTime)
     }

     await doctorModel.findByIdAndUpdate(docId,{slots_booked:slots_booked})
   }
   return res.json({success:true,message:"Appointment cancellation done"})
  }
  catch(error){
    console.log(error);
    return res.json({success:false,message:error.message})
  }
}

//API TO GET DASHBOARD DATA FOR ADMIN PANEL
const adminDashboard=async (req,res)=>{
   try{
      const doctors=await doctorModel.find({});
      const users=await userModel.find({});
      const appointments=await appointmentModel.find({})

      

      const dashData={
         doctors:doctors.length,
         appointments:appointments.length,
         patients:users.length,
         latestAppointments:appointments.slice(-5).reverse()
      }
      res.json({success:true,message:dashData})
      
   }
   catch(error){
     console.log(error);
     return res.json({success:false,message:error.message})
   }
}

export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,clickCancel,adminDashboard};