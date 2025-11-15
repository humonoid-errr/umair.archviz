import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Project } from '../types';
import { FullscreenIcon } from './icons/FullscreenIcon';
import { CloseIcon } from './icons/CloseIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface GalleryPageProps {
  project: Project;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ project }) => {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const [activeFullscreenArrow, setActiveFullscreenArrow] = useState<'left' | 'right' | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1); // -1 for precision
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScrollability();
      el.addEventListener('scroll', checkScrollability);
      window.addEventListener('resize', checkScrollability);
      return () => {
        el.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [checkScrollability]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };


  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
  };

  const closeFullscreen = useCallback(() => {
    setFullscreenIndex(null);
  }, []);

  const goToNextImage = useCallback(() => {
    if (fullscreenIndex === null) return;
    const isLastImage = fullscreenIndex === project.galleryImages.length - 1;
    setFullscreenIndex(isLastImage ? 0 : fullscreenIndex + 1);
  }, [fullscreenIndex, project.galleryImages.length]);

  const goToPreviousImage = useCallback(() => {
    if (fullscreenIndex === null) return;
    const isFirstImage = fullscreenIndex === 0;
    setFullscreenIndex(isFirstImage ? project.galleryImages.length - 1 : fullscreenIndex - 1);
  }, [fullscreenIndex, project.galleryImages.length]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    const swipeThreshold = 50; // pixels

    if (deltaX > swipeThreshold) {
      goToPreviousImage();
    } else if (deltaX < -swipeThreshold) {
      goToNextImage();
    }
    setTouchStartX(null); // Reset for next swipe
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (fullscreenIndex === null) return;
      if (event.key === 'Escape') {
        closeFullscreen();
      } else if (event.key === 'ArrowRight') {
        goToNextImage();
      } else if (event.key === 'ArrowLeft') {
        goToPreviousImage();
      }
    };

    if (fullscreenIndex !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [fullscreenIndex, closeFullscreen, goToNextImage, goToPreviousImage]);
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (fullscreenIndex === null) return;
      const { clientX } = event;
      const threshold = window.innerWidth / 3;

      if (clientX < threshold) {
        setActiveFullscreenArrow('left');
      } else if (clientX > window.innerWidth - threshold) {
        setActiveFullscreenArrow('right');
      } else {
        setActiveFullscreenArrow(null);
      }
    };
    
    const handleMouseLeave = () => {
      setActiveFullscreenArrow(null);
    };

    const currentRef = fullscreenContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
      currentRef.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('mousemove', handleMouseMove);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [fullscreenIndex]);

  const handlePreviousClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToPreviousImage();
  };
  
  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToNextImage();
  };

  return (
    <>
      <section className="min-h-screen md:h-screen w-full flex flex-col bg-white text-gray-800 md:pt-32 overflow-x-hidden md:overflow-y-hidden">
        <div className="px-8 md:px-16 w-full border-t border-gray-300 pt-10 pb-8 md:hidden mt-24">
          <h1 className="text-3xl font-light uppercase tracking-[0.2em]">
            {project.name}
          </h1>
        </div>

        {/* Mobile: Vertical Grid */}
        <div className="flex-grow w-full px-8 pb-16 md:hidden">
          <div className="grid grid-cols-1 gap-8">
            {project.galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="relative w-full cursor-pointer group"
                onClick={() => openFullscreen(index)}
              >
                <img
                  src={image}
                  alt={`${project.name} gallery image ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FullscreenIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Horizontal Scroll */}
        <div className="hidden md:block flex-grow w-full relative group/gallery border-t border-gray-300">
           <div 
              ref={scrollContainerRef}
              className="h-[calc(100vh-12.5rem)] flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {project.galleryImages.map((image, index) => (
                <div 
                  key={index} 
                  className="relative group/image flex-shrink-0 snap-center w-auto h-full px-4 first:pl-16 last:pr-16"
                >
                  <img
                    src={image}
                    alt={`${project.name} gallery image ${index + 1}`}
                    className="h-full w-auto object-contain"
                    onLoad={checkScrollability}
                  />
                   <div
                      onClick={() => openFullscreen(index)}
                      className="absolute top-4 right-8 bg-white/50 backdrop-blur-sm p-3 rounded-full text-gray-800 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 hover:bg-white/80 cursor-pointer"
                    >
                      <FullscreenIcon className="w-5 h-5" />
                    </div>
                </div>
              ))}
            </div>

            {canScrollLeft && (
              <button 
                onClick={() => handleScroll('left')}
                className="absolute left-8 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-white/50 backdrop-blur-sm shadow-lg opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-white/80"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
              </button>
            )}
            {canScrollRight && (
              <button 
                onClick={() => handleScroll('right')}
                className="absolute right-8 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-white/50 backdrop-blur-sm shadow-lg opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-white/80"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-800" />
              </button>
            )}
        </div>

        <footer className="w-full text-center text-sm text-gray-500 py-8 mt-auto">
          © Mohd Umair 2025
        </footer>
      </section>

      {fullscreenIndex !== null && (
        <div 
          ref={fullscreenContainerRef}
          className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-fadeIn overflow-hidden"
          onClick={closeFullscreen}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button 
            onClick={closeFullscreen}
            className="absolute top-6 right-6 text-gray-800 hover:opacity-70 transition-opacity z-50 p-2"
            aria-label="Close fullscreen view"
          >
            <CloseIcon className="w-8 h-8" />
          </button>
          
          <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handlePreviousClick}
              className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/5 hover:bg-black/10 transition-all duration-300 opacity-100 md:opacity-0 ${activeFullscreenArrow === 'left' ? 'md:opacity-100' : ''}`}
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-8 h-8 text-gray-800" />
            </button>

            <div
              className="w-full h-full flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${fullscreenIndex * 100}%)` }}
            >
              {project.galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0 flex items-center justify-center p-8 md:p-16"
                >
                  <img
                    src={image}
                    alt={`${project.name} gallery image ${index + 1} fullscreen`}
                    className="max-w-full max-h-full object-contain shadow-2xl"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleNextClick}
              className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/5 hover:bg-black/10 transition-all duration-300 opacity-100 md:opacity-0 ${activeFullscreenArrow === 'right' ? 'md:opacity-100' : ''}`}
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-8 h-8 text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryPage;