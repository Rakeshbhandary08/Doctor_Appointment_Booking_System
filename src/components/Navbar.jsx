import React from 'react'
import {assets} from "../assets/assets"
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
    const navigate=useNavigate();
    
    const [showMenu,setShowMenu]=useState(false);
    const [token,setToken]=useState(true);
    const [profileFix,setProfileFix]=useState(false);

    //create a function
    function handleProfileClick(){
        if(window.innerWidth < 768){  //smaller screen
           setProfileFix(!profileFix)
        }
    }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img onClick={()=>navigate("/")} className='w-40 cursor-pointer' src={assets.logo}></img>
        <ul className='hidden md:flex items-start gap-5 font-medium text-[17px]'>
            <NavLink to="/">
                <li className='py-1 text-gray-700 hover:text-black transition-all'>Home</li>
                <hr className='border-none outline-non bg-primary h-0.5 w-3/5 m-auto hidden'/>
                
            </NavLink>
            <NavLink to="/doctors">
                <li className='py-1 text-gray-700 hover:text-black transition-all'>All Doctors</li>
                <hr className='border-none outline-non bg-primary h-0.5 w-3/5 m-auto hidden'/>
                
            </NavLink>
            <NavLink to="/about">
                <li className='py-1 text-gray-700 hover:text-black transition-all'>About</li>
                <hr className='border-none outline-non bg-primary h-0.5 w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to="/contact">
                <li className='py-1 text-gray-700 hover:text-black transition-all' >Contact</li>
                <hr className='border-none outline-non bg-primary h-0.5 w-3/5 m-auto hidden'/>
            </NavLink>
        </ul>
        <div className='flex items-center gap-4'>
            {
                token ? 
                <div className=' flex items-center gap-4 cursor-pointer group relative ' onClick={handleProfileClick}>
                    <img src={assets.newMe} alt="" className='w-8 rounded-full'></img>
                    <img src={assets.dropdown_icon} alt="" className={`w-2.5  md:group-hover:rotate-180 ${profileFix ? "rotate-180" : ""} transition-transform duration-250`}></img>
                    <div className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 ${profileFix ? 'block':'hidden'} md:group-hover:block`}>
                        <div className=' min-w-48 text-left bg-stone-100 p-4 flex flex-col gap-4 rounded'>
                            <p onClick={()=>{navigate("/my-profile")}} className='hover:text-black transition-all'>My Profile</p>
                            <p onClick={()=>{navigate("/my-appointments")}} className='hover:text-black transition-all'>My Appointment</p>
                            <p onClick={()=>setToken(false)} className='hover:text-black transition-all'>Logout</p>
                        </div>
                    </div>
                </div> 
                : <button onClick={()=>navigate("/login")} className='text-white bg-primary px-7 py-3 rounded-full hidden md:block text-[15px] cursor-pointer font-medium'>Create Account</button>
            }
        </div>
    </div>
  )
}

export default Navbar;