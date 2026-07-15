import React from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate=useNavigate();
  return (
    <div className='md:mx-10 '>
        <div className=' flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] text-sm gap-9 md:gap-14 mb-10 mt-40 ' >
            {/** Left  */}
            <div className=''>
                <img onClick={()=>scrollTo(0,0)} src={assets.logo} className='mb-5 w-40 cursor-pointer'></img>
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Prescripto is a trusted doctor appointment booking platform connecting patients with verified doctors across multiple specialities. Book appointments online, manage your bookings, and get quality healthcare - all in one place, hassle-free.</p>
            </div>

            {/** middle  */}
            <div className=''>
                <p className='text-xl font-medium mb-3 md:mb-5'>COMPANY</p>
                <ul className='flex flex-col text-gray-600 gap-2'>
                    <li onClick={()=>navigate("/")}  className='cursor-pointer'>Home</li>
                    <li onClick={()=>navigate("/about")} className='cursor-pointer'>About us</li>
                    <li onClick={()=>navigate("/contact")} className='cursor-pointer'>Contact us</li>
                    <li className='cursor-pointer'>Privacy policy</li>
                </ul>
            </div>

            {/** right  */}
            <div className=''>
                <p className='text-xl font-medium mb-3 md:mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col text-gray-600 gap-2'>
                    <li>+91-8595234500</li>
                    <li>health@prescripto.com</li>
                </ul>
            
            </div>
        </div>
        
        {/* copyright text */}
        <div>
            <hr className='border-0 outline-0 h-[1px] w-full bg-gray-300'/>
            <p className='text-center py-5 text-sm text-gray-800'>Copyright © 2026 Prescripto - All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer;