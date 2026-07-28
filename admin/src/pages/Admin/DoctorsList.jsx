import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios';

const DoctorsList = () => {
  const {aToken,backendUrl,getAllDoctors,doctors,changeAvailability}=useContext(AdminContext);

  useEffect(()=>{
    if(aToken){
       getAllDoctors()
    }
  },[aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll '>
       <h1 className='text-lg font-medium'>All Doctors</h1>
       <div className=' w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item,index)=>{
          return(
            <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={item._id}>
              <img className='bg-indigo-50 w-full  object-cover group-hover:bg-primary transition-all duration-500' src={item.image} alt={item.name}/>
              <div className='p-4'>
                <p className='text-lg font-medium text-neutral-800'>{item.name}</p>
                <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                <div className='flex mt-2 items-center gap-1 text-sm'>
                  <input onChange={()=>changeAvailability(item._id)} type='checkbox' checked={item.available}/>
                  <p>Available</p>
                </div>
              </div>
            </div>
          )
        })}
       </div>
    </div>
  )
}

export default DoctorsList