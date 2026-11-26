import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { Currency, SaveCheck } from 'lucide-react';
import { X } from 'lucide-react';
import { DollarSign } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const MyAppointments = () => {
  const {token,backendUrl,getDoctorsData}=useContext(AppContext);
  const [appointments,setAppointments]=useState([]);

  const navigate=useNavigate();
  
  //25, July ,2024
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat=(slotDate)=>{
     const dateArray=slotDate.split("-") //[12 08 2026]
     return dateArray[0]+" " +months[Number(dateArray[1])-1] +" "+dateArray[2]
  }
  
 
  const getUserAppointments=async()=>{
    try{
       const {data}=await axios.get(backendUrl + "/api/user/appointments",{headers:{token}})

        if(data.success){
          const appointmentArray=Array.isArray(data.message) ? data.message : [data.message]
          setAppointments(appointmentArray.reverse())
          appointments && console.log(appointments)
        }
       
    }
    catch(error){
      console.log(error)
      toast.error(error?.response?.data?.message || error.message)

    }
  }

   //Another function for razorpay
  const initPay=(order)=>{
     const options ={
       key:import.meta.env.VITE_RAZORPAY_KEY_ID,
       amount:order.amount,
       currency:order.currency,
       name:'Appointment Payment',
       description:'Appointment Payment',
       order_id:order.id,
       receipt:order.receipt,
       handler: async(response)=>{
            console.log(response)

            try{
              const {data}=await axios.post(backendUrl + "/api/user/verify-razorpay",response,{headers:{token}})
              if(data.success){
                getUserAppointments();
                navigate("/my-appointments")
              }
            }
            catch(error){
              console.log(error);
              toast.error(error?.response?.data?.message)
            }
       }
     }

     const rzp=new window.Razorpay(options)
     rzp.open()
  }

  //RAZORAY LOGIC IMPLEMENTATION
  const appointmentRazorpay=async(appointmentId)=>{
    
    try{
      const {data}=await axios.post(backendUrl + "/api/user/payment-razorpay",{appointmentId},{headers:{token}})

      if(data.success){
        initPay(data.order)
      }
    }
    catch(error){
        console.log(error)
        toast.error(error?.response?.data?.message)
    }

  }

  useEffect(()=>{
    token &&  getUserAppointments()
  },[token])
  

  //FUNCTION FOR CANCEL APPOINTMENT
  const cancelAppointment=async (appointmentId)=>{

      try{
         console.log(appointmentId)
         const {data}=await axios.post(backendUrl + "/api/user/cancel-appointment",{appointmentId},{headers:{token}})

         if(data.success){
           toast.info(data.message || "Appointment cancelled successfully!");
           getUserAppointments();
           getDoctorsData();
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

  //CALL THE API CALL
  return (
    <div>
      <p className='flex gap-1 items-center text-lg font-medium text-zinc-700 pb-3 mt-12 border-b border-gray-300'> <SaveCheck/> My appointments</p>

      <div>
         {
          appointments.map((item,index)=>{
            return (
               <div key={index} className=' grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 border-b border-gray-300 py-2 mt-1'>
                <div className=''>
                  <img className='w-32 bg-indigo-50' src={item.docData.image}></img>
                </div>
                <div  className=' text-sm flex-1'>
                   <p className='font-semibold text-neutral-800'>{item.docData.name}</p>
                   <p>{item.docData.speciality}</p>
                   <p className='font-medium text-zinc-700 mt-1'>Address:</p>
                   <p className='text-xs'>{item?.docData?.address?.line1}</p>
                   <p className='text-xs'>{item?.docData?.address?.line2}</p>
                   <p className='text-xs mt-1'><span className='text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime} </p>
                </div>
                <div  className='='></div>
                <div className='flex flex-col items-center gap-2 justify-end  '>
                  {!item.cancelled && item.payment && !item.isCompleted && <button className='min-w-48 px-1 py-2 border rounded text-white bg-green-600 text-[13px] sm:text-[15px]'>Paid</button>}
                  {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={()=>appointmentRazorpay(item._id)} className='flex gap-1 items-center justify-center text-[13px] font-medium text-stone-500 text-center min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-500 hover:border-primary cursor-pointer'>Pay Online {`₹${item.amount}`}</button>}
                  {!item.cancelled && !item.isCompleted &&  <button onClick={()=>{cancelAppointment(item._id)}} className='flex gap-1 items-center justify-center  text-[13px] font-medium text-stone-500 text-center min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-500 hover:border-red-600 cursor-pointer'>Cancel appointment <X className='w-4'/> </button>}
                  {item.cancelled && !item.isCompleted && <button onClick={()=>{cancelAppointment(item._id)}} className='sm:min-w-48 px-1 border border-red-500 py-2 rounded text-red-500 text-[13px] sm:text-[15px]'>Appointment Cancelleed </button>}
                  {item.isCompleted && <button className='min-w-48 py-2 border border-green-500 text-green-500 rounded'>Completed</button>}
                </div>

              </div>
            )
          })
         }
      </div>
    </div>
  )
}

export default MyAppointments