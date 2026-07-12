import React from 'react'
import {assets} from "../assets/assets"
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img className='w-44 cursor-pointer' src={assets.logo}></img>
        <ul className='hidden md:flex items-start gap-5 font-medium text-[17px]'>
            <NavLink>
                <li className='py-1'>Home</li>
                
            </NavLink>
            <NavLink>
                <li className='py-1'>All Doctors</li>
                
                
            </NavLink>
            <NavLink>
                <li className='py-1'>About</li>
                
            </NavLink>
            <NavLink>
                <li className='py-1'>Contact</li>
             
            </NavLink>
        </ul>
        <div>
            <button>Create Account</button>
        </div>
    </div>
  )
}

export default Navbar;