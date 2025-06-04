
import { useState, useEffect } from "react";
import axios from "axios";

const REVIEWS_PER_PAGE = 3;

const Reviews = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchReviews = async (page) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `https://murakozebacked-production.up.railway.app/api/review/recent?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (
        response.data &&
        response.data.reviews &&
        response.data.reviews.length > 0
      ) {
        const newReviews = response.data.reviews;

        if (page === 1) {
          // First load - replace all reviews
          setAllReviews(newReviews);
        } else {
          // Subsequent loads - append new reviews, but avoid duplicates
          setAllReviews((prev) => {
            const existingIds = prev.map((review) => review.id);
            const uniqueNewReviews = newReviews.filter(
              (review) => !existingIds.includes(review.id)
            );
            return [...prev, ...uniqueNewReviews];
          });
        }

        if (newReviews.length < REVIEWS_PER_PAGE) {
          setHasMore(false);
        }
      } else {
        // No reviews returned, we've reached the end
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to fetch reviews.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, []);

  const handleShowMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchReviews(nextPage);
    }
  };

  const handleViewLess = () => {
    setCurrentPage(1);
    setAllReviews((prev) => prev.slice(0, REVIEWS_PER_PAGE));
    setHasMore(true); 
  };

  const renderReview = (review) => (
    <div key={review.id} className='bg-blue-50 rounded-lg p-6 shadow-sm mb-4'>
      <div className='flex items-center mb-4'>
        <img
          src={`https://ui-avatars.com/api/?name=${review.user.first_name}${review.user.last_name}&background=random`}
          alt={`${review.user.first_name} ${review.user.last_name}`}
          className='w-10 h-10 rounded-full mr-3'
        />
        <span className='font-medium'>
          {review.user.first_name} {review.user.last_name.charAt(0)}.
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

      {review.images && review.images.length > 0 && (
        <div className='mb-2'>
          <img
            src={`https://murakozebacked-production.up.railway.app/${review.images[0].image_url}`}
            alt='Review'
            className='w-full h-48 object-cover rounded'
          />
        </div>
      )}

      {review.institution?.name && (
        <p className='text-sm text-gray-700 font-bold mb-2 mt-4'>
          {review.institution.name}
        </p>
      )}

      <p className='text-gray-800'>{review.review}</p>
    </div>
  );

  return (
    <div className='mb-16 mt-24'>
      <h2 className='text-2xl font-bold text-center mb-8'>Recent Reviews</h2>

      <div className='container mx-auto px-4'>
        {allReviews.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {allReviews.map((review) => renderReview(review))}
          </div>
        ) : (
          <div className='text-center py-8'>
            {loading ? "Loading reviews..." : "No reviews available"}
          </div>
        )}

        {error && <div className='text-red-500 text-center mt-4'>{error}</div>}

        <div className='text-center mt-8 space-x-4'>
          {hasMore && (
            <button
              className='text-blue-600 font-medium disabled:text-gray-900'
              onClick={handleShowMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "More Reviews"}
            </button>
          )}

          {allReviews.length > REVIEWS_PER_PAGE && (
            <button
              className='text-blue-600 font-medium disabled:text-gray-900'
              onClick={handleViewLess}
              disabled={loading}
            >
              View Less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;