import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import GalleryPage from './components/GalleryPage';
import { initialProjects } from './constants';
import { Project } from './types';
import { initialAboutContent } from './constants/initialContent';

export type Page = 'home' | 'about' | 'contact' | 'gallery';

interface RandomImage {
  imageUrl: string;
  projectName: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  
  const projects = initialProjects;
  const aboutContent = initialAboutContent;

  const handleNextProject = useCallback(() => {
    if (projects.length === 0) return;
    setCurrentProjectIndex(prevIndex => (prevIndex + 1) % projects.length);
  }, [projects.length]);

  useEffect(() => {
    if (currentPage !== 'home' || projects.length === 0) {
      return;
    }

    const projectInterval = setInterval(handleNextProject, 5000);

    return () => clearInterval(projectInterval);
  }, [currentPage, handleNextProject, projects.length]);

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
  
  const currentProject = projects.length > 0 ? projects[currentProjectIndex] : null;
  const heroImage: RandomImage | null = currentProject ? {
      imageUrl: currentProject.imageUrl,
      projectName: currentProject.name,
  } : null;

  const renderContent = () => {
    switch (currentPage) {
      case 'about':
        return <AboutSection content={aboutContent} />;
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
      {currentPage === 'home' ? (
        <div className="h-screen overflow-hidden bg-gray-800 text-white font-sans antialiased">
          <Header onNavigate={handleNavigate} page={currentPage} projects={projects} onSelectProject={handleSelectProject} />
          <Hero 
            image={heroImage} 
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