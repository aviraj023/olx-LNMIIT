const nodemailer = require("nodemailer");
require("dotenv").config();
const MAIL = process.env.MAIL;
const MAIL_PASS = process.env.MAIL_PASS;

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:MAIL,
        pass:MAIL_PASS
    }
});


async function sendMail(to,otp)
{
    await transporter.sendMail(
        {
            from:MAIL,
            to,
            subject:"OTP Verification - olx LNMIIT",
            text:`Your OTP for olx LNMIIT is ${otp}. OTP is valid for 5 minutes only.`
        }
    );
}

module.exports=sendMail;
