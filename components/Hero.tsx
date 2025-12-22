
import React, { useState, useEffect } from 'react';
import { RandomImage } from '../types';

interface HeroProps {
  image: RandomImage | null;
  onSkip?: () => void;
}

const Hero: React.FC<HeroProps> = ({ image, onSkip }) => {
  const [img1, setImg1] = useState<RandomImage | null>(null);
  const [img2, setImg2] = useState<RandomImage | null>(null);
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!image) return;

    // Determine current visible URL to avoid reloading the same image
    const currentUrl = activeSlot === 1 ? img1?.imageUrl : img2?.imageUrl;
    if (image.imageUrl === currentUrl) {
      return;
    }

    let isCancelled = false;
    const preloader = new Image();
    preloader.src = image.imageUrl;

    preloader.onload = () => {
      if (isCancelled) return;
      
      const isPortrait = preloader.naturalHeight > preloader.naturalWidth;
      const isMobile = window.innerWidth < 768; 

      /**
       * Desktop Exclusion Logic
       */
      if (!isMobile) {
        const url = decodeURIComponent(image.imageUrl);
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

      // If this is the very first load
      if (!img1 && !img2) {
        setImg1(image);
        setActiveSlot(1);
        return;
      }
      
      // Load into the non-active slot
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
      console.error(`Failed to load hero image: ${image.imageUrl}`);
      if (onSkip) onSkip();
    };
    
    return () => {
      isCancelled = true;
    };
  }, [image, img1, img2, activeSlot, onSkip]);

  // Cleanup effect: Reset the background image opacity after transition to keep DOM clean
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 2500); // Match this with the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const getSlotClasses = (slotNumber: 1 | 2) => {
    const isActive = activeSlot === slotNumber;
    const zIndex = isActive ? 'z-20' : 'z-10';
    
    // Smooth Blurred Transition Logic
    let stateClasses = '';
    let transitionClasses = '';

    if (isActive) {
        // Active: Fully visible, clear (no blur)
        // This causes the browser to animate from blur-xl -> blur-0 and opacity-0 -> opacity-100
        stateClasses = 'opacity-100 blur-0';
        transitionClasses = 'transition-all duration-[2500ms] ease-in-out';
    } else if (isTransitioning) {
        // Outgoing (Background): Fully visible, clear (no blur)
        // Stays clear while being covered by the incoming image
        stateClasses = 'opacity-100 blur-0';
        transitionClasses = 'transition-none';
    } else {
        // Idle (Hidden): Invisible, Blurred
        // The image sits in this state waiting to be activated. 
        // When activated, it will transition FROM this state.
        stateClasses = 'opacity-0 blur-xl';
        transitionClasses = 'transition-none';
    }

    return `absolute inset-0 h-full w-full bg-cover bg-center ${zIndex} ${stateClasses} ${transitionClasses}`;
  };

  const activeProjectName = (activeSlot === 1 ? img1 : img2)?.projectName;

  if (!img1 && !img2) {
    return <main className="relative h-[100dvh] w-full overflow-hidden bg-black" />;
  }
  
  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black group">
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
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-30" />
      
      <div className="absolute bottom-8 inset-x-0 z-30 text-center px-4">
        <div className="inline-block px-6 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 shadow-lg">
          <h2 
            key={activeProjectName}
            className="text-xs sm:text-sm font-light tracking-[0.1em] sm:tracking-[0.2em] text-white uppercase text-center whitespace-nowrap animate-contentFadeIn"
          >
            {activeProjectName}
          </h2>
        </div>
      </div>
    </main>
  );
};

export default Hero;
