import React, { useState, useEffect } from 'react';

interface RandomImage {
  imageUrl: string;
  projectName: string;
}

interface HeroProps {
  image: RandomImage | null;
}

const Hero: React.FC<HeroProps> = ({ image }) => {
  const [img1, setImg1] = useState<RandomImage | null>(null);
  const [img2, setImg2] = useState<RandomImage | null>(null);
  const [showImg1, setShowImg1] = useState(true);
  
  useEffect(() => {
    if (!image) return;

    if (!img1) {
      setImg1(image);
      setShowImg1(true);
      return;
    }
    
    const currentVisibleUrl = showImg1 ? img1.imageUrl : img2?.imageUrl;
    if (image.imageUrl === currentVisibleUrl) {
      return;
    }

    if (showImg1) {
      setImg2(image);
    } else {
      setImg1(image);
    }
    setShowImg1(prev => !prev);
    
  }, [image]);

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
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

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