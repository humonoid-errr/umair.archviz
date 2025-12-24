
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Project } from '../types';
import { FullscreenIcon } from './icons/FullscreenIcon';
import { MinimizeIcon } from './icons/MinimizeIcon';
import { CloseIcon } from './icons/CloseIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { getOptimizedImage, getRawAssetUrl, isImageUrl360 } from '../utils/imageOptimizer';

// Pannellum Type declaration for TS
declare global {
  interface window {
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
  isProject360?: boolean;
}> = ({ src, alt, className, style, loading, draggable, onContextMenu, onLoad, isProject360 }) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const is360 = isProject360 || isImageUrl360(src);
  
  useEffect(() => {
    // Stage 1: Tiny blur-up thumbnail
    const thumbSrc = getOptimizedImage(src, 50, 20, false, is360);
    setCurrentSrc(thumbSrc);
    setIsLoaded(false);

    // Stage 2: Optimized high-res (DPR aware)
    const isMobile = window.innerWidth < 768;
    const optimizedWidth = isMobile ? 1200 : 2560; 
    const optimizedSrc = getOptimizedImage(src, optimizedWidth, 90, true, is360);
    
    const img = new Image();
    img.src = optimizedSrc;
    img.onload = () => {
      setCurrentSrc(optimizedSrc);
      setIsLoaded(true);
      if (onLoad) onLoad();
      
      // Stage 3: Attempt to load raw URL for maximum clarity if not a 360 on desktop
      if (!is360 && !isMobile) {
        const rawImg = new Image();
        rawImg.src = getRawAssetUrl(src);
        rawImg.onload = () => {
          setCurrentSrc(rawImg.src);
        };
      }
    };
  }, [src, is360, onLoad]);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center" style={style}>
       {!is360 && (
         <img
            src={getOptimizedImage(src, 40, 10, false)}
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);
  const [forcedOrientation, setForcedOrientation] = useState<'portrait' | 'landscape'>('portrait');

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

  // Map Vertical Wheel to Horizontal Scroll in Main Gallery View
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleMainWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', handleMainWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleMainWheel);
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
    setForcedOrientation('portrait');
  };

  const closeFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
    if (pannellumViewerRef.current) {
      pannellumViewerRef.current.destroy();
      pannellumViewerRef.current = null;
    }
    setFullscreenIndex(null);
    setIsOverlayAnimationDone(false);
    resetZoom();
    setForcedOrientation('portrait');
  }, [resetZoom]);

  const toggleBrowserFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsBrowserFullscreen(!!document.fullscreenElement);
      setTimeout(() => {
        if (pannellumViewerRef.current) pannellumViewerRef.current.resize();
      }, 100);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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

  // Combined Sync Handler for UI -> Model
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoomLevel(newZoom);
    if (is360Active && pannellumViewerRef.current) {
      // Map Zoom (1 to 3.25) back to HFOV (100 to 10)
      const hfov = 100 - (newZoom - 1) * 40; 
      pannellumViewerRef.current.setHfov(hfov, false); 
    }
    if (newZoom <= 1 && !is360Active) {
      setPanPosition({ x: 0, y: 0 });
    }
  };

  // Improved Universal Wheel Zoom Sync for 2D images
  useEffect(() => {
    const container = fullscreenContainerRef.current;
    if (!container || fullscreenIndex === null) return;

    const handleWheelZoom = (e: WheelEvent) => {
      // If 360 is active, native Pannellum handles it; we poll its state in the RAF loop
      if (is360Active) return;

      e.preventDefault();
      const zoomStep = 0.1; // Finer control
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
      
      setZoomLevel(prev => {
        const nextZoom = Math.min(Math.max(prev + delta, 1), 3.25);
        if (nextZoom <= 1) setPanPosition({ x: 0, y: 0 });
        return nextZoom;
      });
    };

    container.addEventListener('wheel', handleWheelZoom, { passive: false });
    return () => container.removeEventListener('wheel', handleWheelZoom);
  }, [is360Active, fullscreenIndex]);

  // Refined High-Frequency 360 Zoom Sync (Model -> UI)
  useEffect(() => {
    let rafId: number;
    const sync360Zoom = () => {
      if (is360Active && pannellumViewerRef.current) {
        try {
          const currentHfov = pannellumViewerRef.current.getHfov();
          if (currentHfov !== undefined) {
            // Precise mapping: HFOV 100 -> Zoom 1, HFOV 10 -> Zoom 3.25
            const calculatedZoom = 1 + (100 - currentHfov) / 40;
            
            // Only update if change is significant to avoid state churn
            setZoomLevel(prev => {
              const diff = Math.abs(prev - calculatedZoom);
              return diff > 0.0005 ? calculatedZoom : prev;
            });
          }
        } catch (err) {}
      }
      rafId = requestAnimationFrame(sync360Zoom);
    };

    if (is360Active) {
      rafId = requestAnimationFrame(sync360Zoom);
    }

    return () => cancelAnimationFrame(rafId);
  }, [is360Active, fullscreenIndex]);

  useEffect(() => {
    let checkInterval: number;
    const is360 = isCurrentIndex360(fullscreenIndex);
    setIs360Active(is360);

    if (fullscreenIndex !== null && is360 && isOverlayAnimationDone && pannellumContainerRef.current) {
      setIs360Loading(true);
      const initViewer = () => {
        if (!(window as any).pannellum || !pannellumContainerRef.current) return;
        const width = pannellumContainerRef.current.offsetWidth;
        const height = pannellumContainerRef.current.offsetHeight;
        if (width > 0 && height > 0) {
          clearInterval(checkInterval);
          if (pannellumViewerRef.current) {
            try { pannellumViewerRef.current.destroy(); } catch(e) {}
            pannellumViewerRef.current = null;
          }
          const isMobile = window.innerWidth < 1024;
          
          const cacheBuster = `refresh-${Date.now()}`;
          
          const panoramaUrl = isMobile 
            ? getOptimizedImage(galleryImages[fullscreenIndex], 4096, 95, true, true, cacheBuster) 
            : getRawAssetUrl(galleryImages[fullscreenIndex], cacheBuster);
          
          try {
            pannellumViewerRef.current = (window as any).pannellum.viewer(pannellumContainerRef.current, {
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
            pannellumViewerRef.current.on('load', () => {
              setIs360Loading(false);
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
      else if (event.key === 'f') toggleBrowserFullscreen();
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
  }, [fullscreenIndex, closeFullscreen, goToNextImage, goToPreviousImage, toggleBrowserFullscreen]);
  
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

  const handleSliderWheel = (e: React.WheelEvent) => {
    e.stopPropagation(); // Don't let the container zoom as well
    const step = 0.05;
    const delta = e.deltaY > 0 ? -step : step;
    const newZoom = Math.min(Math.max(zoomLevel + delta, 1), 3.25);
    setZoomLevel(newZoom);
    if (is360Active && pannellumViewerRef.current) {
        const hfov = 100 - (newZoom - 1) * 40; 
        pannellumViewerRef.current.setHfov(hfov, false); 
    }
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
                    isProject360={project.is360}
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
                  className="group/image flex-shrink-0 snap-center w-auto h-full first:pl-16 last:pr-16 overflow-hidden flex items-center justify-center"
                >
                  <div className="relative h-full w-auto transition-transform duration-100 ease-linear will-change-transform">
                      <ProgressiveImage
                        src={image}
                        alt={`${project.name} gallery image ${index + 1}`}
                        loading={index < 2 ? "eager" : "lazy"}
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onLoad={checkScrollability}
                        className="h-full w-auto object-contain"
                        isProject360={project.is360}
                      />
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
        >
          {/* Top Controls Bar - Compact and includes orientation toggle */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 md:gap-4 z-[60]">
             {/* Orientation Toggle (Mobile Only) - Smaller and placed before fullscreen toggle */}
             {!is360Active && (
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setForcedOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
                  }}
                  className={`lg:hidden text-gray-800 bg-white/60 backdrop-blur-sm p-1.5 rounded-full hover:bg-white/80 transition-all border border-black/5 active:scale-90`}
                  title="Toggle Orientation"
                >
                   <svg className={`w-5 h-5 transition-transform duration-300 ${forcedOrientation === 'landscape' ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="7" y="3" width="10" height="18" rx="2" />
                      <circle cx="12" cy="18" r="0.5" fill="currentColor" />
                   </svg>
                </button>
             )}

             <button 
                onClick={(e) => { e.stopPropagation(); toggleBrowserFullscreen(); }}
                className="text-gray-800 bg-white/60 backdrop-blur-sm p-1.5 md:p-2 rounded-full hover:bg-white/80 transition-all hover:scale-110 active:scale-90 border border-black/5"
                title="Toggle Display Fullscreen"
              >
                {isBrowserFullscreen ? <MinimizeIcon className="w-5 h-5 md:w-6 md:h-6" /> : <FullscreenIcon className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); closeFullscreen(); }}
                className="text-gray-800 bg-white/60 backdrop-blur-sm p-1.5 md:p-2 rounded-full hover:bg-white/80 transition-all hover:scale-110 active:scale-90 border border-black/5"
                aria-label="Close Gallery"
              >
                <CloseIcon className="w-5 h-5 md:w-6 md:h-6" />
              </button>
          </div>
          
          <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Arrows: Prominent on mobile (smaller), reactive on desktop. Hidden in browser fullscreen. */}
            {zoomLevel <= 1 && !isBrowserFullscreen && (
              <button
                onClick={handlePreviousClick}
                className={`absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-50 p-2 md:p-4 rounded-full bg-black/10 md:bg-black/5 hover:bg-black/20 transition-all duration-300 opacity-60 md:opacity-0 hover:scale-110 active:scale-95 backdrop-blur-[1px] ${activeFullscreenArrow === 'left' ? 'md:opacity-100' : ''}`}
              >
                <ChevronLeftIcon className="w-7 h-7 md:w-8 md:h-8 text-white md:text-gray-800" />
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
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 overflow-hidden bg-white">
                        <div 
                          className="absolute inset-0 bg-cover bg-center filter blur-3xl scale-110 animate-kenburns opacity-60"
                          style={{ backgroundImage: `url(${getOptimizedImage(galleryImages[fullscreenIndex], 100, 10, false)})` }}
                        />
                        <div className="relative flex flex-col items-center">
                          <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-2 border-gray-800 rounded-full animate-ping opacity-10" />
                            <div className="absolute inset-0 border border-gray-800 rounded-full animate-pulse flex items-center justify-center">
                               <div className="w-3 h-3 bg-gray-800 rounded-full" />
                            </div>
                          </div>
                          <p className="mt-10 text-[10px] font-light tracking-[0.5em] uppercase text-gray-500 animate-pulse">
                            Immersing...
                          </p>
                        </div>
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
                            className={`max-w-full max-h-full object-contain shadow-2xl transition-transform duration-500 ease-in-out`}
                            style={{
                              transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel}) ${forcedOrientation === 'landscape' ? 'rotate(90deg) scale(1.4)' : ''}`,
                              transition: isDragging.current ? 'none' : 'transform 0.3s ease-out',
                              transformOrigin: 'center center'
                            }}
                            isProject360={project.is360}
                        />
                      </div>
                   )}
                </div>
            </div>

            {zoomLevel <= 1 && !isBrowserFullscreen && (
              <button
                onClick={handleNextClick}
                className={`absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-50 p-2 md:p-4 rounded-full bg-black/10 md:bg-black/5 hover:bg-black/20 transition-all duration-300 opacity-60 md:opacity-0 hover:scale-110 active:scale-95 backdrop-blur-[1px] ${activeFullscreenArrow === 'right' ? 'md:opacity-100' : ''}`}
              >
                <ChevronRightIcon className="w-7 h-7 md:w-8 md:h-8 text-white md:text-gray-800" />
              </button>
            )}
            
            {/* Bottom Controls Container */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full px-4" onClick={(e) => e.stopPropagation()}>
               {/* Zoom Slider */}
               <div className="flex items-center gap-4 bg-black/70 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/10">
                  <span className="text-white text-[10px] md:text-xs font-medium uppercase tracking-widest">Zoom</span>
                  <input 
                      type="range" 
                      min="1" 
                      max="3.25" 
                      step="0.001" 
                      value={zoomLevel} 
                      onChange={handleZoomChange}
                      onWheel={handleSliderWheel}
                      className="w-24 md:w-48 h-1 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-white hover:accent-gray-200"
                  />
                  <span className="text-white text-[10px] md:text-xs font-mono w-8 text-right">{Math.round(zoomLevel * 100)}%</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryPage;
