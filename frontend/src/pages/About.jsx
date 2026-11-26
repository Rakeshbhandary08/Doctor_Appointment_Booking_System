import React from "react";
import { assets } from "../assets/assets";
import { UserStar } from 'lucide-react';
import { Waypoints } from 'lucide-react';
import { ListCheck } from 'lucide-react';

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center  text-gray-500 pt-5">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
      <div className="flex my-10 flex-col md:flex-row gap-10">
        <img src={assets.about_image} className="w-full max-w-[360px]"></img>
        <div className="flex flex-col text-sm text-gray-600 gap-5 justify-center md:w-2/4 p-1">
          <p>
            Welcome to Prescripto, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At Prescripto, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p>
            Prescripto is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform , integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Prescripto is here to support you every step of the
            way.
          </p>
          <b className="text-gray-800 text-xl mt-1">Our Vision</b>
          <p>
            Our vision at Prescripto is to create a seamless healthcare
            experience for every user. We aim to bridge the gap between patients
            and healthcare providers, making it easier for you to access the
            care you need, when you need it.
          </p>
        </div>
      </div>

      <div>
        <div className="text-xl my-4">
        <p className=" text-gray-800">WHY <span className="text-gray-700 font-semibold">CHOOSE US</span></p>
        </div>
        <div className="flex flex-col md:flex-row ">
          <div className="border  border-gray-300 px-10 md:px-16 py-8 md:py-16 flex flex-col text-[15px] hover:bg-primary hover:text-white transition-all duration-500 text-gray-600 cursor-pointer gap-3">
            <p className="ttext-md font-bold tracking-wider flex items-center gap-1"> <ListCheck/> EFFICIENCY:</p>
            <p className="text-sm">Streamlined appointment scheduling that fits into your busy lifestyle.</p>
          </div> 
          <div className="border  border-gray-300 px-10 md:px-16 py-8 md:py-16 flex flex-col text-[15px] hover:bg-primary hover:text-white transition-all duration-500 text-gray-600 cursor-pointer gap-3">
            <p className=" font-bold tracking-wide flex gap-1"> <Waypoints/> CONVENIENCE:</p>
            <p className="text-sm">Access to a network of trusted healthcare professionals in your are</p>
          </div>
          <div className="border border-gray-300 px-10 md:px-16 py-8 md:py-16 flex flex-col text-[15px] hover:bg-primary hover:text-white transition-all duration-500 text-gray-600 cursor-pointer gap-3">
            <p className="flex items-center gap-1 font-bold tracking-wide"> <UserStar/> PERSONALIZATION:</p>
            <p className="text-sm">Tailored recommendations and reminders to help you stay on top of your health.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
