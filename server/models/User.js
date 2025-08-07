const mongoose=require("mongoose");

const userSchema=mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            trim:true
        },
        lastName:{
            type:String,
            required:false,
            trim:true
        },
        email:{
            type:String,
            required:true,
            trim:true
        },
        password:{
            type:String,
            required:true

        },
        refreshToken:{
            type:String
        },

        itemsToSell:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Item"

        }],
        itemsBought:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Item"
            }
        ]

    }
)


module.exports= mongoose.model("User",userSchema);