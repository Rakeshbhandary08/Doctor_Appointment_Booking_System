import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const {aToken,setAToken}=useContext(AdminContext)

    const navigate=useNavigate()

    //Logout function logic
    const logout=()=>{
        aToken && setAToken("");
        aToken && localStorage.removeItem('aToken')
        navigate("/")
    }
    
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b border-gray-400 bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img onClick={()=>{navigate("/");scroll(0,0)}} className="w-36 sm:w-40 cursor-pointer " src={assets.admin_logo} />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 ">{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick={logout} className="cursor-pointer bg-primary text-white text-xs sm:text-base px-6 sm:px-10 py-3 sm:py-2 rounded-full font-medium">Logout</button>
    </div>
  );
};

export default Navbar;
