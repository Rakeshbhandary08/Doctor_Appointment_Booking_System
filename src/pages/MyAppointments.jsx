import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { SaveCheck } from 'lucide-react';
import { X } from 'lucide-react';
import { DollarSign } from 'lucide-react';

const MyAppointments = () => {
  const {doctors}=useContext(AppContext)
  return (
    <div>
      <p className='flex gap-1 items-center text-lg font-medium text-zinc-700 pb-3 mt-12 border-b border-gray-300'> <SaveCheck/> My appointments</p>

      <div>
         {
          doctors.slice(0,3).map((item,index)=>{
            return (
              <div key={index} className=' grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 border-b border-gray-300 py-2 mt-1'>
                <div className=''>
                  <img className='w-32 bg-indigo-50' src={item.image}></img>
                </div>
                <div  className=' text-sm flex-1'>
                   <p className='font-semibold text-neutral-800'>{item.name}</p>
                   <p>{item.speciality}</p>
                   <p className='font-medium text-zinc-700 mt-1'>Address:</p>
                   <p className='text-xs'>{item.address.line1}</p>
                   <p className='text-xs'>{item.address.line2}</p>
                   <p className='text-xs mt-1'><span className='text-neutral-700 font-medium'>Date & Time:</span> 25, July ,2024 | 8:30 PM</p>
                </div>
                <div  className='='></div>
                <div className='flex flex-col items-center gap-2 justify-end  '>
                  <button className='flex gap-1 items-center justify-center text-xs font-medium text-stone-500 text-center min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-500 hover:border-primary '>Pay Online <DollarSign className='w-4'/></button>
                  <button className='flex gap-1 items-center justify-center text-xs font-medium text-stone-500 text-center min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-500 hover:border-red-600 '>Cancel appointment <X className='w-4'/> </button>
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