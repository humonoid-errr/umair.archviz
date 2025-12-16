
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
import { getOptimizedImage } from './utils/imageOptimizer';

export type Page = 'home' | 'about' | 'services' | 'testimonials' | 'contact' | 'gallery';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  
  // Initialize with a random index based on the total number of images available in initialProjects
  // This ensures the landing page starts with a random image on every visit/refresh.
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(() => {
    const totalImages = initialProjects.reduce((acc, project) => acc + 1 + project.galleryImages.length, 0);
    return totalImages > 0 ? Math.floor(Math.random() * totalImages) : 0;
  });

  // State to track the optimal image width based on screen size
  const [heroImageWidth, setHeroImageWidth] = useState(1920);
  
  const projects = initialProjects;
  const aboutContent = initialAboutContent;

  // Optimize hero images based on screen size
  useEffect(() => {
    const calculateWidth = () => {
      const width = window.innerWidth;
      const dpr = window.devicePixelRatio || 1;
      const physicalWidth = width * dpr;

      // Determine optimal width bucket to maximize quality while managing bandwidth
      if (physicalWidth <= 640) return 640;
      if (physicalWidth <= 1080) return 1080;
      if (physicalWidth <= 1920) return 1920;
      if (physicalWidth <= 2560) return 2560;
      return 3840; // 4K support
    };

    setHeroImageWidth(calculateWidth());

    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setHeroImageWidth(calculateWidth());
      }, 500); // Debounce to prevent rapid reloading
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Security: Disable Right Click, Inspector Shortcuts, Print, and Save
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Ctrl+Shift+I (Inspect) or Ctrl+Shift+J (Console) or Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
      }
      // Ctrl+P (Print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
      }
      // Ctrl+S (Save)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Create a flat list of all images (main + gallery) from all projects.
  const allHeroImages: RandomImage[] = useMemo(() => {
    return projects.flatMap(project => 
      [
        // Optimize hero images dynamically based on calculated heroImageWidth
        { imageUrl: getOptimizedImage(project.imageUrl, heroImageWidth, 85), projectName: project.name },
        ...project.galleryImages.map(galleryImg => ({
          imageUrl: getOptimizedImage(galleryImg, heroImageWidth, 85),
          projectName: project.name,
        })),
      ]
    );
  }, [projects, heroImageWidth]);

  // Handler to pick a random image from the pool (Auto-play logic)
  // This is also used as the onSkip callback if an image is found to be portrait.
  const handleNextHeroImage = useCallback(() => {
    if (allHeroImages.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allHeroImages.length);
    setCurrentHeroImageIndex(randomIndex);
  }, [allHeroImages.length]);

  useEffect(() => {
    if (currentPage !== 'home' || allHeroImages.length === 0) {
      return;
    }
    const imageInterval = setInterval(handleNextHeroImage, 5000);
    return () => clearInterval(imageInterval);
  }, [currentPage, handleNextHeroImage, allHeroImages.length]);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setCurrentPage('gallery');
  }, []);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
    if (page !== 'gallery') {
      setSelectedProject(null);
    }
  }, []);
  
  const currentHeroImage: RandomImage | null = allHeroImages.length > 0 ? allHeroImages[currentHeroImageIndex] : null;

  const renderContent = () => {
    switch (currentPage) {
      case 'about':
        return <AboutSection content={aboutContent} />;
      case 'services':
        return <ServicesSection />;
      case 'testimonials':
        return <TestimonialsSection />;
      case 'contact':
        return <ContactSection />;
      case 'gallery':
        return selectedProject && <GalleryPage project={selectedProject} />;
      default:
        return null;
    }
  };

  return (
    <>
      <CustomCursor />
      {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}
      {currentPage === 'home' ? (
        <div className="h-[100dvh] overflow-hidden bg-gray-800 text-white font-sans antialiased">
          <Header onNavigate={handleNavigate} page={currentPage} projects={projects} onSelectProject={handleSelectProject} />
          <Hero 
            image={currentHeroImage} 
            onSkip={handleNextHeroImage}
          />
        </div>
      ) : (
        <div className="font-sans antialiased bg-white">
          <Header onNavigate={handleNavigate} page={currentPage} projects={projects} onSelectProject={handleSelectProject} />
          <main key={currentPage} className="animate-contentFadeIn">
            {renderContent()}
          </main>
        </div>
      )}
    </>
  );
}

export default App;
