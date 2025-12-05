
import React from 'react';
import { getOptimizedImage } from '../utils/imageOptimizer';

const ContactSection: React.FC = () => {
  const contactImage = "https://cdn.jsdelivr.net/gh/humonoid-errr/umair.archviz@main/portfolio/e5d5272a9600a742836077c9b36e57ab.jpg";
  const optimizedContactImage = getOptimizedImage(contactImage, 1000, 80);

  return (
    <section id="contact" className="min-h-screen w-full bg-white text-[#333] font-sans px-8 md:px-24 pt-24 md:pt-32 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col border-t border-gray-300 pt-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 flex-grow">
          
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            <h2 className="text-5xl font-serif text-gray-800 transition-all duration-500 hover:tracking-widest cursor-default w-fit origin-left">
              Say Hello!
            </h2>
            <div className="w-full">
              <img 
                src={optimizedContactImage}
                alt="Modern house with a pool" 
                className="w-full h-auto object-cover transition-transform duration-700 ease-out hover:scale-105 hover:shadow-2xl"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-between pt-0 md:pt-20">
            <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-4 font-sans text-base items-baseline w-fit mx-auto">
              <span className="font-light text-gray-500 text-left whitespace-nowrap">Phone :</span>
              <a href="tel:+918439144238" className="hover:underline font-light text-gray-700 break-words transition-all duration-300 hover:translate-x-2 inline-block">+91-84391-44238</a>
              
              <span className="font-light text-gray-500 text-left whitespace-nowrap">WhatsApp:</span>
              <a href="https://wa.me/919412505677" target="_blank" rel="noopener noreferrer" className="hover:underline font-light text-gray-700 break-words transition-all duration-300 hover:translate-x-2 inline-block">https://wa.me/919412505677</a>
              
              <span className="font-light text-gray-500 text-left whitespace-nowrap">LinkedIn :</span>
              <a href="https://linkedin.com/in/mumair-" target="_blank" rel="noopener noreferrer" className="hover:underline font-light text-gray-700 break-words transition-all duration-300 hover:translate-x-2 inline-block">linkedin.com/in/mumair-</a>
              
              <span className="font-light text-gray-500 text-left whitespace-nowrap">Email :</span>
              <a href="mailto:hello@umair-archviz.work" className="hover:underline font-light text-gray-700 break-words transition-all duration-300 hover:translate-x-2 inline-block">hello@umair-archviz.work</a>
              
              <span className="font-light text-gray-500 text-left whitespace-nowrap">Address:</span>
              <span className="font-light text-gray-700 transition-all duration-300 hover:translate-x-2 inline-block cursor-default">Available Worldwide</span>
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-7xl md:text-9xl font-serif text-gray-200 tracking-widest leading-none select-none transition-transform duration-500 hover:scale-105 cursor-default">
                THANK YOU
              </p>
            </div>
          </div>
          
        </div>
      </div>
      <footer className="w-full text-center text-sm text-gray-500 py-8">
        © Mohd Umair 2025
      </footer>
    </section>
  );
};

export default ContactSection;
