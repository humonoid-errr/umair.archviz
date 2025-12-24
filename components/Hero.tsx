
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

interface HeroImageState extends RandomImage {
  highResUrl: string;
  thumbUrl: string;
  isReady: boolean;
}

const Hero: React.FC<HeroProps> = ({ image, onSkip, isZenMode = false, onToggleZenMode }) => {
  const [slot1, setSlot1] = useState<HeroImageState | null>(null);
  const [slot2, setSlot2] = useState<HeroImageState | null>(null);
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // Balanced high quality (2K is optimized for load speed vs resolution)
  const HIGH_RES_WIDTH = 2048;
  const QUALITY = 85;

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!image) return;

    // Use a very tiny thumb (40px) for near-instant "blur-up"
    const thumbUrl = getOptimizedImage(image.imageUrl, 40, 10, false);
    const highResUrl = getOptimizedImage(image.imageUrl, HIGH_RES_WIDTH, QUALITY, true);
    
    const currentActive = activeSlot === 1 ? slot1 : slot2;
    if (image.imageUrl === currentActive?.imageUrl && currentActive.isReady) return;

    let isCancelled = false;

    const validateImage = (): boolean => {
      const url = decodeURIComponent(image.imageUrl);
      const isMobile = window.innerWidth < 768;
      
      if (isImageUrl360(url)) return false;

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
        if (desktopBlacklist.some(pattern => url.includes(pattern))) return false;
      }
      return true;
    };

    if (!validateImage()) {
      onSkip?.();
      return;
    }

    const newState: HeroImageState = {
      ...image,
      thumbUrl,
      highResUrl,
      isReady: false
    };

    // Slot management logic
    if (!slot1 && !slot2) {
      // First load: Set Slot 1 with immediate thumbnail
      setSlot1(newState);
      setActiveSlot(1);
      
      const preloader = new Image();
      preloader.src = highResUrl;
      preloader.onload = () => {
        if (!isCancelled) setSlot1(prev => prev ? { ...prev, isReady: true } : null);
      };
      return () => { isCancelled = true; };
    }

    const nextSlotId = activeSlot === 1 ? 2 : 1;
    if (nextSlotId === 1) setSlot1(newState);
    else setSlot2(newState);

    const preloader = new Image();
    preloader.src = highResUrl;
    preloader.onload = () => {
      if (isCancelled) return;
      
      // Update the slot to show the high-res image
      if (nextSlotId === 1) setSlot1(prev => prev ? { ...prev, isReady: true } : null);
      else setSlot2(prev => prev ? { ...prev, isReady: true } : null);
      
      // Cross-fade to next slot
      setIsTransitioning(true);
      setActiveSlot(nextSlotId);
    };

    preloader.onerror = () => {
      if (!isCancelled) onSkip?.();
    };

    return () => { isCancelled = true; };
  }, [image, onSkip]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const renderSlot = (data: HeroImageState | null, isActive: boolean) => {
    if (!data) return null;

    const zIndex = isActive ? 'z-20' : 'z-10';
    let opacityClass = 'opacity-0';
    let transitionClass = 'transition-opacity duration-[2000ms] ease-in-out';

    if (isActive) {
      opacityClass = 'opacity-100';
    } else if (isTransitioning) {
      opacityClass = 'opacity-100';
      transitionClass = 'transition-none';
    }

    return (
      <div className={`absolute inset-0 h-full w-full ${zIndex} ${opacityClass} ${transitionClass} overflow-hidden`}>
        {/* Instant Blur layer */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-3xl scale-110"
          style={{ backgroundImage: `url(${data.thumbUrl})` }}
        />
        {/* High fidelity layer */}
        <div 
          className={`absolute inset-0 h-full w-full bg-cover bg-center animate-kenburns will-change-transform transition-opacity duration-[1500ms] ${data.isReady ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${data.highResUrl})` }}
        />
      </div>
    );
  };

  const activeProjectName = (activeSlot === 1 ? slot1 : slot2)?.projectName;
  const effectiveZenMode = isZenMode && isDesktop;

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black group/hero">
      {renderSlot(slot1, activeSlot === 1)}
      {renderSlot(slot2, activeSlot === 2)}
      
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-30 transition-opacity duration-1000 ${effectiveZenMode ? 'opacity-0' : 'opacity-100'}`} />
      
      <div className="absolute bottom-8 left-0 right-0 z-[60] flex items-center justify-center">
        <div className={`transition-all duration-1000 ${effectiveZenMode ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
          <div className="inline-block px-6 py-2 bg-black/40 backdrop-blur-sm rounded-full border border-white/10 shadow-lg">
            <h2 key={activeProjectName} className="text-xs sm:text-sm font-light tracking-[0.1em] sm:tracking-[0.2em] text-white uppercase text-center animate-contentFadeIn whitespace-nowrap">
              {activeProjectName}
            </h2>
          </div>
        </div>

        {onToggleZenMode && (
          <div className="hidden md:flex absolute right-8 items-center">
            <button
              onClick={onToggleZenMode}
              className={`p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-black/60 transition-all duration-500 shadow-2xl group/zen cursor-pointer ${effectiveZenMode ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}
              aria-label={effectiveZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
            >
              <div className="relative">
                {effectiveZenMode ? <MinimizeIcon className="w-5 h-5" /> : <FullscreenIcon className="w-5 h-5" />}
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 text-[9px] uppercase font-light tracking-[0.2em] opacity-0 group-hover/zen:opacity-100 transition-all duration-300 whitespace-nowrap bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md pointer-events-none translate-x-4 group-hover/zen:translate-x-0">
                   {effectiveZenMode ? "Exit Zen" : "Zen Mode"}
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
