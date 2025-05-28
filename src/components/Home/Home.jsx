
import Detail from "../Imageslider/Detail";
import slider1 from '../../assets/img/slider1.png';
import slider2 from '../../assets/img/slider2.png';
import slider3 from '../../assets/img/slider3.png';
import slider4 from '../../assets/img/slider4.png';
import { Utensils, Building2, Hotel, Building, Home as HomeIcon, MoreHorizontal } from 'lucide-react';
import scan from '../../assets/img/scan.png';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Reviews from "../Reviews/Reviews";


const Home = () => {
  const ip = import.meta.env.VITE_IP;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Map lucide icons to category names
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      "Food/Drinks": <Utensils size={48} className="text-blue-800" />,
      "Financial Services": <Building2 size={48} className="text-blue-800" />,
      "Hotel/Travels": <Hotel size={48} className="text-blue-800" />,
      "Health/Medical": <Building size={48} className="text-blue-800" />,
      "Home/Services": <HomeIcon size={48} className="text-blue-800" />,
      // "More/more": <MoreHorizontal size={48} className="text-blue-800" />,
    };
    
    return iconMap[categoryName]  || <HomeIcon size={48} className="text-blue-800" />;
  };

  // Map category names to path routes
  const getCategoryPath = (categoryName) => {
    const pathMap = {
      "Food/Drinks": "/restaurents",
      "Finincial Services": "/banks",
      "Hotel/Travels": "/hotels",
      "Health/Medical": "/hospitals",
      "Home Services": "/homeservices",
    };

    return pathMap[categoryName] || "/homeservices";
   
  };

  const fetchCategories = () => {
    setLoading(true);
    let token = localStorage.getItem("token");
    
    axios({
      url: `https://murakozebacked-production.up.railway.app/api/institutions`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.data && response.data.categories) {
          setCategories(response.data.categories);
        } else {
          setError("Invalid data format received from API");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setError("Failed to fetch categories");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const slides = [
    {
      image: slider1,
      title: "Bank With Ease",
      buttonText: "Banks",
    },
    {
      image: slider2,
      title: "Grab A Bite",
      buttonText: "Restaurants",
    },
    {
      image: slider3,
      title: "Your Health Matters",
      buttonText: "Hospitals",
    },
    {
      image: slider4,
      title: "Find a place to Stay",
      buttonText: "Hotels",
    },
  ];
  
  // Handle category click to navigate to the correct page with ID
  const handleCategoryClick = (category) => {
    const path = getCategoryPath(category.name);
    navigate(path)
  };

  return (
    <>
      <div className="">
        <Detail slides={slides} />
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4">
       <Reviews />

        {/* Categories Section */}
        <div className="py-12">
          <h2 className="text-2xl font-bold text-center mb-8">Categories</h2>
          
          {loading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-blue-50 rounded-lg p-8 flex flex-col items-center justify-center h-60 cursor-pointer transition-transform hover:scale-105"
                >
                  <div className="mb-4">{getCategoryIcon(category.name)}</div>
                  <h3 className="text-lg font-medium text-center">{category.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QR Section */}
        <div className="mb-12">
          <div className="relative w-full py-16 bg-gradient-to-r from-blue-900 to-blue-700 text-white overflow-hidden rounded-[32px]">
            <div className="absolute inset-0 z-0">
              <img src={scan} alt="Background" className="w-full h-full object-cover opacity-90" />
            </div>
            <div className="relative z-10 text-center px-4">
              <p className="text-lg mb-2">Make Your Voice Heard!</p>
              <h2 className="text-3xl font-bold mb-12">
                Download Murakoze today and start making a difference!
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                {/* Android QR */}
                <div className="flex flex-col items-center">
                  <p className="text-xl mb-4">Android</p>
                  <div className="bg-white p-3 rounded-lg">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://play.google.com/store/apps/murakoze"
                      alt="Android QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                </div>

                {/* iOS QR */}
                <div className="flex flex-col items-center">
                  <p className="text-xl mb-4">iOS</p>
                  <div className="bg-white p-3 rounded-lg">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://apps.apple.com/us/app/murakoze"
                      alt="iOS QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

