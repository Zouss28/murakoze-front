import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import feedback1 from "../../assets/img/feedback1.png";
import feedback2 from "../../assets/img/feedback2.png";
import feedback3 from "../../assets/img/feedback3.png";
import { IoCloseCircleOutline } from "react-icons/io5";

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service, institution } = location.state || {};

  if (!service || !institution) {
    navigate("/");
    return null;
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4 relative'>
      {/* Close button */}
      <Link to='/review'>
        <div className='absolute top-6 right-6 md:top-32 md:right-64'>
          <div className='w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#20497F] flex items-center justify-center bg-white'>
            <IoCloseCircleOutline className='w-5 h-5 md:w-6 md:h-6 text-[#20497F]' />
          </div>
        </div>
      </Link>

      {/* Main content */}
      <div className='text-center'>
        <div className='mb-8 md:mb-12'>
          <div className='text-gray-600 text-base md:text-lg mb-4 md:mb-6'>
            {institution.name}
          </div>
          <div className='text-black text-lg md:text-xl font-medium'>
            How do you feel about our service?
          </div>
        </div>

        <div className='flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16'>
          {["Happy", "Satisfied", "Unhappy"].map((feeling, index) => (
            <Link
              key={feeling}
              to='/rate'
              state={{ service, institution, feeling }}
            >
              <div className='flex flex-col items-center cursor-pointer'>
                <img
                  src={[feedback3, feedback2, feedback1][index]}
                  className='w-20 h-20 md:w-24 md:h-24 mb-3 hover:scale-105 transition-transform'
                  alt={feeling}
                />
                <span className='text-black text-base md:text-lg font-medium'>
                  {feeling}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
