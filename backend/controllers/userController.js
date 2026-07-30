 import validator from "validator"
 import bcrypt from "bcrypt"
 import userModel from "../models/userModel.js"
 import jwt from "jsonwebtoken"

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
 const profileView=async (req,res)=>{
     const {email} = req.body;

     if(!email?.trim()){
        return res.json({success:true,message:"Missing Details"})
     }

     const userData=await userModel.findOne({email:})
 }

 export {registerUser,loginUser}