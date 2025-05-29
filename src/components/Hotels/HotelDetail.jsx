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

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-6'>

        <div className='col-span-1 sm:col-span-2 lg:col-span-3 sm:row-span-2'>

          <img

            src={mainImageUrl}

            alt='Hotel Exterior'

            className='w-full h-64 sm:h-80 lg:h-full object-cover rounded-lg'

            onError={(e) => {

              e.target.src = "/api/placeholder/800/400";

            }}

          />

        </div>



        {galleryImages.map((image, index) => (

          <div key={index} className='col-span-1'>

            <img

              src={`${API_BASE_URL}${image.image_url}`}

              alt='Hotel Room'

              className='w-full h-32 sm:h-40 lg:h-32 object-cover rounded-lg'

              onError={(e) => {

                e.target.src = "/api/placeholder/400/300";

              }}

            />

          </div>

        ))}



        {/* Fill remaining slots if not enough images */}

        {galleryImages.length < 2 &&

          Array.from({ length: 2 - galleryImages.length }).map((_, index) => (

            <div key={`placeholder-${index}`} className='col-span-1'>

              <img

                src='/api/placeholder/400/300'

                alt='Hotel Room'

                className='w-full h-32 sm:h-40 lg:h-32 object-cover rounded-lg'

              />

            </div>

          ))}

      </div>



      {/* Dynamic Buttons */}

      <div className='flex flex-col sm:flex-row gap-4 mb-8'>

        {buttonOne &&

          (buttonOne.type === "link" ? (

            <a

              href={buttonOne.url}

              target='_blank'

              rel='noopener noreferrer'

              className='bg-[#20497F] text-white px-6 py-3 rounded-full w-full sm:w-auto text-center hover:bg-blue-700 transition-colors'

            >

              {buttonOne.label || "Visit the Page"}

            </a>

          ) : (

            <button className='bg-[#20497F] text-white px-6 py-3 rounded-full w-full sm:w-auto hover:bg-blue-700 transition-colors'>

              {buttonOne.label || "Visit the Page"}

            </button>

          ))}



        {buttonTwo && (

          <button

            className='bg-[#20497F] text-white px-6 py-3 rounded-full w-full sm:w-auto hover:bg-blue-700 transition-colors'

            onClick={openServicesPopup}

          >

            {buttonTwo.label || "View Our Services"}

          </button>

        )}

      </div>



      {/* About Section - Now properly responsive */}

      <div className='mb-8'>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>

          {/* Amenities - Left column on large screens, top on smaller */}

          <div className='lg:col-span-1'>

            <h3 className='font-semibold text-lg mb-4'>Amenities</h3>

            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4'>

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

                    <div key={index} className='flex items-center gap-3'>

                      <div className='bg-[#20497F] p-2 rounded-full flex-shrink-0'>

                        <img

                          src={`${API_BASE_URL}${item.amenities.icon}`}

                          alt={item.amenities.name}

                          className='w-4 h-4 object-contain filter invert brightness-0'

                        />

                      </div>

                      <span className='text-sm lg:text-base'>{item.amenities.name}</span>

                    </div>

                  ))}

            </div>

          </div>

        

          {/* About description - Right column on large screens, bottom on smaller */}

          <div className='lg:col-span-2'>

            <h3 className='font-semibold text-lg mb-4'>

              About {institution.name}

            </h3>

            <p className='text-gray-700 leading-relaxed'>

              {institution.description || "No description available."}

            </p>

          </div>

        </div>

      </div>



      {/* Bottom Section - Map, Hours, and Ratings */}

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>

        {/* Location Map */}

        <div className='w-full'>

          <h3 className='font-semibold text-lg mb-4'>Location</h3>

          <iframe

            src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}

            className='w-full h-[250px] md:h-[300px] rounded-lg'

            style={{ border: 0 }}

            allowFullScreen=''

            loading='lazy'

            referrerPolicy='no-referrer-when-downgrade'

          ></iframe>

        </div>



        {/* Opening Hours */}

        <div className='w-full'>

          <h3 className='font-semibold text-lg mb-4'>Opening Hours</h3>

          <div className='space-y-3 bg-gray-50 p-4 rounded-lg'>

            {Object.entries(workingHours).map(([day, hours]) => (

              <div key={day} className='flex justify-between text-sm'>

                <span className='font-medium'>{day}</span>

                <span className='text-gray-600'>{hours}</span>

              </div>

            ))}

          </div>

        </div>



        {/* Ratings */}

        <div className='w-full md:col-span-2 xl:col-span-1'>

          <div className='mb-4'>

            <h3 className='font-semibold text-lg mb-2'>

              Overall Rating

            </h3>

            <p className='text-gray-600 text-sm mb-3'>

              ({institution.reviews?.length || 0} reviews)

            </p>

          </div>



          <div className='flex gap-1 mb-6'>{renderStars(avgRating)}</div>



          <div className='space-y-3'>

            {/* Rating distribution */}

            <div className='flex items-center gap-3 text-sm'>

              <span className='w-12 text-gray-600'>5 stars</span>

              <div className='flex-1 bg-gray-200 rounded-full h-2'>

                <div className='bg-[#20497F] h-2 rounded-full w-[90%]'></div>

              </div>

            </div>

            <div className='flex items-center gap-3 text-sm'>

              <span className='w-12 text-gray-600'>4 stars</span>

              <div className='flex-1 bg-gray-200 rounded-full h-2'>

                <div className='bg-[#20497F] h-2 rounded-full w-[40%]'></div>

              </div>

            </div>

            <div className='flex items-center gap-3 text-sm'>

              <span className='w-12 text-gray-600'>3 stars</span>

              <div className='flex-1 bg-gray-200 rounded-full h-2'>

                <div className='bg-[#20497F] h-2 rounded-full w-[30%]'></div>

              </div>

            </div>

            <div className='flex items-center gap-3 text-sm'>

              <span className='w-12 text-gray-600'>2 stars</span>

              <div className='flex-1 bg-gray-200 rounded-full h-2'>

                <div className='bg-[#20497F] h-2 rounded-full w-[20%]'></div>

              </div>

            </div>

            <div className='flex items-center gap-3 text-sm'>

              <span className='w-12 text-gray-600'>1 star</span>

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

          <div className='bg-blue-50 rounded-lg p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative'>

            <button

              onClick={closeServicesPopup}

              className='absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-700 hover:text-gray-900 z-10'

            >

              <X size={24} />

            </button>



            {buttonTwo.sections.map((section, sectionIndex) => (

              <div key={sectionIndex} className='mb-8'>

                <h2 className='text-xl font-bold mb-4 sm:mb-6 pr-8'>

                  {section.title}

                </h2>



                <div className='space-y-4'>

                  {section.items &&

                    section.items.map((item, itemIndex) => (

                      <div

                        key={itemIndex}

                        className='bg-white rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 shadow-sm'

                      >

                        <div className='font-medium'>{item.name}</div>

                        <div className='text-gray-600 text-sm sm:text-base'>

                          {item.days}

                        </div>

                        <div className='text-sm sm:text-base font-medium'>

                          {item.time}

                        </div>

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