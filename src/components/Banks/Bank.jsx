
import React, { useState, useEffect } from "react";
import { Star, MapPin } from "lucide-react";
import { IoMdMenu } from "react-icons/io";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";

const Bank = () => {
  // NEW: State for selected filters
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("");

  // fethch institutions by price
  const fetchInstitutionsByPrice = (price) => {
    // MODIFIED: Update selected price state instead of direct API call
    setSelectedPrice(price);
  };

  const [amenities, setAmenities] = useState([]);
  const id = 2;
  const categoryId = 2;
  const [open, setOpen] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("recommended");
  const [filterLabel, setFilterLabel] = useState("Recommended");

  const institutionsPerPage = 3;

  const fetchInstitutions = async (filter = null) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let endpoint = `https://murakozebacked-production.up.railway.app/api/institutions/${id}`;

      if (filter === "rating") {
        endpoint = `https://murakozebacked-production.up.railway.app/api/search/rating/${id}`;
        setActiveFilter("rating");
        setFilterLabel("Highest Rated");
      } else if (filter === "review") {
        endpoint = `https://murakozebacked-production.up.railway.app/api/search/review/${id}`;
        setActiveFilter("review");
        setFilterLabel("Most Reviewed");
      } else {
        setActiveFilter("recommended");
        setFilterLabel("Recommended");
      }

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInstitutions(res.data?.institutions || []);
      setCurrentPage(1); // Reset to page 1 when changing filters
    } catch (err) {
      console.error("Error fetching institutions", err);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Function to apply filters
  const applyFilters = async () => {
    if (selectedAmenities.length === 0 && !selectedPrice) {
      fetchInstitutions(); // No filters, fetch all
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let endpoint = `https://murakozebacked-production.up.railway.app/api/search/${id}?`;

      // Add price filter if selected
      if (selectedPrice) {
        endpoint += `price=${selectedPrice}&`;
      }

      // Add amenity filters if selected
      if (selectedAmenities.length > 0) {
        endpoint += `amenities=${selectedAmenities.join(",")}&`;
      }

      // Remove trailing & or ?
      endpoint = endpoint.replace(/[&?]$/, "");

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInstitutions(res.data?.institutions || []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error applying filters", err);
      setError("Failed to apply filters");
    } finally {
      setLoading(false);
    }
  };

  // NEW: Handle amenity checkbox change
  const handleAmenityChange = (amenityId, checked) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId]);
    } else {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId));
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    fetch(
      `https://murakozebacked-production.up.railway.app/api/search/list/amenity?category_id=${categoryId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAmenities(data.amenities);
      })
      .catch((error) => {
        console.error("Error fetching amenities:", error);
      });
  }, []);

  // NEW: Apply filters whenever selectedAmenities or selectedPrice changes
  useEffect(() => {
    applyFilters();
  }, [selectedAmenities, selectedPrice]);

  // Calculate pagination indexes
  const indexOfLastInstitution = currentPage * institutionsPerPage;
  const indexOfFirstInstitution = indexOfLastInstitution - institutionsPerPage;
  const currentInstitutions = institutions.slice(
    indexOfFirstInstitution,
    indexOfLastInstitution
  );

  // Calculate total pages
  const totalPages = Math.ceil(institutions.length / institutionsPerPage);
  // Create page numbers array
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  function isInstitutionOpen(hours) {
    return true;
  }

  // Render star ratings
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

  const FilterPopup = () => {
    return (
      <div className='fixed inset-0 z-50 flex ml-10 mt-16'>
        <div className='bg-white shadow-lg w-64 h-[90vh] flex flex-col'>
          {/* Scrollable content */}
          <div className='p-4 space-y-6 overflow-y-auto flex-1'>
            <h2 className='text-lg font-semibold'>Filters</h2>
            <div className='space-y-2'>
              <h3 className='font-medium'>Price</h3>
              <div className='flex justify-between rounded-full border'>
                {["$", "$$", "$$$", "$$$$"].map((price) => (
                  <label
                    key={price}
                    onClick={() => fetchInstitutionsByPrice(price)}
                    className={`w-full text-center py-2 border-r last:border-none cursor-pointer ${
                      selectedPrice === price
                        ? "bg-[#20497F] text-white"
                        : "text-gray-600 hover:bg-[#20497F] hover:text-white"
                    } rounded`}
                  >
                    {price}
                  </label>
                ))}
              </div>
            </div>

            <div className='space-y-2'>
              {amenities &&
                amenities.map((amenity) => (
                  <div key={amenity.id} className='flex items-center'>
                    <input
                      type='checkbox'
                      id={`amenity-${amenity.id}`}
                      className='mr-2'
                      checked={selectedAmenities.includes(amenity.id)}
                      onChange={(e) =>
                        handleAmenityChange(amenity.id, e.target.checked)
                      }
                    />
                    <label htmlFor={`amenity-${amenity.id}`}>
                      {amenity.name}
                    </label>
                  </div>
                ))}
            </div>
          </div>

          {/* Buttons */}
          <div className='border-t border-gray-200'>
            <div className='flex'>
              <button
                className='flex-1 p-4 text-blue-600 font-medium'
                onClick={() => setShowFilterPopup(false)}
              >
                Cancel
              </button>
              <button
                className='flex-1 p-4 bg-blue-600 text-white font-medium'
                onClick={() => setShowFilterPopup(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Overlay */}
        <div className='flex-1' onClick={() => setShowFilterPopup(false)}></div>
      </div>
    );
  };

  // Base URL for image paths
  const API_BASE_URL = "https://murakozebacked-production.up.railway.app/";

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Filter options */}
      <div className='flex flex-wrap gap-2 mb-6'>
        <button
          className='flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm'
          onClick={() => setShowFilterPopup(true)}
        >
          <IoMdMenu />
          <span className='font-medium'>All</span>
        </button>
        <button className='flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-sm'>
          <span className='font-medium'>Price</span>
        </button>
        <div className='flex gap-2 flex-wrap'>
          {amenities &&
            amenities.slice(0, 3).map((amenity) => (
              <div
                key={amenity.id}
                className='flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-sm'
              >
                <input
                  type='checkbox'
                  id={`amenity-main-${amenity.id}`}
                  className='mr-1'
                  checked={selectedAmenities.includes(amenity.id)}
                  onChange={(e) =>
                    handleAmenityChange(amenity.id, e.target.checked)
                  }
                />
                <label
                  htmlFor={`amenity-main-${amenity.id}`}
                  className='font-medium'
                >
                  {amenity.name}
                </label>
              </div>
            ))}
        </div>
      </div>

      {/* Show Filter Popup when button is clicked */}
      {showFilterPopup && <FilterPopup />}

      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <p className='text-sm text-gray-600'>Banks</p>
          <h1 className='text-2xl font-bold'>
            {activeFilter === "rating"
              ? "Highest Rated Banks in Kigali"
              : activeFilter === "review"
              ? "Most Reviewed Banks in Kigali"
              : "Best Banks in the Kigali City Area"}
          </h1>
        </div>

        <div className='relative'>
          <button
            className='flex items-center gap-1 font-medium'
            onClick={() => setOpen(!open)}
          >
            {filterLabel}
            <IoMdArrowDropdown />
          </button>

          {open && (
            <div className='absolute right-0 bg-white shadow p-2 mt-1 text-sm z-10 w-40'>
              <div
                className={`hover:bg-gray-100 cursor-pointer p-2 ${
                  activeFilter === "recommended" ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  setOpen(false);
                  fetchInstitutions();
                }}
              >
                Recommended
              </div>
              <div
                className={`hover:bg-gray-100 cursor-pointer p-2 ${
                  activeFilter === "rating" ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  setOpen(false);
                  fetchInstitutions("rating");
                }}
              >
                Highest Rated
              </div>
              <div
                className={`hover:bg-gray-100 cursor-pointer p-2 ${
                  activeFilter === "review" ? "bg-blue-50" : ""
                }`}
                onClick={() => {
                  setOpen(false);
                  fetchInstitutions("review");
                }}
              >
                Most Reviewed
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter indicator */}
      {(activeFilter === "rating" || activeFilter === "review") && (
        <div className='mb-4 flex'>
          <div className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center'>
            {activeFilter === "rating" ? "Highest Rated" : "Most Reviewed"}
            <button
              className='ml-2 text-blue-600 hover:text-blue-800'
              onClick={() => fetchInstitutions()}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {loading && <div className='text-center py-10'>Loading banks...</div>}
      {error && <div className='text-center py-10 text-red-600'>{error}</div>}

      <div className='space-y-8 cursor-pointer'>
        {currentInstitutions.map((institution) => {
          const isOpen = isInstitutionOpen(institution.hours || []);
          let imageUrl = "/api/placeholder/400/320";

          if (institution.image) {
            imageUrl = `${API_BASE_URL}${institution.image.image_url}`;
          }

          return (
            <Link
              to={`/banks/${institution.id}`}
              key={institution.id || institution.name}
              className='block mb-6 overflow-hidden border rounded-lg transition-transform transform hover:scale-102 hover:shadow-lg'
            >
              <div className='flex flex-col md:flex-row p-0'>
                <div className='md:w-64 h-48 md:h-auto flex-shrink-0'>
                  <img
                    src={imageUrl}
                    alt={`${institution.name}`}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      e.target.src = "/api/placeholder/400/320";
                      console.log("Image failed to load:", imageUrl);
                    }}
                  />
                </div>
                <div className='p-6 flex-grow'>
                  <h2 className='text-xl text-blue-800 mb-2'>
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

                  {/* Highlight if this is a top-rated or most-reviewed bank */}
                  {activeFilter === "rating" && (
                    <div className='mb-2'>
                      <span className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium'>
                        Top Rated
                      </span>
                    </div>
                  )}

                  {activeFilter === "review" && (
                    <div className='mb-2'>
                      <span className='bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium'>
                        Most Reviewed
                      </span>
                    </div>
                  )}

                  <p className='text-gray-700 mb-4'>
                    {institution.description?.length > 200
                      ? `${institution.description.substring(0, 200)}... `
                      : institution.description}
                    {institution.description?.length > 200 && (
                      <span className='text-blue-600'>more</span>
                    )}
                  </p>
                  <p className='text-gray-600 flex items-center'>
                    <MapPin className='w-4 h-4 mr-1' /> {institution.location}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {!loading && institutions.length === 0 && (
        <div className='text-center py-10'>No banks found</div>
      )}

      {/* Pagination - similar to the Users component */}
      {institutions.length > 0 && (
        <div className='mt-10 mb-6 flex items-center justify-center gap-2'>
          <span
            className='px-4 py-2 border rounded-lg bg-white text-blue-600 cursor-pointer'
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            Previous
          </span>

          {pageNumbers.map((number) => (
            <span
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-4 py-2 border rounded-lg cursor-pointer ${
                currentPage === number
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600"
              }`}
            >
              {number}
            </span>
          ))}

          <span
            className='px-4 py-2 border rounded-lg bg-white text-blue-600 cursor-pointer'
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            Next
          </span>
        </div>
      )}
    </div>
  );
};

export default Bank;