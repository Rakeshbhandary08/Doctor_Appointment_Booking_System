import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ docId, speciality }) => {
  const navigate=useNavigate()
  const { doctors } = useContext(AppContext);
  const [docArr, setDocArr] = useState([]);

  //function logic that picks all the doctor according to speciality
  function specialDoc() {
    setDocArr([]);
    let newArr = doctors.filter(
      (item) => item.speciality === speciality && item._id !== docId,
    );
    setDocArr(newArr);
  }

  useEffect(() => {
    specialDoc();
  }, [speciality, docId]);

  console.log(docId, speciality);
  return (
    <div>
      <p className="text-3xl font-medium text-center mt-20">Related Doctors</p>
      <p className="text-center text-sm sm:min-w-1/3 mt-5  text-gray-800">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-auto gap-4  px-3 sm:px-0 gap-y-6 mt-8">
        {docArr.map((item) => {
          return (
            <div
              onClick={() => {navigate(`/appointment/${item._id}`);scroll(0,0)}}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-8px] transition-all duration-500"
              key={item._id}
            >
              <img className="bg-blue-50" src={item.image}></img>
              <div className="p-4">
                <div className={`text-sm ${item.available ? "text-green-500 " : "text-gray-500 font-medium"} text-center flex items-center gap-2`}>
                        <span className="relative h-2 w-2 flex">
                            <span className={`${item.available ? "animate-ping absolute inline-flex h-full w-full bg-green-500 rounded-full opacity-80" : ""}`}></span>
                            <span className={`h-2 w-2 ${item.available ?"bg-green-500" : "bg-gray-500"} rounded-full relative inline-flex`}></span>
                        </span>
                        <p>{item.available ? "Available" : "Unavailable"}</p>
                    </div>
                <p className="text-gray-900 text-lg font-medium ">
                  {item.name}
                </p>
                <p className="text-sm text-gray-600">{item.speciality}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedDoctors;
