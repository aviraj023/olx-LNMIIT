const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({

    title:{
        type:String,
        required:true,
    },

    description:{
        type:String,
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
       // required:true
    },

    price:{
        type:Number,
        required:true
    },

    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
       // required:true
    },

    image:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:["Available","Sold","Reserved"]
    },

    views:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports=mongoose.model("Item",itemSchema);