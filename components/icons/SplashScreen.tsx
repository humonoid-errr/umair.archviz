
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Elegant timing sequence
    const t1 = setTimeout(() => setPhase(1), 500);  // Show Name
    const t2 = setTimeout(() => setPhase(2), 1500); // Show Experience
    const t3 = setTimeout(() => setPhase(3), 3000); // Fade out all
    const t4 = setTimeout(() => onComplete(), 4000); // Remove splash

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-1000 ${phase === 3 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative text-center px-10">
        {/* Name Reveal */}
        <h1 className={`text-white text-3xl md:text-5xl font-light tracking-[0.6em] md:tracking-[0.8em] uppercase transition-all duration-1000 transform ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          MOHD UMAIR
        </h1>
        
        {/* Architectural Label */}
        <div className={`mt-4 overflow-hidden`}>
           <p className={`text-gray-500 text-[10px] md:text-xs font-light tracking-[0.4em] md:tracking-[0.6em] uppercase transition-all duration-1000 delay-300 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
             Architectural Visualizer
           </p>
        </div>

        {/* New Zealand Experience Label */}
        <div className={`mt-12 md:mt-16 transition-all duration-1000 transform ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
           <div className="inline-block px-8 py-3 border border-white/20 rounded-full">
              <p className="text-white text-[10px] md:text-xs font-light tracking-[0.2em] md:tracking-[0.4em] uppercase">
                Experience in New Zealand
              </p>
           </div>
        </div>
      </div>
      
      {/* Decorative vertical lines */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/5 -translate-x-1/2" />
      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 -translate-y-1/2" />
    </div>
  );
};

export default SplashScreen;
