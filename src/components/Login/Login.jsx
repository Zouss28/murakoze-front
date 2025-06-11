
import React, { useState, useEffect } from 'react';
import cart from '../../assets/img/cart.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://murakozebacked-production.up.railway.app/api/auth/login`,
        formData
      );
      const accessToken = response.data.accessToken; 
      localStorage.setItem('token', accessToken);
      window.dispatchEvent(new Event('storage'));

      toast.success('Login successful!');
      
      setFormData({ email: '', password: '' });
      
      setTimeout(() => {
        navigate('/'); 
      }, 1500);
      
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  
  const handleGoogleLogin = () => {
    toast.info('Google login functionality will be implemented soon.');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen mt-8 lg:mt-16 mb-6 px-4 lg:px-16">
      {/* Left - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center mb-6 lg:mb-32 order-1 lg:order-1">
        <div className="w-full max-w-md px-4 lg:px-8 lg:ml-24">
          <div className="mb-6">
            <Link to="/">
              <button className="flex items-center text-gray-700 hover:text-blue-800">
                {/* Back icon */}
                <IoMdArrowBack />
                Home
              </button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold mb-1">Sign in</h1>
          <p className="text-sm text-gray-600 mb-6">Sign in to your account</p>

          <button 
            className="bg-[#20497F] text-white w-full py-2.5 rounded flex items-center justify-center mb-4"
            onClick={handleGoogleLogin}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            Login with Google
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-xs">or login with email</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input 
                type="email" 
                name="email" 
                id='email'
                value={formData.email} 
                onChange={handleChange}
                placeholder="Email"
                className="w-full border border-gray-300 rounded py-2 px-3"
                required
              />
            </div>
            <div className="mb-4">
              <input 
                id='password'
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange}
                placeholder="Password"
                className="w-full border border-gray-300 rounded py-2 px-3"
                required
              />
            </div>
            <div className="flex justify-end mb-4">
              <Link to="/forgot-password" className="text-sm text-blue-800">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="bg-[#20497F] text-white w-full py-2.5 rounded font-medium mb-4"
            >
              Sign In
            </button>
            <p className="text-sm">
              Don't you have an account? <Link to="/signup" className="text-blue-800">Sign up</Link>
            </p>
          </form>

          <ToastContainer />
        </div>
      </div>

      {/* Right - Image Side */}
      <div className="w-full lg:w-1/3 bg-[#20497F] text-white rounded-xl flex items-center justify-center p-4 mt-4 lg:mt-0 order-2 lg:order-2" style={{height: '600px'}}>
        <div className="flex flex-col justify-center items-center px-4 lg:px-12 py-8">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-center">We help you with the best service</h2>
          <img src={cart} alt="Shopping" className="w-full max-w-xs" />
        </div>
      </div>
    </div>
  );
};

export default Login;