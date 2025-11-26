import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';


interface AboutContent {
  heading: string;
  p1: string;
  p2: string;
  p3: string;
}

interface AdminPageProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  aboutContent: AboutContent;
  setAboutContent: React.Dispatch<React.SetStateAction<AboutContent>>;
}

const AdminPage: React.FC<AdminPageProps> = ({ projects, setProjects, aboutContent, setAboutContent }) => {
  const [openProjectId, setOpenProjectId] = useState<number | null>(null);
  const projectRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());

  const handleProjectChange = (id: number, field: keyof Project, value: any) => {
    const updatedProjects = projects.map(p => p.id === id ? { ...p, [field]: value } : p);
    setProjects(updatedProjects);
  };
  
  const handleGalleryImagesChange = (id: number, urls: string) => {
     const updatedProjects = projects.map(p => 
        p.id === id 
          ? { ...p, galleryImages: urls.split('\n').map(url => url.trim()).filter(url => url) } 
          : p
      );
    setProjects(updatedProjects);
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now(),
      name: 'New Project',
      imageUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=2070&auto=format&fit=crop',
      theme: 'dark',
      galleryImages: [],
    };
    setProjects(prev => [newProject, ...prev]);
    setOpenProjectId(newProject.id);
  };

  const handleDeleteProject = (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      if (openProjectId === id) {
        setOpenProjectId(null);
      }
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };
  
  const handleMoveProject = (id: number, direction: 'up' | 'down') => {
    const fromIndex = projects.findIndex(p => p.id === id);
    if (fromIndex === -1) return;

    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= projects.length) return;

    const newProjects = [...projects];
    const [movedItem] = newProjects.splice(fromIndex, 1);
    newProjects.splice(toIndex, 0, movedItem);
    
    setProjects(newProjects);
  };

  const toggleProjectAccordion = (id: number) => {
    const isOpening = openProjectId !== id;
    setOpenProjectId(isOpening ? id : null);
    if (isOpening) {
      setTimeout(() => {
        projectRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100); // Small delay for the element to render before scrolling
    }
  };

  const handleAboutContentChange = (field: keyof AboutContent, value: string) => {
    setAboutContent(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="admin" className="min-h-screen w-full bg-gray-50 text-gray-800 px-8 md:px-16 pt-32 pb-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light border-b border-gray-300 pb-4 mb-8">Admin Panel</h1>

        {/* Projects Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-light">Projects</h2>
            <button
              onClick={handleAddProject}
              className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors"
            >
              Add New Project
            </button>
          </div>
          <div className="space-y-2">
            {projects.map((p, index) => (
              <div 
                key={p.id} 
                className="border border-gray-200 rounded-md overflow-hidden bg-white"
                ref={el => { projectRefs.current.set(p.id, el); }}
              >
                <button
                  onClick={() => toggleProjectAccordion(p.id)}
                  className="w-full flex justify-between items-center p-4 hover:bg-gray-50 text-left"
                >
                  <span className="font-medium">{p.name}</span>
                  <ChevronRightIcon className={`w-5 h-5 text-gray-500 transition-transform ${openProjectId === p.id ? 'rotate-90' : ''}`} />
                </button>
                {openProjectId === p.id && (
                  <div className="p-4 border-t border-gray-200 space-y-4 animate-contentFadeIn">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Name</label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => handleProjectChange(p.id, 'name', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700">Main Image URL</label>
                      <input
                        type="text"
                        value={p.imageUrl}
                        onChange={(e) => handleProjectChange(p.id, 'imageUrl', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gallery Image URLs (one per line)</label>
                       <textarea
                        value={p.galleryImages.join('\n')}
                        onChange={(e) => handleGalleryImagesChange(p.id, e.target.value)}
                        rows={10}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm font-mono"
                      />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMoveProject(p.id, 'up')}
                          disabled={index === 0}
                          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Move project up"
                        >
                          <ChevronUpIcon className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleMoveProject(p.id, 'down')}
                          disabled={index === projects.length - 1}
                          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Move project down"
                        >
                          <ChevronDownIcon className="w-5 h-5 text-gray-700" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                      >
                        Delete Project
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
             {projects.length === 0 && <p className="text-gray-500 text-center py-4">No projects yet. Click "Add New Project" to start.</p>}
          </div>
        </div>

        {/* About Page Section */}
        <div>
          <h2 className="text-2xl font-light mb-4">About Page Content</h2>
          <div className="p-4 bg-white border border-gray-200 rounded-md space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Heading</label>
                <input
                    type="text"
                    value={aboutContent.heading}
                    onChange={(e) => handleAboutContentChange('heading', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Paragraph 1</label>
                <textarea
                    value={aboutContent.p1}
                    onChange={(e) => handleAboutContentChange('p1', e.target.value)}
                    rows={2}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Paragraph 2</label>
                <textarea
                    value={aboutContent.p2}
                    onChange={(e) => handleAboutContentChange('p2', e.target.value)}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Paragraph 3</label>
                <textarea
                    value={aboutContent.p3}
                    onChange={(e) => handleAboutContentChange('p3', e.target.value)}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;