import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { UserLock } from "lucide-react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate=useNavigate()
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showEye, setShowEye] = useState(false);

  const { setAToken, backendUrl ,getDashData:getAdminDashData} = useContext(AdminContext); //setAToken=""
  const {setDToken,dToken,getDashData:getDoctorDashData}=useContext(DoctorContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

  

    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.message);
          console.log(data.message);
          setAToken(data.message);
          navigate("/admin-dashboard")
          getAdminDashDat()
        } else {
          toast.error(data?.message || "Something went wrong");
        }
      } else {
         //HIT DOCTOR LOGIN API
         try{
           const {data}=await axios.post(backendUrl + "/api/doctor/login",{email,password})

           if(data.success){
             localStorage.setItem('dToken',data.token)
             toast.success(data.message)
             setDToken(data.token)
             console.log(data.token)
             navigate("/doctor-dashboard")
             getDoctorDashDat()
             
           }
         }
         catch(error){
           console.log(error)
           toast.error(data?.message || "Something went wrong");
         }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh]  flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start min-w-[340px] p-8 sm:min-w-96 text-[#5E5E5E] rounded-xl border border-gray-400/30 text-sm sm:text-base shadow-lg">
        <p className="text-2xl font-semibold m-auto flex items-center gap-1">
          <span className="text-primary"> {state}</span> Login <UserLock />
        </p>
        <div className=" w-full ">
          <p className="font-medium mb-1">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            className="border border-[#DADADA] rounded w-full p-2 mt-1 outline-none"
          />
        </div>
        <div className=" w-full ">
          <p className=" font-medium mb-1">Password</p>
          <div className="flex items-center border border-[#DADADA]">
            <div className="w-full relative"> 
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showEye === true ? "text" : "password"}
              required
              className=" rounded w-full p-2 mt-1 outline-none"
            ></input>
            {showEye === true ? (
              <EyeOff className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer w-6 opacity-80"  onClick={() => setShowEye(!showEye)}/>) : (
              <Eye className="absolute  top-1/2 right-3 -translate-y-1/2 w-6 cursor-pointer opacity-80" onClick={() => setShowEye(!showEye)}
              />
            )}
            </div>
            
          </div>
        </div>
        <button className="bg-primary text-white w-full py-[10px] rounded-md text-base cursor-pointer mt-2 ">
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login?
            <span
              onClick={() => setState("Doctor")}
              className="cursor-pointer text-primary underline underline-offset-2 ml-1 font-medium"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?
            <span
              onClick={() => setState("Admin")}
              className="cursor-pointer text-primary underline underline-offset-2 ml-1 font-medium"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
