const otpGenerator = require("otp-generator");


function generateOtp()
{
    return otpGenerator.generate(4,{
        digits:true,
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false

    })
}

module.exports = generateOtp;