import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {
  const {dToken,getAppointments,appointments,setAppointments,completeAppointment,cancelAppointment}=useContext(DoctorContext);
  const {calculateAge,formatDate}=useContext(AdminContext)
  useEffect(()=>{
    if(dToken){
      getAppointments()
    }
  },[dToken])
  
  return (
    <div className='bg-white w-full m-2 sm:m-5 max-w-6xl '>
      <p className='font-medium text-lg mb-3 p-2 '>Your Appointments</p>
      <div className='bg-white border border-gray-400 rounded min-h-[50vh] max-h-[80vh] overflow-y-scroll'>
        <div className='bg-blue-200 max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] border-b gap-1 py-3 px-6 font-medium'>
           <p>#</p>
           <p>Patient</p>
           <p>Payment</p>
           <p>Age</p>
           <p>Data & Time</p>
           <p>Fees</p>
           <p>Action</p>
        </div>
        
          {
            appointments.length > 0 && appointments.map((item,index)=>{
              return (
                <div key={item._id} className='flex flex-wrap items-center justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] border-b
                 text-gray-500 border-gray-200 gap-1 py-3 px-3 sm:px-6 hover:bg-gray-50 transition-all duration-300'>
                    <p className='max-sm:hidden'>{index+1}</p>
                    <div className='flex items-center gap-2'>
                     <img className='w-10 h-10 object-cover rounded-full' src={item.userData.image}/>
                     <p className='font-medium '>{item.userData.name}</p>
                    </div>
                    <div >
                      <p className='text-xs inline border border-primary px-2 rounded-full font-medium'>{item.payment ? 'ONLINE' : 'CASH'}</p>
                    </div>
                    <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
                    <p>{formatDate(item.slotDate)}{", "}{item.slotTime}</p>
                    <p>₹{item.amount}</p>
                    {
                      item.cancelled ? <p className='text-red-600/80 font-medium '>Cancelled</p>
                      : item.isCompleted ? <p className='text-green-600/80 font-medium'>Completed</p>
                      :
                      <div className='flex'>
                      <img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon}/>
                      <img onClick={()=>completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon}/>
                    </div>
                    }
                    
                </div>
              )
            })
          }
        

      </div>
    </div>
  )
}

export default DoctorAppointments