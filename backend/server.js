import "dotenv/config";
import express from "express"

import cors from "cors"

import connectDB from "./config/mongodb.js";
import adminRouter from "./routes/adminRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import doctorRouter from "./routes/doctorRoute.js";
import userRouter from "./routes/userRoute.js";

// App config
const app=express()   //instinct of express
const port=process.env.PORT || 4000;
connectDB();
connectCloudinary();



//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const corsOptions={
  origin:["http://localhost:5174","http://localhost:5173", "https://prescripto-frontend-3r3q.onrender.com",],
  methods:['GET','POST','PUT','PATCH','DELETE'],
  exposedHeaders: ['x-rtb-fingerprint-id', 'request-id'],
  credentials:true
}

 app.use(cors(corsOptions))  //integration of backend & frontend


app.get("/",(req,res)=>res.send("Hello world"))

//api endpoints for admin Panel
app.use("/api/admin",adminRouter)   //localhost:4000/api/admin

//API endpoints for DOCTORS
app.use("/api/doctor",doctorRouter)

//API ENDPOINTS FOR USERS
app.use("/api/user",userRouter)

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ SERVER IS ALIVE AND LISTENING ON PORTttt ${port}`);
});