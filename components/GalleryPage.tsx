
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Project } from '../types';
import { FullscreenIcon } from './icons/FullscreenIcon';
import { CloseIcon } from './icons/CloseIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { getOptimizedImage, getRawAssetUrl, isImageUrl360 } from '../utils/imageOptimizer';

// Pannellum Type declaration for TS
declare global {
  interface Window {
    pannellum: any;
  }
}

interface GalleryPageProps {
  project: Project;
}

const ProgressiveImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "eager" | "lazy";
  draggable?: boolean;
  onContextMenu?: (e: React.MouseEvent) => void;
  onLoad?: () => void;
}> = ({ src, alt, className, style, loading, draggable, onContextMenu, onLoad }) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const is360 = isImageUrl360(src);
  const thumbSrc = is360 ? getOptimizedImage(src, 600, 60) : getOptimizedImage(src, 40, 20);

  useEffect(() => {
    setCurrentSrc(thumbSrc);
    setIsLoaded(false);
    const img = new Image();
    const rawUrl = getRawAssetUrl(src);
    img.src = rawUrl;
    img.onload = () => {
      setCurrentSrc(rawUrl);
      setIsLoaded(true);
      if (onLoad) onLoad();
    };
  }, [src, thumbSrc, onLoad]);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center" style={style}>
       {!is360 && (
         <img
            src={thumbSrc}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover filter blur-xl scale-110 transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
            draggable={false}
          />
       )}
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

  // Zoom and Pan State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPointerPos = useRef({ x: 0, y: 0 });

  // 360 Viewer State
  const pannellumViewerRef = useRef<any>(null);
  const pannellumContainerRef = useRef<HTMLDivElement>(null);
  const [is360Active, setIs360Active] = useState(false);
  const [is360Loading, setIs360Loading] = useState(false);
  const [isOverlayAnimationDone, setIsOverlayAnimationDone] = useState(false);

  const galleryImages = project.galleryImages;

  const isCurrentIndex360 = useCallback((index: number | null) => {
    if (index === null) return false;
    const url = galleryImages[index];
    return project.is360 || isImageUrl360(url);
  }, [project.is360, galleryImages]);

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
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  }, []);
  
  useEffect(() => {
    const handleWindowScroll = () => {
      setShowScrollTop(window.scrollY > 300);
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

  useEffect(() => {
    let animationFrameId: number;
    const updateParallax = () => {
      const isMobile = window.innerWidth < 1024;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      imageRefs.current.forEach((img) => {
        if (!img) return;
        const rect = img.getBoundingClientRect();
        if (isMobile) {
          if (rect.bottom > 0 && rect.top < viewportHeight) {
            const dist = (rect.top + rect.height / 2) - (viewportHeight / 2);
            img.style.transform = `scale(1.1) translateY(${dist * -0.1}px)`;
          }
        } else {
          if (rect.right > 0 && rect.left < viewportWidth) {
            const dist = (rect.left + rect.width / 2) - (viewportWidth / 2);
            img.style.transform = `scale(1.1) translateX(${dist * -0.08}px)`;
          }
        }
      });
      animationFrameId = requestAnimationFrame(updateParallax);
    };
    updateParallax();
    return () => cancelAnimationFrame(animationFrameId);
  }, [project]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      if (direction === 'right' && !canScrollRight) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }
      if (direction === 'left' && !canScrollLeft) {
        el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
        return;
      }
      const scrollAmount = el.clientWidth * 0.8;
      el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    isDragging.current = false;
  }, []);

  const openFullscreen = (index: number) => {
    resetZoom();
    setIsOverlayAnimationDone(false);
    setFullscreenIndex(index);
  };

  const closeFullscreen = useCallback(() => {
    if (pannellumViewerRef.current) {
      pannellumViewerRef.current.destroy();
      pannellumViewerRef.current = null;
    }
    setFullscreenIndex(null);
    setIsOverlayAnimationDone(false);
    resetZoom();
  }, [resetZoom]);

  const goToNextImage = useCallback(() => {
    if (fullscreenIndex === null) return;
    resetZoom();
    const isLastImage = fullscreenIndex === galleryImages.length - 1;
    setFullscreenIndex(isLastImage ? 0 : fullscreenIndex + 1);
  }, [fullscreenIndex, galleryImages.length, resetZoom]);

  const goToPreviousImage = useCallback(() => {
    if (fullscreenIndex === null) return;
    resetZoom();
    const isFirstImage = fullscreenIndex === 0;
    setFullscreenIndex(isFirstImage ? galleryImages.length - 1 : fullscreenIndex - 1);
  }, [fullscreenIndex, galleryImages.length, resetZoom]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel === 1) setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || zoomLevel > 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    setTouchStartX(null);
    if (deltaX > 50) goToPreviousImage();
    else if (deltaX < -50) goToNextImage();
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoomLevel(newZoom);
    if (is360Active && pannellumViewerRef.current) {
      // Mapping: zoomLevel 1 -> hfov 100, zoomLevel 3.25 -> hfov 10
      const hfov = 100 - (newZoom - 1) * 40; 
      pannellumViewerRef.current.setHfov(hfov, false); // false = immediate
    }
    if (newZoom <= 1 && !is360Active) {
      setPanPosition({ x: 0, y: 0 });
    }
  };

  // Mouse Wheel Zoom for non-360 images
  useEffect(() => {
    const container = fullscreenContainerRef.current;
    if (!container || is360Active || fullscreenIndex === null) return;

    const handleWheel = (e: WheelEvent) => {
      // Prevent default browser scrolling
      e.preventDefault();

      const zoomStep = 0.15;
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
      
      setZoomLevel(prev => {
        const nextZoom = Math.min(Math.max(prev + delta, 1), 3.25);
        if (nextZoom <= 1) {
          setPanPosition({ x: 0, y: 0 });
        }
        return nextZoom;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [is360Active, fullscreenIndex]);

  // Improved Bi-directional Zoom Synchronization
  // Listens to Pannellum's internal state to update the slider
  useEffect(() => {
    if (is360Active && pannellumViewerRef.current) {
      const syncInterval = setInterval(() => {
        if (pannellumViewerRef.current) {
          try {
            const currentHfov = pannellumViewerRef.current.getHfov();
            if (currentHfov !== undefined) {
              // Convert HFOV back to Slider 1.0-3.25 range
              // hfov 100 -> 1.0
              // hfov 10 -> 3.25
              const calculatedZoom = 1 + (100 - currentHfov) / 40;
              // Update state if difference is significant to prevent jitter
              setZoomLevel(prev => Math.abs(prev - calculatedZoom) > 0.001 ? calculatedZoom : prev);
            }
          } catch (err) {
            // Viewer might be destroyed or not ready
          }
        }
      }, 30); // 30ms sync frequency for smooth scroller interaction
      return () => clearInterval(syncInterval);
    }
  }, [is360Active, fullscreenIndex]);

  // Robust 360 Viewer Initialization logic
  useEffect(() => {
    let checkInterval: number;
    const is360 = isCurrentIndex360(fullscreenIndex);
    setIs360Active(is360);

    if (fullscreenIndex !== null && is360 && isOverlayAnimationDone && pannellumContainerRef.current) {
      setIs360Loading(true);
      
      const initViewer = () => {
        if (!pannellumContainerRef.current || !window.pannellum) return;
        
        const width = pannellumContainerRef.current.offsetWidth;
        const height = pannellumContainerRef.current.offsetHeight;
        
        // Pannellum needs non-zero dimensions and a stable WebGL context.
        // On mobile, texture size limits (often 4096px) are a primary cause for "WebGL not supported".
        if (width > 0 && height > 0) {
          clearInterval(checkInterval);

          if (pannellumViewerRef.current) {
            try { pannellumViewerRef.current.destroy(); } catch(e) {}
            pannellumViewerRef.current = null;
          }

          const isMobile = window.innerWidth < 1024;
          // IMPORTANT: Cap 360 images to 4096px width on mobile to avoid WebGL context failure (black screen or error)
          const panoramaUrl = isMobile 
            ? getOptimizedImage(galleryImages[fullscreenIndex], 4096, 90) 
            : getRawAssetUrl(galleryImages[fullscreenIndex]);
          
          try {
            pannellumViewerRef.current = window.pannellum.viewer(pannellumContainerRef.current, {
              type: 'equirectangular',
              panorama: panoramaUrl,
              autoLoad: true,
              showControls: false,
              mouseZoom: true,
              keyboardZoom: true,
              doubleClickZoom: true,
              hfov: 100,
              minHfov: 10,
              maxHfov: 150,
              draggable: true,
              crossOrigin: 'anonymous',
            });

            // Solve black screen by ensuring multiple resizes after the load event
            pannellumViewerRef.current.on('load', () => {
              setIs360Loading(false);
              // Force multiple resizes to ensure canvas fills container correctly
              if (pannellumViewerRef.current) {
                pannellumViewerRef.current.resize();
                setTimeout(() => pannellumViewerRef.current?.resize(), 100);
                setTimeout(() => pannellumViewerRef.current?.resize(), 500);
              }
            });
            
            pannellumViewerRef.current.on('error', (err: any) => {
              console.error('Pannellum Error:', err);
              setIs360Loading(false);
            });
          } catch (e) {
            console.error('Failed to init Pannellum:', e);
            setIs360Loading(false);
          }
        }
      };

      // Poll until container has dimensions and overlay is stable
      checkInterval = window.setInterval(initViewer, 100);
    }

    return () => {
      clearInterval(checkInterval);
      if (pannellumViewerRef.current) {
        try { pannellumViewerRef.current.destroy(); } catch(e) {}
        pannellumViewerRef.current = null;
      }
    };
  }, [fullscreenIndex, isOverlayAnimationDone, galleryImages, isCurrentIndex360]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (is360Active) return;
    if (zoomLevel > 1) {
      isDragging.current = true;
      lastPointerPos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (is360Active) return;
    if (isDragging.current && zoomLevel > 1) {
      const deltaX = e.clientX - lastPointerPos.current.x;
      const deltaY = e.clientY - lastPointerPos.current.y;
      setPanPosition(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      lastPointerPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (fullscreenIndex === null) return;
      if (event.key === 'Escape') closeFullscreen();
      else if (event.key === 'ArrowRight') goToNextImage();
      else if (event.key === 'ArrowLeft') goToPreviousImage();
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
      if (fullscreenIndex === null || zoomLevel > 1) {
        setActiveFullscreenArrow(null);
        return;
      }
      const { clientX } = event;
      const threshold = window.innerWidth / 3;
      if (clientX < threshold) setActiveFullscreenArrow('left');
      else if (clientX > window.innerWidth - threshold) setActiveFullscreenArrow('right');
      else setActiveFullscreenArrow(null);
    };
    const currentRef = fullscreenContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener('mousemove', handleMouseMove);
    }
    return () => currentRef?.removeEventListener('mousemove', handleMouseMove);
  }, [fullscreenIndex, zoomLevel]);

  const handlePreviousClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToPreviousImage();
  };
  
  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToNextImage();
  };

  const showArrows = canScrollLeft || canScrollRight;

  return (
    <>
      <section className="min-h-screen lg:h-screen w-full flex flex-col bg-white text-gray-800 pt-24 md:pt-32 overflow-x-hidden lg:overflow-y-hidden">
        
        {/* Mobile: Vertical Grid */}
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
                    src={image}
                    alt={`${project.name} gallery image ${index + 1}`}
                    loading={index < 2 ? "eager" : "lazy"}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
                {(project.is360 || isImageUrl360(image)) && (
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-widest uppercase z-10 border border-white/20">
                    360°
                  </div>
                )}
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
                        src={image}
                        alt={`${project.name} gallery image ${index + 1}`}
                        loading={index < 2 ? "eager" : "lazy"}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onLoad={checkScrollability}
                        className="h-full w-auto object-contain"
                      />
                  </div>
                    {(project.is360 || isImageUrl360(image)) && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[11px] font-bold tracking-widest uppercase z-10 border border-white/20 opacity-0 group-hover/image:opacity-100 transition-opacity">
                        360° Panorama
                      </div>
                    )}
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

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-30 p-3 bg-black/80 backdrop-blur-sm border border-white/10 shadow-xl rounded-full text-white transition-all duration-300 lg:hidden hover:scale-110 active:scale-95 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
         <ChevronUpIcon className="w-6 h-6" />
      </button>

      {fullscreenIndex !== null && (
        <div 
          ref={fullscreenContainerRef}
          className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-fadeIn overflow-hidden"
          onAnimationEnd={() => setIsOverlayAnimationDone(true)}
          onClick={closeFullscreen}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button 
            onClick={closeFullscreen}
            className="absolute top-6 right-6 text-gray-800 hover:opacity-70 transition-opacity z-[60] p-2 hover:scale-110 active:scale-95"
          >
            <CloseIcon className="w-8 h-8" />
          </button>
          
          <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {zoomLevel <= 1 && (
              <button
                onClick={handlePreviousClick}
                className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/5 hover:bg-black/10 transition-all duration-300 opacity-100 md:opacity-0 hover:scale-110 active:scale-95 ${activeFullscreenArrow === 'left' ? 'md:opacity-100' : ''}`}
              >
                <ChevronLeftIcon className="w-8 h-8 text-gray-800" />
              </button>
            )}

            <div
              className="w-full h-full flex items-center justify-center overflow-hidden touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              style={{ cursor: zoomLevel > 1 && !is360Active ? 'grab' : 'default' }}
            >
               <div className="max-w-full max-h-full w-full h-full flex items-center justify-center relative bg-gray-50">
                   {is360Active && is360Loading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white">
                        <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin mb-4" />
                        <p className="text-xs font-light tracking-widest uppercase text-gray-400">Loading Panorama...</p>
                      </div>
                   )}
                   
                   {is360Active ? (
                      <div 
                        ref={pannellumContainerRef} 
                        className={`w-full h-full bg-black transition-opacity duration-700 ${is360Loading ? 'opacity-0' : 'opacity-100'}`} 
                        onContextMenu={(e) => e.preventDefault()}
                      />
                   ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <ProgressiveImage
                            src={galleryImages[fullscreenIndex]}
                            alt={`${project.name} gallery image ${fullscreenIndex + 1} fullscreen`}
                            loading="eager"
                            draggable={false}
                            onContextMenu={(e) => e.preventDefault()}
                            className="max-w-full max-h-full object-contain shadow-2xl"
                            style={{
                              transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                              transition: isDragging.current ? 'none' : 'transform 0.1s ease-out',
                              transformOrigin: 'center center'
                            }}
                        />
                      </div>
                   )}
                </div>
            </div>

            {zoomLevel <= 1 && (
              <button
                onClick={handleNextClick}
                className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/5 hover:bg-black/10 transition-all duration-300 opacity-100 md:opacity-0 hover:scale-110 active:scale-95 ${activeFullscreenArrow === 'right' ? 'md:opacity-100' : ''}`}
              >
                <ChevronRightIcon className="w-8 h-8 text-gray-800" />
              </button>
            )}
            
            {/* Horizontal Zoom Bar */}
            <div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/70 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/10" 
              onClick={(e) => e.stopPropagation()}
            >
               <span className="text-white text-xs font-medium">Zoom</span>
               <input 
                  type="range" 
                  min="1" 
                  max="3.25" 
                  step="0.001" 
                  value={zoomLevel} 
                  onChange={handleZoomChange}
                  className="w-32 md:w-48 h-1 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-white hover:accent-gray-200"
               />
               <span className="text-white text-xs font-mono w-8 text-right">{Math.round(zoomLevel * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryPage;
