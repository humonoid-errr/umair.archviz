
import React, { useEffect, useState } from 'react';

interface IntroOverlayProps {
  onComplete: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 150);
    return () => clearTimeout(t);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  return (
    <div 
      className={`fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Background Architectural Lines */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/5 -translate-x-1/2 pointer-events-none" />
      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/5 -translate-y-1/2 pointer-events-none" />

      {/* Serving Worldwide Label */}
      <div className={`text-center mb-6 transition-all duration-700 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <p className="text-white/80 text-xs md:text-sm font-light tracking-[0.5em] md:tracking-[0.7em] uppercase">
          Serving Worldwide
        </p>
        <div className="mt-3 h-[1px] bg-white/20 mx-auto w-16 md:w-32" />
      </div>

      {/* Copyright Warning Modal Popup */}
      <div 
        className={`relative z-10 bg-zinc-950/95 border border-white/15 rounded-2xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl transition-all duration-700 delay-100 transform ${showContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
      >
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white mb-4 border border-white/20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 002-2H4a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h2 className="text-white text-sm md:text-base font-semibold tracking-widest uppercase mb-4 text-amber-200/90">
          Copyright Warning
        </h2>

        <div className="space-y-3 text-zinc-300 text-xs md:text-sm font-light leading-relaxed text-left bg-black/50 p-4 md:p-5 rounded-xl border border-white/10">
          <p className="font-semibold text-white tracking-wide">
            Copyright (c) 2025 Mohd Umair<br />
            All rights reserved.
          </p>
          <p className="text-zinc-300">
            This project and its contents (including code, design files, images, and visual assets) may not be copied, reproduced, distributed, or used in any form without explicit written permission from the owner.
          </p>
          <p className="text-amber-400/90 font-medium text-xs tracking-wider uppercase pt-1">
            Unauthorized use is strictly prohibited.
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="mt-6 w-full py-3.5 px-6 bg-white text-black text-xs font-semibold tracking-widest uppercase rounded-lg hover:bg-zinc-200 active:scale-[0.98] transition-all cursor-pointer shadow-lg"
        >
          I Agree & Enter Website
        </button>
      </div>
    </div>
  );
};

export default IntroOverlay;

