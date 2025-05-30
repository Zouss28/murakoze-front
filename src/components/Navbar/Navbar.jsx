
import React, { useState, useEffect } from "react";
import { Search, ChevronDown, User, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/img/logo.jpeg";
import { useParams } from "react-router-dom";

const Navbar = () => {
  const { id } = useParams();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Search functionality states
  const [showInput, setShowInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const toggleInput = () => {
    setShowInput((prev) => !prev);
    if (showInput) {
      setSearchQuery("");
      setShowResults(false);
      setFilteredCategories([]);
      setError(null);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setError(null);

    if (query.trim() === "") {
      setFilteredCategories([]);
      setShowResults(false);
      return;
    }

    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://murakozebacked-production.up.railway.app/api/search/categories?q=${encodeURIComponent(
          query
        )}&page=1&pageSize=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      let categoriesData = [];
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        categoriesData = res.data.data;
      } else if (
        res.data &&
        res.data.categories &&
        Array.isArray(res.data.categories)
      ) {
        categoriesData = res.data.categories;
      } else if (res.data && Array.isArray(res.data)) {
        categoriesData = res.data;
      }

      setFilteredCategories(categoriesData);
      setShowResults(true);
    } catch (err) {
      console.error("Error searching categories:", err);
      setError("Failed to search categories");
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setShowResults(false);
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://murakozebacked-production.up.railway.app/api/search/institutions?q=${encodeURIComponent(
            searchQuery
          )}&page=1&pageSize=5`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const institutionsData = res.data?.data || [];

        if (institutionsData.length > 0) {
          navigate(`/institutions/${institutionsData[0].id}`);
          setSearchQuery("");
          setShowInput(false);
        } else {
          setError("No matching institutions found");
          setTimeout(() => setError(null), 3000);
        }
      } catch (err) {
        console.error("Error searching institutions:", err);
        setError(
          err.response?.data?.message || "Failed to search institutions"
        );
        setTimeout(() => setError(null), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCategoryClick = (category) => {
    setSearchQuery(category.name);
    setShowResults(false);
  };

  const navItems = [
    {
      title: "Food Drinks",
      hasDropdown: true,
      dropdownItems: [
        { label: "Restaurants", path: "/restaurents" },
        { label: "Bakeries", path: "/" },
        { label: "Fast Food", path: "/" },
      ],
    },
    {
      title: "Financial Services",
      hasDropdown: true,
      dropdownItems: [
        { label: "Banks", path: "banks" },
        { label: "Tax Services", path: "/" },
        { label: "Accountants", path: "/" },
      ],
    },
    {
      title: "Hotels/Travel",
      hasDropdown: true,
      dropdownItems: [
        { label: "Hotels", path: "/hotels" },
        { label: "Tours", path: "/" },
        { label: "Hostels", path: "/" },
      ],
    },
    {
      title: "Health/Medical",
      hasDropdown: true,
      dropdownItems: [
        { label: "Hospitals", path: "/hospitals" },
        { label: "Clinics", path: "/" },
        { label: "Pharmacies", path: "/" },
      ],
    },
    {
      title: "More",
      hasDropdown: true,
      dropdownItems: [],
    },
  ];

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    const tokenCheckInterval = setInterval(checkAuthStatus, 60000);
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      clearInterval(tokenCheckInterval);
    };
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = tokenData.exp * 1000;
        if (Date.now() >= expirationTime) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } catch {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showResults && !event.target.closest(".search-container")) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showResults]);

  const renderSearchResults = () => {
    if (loading) {
      return <div className='px-4 py-2 text-sm text-gray-500'>Loading...</div>;
    }

    if (error) {
      return <div className='px-4 py-2 text-sm text-red-500'>{error}</div>;
    }

    // Only show categories in dropdown, never institutions
    if (filteredCategories.length > 0) {
      return filteredCategories.map((category) => (
        <div
          key={category._id || category.id}
          className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-b border-gray-50 last:border-b-0'
          onClick={() => handleCategoryClick(category)}
        >
          <div className='font-medium'>{category.name}</div>
          {category.description && (
            <div className='text-xs text-gray-500 mt-1'>
              {category.description}
            </div>
          )}
        </div>
      ));
    } else {
      return (
        <div className='px-4 py-2 text-sm text-gray-500'>
          No categories found
        </div>
      );
    }
  };

  return (
    <nav className='w-full bg-white shadow-sm relative'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex-shrink-0 flex items-center'>
            <Link to='/' className='flex items-center'>
              <img src={logo} alt='Murakoze Logo' className='h-10' />
            </Link>
          </div>

          <div className='hidden sm:ml-6 sm:flex sm:items-center space-x-2 search-container'>
            <button
              onClick={toggleInput}
              className='p-2 bg-[#20497F] text-white rounded hover:bg-blue-800 transition-colors'
            >
              {showInput ? (
                <X className='h-5 w-5' />
              ) : (
                <Search className='h-5 w-5' />
              )}
            </button>

            {showInput && (
              <div className='relative'>
                <input
                  type='text'
                  placeholder='Search institutions... '
                  className='border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />

                {showResults && searchQuery.trim() !== "" && (
                  <div className='absolute left-0 mt-1 w-80 bg-white rounded-md shadow-lg z-50 max-h-60 overflow-y-auto border border-gray-200'>
                    {renderSearchResults()}
                  </div>
                )}

                {/* Show error message below input if exists */}
                {error && !showResults && (
                  <div className='absolute left-0 mt-1 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200'>
                    <div className='px-4 py-2 text-sm text-red-500'>
                      {error}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className='hidden sm:ml-6 sm:flex sm:items-center space-x-1'>
            {navItems.map((item, index) => (
              <div key={index} className='relative group'>
                <button
                  className='px-3 py-2 text-sm font-medium text-gray-700 flex items-center hover:text-[#0046AD] transition-colors'
                  onClick={() => toggleDropdown(index)}
                >
                  {item.title}
                  {item.hasDropdown && <ChevronDown className='ml-1 h-4 w-4' />}
                </button>
                {item.hasDropdown &&
                  activeDropdown === index &&
                  item.dropdownItems.length > 0 && (
                    <div className='absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200'>
                      {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          to={dropdownItem.path}
                          className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>

          <div className='hidden sm:ml-6 sm:flex sm:items-center space-x-3'>
            <Link
              to='/review'
              className='px-4 py-2 text-[#0046AD] border border-[#0046AD] rounded hover:bg-blue-50 text-sm font-medium transition-colors'
            >
              Write a Review
            </Link>
            {isLoggedIn ? (
              <div className='relative'>
                <button
                  className='flex items-center px-4 py-2 text-[#0046AD] border border-[#0046AD] rounded hover:bg-blue-50 text-sm font-medium transition-colors'
                  onClick={() => toggleDropdown("profile")}
                >
                  <User className='mr-2 h-4 w-4' />
                  My Account
                  <ChevronDown className='ml-1 h-4 w-4' />
                </button>
                {activeDropdown === "profile" && (
                  <div className='absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200'>
                    <Link
                      to='/overview'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to='/login'
                  className='px-4 py-2 text-[#0046AD] border border-[#0046AD] rounded hover:bg-blue-50 text-sm font-medium transition-colors'
                >
                  Log In
                </Link>
                <Link
                  to='/signup'
                  className='px-4 py-2 bg-[#20497F] text-white rounded hover:bg-blue-700 text-sm font-medium transition-colors'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className='sm:hidden flex items-center'>
            <button
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className='px-2 pt-2 pb-3 space-y-1'>
          {/* Mobile search bar */}
          <div className='px-3 py-2 search-container'>
            <div className='flex items-center border border-gray-300 rounded overflow-hidden'>
              <input
                type='text'
                placeholder='Search institutions... (Press Enter)'
                className='flex-grow px-3 py-2 focus:outline-none'
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={() => {
                  if (searchQuery) {
                    setSearchQuery("");
                    setShowResults(false);
                    setFilteredCategories([]);
                    setError(null);
                  }
                }}
                className='px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors'
              >
                {searchQuery ? (
                  <X className='h-4 w-4' />
                ) : (
                  <Search className='h-4 w-4' />
                )}
              </button>
            </div>

            {showResults && searchQuery.trim() !== "" && (
              <div className='mt-1 bg-white rounded-md shadow-lg z-50 max-h-60 overflow-y-auto border border-gray-200'>
                {renderSearchResults()}
              </div>
            )}

            {/* Show error message for mobile */}
            {error && !showResults && (
              <div className='mt-1 bg-white rounded-md shadow-lg z-50 border border-gray-200'>
                <div className='px-4 py-2 text-sm text-red-500'>{error}</div>
              </div>
            )}
          </div>

          {navItems.map((item, index) => (
            <div key={index}>
              <button
                className='w-full text-left px-3 py-2 text-base font-medium text-gray-700 flex items-center justify-between hover:bg-gray-50 transition-colors'
                onClick={() => toggleDropdown(index)}
              >
                {item.title}
                {item.hasDropdown && <ChevronDown className='ml-1 h-4 w-4' />}
              </button>
              {activeDropdown === index && item.dropdownItems.length > 0 && (
                <div className='pl-4 pr-2 py-2 bg-gray-50'>
                  {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                    <Link
                      key={dropdownIndex}
                      to={dropdownItem.path}
                      className='block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors'
                    >
                      {dropdownItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className='pt-4 pb-3 border-t border-gray-200'>
            <div className='flex items-center px-5 space-y-3 flex-col'>
              <Link
                to='/review'
                className='w-full px-4 py-2 text-[#0046AD] border border-[#0046AD] rounded hover:bg-blue-50 text-sm font-medium text-center transition-colors'
              >
                Write a Review
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    to='/profile'
                    className='w-full px-4 py-2 text-[#0046AD] border border-[#0046AD] rounded hover:bg-blue-50 text-sm font-medium text-center transition-colors'
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='w-full px-4 py-2 bg-[#20497F] text-white rounded hover:bg-blue-700 text-sm font-medium text-center transition-colors'
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to='/login'
                    className='w-full px-4 py-2 text-[#0046AD] border border-[#0046AD] rounded hover:bg-blue-50 text-sm font-medium text-center transition-colors'
                  >
                    Log In
                  </Link>
                  <Link
                    to='/signup'
                    className='w-full px-4 py-2 bg-[#20497F] text-white rounded hover:bg-blue-700 text-sm font-medium text-center transition-colors'
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;