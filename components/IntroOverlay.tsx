
import React, { useEffect, useState } from 'react';

interface IntroOverlayProps {
  onComplete: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [showText, setShowText] = useState(false);
  const [hideScreen, setHideScreen] = useState(false);

  useEffect(() => {
    // Fade in text
    const timer1 = setTimeout(() => setShowText(true), 500);
    
    // Fade out text
    const timer2 = setTimeout(() => setShowText(false), 2500);
    
    // Fade out screen
    const timer3 = setTimeout(() => setHideScreen(true), 3300);
    
    // Unmount from parent
    const timer4 = setTimeout(onComplete, 4300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${hideScreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className={`text-white text-center transition-all duration-1000 ease-in-out transform ${showText ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-4 blur-sm'}`}>
         <h1 className="text-xl md:text-3xl font-light tracking-[0.2em] md:tracking-[0.4em] uppercase text-white">
            New Zealand. <span className="text-gray-400">Experienced.</span>
         </h1>
      </div>
    </div>
  );
};

export default IntroOverlay;
