import { createContext, useEffect } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

export const AppContext=createContext();

const AppContextProvider=(props)=>{
    const currencySymbol='₹'
    const backendUrl=import.meta.env.VITE_BACKEND_URL;
    const [doctors,setDoctors]=useState([]);
    const [token,setToken]=useState(localStorage.getItem("token") || "");

    const [userData,setUserData]=useState(false)


   // Fetch doctors list from API
    const getDoctorsData=async()=>{
        try{
           const {data}=await axios.get(backendUrl+"/api/doctor/list");

           if(data.success){
             setDoctors(data.message)
           }
           else{
            toast.error(data.message || "Sorry for the inconvience")
           }
        }
        catch(error){
            console.log(error);
            toast.error(error.message || "Sorry for the inconvience")
        }
    }

    //Update the user based on details

    const loadUserProfileData=async ()=>{
        try{

            const {data}=await axios.get(backendUrl +"/api/user/get-profile",{headers:{token}});

            if(data.success){
                setUserData(data.message)
            }
            else{
                toast.error(data.message || "Couldn't fetch the data")
            }

        }
        catch(error){
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }

    //Give the value
     const value={
        doctors,getDoctorsData,currencySymbol,getDoctorsData,token,setToken,
        backendUrl,userData,setUserData,loadUserProfileData
    }

    // Fetch data automatically on initial mount
    useEffect(()=>{
        getDoctorsData()
    },[])

    useEffect(()=>{
        if(token){
        loadUserProfileData()
        }
        else{
            setUserData(false)
        }
    },[token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;