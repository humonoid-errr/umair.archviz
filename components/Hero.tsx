
import React, { useState, useEffect } from 'react';
import { RandomImage } from '../types';
import { isImageUrl360 } from '../utils/imageOptimizer';
import { FullscreenIcon } from './icons/FullscreenIcon';
import { MinimizeIcon } from './icons/MinimizeIcon';

interface HeroProps {
  image: RandomImage | null;
  onSkip?: () => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
}

const Hero: React.FC<HeroProps> = ({ image, onSkip, isZenMode = false, onToggleZenMode }) => {
  const [img1, setImg1] = useState<RandomImage | null>(null);
  const [img2, setImg2] = useState<RandomImage | null>(null);
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!image) return;

    const currentUrl = activeSlot === 1 ? img1?.imageUrl : img2?.imageUrl;
    if (image.imageUrl === currentUrl) return;

    let isCancelled = false;
    const preloader = new Image();
    preloader.src = image.imageUrl;

    preloader.onload = () => {
      if (isCancelled) return;
      
      const url = decodeURIComponent(image.imageUrl);
      const isPortrait = preloader.naturalHeight > preloader.naturalWidth;
      const isMobile = window.innerWidth < 768; 
      const is360 = isImageUrl360(url);

      // CRITICAL: Skip any detected 360 image from landing page transitions
      if (is360) {
        if (onSkip) onSkip();
        return;
      }

      // Desktop Exclusion Logic
      if (!isMobile) {
        const desktopBlacklist = [
          'apartment%20sanskar', 'apartment sanskar',
          'Piano%20house/9.jpg', 'Piano house/9.jpg',
          'Piano%20house/10.jpg', 'Piano house/10.jpg',
          'Piano%20house/11.jpg', 'Piano house/11.jpg',
          'Piano%20house/12.jpg', 'Piano house/12.jpg',
          'Piano%20house/13.jpg', 'Piano house/13.jpg',
          'Piano%20house/14.jpg', 'Piano house/14.jpg',
          'Piano%20house/15.jpg', 'Piano house/15.jpg',
          'modern%20minimilist/2.jpg', 'modern minimilist/2.jpg',
          'modern%20minimilist/4.jpg', 'modern minimilist/4.jpg',
          'modern%20minimilist/5.jpg', 'modern minimilist/5.jpg',
        ];

        const isBlacklisted = desktopBlacklist.some(pattern => url.includes(pattern));
        if (isPortrait || isBlacklisted) {
          if (onSkip) onSkip();
          return;
        }
      }

      if (!img1 && !img2) {
        setImg1(image);
        setActiveSlot(1);
        return;
      }
      
      setIsTransitioning(true);
      if (activeSlot === 1) {
        setImg2(image);
        setActiveSlot(2);
      } else {
        setImg1(image);
        setActiveSlot(1);
      }
    };

    preloader.onerror = () => {
      if (isCancelled) return;
      if (onSkip) onSkip();
    };
    
    return () => { isCancelled = true; };
  }, [image, img1, img2, activeSlot, onSkip]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const getSlotClasses = (slotNumber: 1 | 2) => {
    const isActive = activeSlot === slotNumber;
    const zIndex = isActive ? 'z-20' : 'z-10';
    let stateClasses = '';
    let transitionClasses = '';

    if (isActive) {
        stateClasses = 'opacity-100 blur-0';
        transitionClasses = 'transition-all duration-[2500ms] ease-in-out';
    } else if (isTransitioning) {
        stateClasses = 'opacity-100 blur-0';
        transitionClasses = 'transition-none';
    } else {
        stateClasses = 'opacity-0 blur-xl';
        transitionClasses = 'transition-none';
    }

    return `absolute inset-0 h-full w-full bg-cover bg-center ${zIndex} ${stateClasses} ${transitionClasses}`;
  };

  const activeProjectName = (activeSlot === 1 ? img1 : img2)?.projectName;

  if (!img1 && !img2) {
    return <main className="relative h-[100dvh] w-full bg-black" />;
  }
  
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black group/hero">
      {img1 && (
        <div className={getSlotClasses(1)}>
          <div 
            className="h-full w-full bg-cover bg-center animate-kenburns will-change-transform"
            style={{ backgroundImage: `url(${img1.imageUrl})` }}
          />
        </div>
      )}
      {img2 && (
        <div className={getSlotClasses(2)}>
          <div 
            className="h-full w-full bg-cover bg-center animate-kenburns will-change-transform"
            style={{ backgroundImage: `url(${img2.imageUrl})` }}
          />
        </div>
      )}
      
      {/* Overlay: Fades in Zen Mode */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-30 transition-opacity duration-1000 ${isZenMode ? 'opacity-0' : 'opacity-100'}`} />
      
      {/* Zen Toggle: Pullable tab */}
      {onToggleZenMode && (
         <div className="absolute right-0 top-1/2 -translate-y-1/2 z-[60] hidden md:flex">
             <button
                onClick={onToggleZenMode}
                className="group/zen relative flex items-center justify-start bg-black/40 backdrop-blur-md border border-white/20 border-r-0 rounded-l-full py-4 pl-4 pr-3 hover:bg-black/80 hover:pl-6 transition-all duration-300 translate-x-[calc(100%-3.5rem)] hover:translate-x-0 cursor-pointer shadow-2xl"
                aria-label={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
             >
                <div className="flex flex-row items-center gap-3">
                   <div className={!isZenMode ? "animate-pulse" : ""}>
                      {isZenMode ? <MinimizeIcon className="w-5 h-5 text-white" /> : <FullscreenIcon className="w-5 h-5 text-white" />}
                   </div>
                   <span className="text-[10px] uppercase font-light tracking-[0.2em] text-white whitespace-nowrap opacity-0 group-hover/zen:opacity-100 transition-opacity duration-300">
                      {isZenMode ? "Exit" : "Zen Mode"}
                   </span>
                </div>
             </button>
         </div>
      )}

      {/* Project Title: Fades in Zen Mode */}
      <div className={`absolute bottom-8 inset-x-0 z-30 text-center px-4 transition-all duration-1000 ${isZenMode ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="inline-block px-6 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 shadow-lg">
          <h2 key={activeProjectName} className="text-xs sm:text-sm font-light tracking-[0.1em] sm:tracking-[0.2em] text-white uppercase text-center animate-contentFadeIn">
            {activeProjectName}
          </h2>
        </div>
      </div>
    </main>
  );
};

export default Hero;
