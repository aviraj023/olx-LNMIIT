const User=require("../models/User")
const bcrypt = require("bcrypt")
const generateOtp=require("../utils/otpGenerator")
const sendMail=require("../utils/mailSender");
const OtpModel=require("../models/OtpModel");
const jwt = require("jsonwebtoken");

async function signup(req,res)
{
    try{
    
    
    const {firstName,lastName,email,password,confirmPassword}=req.body;

    
    if(!firstName || !email || !password || !confirmPassword)
    {
        res.status(403).send(
            {
                success:false,
                msg:"required all fields"
            }
        );

        return;
    }

    if(!(password===confirmPassword))
    {
        res.status(403).send(
            {
                success:false,
                msg:"Password and Confirm Password does not match"
            }
        );
        return;
    }

    const exists = await User.findOne({email});

    if(exists)
    {
        res.status(403).send(
            {
                msg:"User already registered"
            }
            
        )
        return;
    }

    const otp=generateOtp();
    const otpExpires = Date.now() + 5*60*1000;  //5 minutes from now

    var user = await OtpModel.findOne({email});

    if(!user) user = new OtpModel({email});
   
    user.otp=otp;
    user.otpExpires=otpExpires;

    await user.save();

    await sendMail(email,otp);

    console.log("otp sent over mail");

    res.status(200).json(
        {
            msg:"OTP sent over mail"
        }
    );
    return;
}
catch(e)
{
    res.status(403).json({
        success:false,
        msg:"Failed to send Otp"
    })
    console.log("got an error: "+e);
}
    
}

async function verifyOtp(req,res) 
{
    const {firstName,lastName,email,password,otp}=req.body;

    const otpuser= await OtpModel.findOne({email});

    if(!otpuser)
    {
        res.status(403).json(
            {
                msg:"User not found"
            }
        );
        return;
    }

    if(otpuser.otp != otp || otpuser.otpExpires < Date.now())
    {
        res.status(403).json(
            {
                msg:"Invalid Otp"
            }
        );
        return;
    }

    const exists = await User.findOne({email});

    if(exists)
    {
        res.status(403).send(
            {
                msg:"User already registered"
            }
            
        )
        return;
    }

    const hashedPassword = await bcrypt.hash(password,10);

    

    const user = await User.create(
        {
            firstName,
            lastName,
            email,
            password:hashedPassword
        }
    )

    

    res.status(200).send(
        {
            msg:"User registered successfully"
        }
    );
    return;

}

async function login(req,res)
{
    const {email,password} = req.body;

    if(!email || !password)
    {
        res.status(403).json(
            {
                msg:"All fields are must."
            }
        );
        return;
    }

    const user = await User.findOne({email});

    if(!user)
    {
        res.status(403).json(
            {
                msg:"User not found Please Signup first"
            }
        );
        return;
    }

    const passwordOk = await bcrypt.compare(password,user.password);

    if(!passwordOk)
    {
        res.status(403).json(
            {
                msg:"Incorrect Password"
            }
        );
        return;
    }

    const payload = {
        email:user.email,
        id:user._id,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken=generateRefreshToken(payload);

    user.refreshToken=refreshToken;

    await user.save();

    res.cookie("refreshToken",refreshToken,{
       // httpOnly:true,
       // secure:true,
        sameSite:"Lax",
        path:"/",
        maxAge: 20 * 24 * 60 * 60 * 1000
    });

    res.cookie("accessToken",accessToken,{
        //httpOnly:false,
       // secure:false,
        sameSite:"Lax",
        path:"/",
        maxAge: 15 * 60 * 1000
    });

    res.status(200).json({
        email:user.email,
        userId:user._id,
        firstName:user.firstName,
        lastName:user.lastName,
        msg:"Logged in Cookies Set"
    });


}
async function logout(req,res)
{
    const refreshToken = req.cookies.refreshToken;

    if(refreshToken)
    {
        const user = await User.findOne({refreshToken});
        if(user)
        {
            user.refreshToken=null;
            await user.save();
        }

    }
    else
    {
        console.log("No refresh token found")
    }

    // res.clearCookie("refreshToken");
    // res.clearCookie("accessToken");
    res.clearCookie("refreshToken", {
  path: "/", // this must match the path used when setting the cookie
  sameSite: "Lax", // match what was used
});

res.clearCookie("accessToken", {
  path: "/",
  sameSite: "Lax",
});

    console.log("Logged out Cookies Cleared");

    res.json({
        msg:"Logged out Cookies Cleared"
    });

}

function generateAccessToken(payload)
{
    return jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{
        expiresIn: process.env.ACCESS_EXPIRES_IN
    });
}

function generateRefreshToken(payload)
{
    return jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{
        expiresIn: process.env.REFRESH_EXPIRES_IN
    });
}

async function createNewToken(req,res)
{
    const refreshToken = req.cookies.refreshToken;
    

    if(!refreshToken)
    {
        console.log("NO refresh token found");
        res.status(404).json({
            msg:"NO Refresh TOken found"
        })
        return;
    }

    try
    {
        var decoded = jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);
    }
    catch(e)
    {
        console.log("Invalid refresh token");
        res.status(404).json({
            msg:"Invalid refresh token"
        });
        return;

    }
    


    const email = decoded.email;

    const user=await User.findOne({email});

    if(!user || refreshToken!=user.refreshToken)
    {
        console.log("Invalid refresh token");
        res.status(404).json({
            msg:"Invalid refresh token"
        });
        return;
    }

    const payload={
        email:user.email,
        id:user._id
    }

    const newAccessToken=generateAccessToken(payload);
    res.cookie("accessToken",newAccessToken,{
        httpOnly:false,
        secure:true,
        samesite:"strict",
        maxAge: 15 * 60 * 1000
    });

    console.log("Access Token Refreshed");

    res.json({
        msg:"Access Token Refreshed"
    });

    // console.log(decoded);

    // res.send("Cookies logged");
}

function authenticateToken(req,res,next)
{
    const accessToken=req.cookies.accessToken;


    console.log(accessToken);
    if(!accessToken)
    {
        res.status(404).json({
            msg:"Access TOken Not Found"
        });
        return;
    }

    try
    {
        const decoded = jwt.verify(accessToken,process.env.JWT_ACCESS_SECRET);
        req.user=decoded;
    }
    catch(e)
    {
        res.status(404).json({
            msg:"Access TOken Invalid"
        });
        return;
    }
    
    next();

    // res.json({
    //     msg:"Acess Token Authenticated"
    // });
}

async function checkAuth(req,res)
{
   
    const accessToken=req.cookies.accessToken;

    console.log(accessToken);
    if(!accessToken)
    {
        res.status(404).json({
            msg:"Access TOken Not Found"
        });
        return;
    }

    try
    {
        const decoded = jwt.verify(accessToken,process.env.JWT_ACCESS_SECRET);
        const userId = decoded.id;
        req.user=decoded;

        const detail = await getUserData(req,res);
    }
    catch(e)
    {
        res.status(404).json({
            msg:"Access TOken Invalid"
        });
        return;
    }

}




async function getUserData(req,res)
{
    const userId=req.user.id;

    if(!userId)
    {
        res.status(403).json({
            msg:"No user id in req"
        });
    }

    const user = await User.findById(userId);

    if(!user)
    {
        res.status(403).json({
            msg:"No such user found"
        });
    }

    const dataTosend={
        id:user._id,
        email:user.email,
        firstName:user.firstName,
        lastName:user.lastName,
    };

    console.log("User data sent successfully");

    res.json(dataTosend);



}





module.exports={signup,verifyOtp,login,createNewToken,authenticateToken,logout,getUserData,checkAuth};