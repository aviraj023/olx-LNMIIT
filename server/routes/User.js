const express = require("express");
const router = express.Router();

const {signup,verifyOtp,login,createNewToken,authenticateToken,logout,getUserData,checkAuth} = require("../controllers/Auth");



router.post("/signup",signup);
router.post("/login",login);
router.post("/verifyOtp",verifyOtp)
router.post("/logout",logout);
router.post("getUserData",getUserData);

router.post("/checkAuth",checkAuth);

router.post("/createNewToken",createNewToken);

//router.post("/authenticateToken",authenticateToken);

module.exports=router;