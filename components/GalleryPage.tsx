
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Project } from '../types';
import { FullscreenIcon } from './icons/FullscreenIcon';
import { CloseIcon } from './icons/CloseIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { getOptimizedImage } from '../utils/imageOptimizer';

interface GalleryPageProps {
  project: Project;
}

// Internal component for Progressive Image Loading
const ProgressiveImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  draggable?: boolean;
  onContextMenu?: (e: React.MouseEvent) => void;
  onLoad?: () => void;
}> = ({ src, alt, className, loading, draggable, onContextMenu, onLoad }) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Create a tiny blurred thumbnail URL
  const tinySrc = getOptimizedImage(src, 20, 20);

  useEffect(() => {
    // Start with the tiny placeholder
    setCurrentSrc(tinySrc);
    setIsLoaded(false);

    // Load the full image in background
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      if (onLoad) onLoad();
    };
  }, [src, tinySrc, onLoad]);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* Background blur placeholder (visible until main image loads) */}
       <img
          src={tinySrc}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover filter blur-xl scale-110 transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
          draggable={false}
        />
        
      {/* Main Image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={loading}
        draggable={draggable}
        onContextMenu={onContextMenu}
      />
    </div>
  );
};


const GalleryPage: React.FC<GalleryPageProps> = ({ project }) => {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [activeFullscreenArrow, setActiveFullscreenArrow] = useState<'left' | 'right' | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Use the defined order directly from the project data
  const galleryImages = project.galleryImages;

  // Reset scroll position when switching projects
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
    window.scrollTo(0, 0);
    setFullscreenIndex(null);
  }, [project.id]);

  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1); // -1 for precision
    }
  }, []);
  
  // Mobile Scroll to Top Visibility
  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Parallax Effect Logic
  useEffect(() => {
    let animationFrameId: number;

    const updateParallax = () => {
      const isMobile = window.innerWidth < 1024; // Updated to match lg breakpoint
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      imageRefs.current.forEach((img) => {
        if (!img) return;

        const rect = img.getBoundingClientRect();

        if (isMobile) {
          // Vertical Parallax for Mobile/Tablet/Landscape Mobile
          // Only animate if the image is somewhat visible
          if (rect.bottom > 0 && rect.top < viewportHeight) {
            const center = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const dist = center - viewportCenter;
            // Move image opposite to scroll direction
            const shift = dist * -0.1; 
            img.style.transform = `scale(1.1) translateY(${shift}px)`;
          }
        } else {
          // Horizontal Parallax for Desktop
          // Only animate if visible horizontally
          if (rect.right > 0 && rect.left < viewportWidth) {
            const center = rect.left + rect.width / 2;
            const viewportCenter = viewportWidth / 2;
            const dist = center - viewportCenter;
            const shift = dist * -0.08;
            img.style.transform = `scale(1.1) translateX(${shift}px)`;
          }
        }
      });

      animationFrameId = requestAnimationFrame(updateParallax);
    };

    updateParallax();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [project]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      // Loop to start if clicking right at the end
      if (direction === 'right' && !canScrollRight) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }
      // Loop to end if clicking left at the start
      if (direction === 'left' && !canScrollLeft) {
        el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
        return;
      }

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
    const isLastImage = fullscreenIndex === galleryImages.length - 1;
    setFullscreenIndex(isLastImage ? 0 : fullscreenIndex + 1);
  }, [fullscreenIndex, galleryImages.length]);

  const goToPreviousImage = useCallback(() => {
    if (fullscreenIndex === null) return;
    const isFirstImage = fullscreenIndex === 0;
    setFullscreenIndex(isFirstImage ? galleryImages.length - 1 : fullscreenIndex - 1);
  }, [fullscreenIndex, galleryImages.length]);
  
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

  // Determine if arrows should show (if content overflows)
  const showArrows = canScrollLeft || canScrollRight;

  return (
    <>
      <section className="min-h-screen lg:h-screen w-full flex flex-col bg-white text-gray-800 pt-24 md:pt-32 overflow-x-hidden lg:overflow-y-hidden">
        
        {/* Mobile/Tablet/Landscape Mobile: Vertical Grid */}
        <div className="flex-grow w-full px-8 pb-16 lg:hidden border-t border-gray-300 pt-10">
          <div className="grid grid-cols-1 gap-8">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="relative w-full cursor-pointer group overflow-hidden rounded-sm flex items-center justify-center bg-gray-50 min-h-[200px]"
                onClick={() => openFullscreen(index)}
              >
                <div className="max-w-full max-h-[80vh] w-auto h-auto transition-transform duration-500 ease-out will-change-transform mx-auto group-hover:scale-[1.02]">
                  <ProgressiveImage
                    src={getOptimizedImage(image, 800, 75)}
                    alt={`${project.name} gallery image ${index + 1}`}
                    loading={index < 2 ? "eager" : "lazy"}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <FullscreenIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Horizontal Scroll */}
        <div className="hidden lg:block flex-grow w-full relative group/gallery border-t border-gray-300">
           <div 
              ref={scrollContainerRef}
              className="h-[calc(100vh-12.5rem)] flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {galleryImages.map((image, index) => (
                <div 
                  key={index} 
                  className="relative group/image flex-shrink-0 snap-center w-auto h-full first:pl-16 last:pr-16 overflow-hidden flex items-center justify-center"
                >
                  <div className="h-full w-auto transition-transform duration-100 ease-linear will-change-transform">
                      <ProgressiveImage
                        src={getOptimizedImage(image, 1000, 80)}
                        alt={`${project.name} gallery image ${index + 1}`}
                        loading={index < 2 ? "eager" : "lazy"}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onLoad={checkScrollability}
                        className="h-full w-auto object-contain"
                      />
                  </div>
                   <div
                      onClick={() => openFullscreen(index)}
                      className="absolute top-4 right-8 bg-white/50 backdrop-blur-sm p-3 rounded-full text-gray-800 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 hover:bg-white/80 cursor-pointer z-10"
                    >
                      <FullscreenIcon className="w-5 h-5" />
                    </div>
                </div>
              ))}
            </div>

            {showArrows && (
              <button 
                onClick={() => handleScroll('left')}
                className="absolute left-8 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-white/50 backdrop-blur-sm shadow-lg opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-white/80"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
              </button>
            )}
            {showArrows && (
              <button 
                onClick={() => handleScroll('right')}
                className="absolute right-8 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-white/50 backdrop-blur-sm shadow-lg opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-white/80"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-800" />
              </button>
            )}
        </div>

        <footer className="w-full text-center text-sm text-gray-500 py-8 mt-auto">
          © Mohd Umair 2025
        </footer>
      </section>

      {/* Scroll to Top Button (Mobile Only) */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-30 p-3 bg-black/80 backdrop-blur-sm border border-white/10 shadow-xl rounded-full text-white transition-all duration-300 lg:hidden hover:scale-110 active:scale-95 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
         <ChevronUpIcon className="w-6 h-6" />
      </button>

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
            className="absolute top-6 right-6 text-gray-800 hover:opacity-70 transition-opacity z-50 p-2 hover:scale-110 active:scale-95"
            aria-label="Close fullscreen view"
          >
            <CloseIcon className="w-8 h-8" />
          </button>
          
          <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handlePreviousClick}
              className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/5 hover:bg-black/10 transition-all duration-300 opacity-100 md:opacity-0 hover:scale-110 active:scale-95 ${activeFullscreenArrow === 'left' ? 'md:opacity-100' : ''}`}
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-8 h-8 text-gray-800" />
            </button>

            <div
              className="w-full h-full flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${fullscreenIndex * 100}%)` }}
            >
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0 flex items-center justify-center p-8 md:p-16"
                >
                  <div className="max-w-full max-h-full w-full h-full flex items-center justify-center">
                    <ProgressiveImage
                        src={getOptimizedImage(image, 1600, 90)}
                        alt={`${project.name} gallery image ${index + 1} fullscreen`}
                        loading={Math.abs(index - fullscreenIndex) <= 1 ? "eager" : "lazy"}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        className="max-w-full max-h-full object-contain shadow-2xl"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNextClick}
              className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/5 hover:bg-black/10 transition-all duration-300 opacity-100 md:opacity-0 hover:scale-110 active:scale-95 ${activeFullscreenArrow === 'right' ? 'md:opacity-100' : ''}`}
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
