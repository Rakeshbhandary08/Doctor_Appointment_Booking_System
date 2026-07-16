import React from 'react'
import { useParams } from 'react-router-dom';

const Appointment = () => {
  let {output}=useParams();
  console.log(output)
  return (
    
    <div>Appointment</div>
  )
}

export default Appointment;