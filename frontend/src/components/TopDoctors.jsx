import React from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
    const navigate=useNavigate();
    const {doctors}=useContext(AppContext);

  return (
    <div className="  flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="text-sm sm:w-1/3 text-center">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className=" w-full grid grid-cols-auto pt-4 gap-4 gap-y-6 px-3 sm:px-0 ">
        {doctors.slice(0, 10).map((item) => {
          return(
            <div onClick={()=>{navigate(`/appointment/${item._id}`);scroll(0,0)}} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-8px] transition-all duration-500" key={item._id} >
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
        })}
      </div>
      <button onClick={()=>{navigate("/doctors");scroll(0,0)}} className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-12 font-medium hover:scale-104 hover:bg-blue-200 transition-all duration-500 ease-out transform-gpu cursor-pointer">more</button>
    </div>
  );
};

export default TopDoctors;
