
import React, { useState, useEffect } from 'react';
import { RandomImage } from '../types';
import { getOptimizedImage, isImageUrl360 } from '../utils/imageOptimizer';
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

    // Standard optimization for hero (reduced size/quality for better transition speed)
    const optimizedUrl = getOptimizedImage(image.imageUrl, 1600, 75);
    
    const currentUrl = activeSlot === 1 ? img1?.imageUrl : img2?.imageUrl;
    if (optimizedUrl === currentUrl) return;

    let isCancelled = false;
    const preloader = new Image();
    preloader.src = optimizedUrl;

    preloader.onload = () => {
      if (isCancelled) return;
      
      const url = decodeURIComponent(image.imageUrl);
      const isPortrait = preloader.naturalHeight > preloader.naturalWidth;
      const isMobile = window.innerWidth < 768; 
      const is360 = isImageUrl360(url);

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

      const newImageData = { ...image, imageUrl: optimizedUrl };

      if (!img1 && !img2) {
        setImg1(newImageData);
        setActiveSlot(1);
        return;
      }
      
      setIsTransitioning(true);
      if (activeSlot === 1) {
        setImg2(newImageData);
        setActiveSlot(2);
      } else {
        setImg1(newImageData);
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
        stateClasses = 'opacity-100';
        transitionClasses = 'transition-opacity duration-[2000ms] ease-in-out';
    } else if (isTransitioning) {
        stateClasses = 'opacity-100';
        transitionClasses = 'transition-none';
    } else {
        stateClasses = 'opacity-0';
        transitionClasses = 'transition-opacity duration-[1000ms] ease-in-out';
    }

    return `absolute inset-0 h-full w-full ${zIndex} ${stateClasses} ${transitionClasses} overflow-hidden`;
  };

  const renderSlotContent = (imgData: RandomImage | null) => {
    if (!imgData) return null;
    
    const thumbUrl = getOptimizedImage(imgData.imageUrl, 50, 10, false);

    return (
      <div className="relative w-full h-full">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-2xl scale-110 opacity-70"
          style={{ backgroundImage: `url(${thumbUrl})` }}
        />
        
        <div 
          className="absolute inset-0 h-full w-full bg-cover bg-center animate-kenburns will-change-transform"
          style={{ backgroundImage: `url(${imgData.imageUrl})` }}
        />
      </div>
    );
  };

  const activeProjectName = (activeSlot === 1 ? img1 : img2)?.projectName;

  if (!img1 && !img2) {
    return <main className="relative h-[100dvh] w-full bg-black" />;
  }
  
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black group/hero">
      <div className={getSlotClasses(1)}>
        {renderSlotContent(img1)}
      </div>
      <div className={getSlotClasses(2)}>
        {renderSlotContent(img2)}
      </div>
      
      {/* Overlay gradient */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-30 transition-opacity duration-1000 ${isZenMode ? 'opacity-0' : 'opacity-100'}`} />
      
      {/* Bottom Interface Bar: Level Projects Name & Zen Mode */}
      <div className="absolute bottom-8 left-0 right-0 z-[60] px-8 md:px-24 flex items-center justify-center">
        
        {/* Project Title Container: Centered */}
        <div className={`transition-all duration-1000 ${isZenMode ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
          <div className="inline-block px-6 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-white/10 shadow-lg">
            <h2 key={activeProjectName} className="text-xs sm:text-sm font-light tracking-[0.1em] sm:tracking-[0.2em] text-white uppercase text-center animate-contentFadeIn whitespace-nowrap">
              {activeProjectName}
            </h2>
          </div>
        </div>

        {/* Zen Toggle: Level with the title, positioned far right */}
        {onToggleZenMode && (
          <div className="absolute right-8 md:right-24 flex items-center">
            <button
              onClick={onToggleZenMode}
              className={`p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-black/60 transition-all duration-500 shadow-2xl group/zen cursor-pointer ${isZenMode ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}
              aria-label={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
            >
              <div className="relative">
                {isZenMode ? <MinimizeIcon className="w-5 h-5" /> : <FullscreenIcon className="w-5 h-5" />}
                
                {/* Minimal Label that appears on hover */}
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 text-[9px] uppercase font-light tracking-[0.2em] opacity-0 group-hover/zen:opacity-100 transition-all duration-300 whitespace-nowrap bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md pointer-events-none translate-x-4 group-hover/zen:translate-x-0">
                   {isZenMode ? "Exit Zen" : "Zen Mode"}
                </span>
              </div>
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Hero;
