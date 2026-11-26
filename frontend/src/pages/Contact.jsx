import React from "react";
import { assets } from "../assets/assets";
import { HousePlus } from 'lucide-react';
import { HeartHandshake } from 'lucide-react';

const Contact = () => {
  return (
    <div className="  flex flex-col gap-8 py-8">
      <p className="text-2xl text-center text-gray-600 ">
        CONTACT <span className="font-semibold text-gray-800">US</span>
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-7" >
        <img className="w-full max-w-[360px]" src={assets.contact_image}></img>
        <div className="flex flex-col gap-5  py-5">
          <p className="flex items-center gap-1 text-lg font-semibold text-gray-700  "><HousePlus/> OUR OFFICE</p>
          <p className="text-gray-500 -mt-3">
            00000 Cybercity <br /> Suite 000, Gurugram, India
          </p>
          <p className="text-gray-500 -mt-2">Tel: (000) 000-0000 <br/> Email: health@prescripto.com</p>
          <p className="flex gap-1 items-center text-lg font-semibold text-gray-700 mt-3"> <HeartHandshake/> CAREERS AT PRESCRIPTO</p>
          <p className="text-gray-500 cursor-pointer -mt-3"><span className="underline underline-offset-2 text-gray-500/80">Learn more</span> about our teams and job openings.</p>
          <button className="mt-1 border border-gray-800 py-3 self-center md:self-start px-6 hover:bg-primary hover:text-white hover:border-gray-100 transition-all duration-500 cursor-pointer" >Explore more</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
