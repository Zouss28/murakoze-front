
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { User, MessageSquare } from "lucide-react";
import axios from "axios";
import { IoIosAddCircleOutline } from "react-icons/io";
import { LuUserRound } from "react-icons/lu";

const Overview = () => {
 
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    gender: "",
    age_group: "",
    address: "",
    added_at: "",
  });

  const [profileImage, setProfileImage] = useState(null);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("User not authenticated!");
      return;
    }

    try {
      const res = await fetch(
        `https://murakozebacked-production.up.railway.app/api/profile/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUserData({
          first_name: data.user.first_name || "",
          last_name: data.user.last_name || "",
          email: data.user.email || "",
          phone_number: data.user.phone_number || "",
          gender: data.user.gender || "",
          age_group: data.user.age_group || "",
          address: data.user.address || "",
          added_at: new Date(data.user.added_at).toLocaleDateString() || "",
        });

        if (data.profile_image && data.profile_image.length > 0) {
          const fullImageUrl = `https://murakozebacked-production.up.railway.app/${data.profile_image[0].image_url}`;
          setProfileImage(fullImageUrl);
        }
        
      } else {
        toast.error(data.error || "Error fetching user data");
      }
    } catch (error) {
      toast.error("Network error");
      console.log("Network error:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    let token = localStorage.getItem("token");

    axios({
      method: "PUT",
      url: `https://murakozebacked-production.up.railway.app/api/profile/update_image`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const imageUrl = `https://murakozebacked-production.up.railway.app/${response.data.profile_image}`;
        setProfileImage(imageUrl);
        toast.success("Profile image updated");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to update profile image");
      });
  };

  return (
    <div className='flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-white mt-24 px-4 md:px-8'>
      {/* Left Sidebar */}
      <div className='w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-200'>
        <div className='flex flex-col items-center p-2 '>
          {/* Profile Image */}
          <div className='w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center mb-4 overflow-hidden'>
            {profileImage ? (
              <img
                src={profileImage}
                alt='Profile'
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='text-blue-800'>
                <LuUserRound className='text-5xl' />
              </div>
            )}
          </div>
          <h2 className='text-lg font-medium'>
            {userData.first_name} {userData.last_name}
          </h2>
          <div className='flex items-center space-x-6 mb-8 mt-4'>
            <Link
              to='/profile'
              className='flex items-center text-sm text-gray-800 cursor-pointer'
            >
              <FaPen />
              <span className='ml-2'>Edit Profile</span>
            </Link>

            <label className='flex items-center text-sm text-gray-800 cursor-pointer'>
              <IoIosAddCircleOutline />
              Add Photo
              <input
                type='file'
                className='hidden'
                accept='image/*'
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        {/* Menu Items */}
        <div className='px-4 pb-6'>
          <div className='flex items-center py-3 px-4 bg-blue-50 rounded-md mb-2 text-gray-700'>
            <User size={18} className='mr-3' />
            <span>Profile Overview</span>
          </div>
          <Link to='/view'>
            <div className='flex items-center py-3 px-4 text-gray-700'>
              <MessageSquare size={18} className='mr-3' />
              <span>Reviews</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-4 md:p-8'>
        {/* CHANGED: Added mx-auto to center the content */}
        <div className='max-w-3xl mx-auto'>
          <h1 className='text-2xl font-semibold mb-2'>Profile Overview</h1>
          <p className='text-gray-500 mb-8'>
            This information will be displayed publicly, be careful what you
            share
          </p>

          <h2 className='text-gray-700 mb-4'>Personal Information</h2>

          {/* Form Grid - Read Only */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <input
                type='text'
                placeholder='Firstname'
                className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
                value={userData.first_name}
                readOnly
              />
            </div>
            <div>
              <input
                type='text'
                placeholder='Active since'
                className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
                value={userData.added_at}
                readOnly
              />
            </div>
            <div>
              <input
                type='text'
                placeholder='Lastname'
                className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
                value={userData.last_name}
                readOnly
              />
            </div>
            <div>
              <input
                type='text'
                placeholder='Phone Number'
                className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
                value={userData.phone_number}
                readOnly
              />
            </div>
            <div>
              <input
                type='text'
                placeholder='Gender'
                className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
                value={userData.gender}
                readOnly
              />
            </div>
            <div>
              <input
                type='email'
                placeholder='Email'
                className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
                value={userData.email}
                readOnly
              />
            </div>
            <div>
              <input
                type='text'
                placeholder='Age group'
                className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
                value={userData.age_group}
                readOnly
              />
            </div>
            <div>
              <input
                type='text'
                placeholder='Address'
                className='w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
                value={userData.address}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
