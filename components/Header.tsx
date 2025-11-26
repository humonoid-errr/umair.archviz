
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
}

const Header: React.FC<HeaderProps> = ({ onNavigate, page, projects, onSelectProject }) => {
  const [isWorkMenuOpen, setIsWorkMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const workMenuRef = useRef<HTMLDivElement>(null);
  const isHomePage = page === 'home';
  const isLightPage = page === 'about' || page === 'services' || page === 'testimonials' || page === 'contact' || page === 'gallery';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (workMenuRef.current && !workMenuRef.current.contains(event.target as Node)) {
        setIsWorkMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Delay setting visible to trigger animation on mount
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
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 300); // Animation duration
  };

  const getHeaderClasses = () => {
    const baseClasses = "absolute top-0 left-0 right-0 z-20 group";
    return `${baseClasses} py-8 md:py-12 px-8 md:px-24`;
  };
  
  const getCapsuleClasses = () => {
    const baseClasses = "hidden md:block absolute top-1/2 -translate-y-1/2 h-14 rounded-full origin-center transition-all duration-300 ease-in-out pointer-events-none";
    const positionClasses = "inset-x-6 md:inset-x-16";
    const hoverClasses = "opacity-0 group-hover:opacity-100 scale-x-95 group-hover:scale-x-100";

    if (isHomePage) {
      if (isWorkMenuOpen) {
        return `${baseClasses} ${positionClasses} opacity-100 scale-x-100 bg-white/10 backdrop-blur-lg border border-white/20`;
      }
      return `${baseClasses} ${positionClasses} ${hoverClasses} bg-black/20 backdrop-blur-lg border border-white/10`;
    }
    
    if (isWorkMenuOpen) {
       return `${baseClasses} ${positionClasses} opacity-100 scale-x-100 bg-gray-200 border border-gray-300`;
    }
    return `${baseClasses} ${positionClasses} ${hoverClasses} bg-gray-100 border border-gray-200`;
  };

  const getTextClasses = () => {
    if (isLightPage) return 'text-gray-800';
    return 'text-white';
  };

  const getButtonClasses = () => {
     if (isLightPage) return "cursor-pointer hover:opacity-70 transition-opacity bg-transparent border-none text-gray-800 uppercase text-sm font-light tracking-wider";
     return "cursor-pointer hover:opacity-70 transition-opacity bg-transparent border-none text-white uppercase text-sm font-light tracking-wider";
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
        
        <div className={`relative flex justify-between items-center ${getTextClasses()}`}>
          <button
            onClick={() => onNavigate('home')}
            className="text-lg md:text-2xl font-light tracking-[0.3em] md:tracking-[0.5em] uppercase bg-transparent border-none p-0 text-left cursor-pointer hover:opacity-70 transition-opacity"
            aria-label="Go to home page"
          >
            MOHD UMAIR
          </button>
          
          <div className="hidden md:block">
            <nav className="flex items-center space-x-6 text-sm font-light tracking-wider uppercase">
              <div 
                className="relative"
                ref={workMenuRef}
                onMouseEnter={() => setIsWorkMenuOpen(true)}
                onMouseLeave={() => setIsWorkMenuOpen(false)}
              >
                <button 
                  onClick={() => setIsWorkMenuOpen(prev => !prev)} 
                  className={`${getButtonClasses()} flex items-center`}
                  disabled={projects.length === 0}
                >
                    <span className="text-xl font-thin mr-1">+</span> Work
                </button>
                {isWorkMenuOpen && projects.length > 0 && (
                  <div className="absolute top-full pt-4 -ml-4 w-64 text-white z-30">
                    <div className="bg-black/80 backdrop-blur-lg border border-white/10 rounded-md overflow-hidden flex flex-col shadow-2xl">
                      <ul className="max-h-80 overflow-y-auto py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-white/60">
                        {projects.map(project => (
                            <li key={project.id}>
                              <button 
                                onClick={() => onSelectProject(project)}
                                className="w-full text-left px-6 py-2.5 text-sm font-light hover:bg-white/10 hover:pl-8 transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis"
                              >
                                {project.name}
                              </button>
                            </li>
                          ))
                        }
                      </ul>
                      <p className="text-[10px] text-gray-400 font-light tracking-wider text-center py-2 border-t border-white/10 bg-black/20">
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
                <a href="https://linkedin.com/in/mumair-" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a href="https://wa.me/919412505677" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  <WhatsAppIcon className="w-5 h-5" />
                </a>
              </div>
            </nav>
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2" aria-label="Open menu">
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className={`fixed inset-0 bg-white z-50 text-gray-900 p-8 flex flex-col md:hidden transform transition-transform duration-300 ease-in-out ${isMenuVisible ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
          <div className="flex justify-end flex-shrink-0">
            <button onClick={closeMobileMenu} aria-label="Close menu" className="p-2 -m-2">
              <CloseIcon className="w-8 h-8 text-gray-900" />
            </button>
          </div>
          <nav className="flex-grow flex flex-col justify-start items-start text-left pt-8 space-y-12 pr-4">
            <div>
              <div className="flex items-center text-3xl font-light mb-4">
                  <span className="text-3xl font-thin mr-2">+</span> Work
              </div>
              <ul className="pl-2 space-y-2">
                {projects.map(project => (
                  <li key={project.id}>
                    <button 
                      onClick={() => handleMobileProjectSelect(project)}
                      className="w-full text-left py-1 text-xl font-light text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {project.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start space-y-6">
              <button onClick={() => handleMobileNav('about')} className="text-3xl font-light hover:opacity-70 transition-opacity">About</button>
              <button onClick={() => handleMobileNav('services')} className="text-3xl font-light hover:opacity-70 transition-opacity">Services</button>
              <button onClick={() => handleMobileNav('testimonials')} className="text-3xl font-light hover:opacity-70 transition-opacity">Testimonials</button>
              <button onClick={() => handleMobileNav('contact')} className="text-3xl font-light hover:opacity-70 transition-opacity">Contact</button>
            </div>
          </nav>
          <div className="pt-6 mt-auto flex-shrink-0">
            <div className="flex justify-start space-x-6 mb-6">
                <a href="https://linkedin.com/in/mumair-" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:opacity-70 transition-opacity">
                    <LinkedinIcon className="w-6 h-6" />
                </a>
                <a href="https://wa.me/919412505677" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:opacity-70 transition-opacity">
                    <WhatsAppIcon className="w-6 h-6" />
                </a>
            </div>
            <div className="text-xs text-gray-500 font-light space-y-2 text-left">
                <p><a href="tel:+918439144238" className="hover:underline">+91-84391-44238</a></p>
                <p><a href="mailto:umairsaifi10@gmail.com" className="hover:underline">umairsaifi10@gmail.com</a></p>
                <p className="pt-2">Address: Available Worldwide</p>
            </div>
            <p className="text-xs text-gray-400 font-light mt-8 text-left tracking-wider">
              © Mohd Umair 2025
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
