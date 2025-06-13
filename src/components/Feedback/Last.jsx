
import React from "react";
import pop from "../../assets/img/pop.png";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Last = () => {
  const location = useLocation();
  const [institution, setInstitution] = useState(
    location.state?.institution || {}
  ); 

  return (
    <div className='min-h-screen flex items-center justify-center p-4 relative'>
      <Link to='/review'>
        <div className='absolute top-6 right-6 md:top-32 md:right-64'>
          <div className='w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#20497F] flex items-center justify-center bg-white'>
            <IoCloseCircleOutline className='w-5 h-5 md:w-6 md:h-6 text-[#20497F]' />
          </div>
        </div>
      </Link>

      <div className='text-center max-w-md w-full px-2'>
        {/* Header */}
        <div className='mb-6 md:mb-8'>
          {/* Balloon image */}
          <div className='flex justify-center mb-6 md:mb-8'>
            <img
              src={pop}
              className='w-24 md:w-32 h-auto'
              alt='Celebration balloons'
            />
          </div>

          {/* Thank you message */}
          <div className='text-black text-lg md:text-xl font-medium mb-12 md:mb-16'>
            Thank You For Your Time!
          </div>

          <div className='mb-6 md:mb-8'>
            <div className='text-gray-600 text-base md:text-lg mb-4 md:mb-6'>
              Want to tell us more?
            </div>

            <div className='flex justify-center'>
                      
              <Link
                to={`/postreview/${institution.id}`}
                state={{ institution }}
              >
                <div className='bg-[#20497F] text-white rounded-lg px-8 py-3 md:px-12 md:py-4 cursor-pointer hover:bg-blue-700 transition-colors'>
                  <div className='text-base md:text-lg font-medium'>
                    Leave Feedback
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Last;
