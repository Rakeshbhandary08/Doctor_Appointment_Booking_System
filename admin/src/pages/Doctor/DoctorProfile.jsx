import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, setProfileData, profileData, getProfileData ,backendUrl} =
    useContext(DoctorContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile=async()=>{
     try{
       const updateData={
         address:profileData.address,
         fees:profileData.fees,
         available:profileData.available
       }

       const {data}=await axios.post(backendUrl + "/api/doctor/update-profile",updateData,{headers:{dToken}})

       if(data.success){
         toast.success(data.message || "Profile Updated successfully")
         getProfileData()
         setIsEdit(false)
       }
       else{
         toast.error(data.message || "Something is wrong")
       }
     }
     catch(error){
      toast.error(error.message || "Something is wrong")
     }
  }

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  return (
    profileData && (
      <div>
        <div className="flex max-sm:flex-col gap-4 m-2 sm:m-5 overflow-hidden">
          <div>
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
              src={profileData.image}
            />
          </div>
          <div className=" flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            {/*  DOCTOR INFO -> NAME,DEGREE,EXPERIENCE */}
            <p className="flex items-center gap-2 text-2xl sm:text-3xl text-gray-700 font-medium">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profileData.speciality} - {profileData.degree}
              </p>
              <button className="border border-gray-400 rounded-full py-0.5 px-2 text-xs font-medium">
                {profileData.experience}
              </button>
            </div>

            {/* DOCTOR ABOUT */}
            <div>
              <p className="flex items-center gap-1 font-medium text-neutral-800 mt-3">
                About:
              </p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1 ">
                {profileData.about}
              </p>
            </div>
            <p className="text-gray-600 font-medium mt-4">
              Appointment fee :
              <span className={`text-gray-800 ${!isEdit && "bg-gray-100"} p-1 px-2 rounded-md`}>
                ₹
                {isEdit ? (
                  <input
                    className="bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-sm focus:outline-primary w-28 ml-1"
                    type="number"
                    value={profileData.fees}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>

            <div className="flex gap-2 py-4">
              <p className="text-gray-600 font-medium ">Address:</p>
              <p className="text-sm text-neutral-800 flex flex-col">
                <span>{isEdit ? (<input className="bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-sm focus:outline-primary w-full" type="text" value={profileData.address.line1} onChange={(e)=>setProfileData(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))}/>):profileData.address.line1} </span ><br className={`${isEdit ? "hidden" :"block"}`}/>
                <span className="-mt-2">{isEdit ? (<input className="bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-sm focus:outline-primary w-full  mt-3" type="text" value={profileData.address.line2} onChange={(e)=>setProfileData(prev=>({...prev,address:{...prev.address,line2:e.target.value}}))}/>):profileData.address.line2} </span>
              </p>
            </div>

            <div className="flex items-center gap-1 pt-2">
              <input onChange={()=>setProfileData(prev=>({...prev,available:!prev.available}))} type="checkbox" disabled={!isEdit} id="" checked={profileData.available} />
              <label htmlFor="">Available</label>
            </div>
            
            {
              isEdit ? <button
              onClick={() => updateProfile()}
              className="border border-primary px-6 py-1 text-base rounded-full cursor-pointer mt-5 hover:bg-primary hover:text-white transition-all duration-500"
            >
              Save
            </button> :
            <button
              onClick={() => setIsEdit(true)}
              className="border border-primary px-6 py-1 text-base rounded-full cursor-pointer mt-5 hover:bg-primary hover:text-white transition-all duration-500"
            >
              Edit
            </button>
            
              }

          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
