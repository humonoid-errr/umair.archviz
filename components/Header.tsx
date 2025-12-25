
import React, { useState, useRef, useEffect } from 'react';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { Page } from '../App';
import { Project } from '../types';
import { MenuIcon } from './icons/MenuIcon';
import { CloseIcon } from './icons/CloseIcon';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  page: Page;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  isZenMode?: boolean;
  forceHide?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onNavigate, 
  page, 
  projects, 
  onSelectProject, 
  isZenMode = false,
  forceHide = false
}) => {
  const [isWorkMenuOpen, setIsWorkMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isHeaderHiddenByScroll, setIsHeaderHiddenByScroll] = useState(false);
  const lastScrollY = useRef(0);
  const workMenuRef = useRef<HTMLDivElement>(null);
  
  const isLightPage = page !== 'home';

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle smart scroll behavior (Hide on scroll down, show on scroll up)
  useEffect(() => {
    if (page === 'home') {
      setIsHeaderHiddenByScroll(false);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at the very top
      if (currentScrollY < 50) {
        setIsHeaderHiddenByScroll(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Hide if scrolling down, show if scrolling up
      if (currentScrollY > lastScrollY.current) {
        setIsHeaderHiddenByScroll(true);
      } else {
        setIsHeaderHiddenByScroll(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (workMenuRef.current && !workMenuRef.current.contains(event.target as Node)) {
        setIsWorkMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setIsMenuVisible(true), 10);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'auto';
      }
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMenuVisible(false);
    setTimeout(() => setIsMobileMenuOpen(false), 300);
  };

  const getHeaderClasses = () => {
    const baseClasses = "fixed top-0 left-0 right-0 z-[100] group transition-all duration-500 ease-in-out";
    
    // Combined visibility logic
    const shouldHide = forceHide || isHeaderHiddenByScroll || (isZenMode && isDesktop);
    const visibilityClasses = shouldHide ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100";
    
    return `${baseClasses} ${visibilityClasses} py-8 md:py-12 px-8 md:px-24`;
  };
  
  const getCapsuleClasses = () => {
    const baseClasses = "hidden md:block absolute top-1/2 -translate-y-1/2 h-14 rounded-full origin-center transition-all duration-300 ease-in-out pointer-events-none";
    const positionClasses = "inset-x-6 md:inset-x-16";
    const hoverClasses = "opacity-0 group-hover:opacity-100 scale-x-95 group-hover:scale-x-100";

    if (!isLightPage) {
      if (isWorkMenuOpen) return `${baseClasses} ${positionClasses} opacity-100 scale-x-100 bg-white/10 backdrop-blur-lg border border-white/20`;
      return `${baseClasses} ${positionClasses} ${hoverClasses} bg-black/20 backdrop-blur-lg border border-white/10`;
    }
    
    if (isWorkMenuOpen) return `${baseClasses} ${positionClasses} opacity-100 scale-x-100 bg-gray-200/50 backdrop-blur-md border border-gray-300`;
    return `${baseClasses} ${positionClasses} ${hoverClasses} bg-gray-100/50 backdrop-blur-md border border-gray-200`;
  };

  const getTextClasses = () => isLightPage ? 'text-gray-900' : 'text-white';
  
  const getButtonClasses = () => {
    const color = isLightPage ? 'text-gray-900' : 'text-white';
    return `cursor-pointer hover:opacity-70 transition-all duration-300 bg-transparent border-none uppercase text-[10px] md:text-xs font-light tracking-widest ${color}`;
  };
  
  const handleMobileNav = (page: Page) => {
    onNavigate(page);
    closeMobileMenu();
  };
  
  const handleMobileProjectSelect = (project: Project) => {
    onSelectProject(project);
    closeMobileMenu();
  };

  return (
    <>
      <header className={getHeaderClasses()}>
        <div className={getCapsuleClasses()} aria-hidden="true" />
        
        <div className={`relative flex justify-between items-center transition-colors duration-500 ${getTextClasses()}`}>
          <button
            onClick={() => onNavigate('home')}
            className={`text-lg md:text-2xl font-light tracking-[0.3em] md:tracking-[0.5em] uppercase bg-transparent border-none p-0 text-left cursor-pointer hover:opacity-70 transition-all duration-500 ${getTextClasses()}`}
          >
            MOHD UMAIR
          </button>
          
          <div className="hidden md:block">
            <nav className="flex items-center space-x-6">
              <div 
                className="relative"
                ref={workMenuRef}
                onMouseEnter={() => setIsWorkMenuOpen(true)}
                onMouseLeave={() => setIsWorkMenuOpen(false)}
              >
                <button onClick={() => setIsWorkMenuOpen(prev => !prev)} className={`${getButtonClasses()} flex items-center`}>
                    <span className="text-xl font-thin mr-1">+</span> Work
                </button>
                {isWorkMenuOpen && projects.length > 0 && (
                  <div className="absolute top-full pt-4 -ml-4 w-64 text-white z-30 animate-contentFadeIn">
                    <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-md overflow-hidden flex flex-col shadow-2xl">
                      <ul className="max-h-[70vh] overflow-y-auto py-2">
                        {projects.map(project => (
                            <li key={project.id}>
                              <button onClick={() => onSelectProject(project)} className="w-full text-left px-6 py-2.5 text-xs font-light hover:bg-white/10 hover:pl-8 transition-all duration-300">
                                {project.name}
                              </button>
                            </li>
                          ))
                        }
                      </ul>
                      <p className="text-[9px] text-gray-400 font-light tracking-widest text-center py-2 border-t border-white/10 bg-black/20">
                        © Mohd Umair 2025
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => onNavigate('about')} className={getButtonClasses()}>About</button>
              <button onClick={() => onNavigate('services')} className={getButtonClasses()}>Services</button>
              <button onClick={() => onNavigate('testimonials')} className={getButtonClasses()}>Testimonials</button>
              <button onClick={() => onNavigate('contact')} className={getButtonClasses()}>Contact</button>
              <div className="flex items-center pl-4 space-x-4">
                <a href="https://linkedin.com/in/mumair-" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity"><LinkedinIcon className="w-5 h-5" /></a>
                <a href="https://wa.me/919412505677" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity"><WhatsAppIcon className="w-5 h-5" /></a>
              </div>
            </nav>
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2" aria-label="Open menu">
              <MenuIcon className={`w-6 h-6 ${isLightPage ? 'text-gray-900' : 'text-white'}`} />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className={`fixed inset-0 bg-white z-[200] text-gray-900 p-8 flex flex-col transform transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-hide ${isMenuVisible ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-end mb-4 flex-shrink-0">
            <button onClick={closeMobileMenu} className="p-2 -m-2"><CloseIcon className="w-8 h-8 text-gray-900" /></button>
          </div>
          <nav className="flex-grow flex flex-col pt-4 pb-12 space-y-12">
            <div>
              <div className="text-3xl font-light mb-4 uppercase tracking-widest text-gray-400">Work</div>
              <ul className="pl-2 space-y-4">
                {projects.map(project => (
                  <li key={project.id}>
                    <button onClick={() => handleMobileProjectSelect(project)} className="w-full text-left py-1 text-2xl font-light text-gray-900 uppercase tracking-tighter">{project.name}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col space-y-6">
              <button onClick={() => handleMobileNav('about')} className="text-4xl font-light text-left uppercase tracking-tighter">About</button>
              <button onClick={() => handleMobileNav('services')} className="text-4xl font-light text-left uppercase tracking-tighter">Services</button>
              <button onClick={() => handleMobileNav('testimonials')} className="text-4xl font-light text-left uppercase tracking-tighter">Testimonials</button>
              <button onClick={() => handleMobileNav('contact')} className="text-4xl font-light text-left uppercase tracking-tighter">Contact</button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
