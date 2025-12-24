
import React, { useEffect, useState } from 'react';

interface IntroOverlayProps {
  onComplete: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Sequence: Start invisible, show text, hide overlay
    const t1 = setTimeout(() => setShowText(true), 400);   // Fade in text
    const t2 = setTimeout(() => setIsVisible(false), 2400); // Fade out overlay
    const t3 = setTimeout(() => onComplete(), 3400);       // Fully unmount

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[200] bg-black flex items-center justify-center transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="relative text-center px-6">
        <p 
          className={`text-white text-xl md:text-4xl font-light tracking-[0.4em] md:tracking-[0.6em] uppercase transition-all duration-1000 transform ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          Serving Worldwide
        </p>
        
        {/* Subtle decorative line below text */}
        <div 
          className={`mt-10 h-[1px] bg-white/20 mx-auto transition-all duration-1000 delay-300 ${showText ? 'w-24 md:w-48 opacity-100' : 'w-0 opacity-0'}`} 
        />
      </div>
      
      {/* Decorative background grid lines for architectural feel */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/5 -translate-x-1/2" />
      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 -translate-y-1/2" />
    </div>
  );
};

export default IntroOverlay;
