import express from "express"

import cors from "cors"

import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// App config
const app=express()   //instinct of express
const port=process.env.PORT || 4000;
connectDB();
connectCloudinary();


//Middlewares
app.use(express.json())
app.use(cors())  //integration of backend & frontend

//api endpoints
app.get("/",(req,res)=>{
    res.send("API WORKING")
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})