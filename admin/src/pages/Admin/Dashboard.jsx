import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets.js";

const Dashboard = () => {
  const { aToken, getDashData, dashData, clickCancel, formatDate } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="m-5">
        <div className=" flex flex-wrap gap-3">
          <div className="bg-white flex items-center gap-2 p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-103 transition-all duration-500">
            <img className="w-14" src={assets.doctor_icon} />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className="text-gray-400">Doctors</p>
            </div>
          </div>
          <div className="bg-white flex items-center gap-2 p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-103 transition-all duration-500">
            <img className="w-14" src={assets.appointments_icon} />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>
          <div className="bg-white flex items-center gap-2 p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-103 transition-all duration-500">
            <img className="w-14" src={assets.patients_icon} />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-white ">
          <div className=" flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border-b border-gray-400">
            <img src={assets.list_icon} />
            <p className="font-semibold">Latest Bookings</p>
          </div>
          <div className="rounded-t">
            {dashData.latestAppointments.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex px-6 py-3 gap-3 hover:bg-gray-100"
                >
                  <img
                    className="w-10 h-10 object-cover rounded-full"
                    src={item.docData.image}
                  />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-800 font-semibold">
                      {item.docData.name}
                    </p>
                    <p className="text-gray-500 font-medium ">
                      {formatDate(item.slotDate)} {", "} {item.slotTime}
                    </p>
                  </div>
                  {item.cancelled ? (
                    <p className="text-red-400 font-medium">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className=" text-green-500/90 font-medium">Completed</p>
                  ) : (
                    <img
                      onClick={() => clickCancel(item._id)}
                      className="w-10 cursor-pointer"
                      src={assets.cancel_icon}
                      alt=""
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
