
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import group from '../../assets/img/group.png';
import sticker from '../../assets/img/sticker.png';
import axios from 'axios';

const Writereview = () => {

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchInstitutions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://murakozebacked-production.up.railway.app/api/review/institution`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
       setInstitutions(res.data?.institutions || []);
      } catch (err) {
        console.error("Error fetching institutions", err);
        setError("Failed to load institutions");
      } finally {
        setLoading(false);
      }
    };
  
    fetchInstitutions();
  }, []);

  // Filter institutions based on search term
  const filteredInstitutions = institutions.filter(institution => 
    institution.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchClick = () => {
    setShowSuggestions(prev => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true); 
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-6xl'>
      <h1 className='text-xl font-bold text-blue-800 mb-2'>
        Share Your experience: Review a Business
      </h1>
      <p className='text-gray-700 mb-4'>
        Tell Us About Your Experience: Select a Business
      </p>

      <div className='flex flex-col lg:flex-row items-center justify-between mb-10 w-full'>
        <div className='w-full lg:w-auto mb-6 lg:mb-0'>
          <div className='flex relative'>
            <input
              type='text'
              placeholder="Let's Find a Business!"
              className='border border-gray-300 rounded-l p-2 w-64 focus:outline-none'
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={() => setShowSuggestions(true)}
            />
            <button
              className='bg-[#20497F] text-white px-4 rounded-r flex items-center justify-center'
              onClick={handleSearchClick}
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                ></path>
              </svg>
            </button>

            {showSuggestions && (
              <div className='absolute top-12 left-0 w-64 bg-white border border-gray-300 rounded shadow-md max-h-60 overflow-y-auto z-10'>
                {loading ? (
                  <div className='p-2 text-gray-500'>Loading...</div>
                ) : error ? (
                  <div className='p-2 text-red-500'>{error}</div>
                ) : filteredInstitutions.length > 0 ? (
                  filteredInstitutions.map((institution) => (
                    <Link
                      to='/service'
                      state={{ institution }}
                      className='block p-2 hover:bg-gray-100 cursor-pointer text-gray-700'
                      onClick={() => setShowSuggestions(false)}
                      key={institution.id}
                    >
                      {institution.name}
                    </Link>
                  ))
                ) : (
                  <div className='p-2 text-gray-500'>No businesses found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className='w-full lg:w-1/2 flex justify-end'>
          <img
            src={group}
            alt='Review illustration'
            className='w-full max-w-md'
          />
        </div>
      </div>

      <div className='flex flex-col lg:flex-row items-center justify-between mb-16'>
        <div className='lg:w-1/3 mb-8 lg:mb-0'>
          <h2 className='text-lg font-bold'>
            Loved a Place Lately? Leave a Review!
          </h2>
        </div>
      </div>

      <div className='flex flex-col items-center justify-center mt-16 text-center'>
        <div className='mb-6'>
          <img src={sticker} alt='Thumbs up with stars' className='w-24 h-24' />
        </div>
        <p className='text-blue-800'>
          No new suggestions at the moment, but keep exploring!
          <br />
          More coming soon.
        </p>
      </div>
    </div>
  );
};

export default Writereview;