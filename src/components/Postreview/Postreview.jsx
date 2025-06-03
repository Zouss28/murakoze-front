
import React, { useRef, useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";

const Postreview = () =>{
  const [imagePreview, setImagePreview] = useState(null);
 
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
  
    if (!rating) return toast.error('Please select a rating');
    if (review.length < 85) return toast.error('Review must be at least 85 characters long');
    if (!selectedFile) return toast.error('Please upload an image');
  
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('review', review);
      formData.append('profile_image', selectedFile);
  
      const res = await axios.post(
        `https://murakozebacked-production.up.railway.app/api/review/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      toast.success('Review posted successfully!');
      
      setRating(0);
      setReview('');
      setSelectedFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error posting review:', error);
      toast.error(error.response?.data?.error || 'Failed to post review');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className='max-w-4xl mx-auto p-6 mt-16 mb-16'>
      <ToastContainer position='top-right' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Review Section */}
        <div className='border rounded-lg p-4'>
          <div className='flex gap-2 mb-4'>
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                onClick={() => setRating(index + 1)}
                className={`w-6 h-6 cursor-pointer ${
                  index < rating
                    ? "fill-yellow-400 stroke-yellow-400"
                    : "stroke-gray-500"
                }`}
              />
            ))}
          </div>

          <textarea
            placeholder='Write your review...'
            className='w-full min-h-[200px] p-3 border rounded'
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />

          <p className='text-sm text-gray-600 mt-2'>
            Reviews should be at least 85 characters
            {review.length > 0 && ` (${review.length}/85)`}
          </p>
        </div>

        {/* Image Upload Section */}
        <div
          className='border rounded-lg p-4 flex flex-col items-center justify-center min-h-[300px] bg-gray-50 cursor-pointer'
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type='file'
            accept='image/*'
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <div className='text-center'>
            <div className='w-12 h-12 mx-auto mb-4'>
              <svg
                className='w-full h-full text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M3 16V4a2 2 0 012-2h14a2 2 0 012 2v12'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M3 16l4-4 4 4 4-4 4 4'
                />
              </svg>
            </div>
       
            {imagePreview ? (
              <img
                src={imagePreview}
                alt='Preview'
                className='w-full h-auto max-h-64 object-contain rounded mb-2'
              />
            ) : (
              <p className='text-sm text-gray-600'>Click to upload photo</p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className='flex justify-end gap-4 mt-6'>
        <button
          className='px-6 py-2 border rounded text-gray-700 hover:bg-gray-100'
          onClick={() => {
            setRating(0);
            setReview("");
            setSelectedFile(null);
          }}
        >
          Cancel
        </button>
        <button
          className='px-6 py-2 bg-[#20497F] text-white rounded hover:bg-blue-900 disabled:bg-gray-400'
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Posting..." : "Post Review"}
        </button>
      </div>
    </div>
  );
};

export default Postreview;


