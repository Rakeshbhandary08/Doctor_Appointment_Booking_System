import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import {AppContext} from "../context/AppContext"


const Doctors = () => {
    const {doctors}=useContext(AppContext);
    const [showfilter,setShowFilter]=useState(false);
    const navigate=useNavigate()
    const {speciality}=useParams()
   
    
   //for maintaint the doctor section
   const [filtetDoc,setFilterDoc]=useState([]);
 

   const applyFilter=()=>{
     if(speciality){
       setFilterDoc(doctors.filter((doc)=>doc.speciality === speciality))
     }
     else{
      setFilterDoc(doctors)
     }
   }


   useEffect(()=>{
    applyFilter()
   },[doctors,speciality])



   console.log(speciality)

  return (
    <div>
      <p className='text-gray-600 '>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row  items-start gap-5 mt-5'>
        <button className={`cursor-pointer py-1 px-3  rounded border transition-all text-base sm:hidden ${showfilter ? "bg-primary text-white" :""}`} onClick={()=>setShowFilter(prev=>!prev)}>Filter</button>
        <div className={`flex-col  gap-4  text-gray-600 text-sm ${showfilter ? "flex":"hidden sm:flex"}`}>
          <p onClick={()=>speciality === "General physician" ? navigate("/doctors") : navigate("/doctors/General physician")} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""}`}>General physician</p>
          <p onClick={()=>speciality === "Gynecologist" ? navigate("/doctors") : navigate("/doctors/Gynecologist")} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}>Gynecologist</p>
          <p onClick={()=>speciality === "Dermatologist" ?  navigate("/doctors"): navigate("/doctors/Dermatologist")} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}>Dermatologist</p>
          <p onClick={()=>speciality === "Pediatrician" ? navigate("/doctors"): navigate("/doctors/Pediatrician")} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatrician" ? "bg-indigo-100 text-black" : ""}`}>Pediatrician</p>
          <p onClick={()=>speciality === "Neurologist" ?  navigate("/doctors") : navigate("/doctors/Neurologist") } className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}>Neurologist</p>
          <p onClick={()=>speciality === "Gastroenterologist" ?  navigate("/doctors") :navigate("/doctors/Gastroenterologist")}  className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>Gastroenterologist</p>
        </div>

        <div className='w-full grid grid-cols-auto gap-4  px-3 sm:px-0 gap-y-6'>
          {
            filtetDoc.map((item)=>{
              return(
                <div onClick={()=>navigate(`/appointment/${item._id}`)} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-8px] transition-all duration-500" key={item._id} >
                <img className="bg-blue-50" src={item.image}></img>
                <div className="p-4">
                    <div className={`text-sm ${item.available ? "text-green-500 " : "text-gray-500 font-medium"} text-center flex items-center gap-2`}>
                        <span className="relative h-2 w-2 flex">
                            <span className={`${item.available ? "animate-ping absolute inline-flex h-full w-full bg-green-500 rounded-full opacity-80" : ""}`}></span>
                            <span className={`h-2 w-2 ${item.available ?"bg-green-500" : "bg-gray-500"} rounded-full relative inline-flex`}></span>
                        </span>
                        <p>{item.available ? "Available" : "Unavailable"}</p>
                    </div>
                    <p className="text-gray-900 text-lg font-medium ">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.speciality}</p>
                </div>
            </div>
              )
            })
          }
        </div>

      </div>
    </div>

  )
}

export default Doctors