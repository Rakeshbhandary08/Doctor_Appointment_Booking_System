import React from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
    const navigate=useNavigate()
  return (
    <div className='bg-primary flex  rounded-lg  mb-20 px-6 sm:px-10 md:px-11 lg:px-12 my-20 md:mx-10 lg:mt-25'>
        {/* Left Side */}
        <div className='flex flex-col items-center lg:items-start py-8 sm:py-10 md:py-16 lg:py-22 lg:pl-5 mx-auto'>
          <div className='text-3xl md:text-4xl lg:text-5xl text-white font-medium leading-tight'>
            <p>Book Appointment </p>
            <p>With 100+ Trusted Doctors</p>
          </div>
          <button onClick={()=>{navigate('/login');scroll(0,0)}} className='text-gray-800 bg-blue-50 px-8 py-3 rounded-full mt-7 hover:scale-104 transition-transform duration-500 cursor-pointer'>create account</button>
        </div>

        {/* Right Side */}
        <div className=' hidden md:block md:w-1/2 lg:w-[370px] relative'>
          <img src={assets.appointment_img} className='w-full absolute right-0 bottom-0 '></img>
        </div>
    </div>
  )
}

export default Banner;