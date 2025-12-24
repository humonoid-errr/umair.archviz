
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import ServicesSection from './components/ServicesSection';
import TestimonialsSection from './components/TestimonialsSection';
import GalleryPage from './components/GalleryPage';
import CustomCursor from './components/CustomCursor';
import IntroOverlay from './components/IntroOverlay';
import { initialProjects } from './constants';
import { Project, RandomImage } from './types';
import { initialAboutContent } from './constants/initialContent';
import { getOptimizedImage, isImageUrl360 } from './utils/imageOptimizer';

export type Page = 'home' | 'about' | 'services' | 'testimonials' | 'contact' | 'gallery';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isZenMode, setIsZenMode] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  const projects = initialProjects;
  const aboutContent = initialAboutContent;

  const allHeroImages: RandomImage[] = useMemo(() => {
    return projects
      .filter(project => !project.is360) 
      .flatMap(project => {
        const potentialImages = [
          { imageUrl: project.imageUrl, projectName: project.name },
          ...project.galleryImages.map(galleryImg => ({
            imageUrl: galleryImg,
            projectName: project.name,
          })),
        ];
        
        return potentialImages
          .filter(img => !isImageUrl360(img.imageUrl))
          .map(img => ({
            ...img,
            imageUrl: img.imageUrl,
            projectName: img.projectName
          }));
      });
  }, [projects]);

  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(() => {
    return allHeroImages.length > 0 ? Math.floor(Math.random() * allHeroImages.length) : 0;
  });

  // Pre-cache first few images during intro for instant landing experience
  useEffect(() => {
    if (showIntro && allHeroImages.length > 0) {
      const imagesToPrecache = allHeroImages.slice(0, 5);
      imagesToPrecache.forEach(img => {
        const preloader = new Image();
        preloader.src = getOptimizedImage(img.imageUrl, 2048, 85);
      });
    }
  }, [showIntro, allHeroImages]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') e.preventDefault();
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) e.preventDefault();
      if (e.ctrlKey && e.key === 'u') e.preventDefault();
      if (e.ctrlKey && e.key === 'p') e.preventDefault();
      if (e.ctrlKey && e.key === 's') e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNextHeroImage = useCallback(() => {
    if (allHeroImages.length === 0) return;
    const nextIndex = (currentHeroImageIndex + 1) % allHeroImages.length;
    setCurrentHeroImageIndex(nextIndex);
  }, [allHeroImages.length, currentHeroImageIndex]);

  useEffect(() => {
    if (currentPage !== 'home' || allHeroImages.length === 0 || isZenMode || showIntro) {
      return;
    }
    const imageInterval = setInterval(handleNextHeroImage, 6000); // Slightly longer interval for better appreciation
    return () => clearInterval(imageInterval);
  }, [currentPage, handleNextHeroImage, allHeroImages.length, isZenMode, showIntro]);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setCurrentPage('gallery');
    setIsZenMode(false);
  }, []);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setIsZenMode(false);
    if (page !== 'gallery') {
      setSelectedProject(null);
    }
  }, []);
  
  const currentHeroImage: RandomImage | null = allHeroImages.length > 0 ? allHeroImages[currentHeroImageIndex] : null;

  const renderContent = () => {
    switch (currentPage) {
      case 'about': return <AboutSection content={aboutContent} />;
      case 'services': return <ServicesSection />;
      case 'testimonials': return <TestimonialsSection />;
      case 'contact': return <ContactSection />;
      case 'gallery': return selectedProject && <GalleryPage project={selectedProject} />;
      default: return null;
    }
  };

  return (
    <>
      {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}
      <CustomCursor />
      {currentPage === 'home' ? (
        <div className="h-[100dvh] overflow-hidden bg-black text-white font-sans antialiased">
          <Header 
            onNavigate={handleNavigate} 
            page={currentPage} 
            projects={projects} 
            onSelectProject={handleSelectProject}
            isZenMode={isZenMode}
          />
          <Hero 
            image={currentHeroImage} 
            onSkip={handleNextHeroImage}
            isZenMode={isZenMode}
            onToggleZenMode={() => setIsZenMode(!isZenMode)}
          />
        </div>
      ) : (
        <div className="font-sans antialiased bg-white min-h-screen flex flex-col">
          <Header onNavigate={handleNavigate} page={currentPage} projects={projects} onSelectProject={handleSelectProject} />
          <main key={currentPage} className="animate-contentFadeIn flex-grow">
            {renderContent()}
          </main>
        </div>
      )}
    </>
  );
}

export default App;
