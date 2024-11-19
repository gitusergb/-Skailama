import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async(e) => {
      e.preventDefault();
      const values = { email, password };
      try {
         const response = await axios.post('https://podcastbe.onrender.com/users/login', values);
         console.log('Login response:', response.data);
   
        if (response.data) {
          toast.success(response.data.message);

         
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('token', response.data.token);
        navigate('/newProject');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error(error.response ? error.response.data.message : error.message);
        toast.error(" Please Login !");
      }
    };
  
  return (
    <div className="flex h-screen text-sans">
                     {/* Image Section */}
                    <img src="https://i.ibb.co/VQSL5sb/login-img.png" alt="login_img" />

                    {/* Form Section */}
                    <div className="w-1/2 bg-purple-50 flex flex-col justify-center items-center p-16">
                        <div className="flex flex-col items-center mb-8">
                              {/* Logo and Welcome Text */}
                            <img src="https://i.ibb.co/m53Ssh1/logo.png" alt="logo_img"  />
                            <div className="text-3xl font-sans text-purple-600 mb-2">Welcome to</div>
                            <div className="text-4xl font-bold text-purple-600">Ques.AI</div>
                        </div>

                           {/* Form */}
                        <form className="w-full max-w-sm" onSubmit={handleLogin}>
                             {/* Email Input */}
                            <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-xl font-medium w-full p-2 mb-4 border border-gray-300 rounded"  required/>
                             {/* Password Input */}
                            <input type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-xl font-medium w-full p-2 mb-4 border border-gray-300 rounded"  required/>
                            <div className="flex items-center justify-between mb-4">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2 text-sm" />
                                    Remember me
                                </label>
                                <a  href="/forgot-password" className="text-blue-600 text-sm">Forgot password?</a>
                            </div>

                             {/* Login Button */}
                            <button  type="submit"
                             className="w-full bg-purple-600 text-white p-3 rounded mb-4 font-bold">Login</button>
                            <div className="flex items-center justify-center mb-4">
                                <div className="border-t border-gray-300 w-full"></div>
                                <div className="px-2 text-gray-500">or</div>
                                <div className="border-t border-gray-300 w-full"></div>
                            </div>
                                   {/* Google Login */}
                            <button className="font-medium text-balance w-full bg-white text-gray-700 border border-gray-300 p-3 rounded flex items-center justify-start">
                                <img src="https://i.ibb.co/D5VZttX/google.png" alt="Google logo" className="mr-2 h-5" />
                                Continue with Google
                            </button>
                            <div className="text-center mt-4">
                                <span>Don't have an account? </span>
                                <a href="/signup" className="text-blue-600 text-sm font-semibold">Create Account</a>
                            </div>
                        </form>
                    </div>
                </div>
  )
}

export default Login