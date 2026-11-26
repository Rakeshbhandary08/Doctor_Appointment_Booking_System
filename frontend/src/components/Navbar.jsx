import React, { useContext } from 'react'
import {assets} from "../assets/assets"
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AppContext } from '../context/AppContext';


const Navbar = () => {
    const navigate=useNavigate();

    const {token,setToken,userData}=useContext(AppContext)
    
    const [showMenu,setShowMenu]=useState(false);
   
    const [profileFix,setProfileFix]=useState(false);
    

    //create a function
    function handleProfileClick(){
        if(window.innerWidth < 768){  //smaller screen
           setProfileFix(!profileFix)
        }
    }

    //create a function for logout
    function logout(){
        setToken('');
        localStorage.removeItem("token")
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
        <div className='flex items-center gap-4 '>
            {
                token ? 
                <div className=' flex items-center gap-3 cursor-pointer group relative ' onClick={handleProfileClick}>
                    <img src={userData && userData.image} alt="" className='w-8 h-8 rounded-full object-cover'></img>
                    <img src={assets.dropdown_icon} alt="" className={`w-2.5  md:group-hover:rotate-180 ${profileFix ? "rotate-180" : ""} transition-transform duration-250`}></img>
                    <div className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 ${profileFix ? 'block':'hidden'} md:group-hover:block`}>
                        <div className=' min-w-48 text-left bg-stone-100 p-4 flex flex-col gap-4 rounded'>
                            <p onClick={()=>{navigate("/my-profile")}} className='hover:text-black transition-all'>My Profile</p>
                            <p onClick={()=>{navigate("/my-appointments")}} className='hover:text-black transition-all'>My Appointment</p>
                            <p onClick={logout} className='hover:text-black transition-all'>Logout</p>
                        </div>
                    </div>
                </div> 
                : <button onClick={()=>navigate("/login")} className='text-white bg-primary px-7 py-3 rounded-full hidden md:block text-[15px] cursor-pointer font-medium'>Create Account</button>
            }
            {/* --------------- Mobile Menu   ---------------------- */}
          
            <img className='md:hidden w-6 ml-1 cursor-pointer ' src={assets.menu_icon} onClick={()=>setShowMenu(!showMenu)} ></img>
           <div className={`md:hidden fixed w-full overflow-hidden bg-white  right-0 bottom-0 top-0  z-20 transition-transform duration-300 ease-in-out ${showMenu ? 'translate-x-0' : "translate-x-full"} `}>
               <div className='flex justify-between items-center bg-white px-4 py-4 border border-b border-gray-300'>
                 <img src={assets.logo} className='w-40'></img>
                 <img onClick={()=>setShowMenu(!showMenu)} src={assets.cross_icon} className='w-7 cursor-pointer'/>
               </div>
               <ul className='flex flex-col items-center gap-3 mt-5 text-lg font-medium '>
                <NavLink  to="/" onClick={()=>setShowMenu(!showMenu)}><p className="px-4 py-2 rounded inline-block">Home</p></NavLink>
                <NavLink  to="/doctors" onClick={()=>setShowMenu(!showMenu)}><p className="px-4 py-2 rounded inline-block">All Doctors</p></NavLink>
                <NavLink  to="/about" onClick={()=>setShowMenu(!showMenu)}><p className="px-4 py-2 rounded inline-block"> About</p></NavLink>
                <NavLink  to="/contact" onClick={()=>setShowMenu(!showMenu)}><p className="px-4 py-2 rounded inline-block">Contact</p></NavLink>
               </ul>
            </div>
            
        </div>
    </div>
  )
}

export default Navbar;




