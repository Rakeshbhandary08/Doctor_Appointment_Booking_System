 import validator from "validator"
 import bcrypt from "bcrypt"
 import userModel from "../models/userModel.js"
 import jwt from "jsonwebtoken"
 import {v2 as claudinary} from "cloudinary"
 import doctorModel from "../models/doctorModel.js"
 import appointmentModel from "../models/appointmentModel.js"
 import razorpay from "razorpay"
import { Await } from "react-router-dom"

 //API TO REGISTER USER
 const registerUser=async (req,res)=>{
    try{
    const {name,email,password}=req.body;

    if(!name?.trim() || !email?.trim() || !password?.trim()){
        return res.json({success:false,message:"Missing required fields"})
    }
    
    // Normalize and Sanitize User Inputs
    const normalizedEmail=email.trim().toLowerCase();
    const normalizedName=name.trim()
    
    if(!validator.isEmail(normalizedEmail)){
        return res.json({success:false,message:"Invalid Details"})
    }

    if(password.length < 8){
        return res.json({success:false,message:"Password must be atleast of 8 Characters"})
    }

    // ADD THIS CHECK HERE: FOR EXISTING USER;
    const existingUser=await userModel.findOne({email:normalizedEmail})
    
    if(existingUser){
        return res.json({success:false,message:"User already exists with this email"})
    }

    //Bcrypt the password
    const salt=await bcrypt.genSalt(10)
    const hassPassword=await bcrypt.hash(password,salt)
    
    const userData=await userModel.create({name:normalizedName,email:normalizedEmail,password:hassPassword})

    //Generate JWT Token using user's DB ID
    const token=jwt.sign({id:userData._id},process.env.USER_JWT_SECRET,{expiresIn:"1d"});

    console.log(token)

    return res.json({success:true,message:"Registeration done successfully",token:token})
   } 

   catch(error){
    console.log(error);
    return res.json({success:false,message:error.message})
   }

 }

 //API FOR USER TO GET LOGIN
 const loginUser=async (req,res)=>{
    
     try{
     const {email,password}=req.body;

     //Presence of email and password 
     if(!email?.trim() || !password?.trim()){
        return res.json({success:false,message:"Email and Password both are required"})
     }

     const normalizedEmail=email.trim().toLowerCase();

     const userData=await userModel.findOne({email:normalizedEmail});

     if(!userData){
        return res.json({success:false,message:"Invalid Email or Password"})
     }
     
     //Checking the password
     const isPasswordMatch=await bcrypt.compare(password,userData.password);

     if(!isPasswordMatch){
        return res.json({success:false,message:"Invalid Email or Password"})
     }

     //GENERATE THE TOKEN
     const token=jwt.sign({id:userData._id},process.env.USER_JWT_SECRET,{expiresIn:"1d"})
     

     return res.json({success:true,message:"Login Successful",token:token})

    }
    catch(error){
        console.log(error);
        return res.json({success:false,message:error.message})
    }
 }

 //create a api for PROFILE SECTION
 const getProfile=async (req,res)=>{
     try{
       const userId=req.userId;

       const userData =await userModel.findById(userId).select({password:0})

       return res.json({success:true,message:userData})
     }
     catch(error){
        console.log(error);
        return res.json({success:false,message:error.message})
     }
 }

 //API to update user profile
 const updateProfile=async (req,res)=>{

    try{
       const userId=req.userId;
       const {name,phone,address,dob,gender}=req.body;

       const imageFile=req.file;
       
       //Checking the presence
       if(!name || !phone || !dob || !gender || !address){
        return res.json({success:false,message:"Data Missing"})
       }

       let parsedAddress = address;
      if (typeof address === 'string') {
       try {
        parsedAddress = JSON.parse(address);
      } catch (e) {
        return res.json({ success: false, message: "Invalid address format" });
      }
    }

       await userModel.findByIdAndUpdate(userId,{name,phone,address:parsedAddress,dob,gender})

       if(imageFile){
          //Upload image  to Claudinary
          const imageUpload=await claudinary.uploader.upload(imageFile.path,{resource_type:'image'})
          const imageUrl=imageUpload.secure_url;

          await userModel.findByIdAndUpdate(userId,{image:imageUrl});

          return res.json({success:true,message:"Profile has been updated"})
       }
    }
    catch(error){
        console.log(error);
        return res.json({success:false,message:error.message || "An error occurred while updating profile"})
    }
 }

 //API FOR USER ACCORDING TO THEIR BOOKING
 const bookAppointment=async(req,res)=>{
     try{ 
         const userId=req.userId;

         const {docId,slotDate,slotTime}=req.body;

         const docData=await doctorModel.findById(docId).select(["-password"]).lean();

         //Checking the availability of doctor
         if(!docData.available){
            return res.json({success:false,message:"Doctor is not available"})
         }

         let slots_booked=docData.slots_booked
         //CHECKING FOR SLOTS AVAILABILITY FOR A PARTICULAR TIME
         if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
               return res.json({success:false,message:"This slot is not available"})
            }
            else{
               slots_booked[slotDate].push(slotTime)
            }
         }
         else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
         }

         const userData=await userModel.findById(userId).select("-password").lean();

         //DELETE THE OLD SLOT DATA OF DOCTOR
         //const docDataObj=docData.toOject();
         delete docData.slots_booked;
         
         // ALL THE DETAILS OF BOOKING
         const appointment={
            userId,docId,slotDate,slotTime,userData,docData,amount:docData.fees,date:Date.now()
         }

         const newAppointment=await appointmentModel.create(appointment);
         
         //REPLACE THE OLD SLOT BOOKED DATA WITH NEW ONE
         await doctorModel.findByIdAndUpdate(docId,{slots_booked})

         return res.json({success:true,message:"Your appoinment is booked"})

     }
     catch(error){
      console.log(error);
      return res.json({success:false,message:error.message})
     }
 }

 //API TO GET THE LIST OF APPOINTMENTS FOR FRONTEND
 const listAppointment=async (req,res)=>{
    try{
      const userId=req.userId;

      const appointments=await appointmentModel.find({userId:userId});

      return res.json({success:true,message:appointments})
    }
    catch(error){
      console.log(error)
      return res.json({success:false,message:error.message})
    }
 }

 //API TO CANCEL APPOINTMENT VIA USER
 const cancelAppointment=async (req,res)=>{
   try{
     const userId=req.userId;
     const {appointmentId}=req.body;
     const appointementData=await appointmentModel.findById(appointmentId);

     //IF WE HAVEN'T ABLE TO FIND OUT THE APPOINTMENT FOR THAT ID
     if(!appointementData){return res.json({success:false,message:"Appointment not found"})}

     //VERIFY APPOINTMENT USER
     if(appointementData.userId.toString() !== userId){
       return res.json({success:false,message:"Unauthorized action"})}

     await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

     //RELEASING THE DOCTOR SLOT 
     const {docId,slotTime,slotDate}=appointementData;
     const doctorData=await doctorModel.findById(docId);

     if(doctorData){
     const slots_booked=doctorData.slots_booked || {};
     if(slots_booked[slotDate]){
     slots_booked[slotDate]=slots_booked[slotDate].filter((e)=> e != slotTime);
     }
     //UPDATE THE CHANGES
     await doctorModel.findByIdAndUpdate(docId,{slots_booked})}

     return res.json({success:true,message:"Appointment is Cancelled"})
   }
   catch(error){
      console.log(error);
      return res.json({success:false,message:error.message})
   }

 }

 const razorpayInstance=new razorpay({
   key_id:process.env.RAZORPAY_KEY_ID,
   key_secret:process.env.RAZORPAY_KEY_SECRET
 })
 // API TO MAKE PAYMENT OF APPOINTMENT USING RAZORPAY
 const paymentRazorpay=async (req,res)=>{
      try{ 
        const userId=req.userId;
        const {appointmentId}=req.body;

        const appointmentData=await appointmentModel.findById(appointmentId)

        if(!appointmentData || appointmentData.cancelled)
         { return res.json({success:false,message:"Appointment not found"})}

        //Security: Ensure the appointment belongs to the requesting user
        if(appointmentData.userId.toString() !== userId.toString())
         { return res.json({success:false,message:"Unathorized Action"}) }

        //Prevent duplicate payments
        if(appointmentData.payment){
         return res.json({success:false,message:"Appointment is already paid"})}

        //CREATING THE OPTIONS FOR RAZORPAY PAYMENT
        const options ={
         amount:appointmentData.amount * 100,
         currency:process.env.CURRENCY || "INR",
         receipt:appointmentId}

        // CREATION OF AN ORDER
        const order=await razorpayInstance.orders.create(options)

        return res.json({success:true,order})
      }
      catch(error){
         console.log(error)
         return res.json({success:true,message:error.message})
      }
 }

 //API TO VERIFY THE PAYMENT OF RAZORPAY

 const verifyRazorpay=async(req,res)=>{
    try{
      const {razorpay_order_id}=req.body;
      const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)

      
      if(orderInfo.status === "paid"){
          await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment : true})
          return res.json({success:true,message:"Payment successful"})
      }
      else{
         return res.json({success:false,message:"Payment Failed, Try again!"})
      }
    }
    catch(error){
      console.log(error);
      return res.json({success:false,message:error.message})
    }
 }



 export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}