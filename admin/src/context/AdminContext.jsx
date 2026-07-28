import {createContext, useState} from "react"
export const AdminContext=createContext();
import { toast } from "react-toastify";
import axios from "axios";


const AdminContextProvider=(props)=>{
    const [aToken,setAToken]=useState(localStorage.getItem('aToken') ?localStorage.getItem('aToken'):"" )
    const [doctors,setDoctors]=useState([])
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

    const value={
        aToken,setAToken,backendUrl,getAllDoctors,doctors,changeAvailability
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;