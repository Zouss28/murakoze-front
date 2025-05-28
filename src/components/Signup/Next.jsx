
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import store from '../../assets/img/store.png';
// import { Link } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Next = () => {

//   const navigate = useNavigate();

//   const savedUserData = JSON.parse(localStorage.getItem('userData')) || {};

//   const [form, setForm] = useState({
//     phone_number: savedUserData.phone_number || '',
//     age_group: savedUserData.age_group || '',
//     gender: savedUserData.gender || '',
//     address: savedUserData.address || '',
//     first_name: savedUserData.first_name || '',
//     last_name: savedUserData.last_name || '',
//     email: savedUserData.email || '',
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
   
//     const token = localStorage.getItem('token');

//     try {
      
//       const res = await fetch(
//         `https://murakozebacked-production.up.railway.app/api/profile/dashboard/update`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ ...form }),
//         }
//       );
     
//       const data = await res.json();
    
//       if (res.ok) {
//         localStorage.setItem('userData', JSON.stringify(form));
//         toast.success('Profile updated successfully!');
//         window.dispatchEvent(new Event('storage'));
//         setTimeout(() => navigate('/login'), 2000);
//       } else {
//         toast.error(data.message || 'Update failed!');
//       }
//     } catch (error) {
//       toast.error('Something went wrong.');
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row min-h-screen mt-8 lg:mt-16 mb-6 px-4 lg:px-16">
//       {/* Left side - Profile Completion Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 order-1 lg:order-1">
//         <div className="w-full max-w-md lg:ml-24">
//           <Link to="/signup">
//             <div className="mb-6">
//               <button className="flex items-center text-gray-700 hover:text-blue-800">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
//                 </svg>
//                 Back
//               </button>
//             </div>
//           </Link>

//           <form onSubmit={handleSubmit}>
//             <div className="mb-4">
//               <input
//                 type="text"
//                 name="phone_number"
//                 id="phone_number"
//                 value={form.phone_number}
//                 onChange={handleChange}
//                 placeholder="Phone number"
//                 className="w-full border border-gray-300 rounded p-2"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <input
//                 type="text"
//                 id="age_group"
//                 name="age_group"
//                 value={form.age_group}
//                 onChange={handleChange}
//                 placeholder="Age"
//                 className="w-full border border-gray-300 rounded p-2"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <input
//                 type="text"
//                 id="gender"
//                 name="gender"
//                 value={form.gender}
//                 onChange={handleChange}
//                 placeholder="Gender"
//                 className="w-full border border-gray-300 rounded p-2"
//                 required
//               />
//             </div>
//             <div className="mb-6">
//               <input
//                 type="text"
//                 id="address"
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//                 placeholder="Address"
//                 className="w-full border border-gray-300 rounded p-2"
//                 required
//               />
//             </div>

//             <button type="submit" className="w-full lg:w-32 bg-[#20497F] text-white py-2 rounded mb-6">
//               Finish Up
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* Right side - Welcome Banner */}
//       <div className="w-full lg:w-1/3 bg-[#20497F] flex items-center justify-center p-4 lg:p-8 rounded-xl mt-6 lg:mt-0 order-2 lg:order-2" style={{ height: 'auto', minHeight: '260px', maxHeight: 'none' }}>
//         <div className="text-center">
//           <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 lg:mb-8">Welcome to our store</h2>
//           <img src={store} alt="Welcome" className="max-w-full lg:max-w-sm" />
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Next;

import React from 'react'

const Next = () => {
  return (
    <div>
      
    </div>
  )
}

export default Next
