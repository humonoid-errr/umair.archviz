
import React, { useState, useEffect } from 'react';
import { RandomImage } from '../types';

interface HeroProps {
  image: RandomImage | null;
  onSkip?: () => void;
}

const Hero: React.FC<HeroProps> = ({ image, onSkip }) => {
  const [img1, setImg1] = useState<RandomImage | null>(null);
  const [img2, setImg2] = useState<RandomImage | null>(null);
  const [showImg1, setShowImg1] = useState(true);
  
  useEffect(() => {
    if (!image) return;

    const currentVisibleUrl = showImg1 ? img1?.imageUrl : img2?.imageUrl;
    if (image.imageUrl === currentVisibleUrl) {
      return;
    }

    let isCancelled = false;
    const preloader = new Image();
    preloader.src = image.imageUrl;

    preloader.onload = () => {
      if (isCancelled) return;
      
      const isPortrait = preloader.naturalHeight > preloader.naturalWidth;
      const isMobile = window.innerWidth < 768; // Tailwind md breakpoint

      // Check if the image is portrait (height > width)
      // On desktop (!isMobile), we skip portrait images to ensure optimal cover layout.
      // On mobile (isMobile), we allow portrait images as they fit the screen ratio better.
      if (isPortrait && !isMobile) {
        if (onSkip) {
          onSkip();
        }
        return;
      }

      // For the very first image, load it into the first slot.
      if (!img1) {
        setImg1(image);
        return;
      }
      
      // For subsequent images, load into the hidden slot and then toggle visibility.
      if (showImg1) {
        setImg2(image);
      } else {
        setImg1(image);
      }
      setShowImg1(prev => !prev);
    };

    preloader.onerror = () => {
      if (isCancelled) return;
      console.error(`Failed to load hero image: ${image.imageUrl}`);
    };
    
    return () => {
      isCancelled = true;
    };
  }, [image, img1, img2, showImg1, onSkip]);

  const activeImage = showImg1 ? img1 : img2;

  if (!activeImage) {
    return <main className="relative h-screen w-full overflow-hidden bg-black" />;
  }
  
  const imageContainerClasses = "absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000 ease-in-out";

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black group">
      {img1 && (
        <div
          className={`${imageContainerClasses} ${showImg1 ? 'opacity-100' : 'opacity-0'}`}
        >
          <div 
            className="h-full w-full bg-cover bg-center animate-kenburns"
            style={{ backgroundImage: `url(${img1.imageUrl})` }}
          />
        </div>
      )}
      {img2 && (
        <div
          className={`${imageContainerClasses} ${!showImg1 ? 'opacity-100' : 'opacity-0'}`}
        >
          <div 
            className="h-full w-full bg-cover bg-center animate-kenburns"
            style={{ backgroundImage: `url(${img2.imageUrl})` }}
          />
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
      
      <div className="absolute bottom-8 inset-x-0 z-10 text-center px-4">
        <div className="inline-block px-6 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 shadow-lg">
          <h2 className="text-xs sm:text-sm font-light tracking-[0.1em] sm:tracking-[0.2em] text-white uppercase text-center whitespace-nowrap">
            {activeImage.projectName}
          </h2>
        </div>
      </div>
    </main>
  );
};

export default Hero;
