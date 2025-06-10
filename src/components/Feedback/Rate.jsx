
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Rate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service, institution } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!service || !institution) {
      navigate("/");
      return;
    }

    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://murakozebacked-production.up.railway.app/api/review/Q&A?service_id=${service.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Failed to load questions", err);
      }
    };

    fetchQuestions();
  }, [service, institution, navigate]);

  const handleAnswer = (choice) => {
    const currentQuestion = questions[currentIndex];
    setAnswers((prev) => [
      ...prev,
      {
        question_id: currentQuestion.id,
        answer: choice,
      },
    ]);

    // Move to next or go to scale
    if (currentIndex === questions.length - 1) {
      navigate("/scale", {
        state: {
          service,
          institution,
          answers: [
            ...answers,
            {
              question_id: currentQuestion.id,
              answer: choice,
            },
          ],
        },
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    const currentQuestion = questions[currentIndex];

    // Optionally store skipped state
    setAnswers((prev) => [
      ...prev,
      {
        question_id: currentQuestion.id,
        skipped: true,
      },
    ]);

    // Move to next or go to scale
    if (currentIndex === questions.length - 1) {
      navigate("/scale", {
        state: {
          service,
          institution,
          answers: [
            ...answers,
            {
              question_id: currentQuestion.id,
              skipped: true,
            },
          ],
        },
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!service || !institution || questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  // const choices = JSON.parse(currentQuestion.choices || "[]");
  const choices = JSON.parse(
    (currentQuestion.choices || "[]").replace(/[“”]/g, '"')
  );

  
  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='text-center max-w-4xl'>
        <div className='mb-8 md:mb-12'>
          <div className='text-gray-600 text-base md:text-lg mb-4 md:mb-6'>
            {institution.name} ({service.name})
          </div>
          <div className='text-black text-lg md:text-xl font-medium'>
            {currentQuestion.question}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
          {choices.map((choice, idx) => (
            <div
              key={idx}
              className='bg-[#A3A1AA] text-black rounded-lg px-6 py-10 cursor-pointer hover:bg-gray-500 transition-colors w-full md:w-80 h-32 flex items-center justify-center mx-auto'
              onClick={() => handleAnswer(choice)}
            >
              <div className='text-base md:text-lg font-medium'>{choice}</div>
            </div>
          ))}

          {/* Skip to next question */}
          <div
            onClick={handleSkip}
            className='bg-[#20497F] text-white rounded-lg px-6 py-10 cursor-pointer hover:bg-blue-700 transition-colors w-full md:w-80 h-32 flex items-center justify-center mx-auto'
          >
            <div className='text-base md:text-lg font-medium'>
              Skip to the next question
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rate;

