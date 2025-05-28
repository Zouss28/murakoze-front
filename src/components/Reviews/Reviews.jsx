   

import { useState, useEffect } from "react";
import axios from "axios";

const Reviews = () => {
 
  const [dynamicReviews, setDynamicReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await axios({
          url: `https://murakozebacked-production.up.railway.app/api/review/recent`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if we have valid data
        if (
          response.data &&
          response.data.reviews &&
          response.data.reviews.length > 0
        ) {
          setDynamicReviews(response.data.reviews);
          setUsingFallback(false);
        } else {
          console.log("No reviews found in API response, using fallback data");
          setUsingFallback(true);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderReview = (review) => {
    return (
      <div key={review.id} className='bg-blue-50 rounded-lg p-6 shadow-sm mb-4'>
        <div className='flex items-center mb-4'>
          <img
            src={`https://ui-avatars.com/api/?name=${review.user.first_name}${review.user.last_name}&background=random`}
            alt={`${review.user.first_name} ${review.user.last_name}`}
            className='w-10 h-10 rounded-full mr-3'
          />
          <span className='font-medium'>
            {review.user.first_name} {review.user.last_name.charAt(0)}
          </span>
          <div className='ml-auto flex'>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < review.rating ? "text-black" : "text-gray-300"
                }`}
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
            ))}
          </div>
        </div>

        {/* Review Image */}
        {review.images && review.images.length > 0 && (
          <div className='mb-4'>
            <img
              src={`https://murakozebacked-production.up.railway.app/${review.images[0].image_url}`}
              alt='Review'
              className='w-full h-48 object-cover rounded'
            />
          </div>
        )}

        <p className='text-gray-800'>{review.review}</p>
      </div>
    );
  };

  if (loading) {
    return <div className='text-center py-8'>Loading reviews...</div>;
  }

  return (
    <div className='mb-16 mt-24'>
      <h2 className='text-2xl font-bold text-center mb-8'>Recent Reviews</h2>

      {/* Display the reviews */}
      <div className='container mx-auto px-4'>
        {dynamicReviews.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {dynamicReviews.map((review) => renderReview(review))}
          </div>
        ) : (
          <div className='text-center py-8'>No reviews available</div>
        )}
      </div>

      <div className='text-center mt-8'>
        <button className='text-blue-600 font-medium'>More Reviews</button>
      </div>
    </div>
  );
};

export default Reviews;


