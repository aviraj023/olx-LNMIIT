const express = require("express");
const mongoose=require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const cors=require("cors");
const app=express();
const userRouter = require("./routes/User");
const itemRouter = require("./routes/Item");
require("dotenv").config();

app.use(express.json());
app.use(express.json());

app.use(cookieParser());


app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp"

}));

app.use(cors({
    origin: 'http://localhost:5173',  // Allow this origin
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));;



cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET

});



const PORT = process.env.PORT || 5000;
const MONGODB_URL= process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL);

app.use("/api/v1/auth",userRouter);
app.use("/api/v1/item",itemRouter);





app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});








