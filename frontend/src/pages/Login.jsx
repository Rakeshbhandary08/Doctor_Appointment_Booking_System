import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {Eye} from 'lucide-react'
import { EyeOff } from 'lucide-react';

const Login = () => {
  const navigate=useNavigate()
  const [state,setState]=useState('Sign Up');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [passShow,setPassShow]=useState(false)


  const {token,setToken,backendUrl}=useContext(AppContext);

  const onSubmitHandler = async(event) =>{
    event.preventDefault();

    try{
      if(state === "Sign Up"){
      const {data}=await axios.post(backendUrl+"/api/user/register",{name,email,password})
      //IF we succesfully register the user
       if(data.success){
        localStorage.setItem('token',data.token)
        setToken(data.token)
        toast.success(data.message);
        
       }
       else{
         toast.error(data.message)
      }
      }
      else{
        const {data}=await axios.post(backendUrl+"/api/user/login",{email,password})
        
        //IF login Successfully done
        if(data.success){
          localStorage.setItem("token",data.token);
          setToken(data.token);
          toast.success(data.message);
          
        }
        else{
          toast.error(data.message || "Sorry for the inconvience")
        }

      }
      
      
    }
    catch(error){
      console.log(error);
      toast.error(error.response?.data?.message || "Sorry for the inconvience")
    }
  }
  

  //Write the logic if User LOGIN OR SIGNUP -> REMOVE LOGIN PAGE
  useEffect(()=>{
   if(token){
    toast.success("You are already Registered");
    navigate("/")
   }
  
  },[token])
  

  return (
    <form onSubmit={onSubmitHandler} className=' min-h-[80vh]  flex items-center'>
      <ToastContainer   position="top-center" className="text-sm sm:text-base" toastClassName="mx-2 sm:mx-0"/>
        <div className='flex flex-col  items-start gap-3 m-auto  p-8 min-w-[320px] sm:min-w-96 border border-zinc-300 rounded-xl text-zinc-600 text-sm shadow-lg '>
          <p className='text-2xl font-semibold'>{state === "Sign Up" ? "Create Account" :"Login"}</p>
          <p>Please {state === "Sign Up" ? "sign up" :"log in"} to book appointment</p>
          
          {state === "Sign Up" && <div className=' w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 p-2 mt-1 w-full rounded' type="text" onChange={(e)=>setName(e.target.value)} value={name} required/>
          </div>}
          <div className=' w-full'>
            <p>Email</p>
            <input className='border border-zinc-300 p-2 mt-1 w-full rounded' type="email" onChange={(e)=>setEmail(e.target.value)} value={email} required/>
          </div>
          <div className='w-full'>
            <p>Password</p>
            <div className='relative'>
            <input className='border border-zinc-300 p-2 mt-1 w-full rounded' type={passShow ? "text" : "password"} onChange={(e)=>setPassword(e.target.value)} value={password} required/>
            {passShow ? <EyeOff onClick={()=>setPassShow(prev => !prev)} className='absolute w-5 right-3 top-[23px] -translate-y-1/2 opacity-70 cursor-pointer'/> : <Eye onClick={()=>setPassShow(prev => !prev)} className='absolute w-5 right-3 top-[23px] -translate-y-1/2 opacity-70 cursor-pointer'/>}
            </div>
          </div>
          <button type='submit' className='bg-primary cursor-pointer text-white w-full py-3 mt-2 font-medium rounded-md'>{state === "Sign Up" ? "Create Account" : "Login"}</button>
          {
            state === "Sign Up" ?
             <p>Already have an account? <span  onClick={()=>setState("Login")} className='text-primary underline underline-offset-2 cursor-pointer font-medium'>Login here</span></p>:
             <p>Create a new Account? <span onClick={()=>setState("Sign Up")} className='text-primary underline underline-offset-2 cursor-pointer font-medium'>Click here</span></p>
          }
        </div>
    </form>
  )
}

export default Login