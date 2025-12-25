
import React, { useState, useMemo } from 'react';
import { getOptimizedImage } from '../utils/imageOptimizer';

interface AboutContent {
  heading: string;
  p1: string;
  p2: string;
  p3: string;
}

interface AboutSectionProps {
  content: AboutContent;
}

const ProgressiveImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Use a tiny thumbnail for instant blur-up
  const tinySrc = useMemo(() => getOptimizedImage(src, 40, 20), [src]);
  // Use a reasonably sized image for the main display
  const fullSrc = useMemo(() => getOptimizedImage(src, 800, 90), [src]);

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {/* Tiny Blur Placeholder - Absolute to sit behind */}
      <img
        src={tinySrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-110"
        aria-hidden="true"
      />
      
      {/* Main Image - Relative to define size (once loaded) or use aspect ratio class on container */}
      <img
        src={fullSrc}
        alt={alt}
        className={`relative w-full h-full object-cover transition-opacity duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading="eager"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
  const profileImage = "https://cdn.jsdelivr.net/gh/humonoid-errr/umair.archviz@main/mypic/Background.jpg";

  return (
    <section id="about" className="min-h-screen w-full flex flex-col bg-white text-gray-800 px-8 md:px-24 pt-24 md:pt-32 pb-8">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col border-t border-gray-300 pt-10">
        <div className="w-full">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col items-start gap-8">
            <h2 className="text-3xl font-light uppercase tracking-[0.2em]">
              {content.heading}
            </h2>
            <div className="w-full flex justify-center">
              <ProgressiveImage
                src={profileImage}
                alt="Modern interior with a view of sand dunes"
                className="w-full max-w-xs aspect-[3/4] rounded-t-full transition-transform duration-500 ease-out active:scale-105 shadow-lg"
              />
            </div>
            <div className="text-base font-light leading-relaxed text-gray-600 space-y-4">
              <p>{content.p1}</p>
              <p>{content.p2}</p>
              <p>{content.p3}</p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-[1.5fr_1fr] gap-8 md:gap-16 items-start">
            {/* Left Column - Text Content */}
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-light uppercase tracking-[0.2em] mb-12 transition-all duration-500 hover:tracking-[0.25em] cursor-default w-fit origin-left">
                {content.heading}
              </h2>
              <div className="text-base md:text-lg font-light leading-relaxed text-gray-600 space-y-6">
                <p className="transition-all duration-300 hover:text-gray-900 hover:translate-x-2 cursor-default">{content.p1}</p>
                <p className="transition-all duration-300 hover:text-gray-900 hover:translate-x-2 cursor-default">{content.p2}</p>
                <p className="transition-all duration-300 hover:text-gray-900 hover:translate-x-2 cursor-default">{content.p3}</p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="w-full flex justify-end">
               <ProgressiveImage
                src={profileImage}
                alt="Modern interior with a view of sand dunes"
                className="w-full max-w-xs aspect-[3/4] rounded-t-full shadow-lg transition-transform duration-700 ease-out hover:scale-105 hover:shadow-2xl will-change-transform"
              />
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full text-center text-sm text-gray-500 pt-16 mt-auto">
        © Mohd Umair 2025
      </footer>
    </section>
  );
};

export default AboutSection;
