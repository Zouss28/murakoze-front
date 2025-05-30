
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Service = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const institution = location.state?.institution;

  // Redirect if no institution is passed
  if (!institution) {
    navigate("/");
    return null;
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='text-center'>
        <div className='mb-8 md:mb-12'>
          <div className='text-gray-600 text-base md:text-lg mb-4 md:mb-6'>
            {institution.name}
          </div>
          <div className='text-black text-lg md:text-xl font-medium'>
            Select service to rate
          </div>
        </div>

        {/* Service options grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
          {institution.services?.map((service) => (
            <Link
              key={service.id}
              to='/feedback'
              state={{ service, institution }}
            >
              <div className='bg-[#20497F] text-white rounded-lg px-6 py-10 cursor-pointer hover:bg-blue-700 transition-colors w-full md:w-80 h-32 flex items-center justify-center mx-auto'>
                <div className='text-base md:text-lg font-medium'>
                  {service.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
