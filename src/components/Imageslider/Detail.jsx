
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Detail = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] w-full overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-[258px] bg-blue-800 z-10 flex flex-col justify-center px-6">
        <h2 className="text-white text-2xl font-semibold mb-4">
          {slides[currentIndex].title}
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm flex items-center transition-colors max-w-[160px]">
          {slides[currentIndex].buttonText} →
        </button>
      </div>

      <div
        className="h-full w-full bg-center bg-cover transition-all duration-500"
        style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
      ></div>

      <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between z-20">
        <button
          onClick={goToPrevious}
          className="text-white ml-[274px]"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          className="text-white mr-4"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Detail;
