const mongoose = require("mongoose");

const optSchema = mongoose.Schema(
    {
        email:{
            type:String,
            required:true
        },
        otp:{
            type:String,
        },
        optExpires:{
            type:Date
        }
    }
);

module.exports=mongoose.model("OtpModel",optSchema);
