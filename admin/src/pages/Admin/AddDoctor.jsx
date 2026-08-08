import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import {AdminContext} from "../../context/AdminContext"
import axios from 'axios';
import { toast } from 'react-toastify';
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";



const AddDoctor = () => {

  const [docImg,setDocImg]=useState(false);
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [experience,setExperience]=useState('1 Year');
  const [fees,setFees]=useState("");
  const [about,setAbout]=useState("");
  const [speciality,setSpeciality]=useState('General physician');
  const [degree,setDegree]=useState("");
  const [address1,setAddress1]=useState("");
  const [address2,setAddress2]=useState("");

  const [eyeShow,setEyeShow]=useState(false)

  const {backendUrl,aToken}=useContext(AdminContext);


  //create a function for handling the submission
  const onSubmitHandler=async(event)=>{
     event.preventDefault();

     try{
      if(!docImg){
        return toast.error('Please Upload the Image')
      }

      //create a formData
      const formData=new FormData();

      formData.append('image',docImg);
      formData.append('name',name);
      formData.append('email',email);
      formData.append('password',password);
      formData.append('address',JSON.stringify({line1:address1,line2:address2}));
      formData.append('experience',experience);
      formData.append('about',about);
      formData.append('degree',degree);
      formData.append('fees',Number(fees))
      formData.append('speciality',speciality)

      //let's console the form data

      formData.forEach((value,key)=>console.log(`${key} : ${value}`))


       const {data}=await axios.post(backendUrl + "/api/admin/add-doctor",formData,{headers:{aToken}})

       if(data.success){
         toast.success(data.message)
         //find the data empty to add another doctor
         setDocImg(false);
         setName('');
         setEmail('');
         setPassword('');
         setAbout('');
         setDegree('');
         setAddress1('');
         setAddress2('');
         setFees('');
         setExperience('1 Year');
         setSpeciality('General physician');
       }
       else{
        toast.error(data.message)
       }
     }
     catch(error){
       toast.error(error.message)
       console.log(error);
     }

  }

  //create a function for image validation
  function handleImageChange(e){
    const file=e.target.files[0];
    //Processing and validation of the image file
    if(!file) return;
    if(!file.type.startsWith("image/")){
      toast.error("Please Upload a valid Image");
      return;
    }
    if(file.size > 5 * 1024 * 1024){
     toast.error("Image size should be under 5MB")
      return;
    }

    setDocImg(file)
  }



  return (
    <form onSubmit={onSubmitHandler} className=' w-full m-5'>
      <p className='mb-3 text-lg font-medium '>Add Doctors</p>
      
      <div className='bg-white px-8 py-8 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll  '>
        <div className=' flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor='doc-img' >
             <img className='w-16 h-16 object-cover bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}/>
          </label>
          <input onChange={handleImageChange} accept='image/*' type='file' id="doc-img" hidden/>
          <p>Upload Doctor <br/> Picture</p>
        </div>

        {/* ------ PROPER A FORM APPLICATION */}

        <div className=' flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          {/*  LEFt SIDE */}
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className=' flex-1 flex flex-col gap-1'> 
              <p>Doctor's Name</p>
              <input onChange={(e)=>setName(e.target.value)} value={name} className='border rounded px-3 py-2'  type="text" placeholder='Name' required/>
            </div>

            <div  className=' flex-1 flex flex-col gap-1'>
              <p>Email </p>
              <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required/>
            </div>

            <div  className=' flex-1 flex flex-col gap-1'>
              <p>Password</p>
              <div className='relative'>
              <input onChange={(e)=>setPassword(e.target.value)} value={password} className='w-full border rounded px-3 py-2' type={eyeShow ? "text" : "password"} placeholder='Password' required/>
               {eyeShow ?<EyeOff onClick={()=>setEyeShow(!eyeShow)} className='absolute right-3 -translate-y-1/2 top-1/2 opacity-75 w-5 cursor-pointer' /> : <Eye onClick={()=>setEyeShow(!eyeShow)} className='absolute right-3 -translate-y-1/2 top-1/2 opacity-75 w-5 cursor-pointer'/>}
              </div>
              
            </div>

            <div className=' flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select onChange={(e)=>setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2' name="" >
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10 Years">10+ Years</option>
              </select>
            </div>

            <div  className='flex-1 flex flex-col gap-1'>
              <p>Fees (₹)</p>
              <input onChange={(e)=>setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Fees' required/>
            </div>
          </div>

          {/*  RIGHT SIDE */}
          <div className=' w-full lg:flex-1 flex flex-col gap-4' >
            <div className=' flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2'>
                <option value="General physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            
            <div className=' flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input onChange={(e)=>setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Education' required/>
            </div>

            <div className=' flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required/>
              <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required/>
            </div>
          </div>
        </div>

        {/*  MIDDLE ONE */}
        
        <div>
              <p className='mt-4 mb-2 '>About Doctor</p>
              <textarea onChange={(e)=>setAbout(e.target.value)} value={about} className=' w-full px-4 pt-2 border rounded' placeholder='Write about doctor' rows={5}/>
        </div>

        <button type='submit' className='rounded-full px-10 py-3 mt-4 text-white bg-primary cursor-pointer'>Add Doctor</button>

      </div>
    </form>
  )
}

export default AddDoctor