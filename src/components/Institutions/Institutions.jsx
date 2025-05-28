
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Institutions = () => {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `https://murakozebacked-production.up.railway.app/api/search?q=q&page=1`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data?.data && response.data.data.length > 0) {
          setInstitutions(response.data.data);
        } else {
          setError("No institutions found");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching institutions:", err);
        setError(err.message || "Failed to load institutions");
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, [ navigate]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#20497F]'></div>
      </div>
    );
  }

  const parseButtonData = (buttonString) => {
    try {
      return buttonString ? JSON.parse(buttonString) : null;
    } catch (err) {
      console.error("Error parsing button data:", err);
      return null;
    }
  };

  
  const getImageUrl = (imageUrl) => {
    return `https://murakozebacked-production.up.railway.app/${imageUrl}`;
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-[#20497F] mb-8 text-left'>
        Institutions
      </h1>

      {institutions.length === 0 ? (
        <p className='text-center text-gray-600'>No institutions found</p>
      ) : (
        <div className='space-y-6'>
          {institutions.map((institution) => {
            const buttonOne = parseButtonData(institution.button_one);
            const buttonTwo = parseButtonData(institution.button_two);
            const hasImages =
              institution.images && institution.images.length > 0;

            return (
              <div
                key={institution.id}
                className='border-b border-gray-200 pb-6 last:border-0'
              >
                <div className='flex flex-col md:flex-row gap-6'>
                  {/* Left side - Image */}
                 
                  <div className='md:w-1/4 lg:w-1/5'>
                    {hasImages ? (
                      <div className='h-48 w-full bg-gray-100 rounded overflow-hidden'>
                        <img
                          src={getImageUrl(institution.images[0].image_url)}
                          alt={`${institution.name}`}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    ) : (
                      <div className='h-48 w-full bg-gray-100 rounded overflow-hidden'>
                        <div className='flex items-center justify-center h-full bg-gray-200'>
                          <span className='text-gray-400 text-4xl font-bold'>
                            {institution.name[0]}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right side - Content */}
                  <div className='md:w-3/4 lg:w-4/5'>
                    <div className='flex flex-col h-full'>
                      {/* Institution header */}
                      <div className='mb-2'>
                        <h2 className='text-2xl font-semibold text-[#20497F]'>
                          {institution.name}
                        </h2>
                      </div>
                      {institution.description && (
                        <p className='text-gray-700 mb-3 line-clamp-2'>
                          {institution.description}
                        </p>
                      )}
                      <div className='mb-4'>
                        {institution.address && (
                          <div className='flex items-start mb-1.5'>
                            <span className='text-gray-700 text-sm'>
                              {institution.address}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className='mb-4'>
                        {institution.email && (
                          <div className='flex items-start mb-1.5'>
                            <span className='text-gray-700 text-sm'>
                              {institution.email}
                            </span>
                          </div>
                        )}
                      </div>


                      {/* Buttons */}
                      <div className='flex flex-wrap gap-2 mt-auto'>
                        {buttonOne && buttonOne.type === "link" && (
                          <a
                            href={buttonOne.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='px-4 py-2 bg-[#20497F] text-white text-sm rounded hover:bg-blue-700'
                          >
                            {buttonOne.label}
                          </a>
                        )}

                        {buttonOne && buttonOne.type === "tooltip" && (
                          <div className='relative group'>
                            <button className='px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300'>
                              {buttonOne.label}
                            </button>
                            <div className='absolute z-10 hidden group-hover:block bg-white border rounded shadow-lg p-4 mt-1 min-w-max'>
                              <ul>
                                {buttonOne.content &&
                                  buttonOne.content.map((item, i) => (
                                    <li key={i} className='py-1 text-sm'>
                                      {item}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {buttonTwo && buttonTwo.type === "link" && (
                          <a
                            href={buttonTwo.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='px-4 py-2 bg-[#20497F] text-white text-sm rounded hover:bg-blue-700'
                          >
                            {buttonTwo.label}
                          </a>
                        )}

                        {buttonTwo && buttonTwo.type === "popup" && (
                          <div className='relative group'>
                            <button className='px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300'>
                              {buttonTwo.label}
                            </button>
                            <div className='absolute z-10 hidden group-hover:block bg-white border rounded shadow-lg p-4 mt-1 min-w-max'>
                              {buttonTwo.sections &&
                                buttonTwo.sections.map((section, i) => (
                                  <div key={i} className='mb-3 last:mb-0'>
                                    <h4 className='font-medium text-[#20497F] mb-1'>
                                      {section.title}
                                    </h4>
                                    <ul>
                                      {section.items &&
                                        section.items.map((item, j) => (
                                          <li key={j} className='py-1 text-sm'>
                                            {item.name}
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Institutions;