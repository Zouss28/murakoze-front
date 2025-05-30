
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Scale = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service, institution, answers = [], token } = location.state || {};

  const [selected, setSelected] = useState(null);

  const handleSubmit = async () => {
    if (selected === null) return;
    const token = localStorage.getItem("token");

    const data = {
      answers: [
        ...answers,
        {
          question_id: 1,
          scale_rating: selected,
        },
      ],
    };

  try {
    const token = localStorage.getItem("token");
    await axios.post(
      "https://murakozebacked-production.up.railway.app/api/review/Q&A/post",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  
    toast.success("Feedback submitted successfully!");
    console.log(data);
    setTimeout(() => {
      navigate("/last");
    }, 1500);
  } catch (error) {
    console.error("Error submitting scale:", error);
    toast.error("Failed to submit feedback");
  }
  };  

  const renderNumber = (num, color) => {
    const colors = {
      red: { bg: "#fee2e2", border: "#dc2626", text: "#dc2626" },
      yellow: { bg: "#fef3c7", border: "#d97706", text: "#d97706" },
      green: { bg: "#dcfce7", border: "#16a34a", text: "#16a34a" },
    };

    return (
      <div
        key={num}
        onClick={() => setSelected(Number(num))}
        style={{
          backgroundColor: selected === Number(num) ? colors[color].bg : "",
          borderColor: colors[color].border,
        }}
        className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center cursor-pointer transition-colors`}
      >
        <div
          style={{ color: colors[color].text }}
          className={`text-base md:text-xl font-bold`}
        >
          {num}
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='text-center max-w-6xl w-full'>
        <ToastContainer position='top-center' />

        {/* Header */}
        <div className='mb-8 md:mb-12 px-2'>
          <div className='text-gray-600 text-base md:text-lg mb-4 md:mb-6'>
            {institution?.name} ({service?.name})
          </div>
          <div className='text-black text-lg md:text-xl font-medium'>
            On a scale 0 to 10, how likely are you to recommend this to a
            friend?
          </div>
        </div>

        {/* Scale numbers */}
        <div className='flex flex-wrap justify-center items-center gap-3 md:gap-4 mb-6 px-2'>
          {[...Array(11).keys()].map((num) => {
            const color = num <= 6 ? "red" : num <= 8 ? "yellow" : "green";
            return renderNumber(num, color);
          })}
        </div>

        {/* Scale labels */}
        <div className='flex justify-between items-center mb-10 md:mb-12 max-w-4xl mx-auto px-4'>
          <div className='text-red-700 text-sm font-medium'>Not Likely</div>
          <div className='text-green-600 text-sm font-medium'>Most Likely</div>
        </div>

        {/* Continue button */}
        <div className='flex justify-center'>
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className='bg-[#20497F] text-white rounded-lg px-8 py-3 md:px-12 md:py-4 cursor-pointer hover:bg-blue-700 transition-colors disabled'
          >
            <div className='text-base md:text-lg font-medium'>Continue</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scale;

