import doctorModel from "../models/doctorModel.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";


const changeAvailability=async(req,res)=>{
   try{
       const {docId}=req.body;

       const docData=await doctorModel.findById(docId);

       await doctorModel.findByIdAndUpdate(docId,{available:!docData.available});

       return res.json({success:true,message:"Availablity Changed"})

   }
   catch(error){
     console.log(error);
     return res.json({success:false,message:error.message})
   }
}

//CREATE A API OF THE AVAILABLE DOCTORS FROM DOCTOR LIST
const doctorList=async(req,res)=>{
  try{
      const doctors=await doctorModel.find({}).select("-password -email")

      return res.json({success:true,message:doctors})
  }
  catch(error){
    console.log(error);
    return res.json({success:false,message:error.message || "Unavailable Data"})
  }
}

//LOGIN LOGIC FOR DOCTORS
const loginDoctor=async(req,res)=>{
   try{
      const {email,password}=req.body;

      //Checking the presence of the email & password
      if(!email || !password) return res.json({success:false,message:"Invalid credentials"})

      let fixEmail=email.trim().toLowerCase();

      let doctorData=await doctorModel.findOne({email:fixEmail})

      //Checking the Registeration of a doctorData
      if(!doctorData){
        return res.json({success:false,message:"Invalid credentials"})
      }

      //Verifiying the password
      let hassPassword=await bcrypt.compare(password,doctorData.password)

      if(!hassPassword){
        return res.json({success:false,message:"Something wrong, Try Again"})
      }

      //Generating the token
      const token=jwt.sign({id:doctorData._id},process.env.JWT_SECRET,{expiresIn:"1d"})

      return res.json({success:true,message:"Login successfully",token:token})
      
   }
   catch(error){
    console.log(error);
    return res.json({success:false,message:error.message})
   }
}

//API TO GET A DOCTOR appointments for doctor panel
const appointmentsDoctor=async (req,res)=>{
   try{
      const docId=req.docId;

      const appointments=await appointmentModel.find({docId:docId});

      return res.json({success:true,message:"Appointments are laoded",appointments})

   }
   catch(error){
    console.log(error);
    return res.json({success:false,message:error.message})
   }
} 

//API FOR THE COMPLETION OF THE APPOINTMENT
const appointmentComplete=async (req,res)=>{
  try{
   const docId=req.docId;
   const {appointmentId}=req.body;

   if(!appointmentId){
    return res.json({success:false,message:"Something went wrong"})
   }

   const appointmentData=await appointmentModel.findById(appointmentId)

   if(!appointmentData){
    return res.json({success:false,message:"Appointment not found"})
   }

   //Security Check: Ensure this appointment belongs to the logged-in doctor
   if(appointmentData.docId !== docId){
    return res.json({success:false,message:"Unathorized action"})
   }

   if (appointmentData.isCompleted) {
      return res.json({ success: false, message: "Appointment is already completed" });
    }

   await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})

   return res.json({success:true,message:"Appointment completed successfully"})
  }
  catch(error){
    console.log(error)
    return res.json({success:false,message:error.message})
  }
}

//API FOR THE CANCELLATION OF THE APPOINTMENT
const appointmentCancel= async (req,res)=>{
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

//API TO GET DASHBOARD FOR DOCTOR PANEL
const doctorDashboard=async(req,res)=>{
  try {

    const docId=req.docId;

    //Catch Block Security Leak (success: true)
    if(!docId){
      return res.status(401).json({success:false,message:"Unathorized Access"})
    }

    const appoinments=await appointmentModel.find({docId:docId});

    let earnings=0

    appoinments.map((item)=>{
      if(item.isCompleted){
      earnings=earnings + item.amount
      }
    })

    let patients=new Set(appoinments.map((item)=>item.userId)).size

    //CREATE A DATA SET FOR DOCTOR
    const dashData={
      earnings,
      appointments:appoinments.length,
      patients,
      latestAppointments:appoinments.slice(-5).reverse()
    }

    return res.json({success:true,dashData})

    
  } catch (error) {
    console.log(error)
    return res.json({success:true,message:error.message})
  }
}


//API TO GET THE DETAILS OF THE DOCTOR
const doctorProfile=async(req,res)=>{
    try{
      const docId=req.docId;
      
      //cookies blocked condition
      if(!docId){
         return res.json({success:false,message:"Unauthorized access"})
      }

      const profileData=await doctorModel.findById(docId).select("-password").lean()

      if(!profileData){
        return res.json({success:false,message:"Doctor profile not found"})
      }
      
      return res.json({success:true,profileData})

    }
    catch(error){
      console.log(error)
      return res.json({success:false,message:error.message})
    }
}

//API TO EDIT/UPDATE THE PROFILE OF THE DOCTOR
const updateDoctorProfile=async(req,res)=>{
  try{
    const docId=req.docId;
    const {fees,address,available}=req.body;
   
    //cookies blocked condition
      if(!docId){
         return res.json({success:false,message:"Unauthorized access"})
      }

    let updateData={} //to store the updated data

    //validate the fees
    if(fees !== undefined){
      let parsedFees=Number(fees)
    if(isNaN(fees) || parsedFees< 100 || parsedFees > 10000){
      return res.json({success:false,message:"Fees must be between ₹100 and ₹10,000"})
    }
     updateData.fees=parsedFees
   }

   //validates the address
   if(address !== undefined){
      updateData.address=address
   }

   //validates the availability
   if(available !== undefined){
     updateData.available=Boolean(available)
   }

   //IF DOCTOR HASN'T UPDATE ANYTHING

   if(Object.keys(updateData).length === 0){
     return res.json({success:false,message:"No fields provided to update"})
   }

   await doctorModel.findByIdAndUpdate(docId,updateData,{new:true,runValidators:true})

    return res.json({success:true,message:"Profile has been upadated"})


  }
  catch(error){
      console.log(error)
      return res.json({success:false,message:error.message})
    }
}


export {changeAvailability,doctorList,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancel,doctorDashboard,doctorProfile,updateDoctorProfile};