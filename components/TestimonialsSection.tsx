
import React, { useState } from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { getOptimizedImage } from '../utils/imageOptimizer';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "It was high quality work. This guy is flexible and does what his clients need. I would definitely use him again.",
    name: "Glen Wells",
    role: "Client",
    image: "https://cdn.jsdelivr.net/gh/humonoid-errr/umair.archviz@main/testimonials/Glen%20Wells.png"
  },
  {
    id: 2,
    quote: "Team is very helpful and easy to talk to. They understood our need quickly and did a good job.",
    name: "Mohd Nadeem",
    role: "Client",
    image: "https://cdn.jsdelivr.net/gh/humonoid-errr/umair.archviz@main/testimonials/Nadeem.png"
  },
  {
    id: 3,
    quote: "The attention to detail was second to none, and they read the plans correctly, which meant very few revisions were needed. I'm very happy with the results.",
    name: "Tim Dunlop",
    role: "Client",
    image: "https://cdn.jsdelivr.net/gh/humonoid-errr/umair.archviz@main/testimonials/Tim.png"
  },
  {
    id: 4,
    quote: "They really knew how to fix the issues in my project. Everything was sorted quickly and properly. I’ll definitely reach out again if I face something I can't handle myself. Thanks a lot!!!",
    name: "Darren K",
    role: "Client",
    image: "https://cdn.jsdelivr.net/gh/humonoid-errr/umair.archviz@main/testimonials/darren.png"
  },
  {
    id: 5,
    quote: "Good communication, work was done before time will definately hire again.",
    name: "Mark Knox",
    role: "Client",
    image: "https://cdn.jsdelivr.net/gh/humonoid-errr/umair.archviz@main/testimonials/marck.png"
  },
  {
    id: 6,
    quote: "Thanks for the great work! Very professional, yet friendly. I felt comfortable discussing everything with them.",
    name: "Ranjit K",
    role: "Client",
    image: "https://cdn.jsdelivr.net/gh/humonoid-errr/umair.archviz@main/testimonials/ranjeet.png"
  }
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="min-h-screen md:h-screen md:overflow-hidden w-full flex flex-col bg-white text-gray-800 px-8 md:px-24 pt-24 md:pt-32 pb-4">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col border-t border-gray-300 pt-10">
        
        <div className="flex-grow flex flex-col justify-center items-center">
          {/* Quote Section - Reduced min-h to pull content up */}
          <div className="w-full max-w-4xl relative flex items-center justify-between gap-4 md:gap-12 mb-4 md:mb-10 min-h-[300px] md:min-h-[300px]">
            <button 
              onClick={handlePrevious}
              className="hidden md:block p-4 rounded-full hover:bg-gray-50 transition-all duration-300 text-gray-400 hover:text-gray-800 flex-shrink-0 hover:scale-110 active:scale-95"
              aria-label="Previous testimonial"
            >
              <span className="block transform rotate-180 text-4xl font-light leading-none border-l border-b border-gray-300 w-8 h-8 translate-x-2 -translate-y-1 origin-center rotate-45"></span>
            </button>

            <div className="flex-1 text-center px-4 md:px-12 animate-contentFadeIn flex items-center justify-center h-full" key={currentIndex}>
              <p className="text-2xl md:text-4xl font-serif italic leading-relaxed text-gray-800">
                “{currentTestimonial.quote}”
              </p>
            </div>

            <button 
              onClick={handleNext}
              className="hidden md:block p-4 rounded-full hover:bg-gray-50 transition-all duration-300 text-gray-400 hover:text-gray-800 flex-shrink-0 hover:scale-110 active:scale-95"
              aria-label="Next testimonial"
            >
              <span className="block transform rotate-45 text-4xl font-light leading-none border-t border-r border-gray-300 w-8 h-8 -translate-x-2 translate-y-0"></span>
            </button>
          </div>
          
          {/* Mobile Navigation - Moved out of relative container to prevent overlap */}
          <div className="md:hidden flex justify-center gap-12 mb-6 w-full">
              <button onClick={handlePrevious} className="p-2 text-gray-500 hover:text-gray-800 transition-colors hover:scale-110 active:scale-95">
                  <ChevronLeftIcon className="w-8 h-8" />
              </button>
              <button onClick={handleNext} className="p-2 text-gray-500 hover:text-gray-800 transition-colors hover:scale-110 active:scale-95">
                  <ChevronRightIcon className="w-8 h-8" />
              </button>
          </div>

          {/* Avatar Selector - Added bottom padding to lift off footer */}
          <div className="flex flex-col items-center w-full pb-8">
            <div className="flex items-center justify-center gap-2 md:gap-6 h-24 mb-6 w-full max-w-full overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {testimonials.map((item, index) => {
                const isActive = index === currentIndex;
                // Optimize avatars to be small (200px is more than enough for retina displays)
                const optimizedAvatar = getOptimizedImage(item.image, 200, 80);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(index)}
                    className={`relative rounded-full overflow-hidden transition-all duration-500 ease-in-out flex-shrink-0 ${
                      isActive 
                        ? 'w-16 h-16 md:w-24 md:h-24 shadow-xl scale-110 grayscale-0 ring-4 ring-gray-50' 
                        : 'w-10 h-10 md:w-14 md:h-14 opacity-50 hover:opacity-80 grayscale scale-100'
                    }`}
                    aria-label={`View testimonial from ${item.name}`}
                  >
                    <img 
                      src={optimizedAvatar} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </button>
                );
              })}
            </div>
            
            <div className="text-center animate-fadeIn" key={`info-${currentIndex}`}>
              <h3 className="text-lg md:text-xl font-medium text-gray-900">{currentTestimonial.name}</h3>
              <p className="text-sm md:text-base text-gray-500 font-light mt-1">{currentTestimonial.role}</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full text-center text-sm text-gray-500 py-4 mt-auto">
        © Mohd Umair 2025
      </footer>
    </section>
  );
};

export default TestimonialsSection;
