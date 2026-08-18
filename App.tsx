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

export type Page =
  | 'home'
  | 'about'
  | 'services'
  | 'testimonials'
  | 'contact'
  | 'gallery';

/* =========================================================
   GOOGLE ANALYTICS
   ========================================================= */

const trackPageView = (pageTitle: string, hash: string = '') => {
  if (typeof window === 'undefined') return;

  const gtag = (window as any).gtag;

  if (typeof gtag !== 'function') return;

  // Convert the hash route into a virtual analytics path.
  // Example:
  // #piano-house -> /piano-house
  // #about -> /about
  // no hash -> /
  const virtualPath = hash ? `/${hash}` : '/';

  const pageLocation = `${window.location.origin}${virtualPath}`;

  gtag('event', 'page_view', {
    page_title: pageTitle,
    page_location: pageLocation,
  });
};

const trackProjectView = (project: Project) => {
  if (typeof window === 'undefined') return;

  const gtag = (window as any).gtag;

  if (typeof gtag !== 'function') return;

  gtag('event', 'project_view', {
    project_name: project.name,
  });
};

/* =========================================================
   APP
   ========================================================= */

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isZenMode, setIsZenMode] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isGalleryFullscreen, setIsGalleryFullscreen] = useState(false);

  const projects = initialProjects;
  const aboutContent = initialAboutContent;

  // Helper to create URL-friendly slugs from project names
  const getProjectSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-');

  /* =========================================================
     HASH ROUTING + GOOGLE ANALYTICS PAGE TRACKING
     ========================================================= */

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');

      /* -----------------------------------------------------
         HOME
         ----------------------------------------------------- */

      if (!hash) {
        setCurrentPage('home');
        setSelectedProject(null);
        setIsZenMode(false);
        setIsGalleryFullscreen(false);

        trackPageView('Home | umair.archviz', '');

        return;
      }

      /* -----------------------------------------------------
         STANDARD PAGES
         ----------------------------------------------------- */

      const validPages: Page[] = [
        'about',
        'services',
        'testimonials',
        'contact',
      ];

      if (validPages.includes(hash as Page)) {
        const page = hash as Page;

        setCurrentPage(page);
        setSelectedProject(null);
        setIsZenMode(false);
        setIsGalleryFullscreen(false);

        const pageTitle =
          page.charAt(0).toUpperCase() +
          page.slice(1) +
          ' | umair.archviz';

        trackPageView(pageTitle, hash);

        return;
      }

      /* -----------------------------------------------------
         PROJECT PAGES
         ----------------------------------------------------- */

      const project = projects.find(
        (p) => getProjectSlug(p.name) === hash
      );

      if (project) {
        setSelectedProject(project);
        setCurrentPage('gallery');
        setIsZenMode(false);
        setIsGalleryFullscreen(false);

        // GA4 virtual page view
        trackPageView(`${project.name} | umair.archviz`, hash);

        // Separate project event for easier reporting
        trackProjectView(project);

        return;
      }

      /* -----------------------------------------------------
         INVALID HASH
         ----------------------------------------------------- */

      setCurrentPage('home');
      setSelectedProject(null);
      setIsZenMode(false);
      setIsGalleryFullscreen(false);

      trackPageView('Home | umair.archviz', '');
    };

    // Handle initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [projects]);

  /* =========================================================
     HERO IMAGES
     ========================================================= */

  const allHeroImages: RandomImage[] = useMemo(() => {
    return projects
      .filter((project) => !project.is360)
      .flatMap((project) => {
        const potentialImages = [
          {
            imageUrl: project.imageUrl,
            projectName: project.name,
          },
          ...project.galleryImages.map((galleryImg) => ({
            imageUrl: galleryImg,
            projectName: project.name,
          })),
        ];

        return potentialImages
          .filter((img) => !isImageUrl360(img.imageUrl))
          .map((img) => ({
            ...img,
            imageUrl: img.imageUrl,
            projectName: img.projectName,
          }));
      });
  }, [projects]);

  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(() => {
    return allHeroImages.length > 0
      ? Math.floor(Math.random() * allHeroImages.length)
      : 0;
  });

  /* =========================================================
     IMAGE PRE-CACHING
     ========================================================= */

  useEffect(() => {
    if (showIntro && allHeroImages.length > 0) {
      const imagesToPrecache = allHeroImages.slice(0, 5);

      imagesToPrecache.forEach((img) => {
        const preloader = new Image();

        preloader.src = getOptimizedImage(
          img.imageUrl,
          2048,
          85
        );
      });
    }
  }, [showIntro, allHeroImages]);

  /* =========================================================
     CONTENT PROTECTION
     ========================================================= */

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') e.preventDefault();

      if (
        e.ctrlKey &&
        e.shiftKey &&
        (e.key === 'I' ||
          e.key === 'J' ||
          e.key === 'C')
      ) {
        e.preventDefault();
      }

      if (e.ctrlKey && e.key === 'u') e.preventDefault();
      if (e.ctrlKey && e.key === 'p') e.preventDefault();
      if (e.ctrlKey && e.key === 's') e.preventDefault();
    };

    document.addEventListener(
      'contextmenu',
      handleContextMenu
    );

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'contextmenu',
        handleContextMenu
      );

      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, []);

  /* =========================================================
     HERO NAVIGATION
     ========================================================= */

  const handleNextHeroImage = useCallback(() => {
    if (allHeroImages.length === 0) return;

    const nextIndex =
      (currentHeroImageIndex + 1) %
      allHeroImages.length;

    setCurrentHeroImageIndex(nextIndex);
  }, [
    allHeroImages.length,
    currentHeroImageIndex,
  ]);

  useEffect(() => {
    if (
      currentPage !== 'home' ||
      allHeroImages.length === 0 ||
      isZenMode ||
      showIntro
    ) {
      return;
    }

    const imageInterval = setInterval(
      handleNextHeroImage,
      6000
    );

    return () => clearInterval(imageInterval);
  }, [
    currentPage,
    handleNextHeroImage,
    allHeroImages.length,
    isZenMode,
    showIntro,
  ]);

  /* =========================================================
     PROJECT NAVIGATION
     ========================================================= */

  const handleSelectProject = useCallback(
    (project: Project) => {
      window.location.hash = getProjectSlug(project.name);
    },
    []
  );

  /* =========================================================
     STANDARD PAGE NAVIGATION
     ========================================================= */

  const handleNavigate = useCallback(
    (page: Page) => {
      if (page === 'home') {
        history.pushState(
          '',
          document.title,
          window.location.pathname +
            window.location.search
        );

        window.location.hash = '';
      } else if (page === 'gallery') {
        window.location.hash = '';
      } else {
        window.location.hash = page;
      }
    },
    []
  );

  /* =========================================================
     CURRENT HERO IMAGE
     ========================================================= */

  const currentHeroImage: RandomImage | null =
    allHeroImages.length > 0
      ? allHeroImages[currentHeroImageIndex]
      : null;

  /* =========================================================
     PAGE CONTENT
     ========================================================= */

  const renderContent = () => {
    switch (currentPage) {
      case 'about':
        return (
          <AboutSection content={aboutContent} />
        );

      case 'services':
        return <ServicesSection />;

      case 'testimonials':
        return <TestimonialsSection />;

      case 'contact':
        return <ContactSection />;

      case 'gallery':
        return (
          selectedProject && (
            <GalleryPage
              project={selectedProject}
              onFullscreenChange={
                setIsGalleryFullscreen
              }
            />
          )
        );

      default:
        return null;
    }
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <>
      {showIntro && (
        <IntroOverlay
          onComplete={() => setShowIntro(false)}
        />
      )}

      <CustomCursor />

      {currentPage === 'home' ? (
        <div className="h-[100dvh] overflow-hidden bg-black text-white font-sans antialiased">
          <Header
            onNavigate={handleNavigate}
            page={currentPage}
            projects={projects}
            onSelectProject={handleSelectProject}
            isZenMode={isZenMode}
            forceHide={isGalleryFullscreen}
          />

          <Hero
            image={currentHeroImage}
            onSkip={handleNextHeroImage}
            isZenMode={isZenMode}
            onToggleZenMode={() =>
              setIsZenMode(!isZenMode)
            }
          />
        </div>
      ) : (
        <div className="font-sans antialiased bg-white min-h-screen flex flex-col">
          <Header
            onNavigate={handleNavigate}
            page={currentPage}
            projects={projects}
            onSelectProject={handleSelectProject}
            forceHide={isGalleryFullscreen}
          />

          <main
            key={currentPage}
            className="animate-contentFadeIn flex-grow"
          >
            {renderContent()}
          </main>
        </div>
      )}
    </>
  );
};

export default App;
