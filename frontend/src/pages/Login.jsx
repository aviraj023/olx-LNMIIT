/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../assets/signupimg.jpg";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import { authLoginThunk,authLogoutThunk } from "../features/authSlice";
import {useDispatch,useSelector} from "react-redux"


export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  //const [SubmitMsg,setSubmitMsg]=useState("");
 // const [SubmitErr,setSubmitErr]=useState("");
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const submitError = useSelector((state)=>{
    return state.auth.showError
  });

  const isLoggedIn = useSelector((state)=>{
    return state.auth.isLoggedIn;
  })


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging in:", formData);

    dispatch(authLoginThunk(formData));

  };

  useEffect(()=>{
    if(isLoggedIn)
    {
        navigate("/")
    }
  },[isLoggedIn,navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <ToastContainer position="top-right" autoClose={2000}/>
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center bg-blue-100">
          <img
            src={loginImg}
            alt="Login"
            className="max-w-xs object-contain"
          />
        </div>

        <div className="p-8 sm:p-10 w-full">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Welcome Back 
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>  
            

            {/* Password */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={formData.showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      showPassword: !prev.showPassword,
                    }))
                  }
                  className="absolute right-3 top-2 text-sm text-blue-600 hover:underline"
                >
                  {formData.showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

        

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Log In
            </button>

          

            {submitError?<div className="text-red-500">
               Failed to login
            </div>:null}

            <p className="text-center text-sm mt-4 text-gray-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
