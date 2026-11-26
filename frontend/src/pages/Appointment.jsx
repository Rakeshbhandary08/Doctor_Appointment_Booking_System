import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { ClipboardClock } from "lucide-react";
import { MousePointerClick } from 'lucide-react';
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const navigate=useNavigate()
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  let { docId } = useParams();
  const { currencySymbol, doctors,backendUrl,getDoctorsData,token } = useContext(AppContext);
  // console.log(docId);

  let [docInfo, setDocInfo] = useState();

  //Here we go
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0); //maintain the index
  const [timeIndex, setTimeIndex] = useState(0);

  const filterArray = () => {
    const newData = doctors.find((item) => item._id === docId);
    setDocInfo(newData);
    console.log(docInfo);
  };

  useEffect(() => {
    filterArray();
    console.log(docInfo);
  }, [docId, doctors]);

  //------------- SLOT BOOKING LOGIC ---------------------------------
  const getAvailableSlots = async () => {
    setDocSlots([]);

    //getting current date
    const today = new Date(); //constant date because set function changes the original object also
    //Fri Jul 17 2026 18:21:07 GMT+0530 (India Standard Time)

    for (let i = 0; i < 7; i++) {
      //getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      //setting end time of the date with index
      //Fri Jul 17 2026 18:21:07 GMT+0530 (India Standard Time)
      let endTime = new Date();

      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0); //raat 9 baje tak appointment kar sakte hai

      //setting hours  subah 10 baje se 9 baje tak appointment hoti h (2 variable 00:00(hh:MM)
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10,
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        //future ke liye appoinmet
        currentDate.setHours(10); //subah 10 baje se start
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        //Write the Logic and Don't show the aleady booked SLOT
        let day=currentDate.getDate();
        let month=currentDate.getMonth()+1;
        let year=currentDate.getFullYear();

        const slotDate=day + "-" + month + "-" + year;
        const slotTime=formattedTime;

        const isSlotAvailable=docInfo?.slots_booked[slotDate] && docInfo?.slots_booked[slotDate]?.includes(slotTime) ? false : true;

        if(isSlotAvailable){
           //add slot to array
          timeSlots.push({
          dateTime: new Date(currentDate),
          time: formattedTime,
        });

        }
        //increment current time by 30 mins
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  //CREATE THE FUNCTION FOR BOOKING
  const bookAppointment=async ()=>{
     if(!token){
       toast.info("Please sign in first.")
       return navigate("/login")
     }

     try{
      // Guard check if selected day has available slots
      if (!docSlots[slotIndex] || !docSlots[slotIndex].length) {
        return toast.error("No slots available for this day");
      }
       const date=docSlots[slotIndex][0].dateTime
       let day=date.getDate()
       let month=date.getMonth() + 1
       let year=date.getFullYear()

       const slotDate= day + "-" + month + "-" + year;
       const slotTime=docSlots[slotIndex][timeIndex].time;
    
       
       const {data}=await axios.post(backendUrl + "/api/user/book-appointment",{docId,slotTime,slotDate},{headers:{token}})

       if(data.success){
         toast.success(data.message);
         getDoctorsData();
         navigate("/my-appointments")
       }
       else{
         toast.error(data.message)
       }
       
     }
     catch(error){
      console.log(error);
      toast.error(error?.response?.data?.message)
     }
     
    
  }

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  useEffect(() => {
    console.log("slotIndex changed:", slotIndex);
  }, [slotIndex]);



  return (
    docInfo && (
      <div>
        {/* --------- Doctore Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
            />
          </div>

          <div className="border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 my-[-80px] sm:my-0  flex-1">
            {" "}
            {/* Details */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-800">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon}></img>
            </p>
            <div className="flex gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full opacity-80">
                {docInfo.experience}
              </button>
            </div>
            {/* ---------- Doctor ABout */}
            <div>
              <p className="flex gap-1 items-center text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} />
              </p>
              <p className="text-gray-600 max-w-[750px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="bg-blue-50 max-w-[220px] px-2 py-1 rounded-lg text-lg font-medium mt-3 sm:mt-2 text-gray-700 cursor-pointer hover:text-gray-800 transition-colors duration-300">
              Appointment fee:{" "}
              <span className="text-base font-bold">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* ------------ SLOT BOOKING LOGIC INTO CODE --------------------- */}
        <div className=" sm:ml-72 sm:pl-4 mt-28 sm:mt-7 text-gray-700">
          <p className="flex gap-1 text-md font-medium text-gray-700"> <ClipboardClock className="w-5"/>Book Your Slot:</p>
          <div className="flex gap-3 items-center w-full mt-4 overflow-x-scroll">
            {docSlots.length &&
              docSlots.map((item, index) => {
                return (
                  <div
                    onClick={() => {setSlotIndex(index);setTimeIndex(0)}}
                    key={index}
                    className={`text-center py-6 rounded-full cursor-pointer  min-w-16 ${slotIndex === index ? "bg-primary text-white" : "border border-gray-200"} `}
                  >
                    <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                    <p>{item[0] && item[0].dateTime.getDate()}</p>
                  </div>
                );
              })}
          </div>
          <div className="flex items-center w-full gap-3 mt-4 overflow-x-scroll">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => {
                return (
                  <p
                    onClick={() => setTimeIndex(index)}
                    key={index}
                    className={`text-sm font-light flex-shrink-0 px-5 py-2 border rounded-full cursor-pointer ${timeIndex === index ? "bg-primary text-white" : "border border-gray-200"} `}
                  >
                    {item.time.toUpperCase()}
                  </p>
                );
              })}
          </div>
          <div className='flex justify-center sm:justify-normal mt-3 mb-10 '>
          <button onClick={()=>{bookAppointment();scroll(0,0)}} className="flex gap-1 items-center bg-primary  px-7 py-2 text-white rounded mt-7 transition-transform hover:scale-102 duration-500 transform-gpu">
            Book an Appointment <MousePointerClick className="w-6"/>
          </button>

          </div>
        </div>

        {/* -------- RELATED DOCTORS  */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
      
      </div>
    )
  );
};

export default Appointment;
