/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signupimg from "../assets/signupimg.jpg"
import axios from "axios"
const BASE_URL = import.meta.env.BASE_URL;

export default function SignUp() {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: ""
  });

   const [msg,setMsg]=useState("");
   const [err,setErr]=useState("");

   const [SubmitMsg,setSubmitMsg]=useState("");
   const [SubmitErr,setSubmitErr]=useState("");

   const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/v1/auth/signup", formData);

      setErr("");
      setMsg(response.data?.message || "OTP sent successfully");


      
    } catch (err) {
      setMsg("");
      setErr("Failed to send OTP");
    }

    console.log(msg);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/v1/auth/verifyOtp", formData);
      setSubmitErr("");
      setSubmitMsg(response.data?.message || "Account created succefully");
      navigate("/login")
    } catch (err) {
      setSubmitMsg("");
      setSubmitErr("Failed to create an account");
      
    }

    console.log("Form submitted:", formData);
  };

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      
        <div className="hidden md:flex items-center justify-center bg-blue-100">
          <img
            src={signupimg}
            alt="SignUp Illustration"
            className="max-w-xs"
          />
        </div>

       
        <div className="p-8 sm:p-10 w-full">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            

            <div>
              <label className="block text-gray-600 text-sm mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1">OTP</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Send OTP
                </button>
              </div>
            </div>

            {msg?<div className="text-green-500">
                {msg}
            </div>:null}

            {err?<div className="text-red-500">
                {err}
            </div>:null}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit
            </button>

            {SubmitMsg?<div className="text-green-500">
                {SubmitMsg}
            </div>:null}

            {SubmitErr?<div className="text-red-500">
                {SubmitErr}
            </div>:null}

            <p className="text-center text-sm mt-4 text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
