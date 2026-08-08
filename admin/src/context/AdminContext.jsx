import {createContext, useState} from "react"
export const AdminContext=createContext();
import { toast } from "react-toastify";
import axios from "axios";


const AdminContextProvider=(props)=>{

   //FUNCTION THAT CALCULATES THE AGE USING DOB
   const calculateAge=(dob)=>{
      const today=new Date();
      const birthDate=new Date(dob);  //   "dob": "2004-08-12",

      let age=today.getFullYear()-birthDate.getFullYear()

      if(age < 1){
        return "Under 1 yr"
      }
      else if(age === 1){
        return "1 yr"
      }
      else if(age>1){
        return `${age} yrs`
      }
   }

   //FUNCTION FOR FORMATING THE DATE
   const formatDate=(data)=>{ // "9-8-2026",
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
       const splitDate=data.split("-");

       return splitDate[0] + " "+ months[splitDate[1]-1] +" "+ splitDate[2]

   }

    const [aToken,setAToken]=useState(localStorage.getItem('aToken') ?localStorage.getItem('aToken'):"" )
    const [doctors,setDoctors]=useState([])
    const [appointments,setAppointments]=useState([])
    const [dashData,setDashData]=useState(false)

    const backendUrl=import.meta.env.VITE_BACKEND_URL

    async function getAllDoctors(){
    try{
      const {data}=await axios.get(backendUrl+"/api/admin/all-doctors",{headers:{ATOKEN:aToken}});

      if(data.success){
        setDoctors(data.message)
        toast.success("Doctors list loaded successfully");
        console.log(data.message)

      }
      else{
        toast.error("Failed to fetch doctors");
        
      }
    }
    catch(error){
        console.log(error);
        toast.error(error.response?.data?.message || error.message)
    }
  }

  const changeAvailability=async(docId)=>{
    try{
         const {data}=await axios.post(backendUrl+"/api/admin/change-availability",{docId},{headers:{aToken}})

         if(data.success){
           toast.success(data.message);
           getAllDoctors()
         }
         else{
          toast.error(data?.message || "Sorry,Availability haven't changed")
         }
    }
    catch(error){
      toast.error(error.response?.data?.message || "Sorry for the inconvience")
    }
  }

  //New Function to fetch all the Appointments
  const getAllAppointments=async ()=>{
     try{
       const {data}=await axios.get(backendUrl + "/api/admin/appointments",{headers:{ATOKEN:aToken}})

       if(data.success){
         setAppointments(data.message)
    
       }
       
       else{
         toast.error(data.message || "No Appointments")
       }
     }
     catch(error){
       toast.error(error.message)
     }
  }

   //FUNCTION FOR CLICK CANCEL FOR ADMIN
    async function clickCancel(appointmentId){
      try{
        const {data}=await axios.post(backendUrl + "/api/admin/click-cancel",{appointmentId},{headers:{aToken}})
  
        if(data.success){
          toast.success(data.message)
          getAllAppointments()
        }
        else{
          toast.error(data.message)
        }
      }
      catch(error){
        console.log(error);
        toast.error(error?.response?.data?.message)
      }
    }

    //FUNCTION CALLING FOR DASHBOARD
    async function getDashData(){
       try{
         const {data}=await axios.get(backendUrl + "/api/admin/dashboard",{headers:{aToken}})

         if(data.success){
          setDashData(data.message)
           console.log(data.message)
         }
         else{
          toast.error(data.message)
         }
       }
       catch(error){
        console.log(error);
        return toast.error(error?.response?.data?.message)
       }
    }

    const value={
        aToken,setAToken,backendUrl,getAllDoctors,doctors,changeAvailability,
        appointments,setAppointments,getAllAppointments,calculateAge,formatDate,clickCancel,getDashData,dashData
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;