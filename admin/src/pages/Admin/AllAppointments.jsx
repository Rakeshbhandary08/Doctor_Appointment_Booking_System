import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { toast } from "react-toastify";
import axios from 'axios'

const AllAppointments = () => {

  const {aToken,appointments,setAppointments,getAllAppointments,
    calculateAge,formatDate,backendUrl,clickCancel}=useContext(AdminContext)

  useEffect(()=>{
    if(aToken){ getAllAppointments() }},[aToken])

  return (
    <div className=' w-full m-5 max-w-6xl '>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border border-gray-400 rounded text-base min-h-[60vh] max-h-[80vh] 
      overflow-y-scroll max-sm:overflow-x-scroll'>
        <div className='bg-blue-200 sm:grid grid grid-cols-[0.5fr_3fr_1.2fr_3fr_3fr_1fr_1fr] grid-flow-col 
        py-3 px-6 border-b font-medium'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {appointments?.map((item,index)=>{
          return(
            <div key={item._id} className=' flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1.2fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6  border-b hover:bg-gray-50 transition-all duration-500' >
               <p className='max-sm:hidden'>{index+1}</p>
               <div className='flex items-center gap-2 '>
                 <img className='w-8 h-8 object-cover rounded-full' src={item?.userData?.image} alt=""/><p>{item.userData.name}</p>
               </div>
               <p className='max-sm:hidden'>{calculateAge(item?.userData?.dob) || "N/A"}</p>
               <p>{formatDate(item.slotDate)},{" "}{item.slotTime}</p>
               <div className='flex items-center gap-2 '>
                 <img className='bg-gray-200 w-8 h-8 object-cover rounded-full' src={item?.docData?.image} alt=""/><p>{item.docData.name}</p>
               </div>
               <p>₹{item.amount}</p>
               {
                item.cancelled ? <p className='text-red-400 font-medium'>Cancelled</p> 
                : item.isCompleted ? <p className=' text-green-500/90 font-medium'>Completed</p> : <img onClick={()=>clickCancel(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt=""/>
               }
              
               
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AllAppointments