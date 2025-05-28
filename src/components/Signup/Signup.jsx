
import React, { useState } from 'react';
import store from '../../assets/img/store.png';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdArrowBack } from "react-icons/io";

const Signup = () => {
  const [passwordError, setPasswordError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false); 

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

 
    if (form.password !== form.confirm_password) {
      setPasswordError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    } else {
      setPasswordError(""); 
    }
    
    try {
      const res = await fetch(
        `https://murakozebacked-production.up.railway.app/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // body: JSON.stringify(form),
          body: JSON.stringify({
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            password: form.password,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(
          "Account created successfully! Please check your email to verify your account."
        );
        setIsEmailSent(true);
        // localStorage.setItem('token', data. accessToken);
        // localStorage.setItem('userData', JSON.stringify(form));
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.message || 'Signup failed!');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className='flex flex-col lg:flex-row min-h-screen mt-8 lg:mt-16 mb-6 px-4 lg:px-16'>
      {/* Left side - Signup Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 order-1 lg:order-1'>
        <div className='w-full max-w-md lg:ml-24'>
          <div className='mb-6'>
            <Link to=''>
              <button className='flex items-center text-gray-700 hover:text-blue-800'>
                {/* Back icon */}
                <IoMdArrowBack />
                Home
              </button>
            </Link>
          </div>

          <h1 className='text-2xl font-bold mb-1'>Create a new account</h1>
          <p className='text-gray-600 mb-6'>Sign up to create your account</p>

          <button className='bg-[#20497F] text-white w-full py-2.5 rounded flex items-center justify-center mb-4'>
            {/* Google icon */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 mr-2'
              viewBox='0 0 24 24'
            >
              <path
                fill='currentColor'
                d='M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z'
              />
            </svg>
            Signup with Google
          </button>

          <p className='text-sm text-gray-600 mb-6'>
            Use your email to create a new account
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type='text'
              id='first_name'
              name='first_name'
              placeholder='First name'
              className='w-full border border-gray-300 rounded p-2 mb-4'
              value={form.first_name}
              onChange={handleChange}
              required
            />
            <input
              type='text'
              name='last_name'
              id='last_name'
              placeholder='Last name'
              className='w-full border border-gray-300 rounded p-2 mb-4'
              value={form.last_name}
              onChange={handleChange}
              required
            />
            <input
              type='email'
              name='email'
              id='email'
              placeholder='Email address'
              className='w-full border border-gray-300 rounded p-2 mb-4'
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type='password'
              name='password'
              placeholder='Password'
              id='password'
              className='w-full border border-gray-300 rounded p-2 mb-6'
              value={form.password}
              onChange={handleChange}
              required
            />

            <input
              type='password'
              name='confirm_password'
              placeholder='Confirm password'
              id='confirm_password'
              className='w-full border border-gray-300 rounded p-2 mb-2'
              value={form.confirm_password}
              onChange={handleChange}
              required
            />

            {passwordError && (
              <p className='text-red-500 text-sm mb-2'>{passwordError}</p>
            )}

            <div className='flex items-center mb-6'>
              <input type='checkbox' id='terms' className='mr-2' required />
              <label htmlFor='terms' className='text-sm'>
                I agree to the
                <a href='#' className='text-blue-800'>
                  Terms and Conditions
                </a>
              </label>
            </div>

            <button
              type='submit'
              className='w-full lg:w-32 bg-[#20497F] text-white py-2 rounded mb-6'
            >
              Sign Up
            </button>

            <p className='text-sm'>
              Already have an account?{" "}
              <a href='/login' className='text-blue-800'>
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Welcome Banner */}
      <div
        className='w-full lg:w-1/3 bg-[#20497F] flex items-center justify-center p-4 lg:p-8 rounded-xl mt-6 lg:mt-0 order-2 lg:order-2'
        style={{
          height: "auto",
          minHeight: "260px",
          maxHeight: "none",
          lg: { height: "680px" },
        }}
      >
        <div className='text-center'>
          <h2 className='text-2xl lg:text-3xl font-bold text-white mb-4 lg:mb-8'>
            Welcome to Murakoze
          </h2>
          <img src={store} alt='Welcome' className='max-w-full lg:max-w-sm' />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Signup;

