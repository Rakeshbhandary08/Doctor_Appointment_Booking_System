import doctorModel from "../models/doctorModel.js"


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

export {changeAvailability,doctorList};