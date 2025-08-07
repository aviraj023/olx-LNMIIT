const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    description:{
        type:String,
    },

    items:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item"
    }]
});

module.exports=mongoose.model("Category",categorySchema);