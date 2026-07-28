import { createContext } from "react";

export const DoctorContext=createContext();

const DoctorContextProvider=(props)=>{
    let value={

    }
    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;