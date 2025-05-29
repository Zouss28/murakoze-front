
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, X, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const HotelDetail = () => {
  const { id } = useParams(); 
  const [institution, setInstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showServicesPopup, setShowServicesPopup] = useState(false);
  const [buttonOne, setButtonOne] = useState(null);
  const [buttonTwo, setButtonTwo] = useState(null);

  const openServicesPopup = () => {
    setShowServicesPopup(true);
  };

  const closeServicesPopup = () => {
    setShowServicesPopup(false);
  };

  useEffect(() => {
    const fetchInstitutions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://murakozebacked-production.up.railway.app/api/institutions/${id}/view`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
    
        if (res.data?.institution?.button_one) {
          try {
            setButtonOne(JSON.parse(res.data.institution.button_one));
          } catch (e) {
            console.error("Error parsing button_one", e);
          }
        }
        
        if (res.data?.institution?.button_two) {
          try {
            setButtonTwo(JSON.parse(res.data.institution.button_two));
          } catch (e) {
            console.error("Error parsing button_two", e);
          }
        }
    
        setInstitution(res.data?.institution);
      } catch (err) {
        console.error("Error fetching institutions", err);
        setError("Failed to load institutions");
      } finally {
        setLoading(false);
      }
    };
  
    fetchInstitutions();
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} className="text-blue-800 fill-blue-800" size={20} />);
      } else {
        stars.push(<Star key={i} className="text-gray-300" size={20} />);
      }
    }
    return stars;
  };
  
  // Base URL for image paths
  const API_BASE_URL = "https://murakozebacked-production.up.railway.app/";

  if (loading) return <div className="w-full mx-auto px-4 sm:px-6 md:px-12 p-4 mb-8 text-center">Loading hotel details...</div>;
  if (error) return <div className="w-full mx-auto px-4 sm:px-6 md:px-12 p-4 mb-8 text-center text-red-500">{error}</div>;
  if (!institution) return <div className="w-full mx-auto px-4 sm:px-6 md:px-12 p-4 mb-8 text-center">Hotel not found</div>;

  // Calculate average rating from reviews
  const calculateAvgRating = () => {
    if (!institution.reviews || institution.reviews.length === 0) return 0;
    const sum = institution.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / institution.reviews.length;
  };
  
  const avgRating = calculateAvgRating();
  
  let mainImageUrl = "/api/placeholder/800/400";
  if (institution.images && institution.images.length > 0) {
    mainImageUrl = `${API_BASE_URL}${institution.images[0].image_url}`;
  }

  // Get other images for gallery
  const galleryImages = institution.images && institution.images.length > 1 ? 
    institution.images.slice(1, 4) : [];
    
  // Parse working hours from the API response
  const workingHours = institution.working_hours ? 
    JSON.parse(institution.working_hours || "{}") : 
    {
      Monday: "09:00 AM - 12:00 AM",
      Tuesday: "08:00 AM - 02:00 AM",
      Wednesday: "09:00 AM - 12:30 AM",
      Thursday: "10:00 AM - 12:00 AM",
      Friday: "09:00 AM - 11:30 PM",
      Saturday: "10:00 AM - 03:00 AM",
      Sunday: "11:00 AM - 04:00 AM"
    };
    
  // Get latitude and longitude
  const latitude = institution.latitude || "-1.95465";
  const longitude = institution.longitude || "30.092757";

  return (
    <div className='w-full mx-auto px-4 sm:px-6 md:px-12 p-4 mb-8'>
      <Link
        to='/hotels'
        className='flex items-center text-blue-600 mb-4 hover:underline'
      >
        <ArrowLeft className='w-4 h-4 mr-1' /> Back to Hotels
      </Link>

      <h1 className='text-xl sm:text-2xl font-bold text-blue-800 pb-2 mb-4'>
        {institution.name}
      </h1>

      {/* Image Gallery - Responsive layout */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mb-4'>
        <div className='col-span-1 sm:col-span-2 sm:row-span-2'>
          <img
            src={mainImageUrl}
            alt='Hotel Exterior'
            className='w-full h-64 object-cover rounded-lg sm:h-full'
            onError={(e) => {
              e.target.src = "/api/placeholder/800/400";
            }}
          />
        </div>

        {galleryImages.map((image, index) => (
          <div key={index}>
            <img
              src={`${API_BASE_URL}${image.image_url}`}
              alt='Hotel Room'
              className='w-full h-64 object-cover rounded-lg'
              onError={(e) => {
                e.target.src = "/api/placeholder/400/300";
              }}
            />
          </div>
        ))}

        {/* Fill remaining slots if not enough images */}
        {galleryImages.length < 3 &&
          Array.from({ length: 3 - galleryImages.length }).map((_, index) => (
            <div key={`placeholder-${index}`}>
              <img
                src='/api/placeholder/400/300'
                alt='Hotel Room'
                className='w-full h-64 object-cover rounded-lg'
              />
            </div>
          ))}
      </div>

      {/* Dynamic Buttons */}
      <div className='flex flex-col sm:flex-row gap-4 mb-6 sm:-mt-2'>
        {buttonOne &&
          (buttonOne.type === "link" ? (
            <a
              href={buttonOne.url}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-[#20497F] text-white px-4 py-2 rounded-full w-full sm:w-auto text-center'
            >
              {buttonOne.label || "Visit the Page"}
            </a>
          ) : (
            <button className='bg-[#20497F] text-white px-4 py-2 rounded-full w-full sm:w-auto'>
              {buttonOne.label || "Visit the Page"}
            </button>
          ))}

        {buttonTwo && (
          <button
            className='bg-[#20497F] text-white px-4 py-2 rounded-full w-full sm:w-auto'
            onClick={openServicesPopup}
          >
            {buttonTwo.label || "View Our Services"}
          </button>
        )}
      </div>

      {/* Features/Amenities Section - Responsive */}
      <div className='flex mt-8 px-4'>
        <div className='flex flex-col md:flex-row gap-8 items-start'>
          <div className='flex flex-wrap max-w-[250px] gap-3'>
            {institution.business_amenities &&
              institution.business_amenities
                .filter(
                  (item) =>
                    ![
                      "Free Wifi",
                      "Free Parking",
                      "Coffee",
                      "Restaurant",
                    ].includes(item.amenities.name)
                )
                .map((item, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <div className='bg-[#20497F] p-2 rounded-full'>
                      <img
                        src={`${API_BASE_URL}${item.amenities.icon}`}
                        alt={item.amenities.name}
                        className='w-4 h-4 object-contain filter invert brightness-0'
                      />
                    </div>
                    <span className=''>{item.amenities.name}</span>
                  </div>
                ))}
          </div>
        
          <div className='flex-1 '>
            <h3 className='font-semibold text-lg mb-2'>
              About {institution.name}
            </h3>
            <p className=''>
              {institution.description || "No description available."}
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:mt-16 px-4'>
        {/* Left Column - Location with dynamic coordinates */}
        <div className='w-full'>
          <iframe
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
            className='w-full h-[300px] md:h-[450px]'
            style={{ border: 0 }}
            allowFullScreen=''
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          ></iframe>
        </div>

        {/* Middle Column - Dynamic Opening Hours */}
        <div className='ml-0 md:ml-28'>
          <h3 className='font-medium mb-2 '>Our opening hours</h3>
          <div className='space-y-3 md:mr-16'>
            {Object.entries(workingHours).map(([day, hours]) => (
              <div key={day} className='flex justify-between'>
                <span>{day}</span>
                <span>{hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Ratings */}
        <div className='mt-8 md:mt-0'>
          <div className='flex justify-between mb-2'>
            <h3 className='font-medium'>
              Overall rating{" "}
              <span className='text-gray-600'>
                ({institution.reviews?.length || 0} reviews)
              </span>
            </h3>
          </div>

          <div className='flex gap-1 mb-4'>{renderStars(avgRating)}</div>

          <div className='space-y-2'>
            {/* Rating distribution - you can replace this with actual data if available */}
            <div className='flex items-center gap-2'>
              <span className='w-12'>5 stars</span>
              <div className='flex-1 bg-gray-200 rounded-full h-2'>
                <div className='bg-[#20497F] h-2 rounded-full w-[90%]'></div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-12'>4 stars</span>
              <div className='flex-1 bg-gray-200 rounded-full h-2'>
                <div className='bg-[#20497F] h-2 rounded-full w-[40%]'></div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-12'>3 stars</span>
              <div className='flex-1 bg-gray-200 rounded-full h-2'>
                <div className='bg-[#20497F] h-2 rounded-full w-[30%]'></div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-12'>2 stars</span>
              <div className='flex-1 bg-gray-200 rounded-full h-2'>
                <div className='bg-[#20497F] h-2 rounded-full w-[20%]'></div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-12'>1 star</span>
              <div className='flex-1 bg-gray-200 rounded-full h-2'>
                <div className='bg-[#20497F] h-2 rounded-full w-[5%]'></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Services Popup */}
      {showServicesPopup && buttonTwo && buttonTwo.sections && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4'>
          <div className='bg-blue-50 rounded-lg p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative'>
            <button
              onClick={closeServicesPopup}
              className='absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-700 hover:text-gray-900'
            >
              <X size={24} />
            </button>

            {buttonTwo.sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h2 className='text-xl font-bold mb-4 sm:mb-6 pr-8'>
                  {section.title}
                </h2>

                <div className='space-y-4 mb-6 sm:mb-8'>
                  {section.items &&
                    section.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className='bg-white rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2'
                      >
                        <div className='font-medium'>{item.name}</div>
                        <div className='text-gray-600 text-sm sm:text-base'>
                          {item.days}
                        </div>
                        <div className='text-sm sm:text-base'>{item.time}</div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetail;