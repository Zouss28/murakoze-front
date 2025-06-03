
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { useState } from "react";

const Detailsinstitution = () => {
    
 const [institution, setInstitution] = useState([]);
     
  const location = useLocation();
  const navigate = useNavigate();

  const institutions = location.state?.institutions || [];

    const isOpen = isInstitutionOpen(institution.hours || []);
    function isInstitutionOpen(hours) {
      const now = new Date();
      const day = now.toLocaleString("en-US", { weekday: "long" });
      const currentTime = now.toTimeString().slice(0, 5);
      const today = hours?.find((h) => h.day_of_week === day);
      if (!today) return false;
      const open = today.open_time;
      const close = today.close_time;
      if (close < open) {
        return currentTime >= open || currentTime <= close;
      }
      return currentTime >= open && currentTime <= close;
    }



      const renderStars = (rating) => {
        if (!rating)
          return Array(5)
            .fill()
            .map((_, i) => <Star key={i} className='text-gray-300 w-5 h-5' />);
        const stars = [];
        for (let i = 1; i <= 5; i++) {
          if (i <= Math.floor(rating)) {
            stars.push(
              <Star key={i} fill='currentColor' className='text-gray-900 w-5 h-5' />
            );
          } else {
            stars.push(<Star key={i} className='text-gray-300 w-5 h-5' />);
          }
        }
        return stars;
      };


  if (institutions.length === 0) {
    return <p>No results found. Please try another search.</p>;
  }

  return (
    <div className='ml-10 mr-10 mx-auto py-8 px-2'>
      {institutions.map((institution) => (
        <div
          key={institution.id}
          onClick={() => navigate(`/in${institution.id}`)}
          className='flex bg-white rounded-xl shadow border border-gray-200 mb-8 overflow-hidden cursor-pointer transition-shadow hover:shadow-lg'
        >
          <img
            src={`https://murakozebacked-production.up.railway.app/${institution.image.image_url}`}
            alt={institution.name}
            className='w-64 h-48 object-cover flex-shrink-0'
          />
          <div className='flex flex-col p-6 justify-center flex-1'>
            <h2 className='text-xl font-semibold text-blue-700 mb-1 leading-tight'>
              {institution.name}
            </h2>

            <p className='font-medium mb-2 text-green-600'>
              {isOpen ? "Open now" : "Closed now"}
            </p>

            <div className='flex items-center mb-2'>
              {renderStars(institution.avgRating)}
              <span className='ml-2 text-gray-700'>
                {institution.avgRating || "No rating"}
              </span>
              <span className='ml-2 text-gray-700'>
                ({institution.totalReview || 0} Reviews)
              </span>
            </div>
            <p className='text-gray-800 mb-2 line-clamp-2'>
              {institution.description}
            </p>
            <p className='text-gray-600 flex items-center'>
              <MapPin className='w-4 h-4 mr-1' /> {institution.location}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Detailsinstitution;