import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";


export const DoctorContext=createContext();

const DoctorContextProvider=(props)=>{

    const [appointments,setAppointments]=useState([]);
    const [dashData,setDashData]=useState([]);
    const [profileData,setProfileData]=useState(false)

    const [dToken,setDToken]=useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):"");

    const backendUrl=import.meta.env.VITE_BACKEND_URL;

    //CREATE THE FUNCTION TO FETCH THE APPOINTMENTS
    const getAppointments=async ()=>{

        try{
        const {data}=await axios.get(backendUrl + "/api/doctor/get-appointments",{headers:{dToken}})

        if(data.success){
            setAppointments([...data.appointments].reverse());
            console.log([...data.appointments].reverse())
        }
        else{
            toast.error(data.message)
        }
        }
        catch(error){
            console.log(error)
            toast.error(error?.response?.data?.message || "Failed to fetch appointments")
        }
    }

    //FUNCTION TO MARK THE APPOINTMENT AS COMPLETED
    const completeAppointment=async (appointmentId)=>{
       try{
          const {data}=await axios.post(backendUrl + "/api/doctor/complete-appointment",{appointmentId},{headers:{dToken}})

          if(data.success){
            toast.success(data.message);
            getAppointments();
            getDashData()
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

    //FUNCTION TO MARK THE APPOINTMENT AS CANCELLED
    const cancelAppointment=async (appointmentId)=>{
       try{
          const {data}=await axios.post(backendUrl + "/api/doctor/cancel-appointment",{appointmentId},{headers:{dToken}})
          
          if(data.success){
            toast.info(data.message);
            getAppointments();
             getDashData();
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

    //FUNCTION TO GET THE DASHBOARD DETAILS TO DOCTOR
    const getDashData=async ()=>{
        try{

            // 1. Guard check for token
            if(!dToken) return;

           const {data}=await axios.get(backendUrl + "/api/doctor/dashboard",{headers:{dToken}})

           if(data.success){
            setDashData(data.dashData)
             console.log(data.dashData)
           }
           else{
            toast.error(data.message || "Failed to load dashboard data")
           }

           // Handle backend token errors returned with HTTP 200 (if any)
           if(data.message === "Invalid or expired token"){
             localStorage.removeItem('dToken')
             
           }
        }
        catch(error){
            console.log(error)
            toast.error(error?.response?.data?.message || "Something went wrong")
        }

    }

    //Create the logic of logout
    async function logoutDoctor(req,res){
      localStorage.removeItem("dToken");
      setDToken("")
    }
    
    //FUNCTION TO GET THE PROFILE OF THE DATA
    const getProfileData=async ()=>{
        try{

           //token guard
           if(!dToken){
            logoutDoctor();
            setProfileData(false)
            return;
           }

           const {data}=await axios.get(backendUrl + "/api/doctor/profile",{headers:{dToken}})

           if(data.success){
             setProfileData(data.profileData)
             console.log(data.profileData)
           }
           else{
              toast.error(data.message || "Failed to load profile data")
           }
        }
        catch(error){
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }
    

    let value={
       dToken,setDToken,backendUrl,getAppointments,appointments,setAppointments,completeAppointment,cancelAppointment,
       getDashData,dashData,setDashData,setProfileData,profileData,getProfileData,logoutDoctor
    }
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;