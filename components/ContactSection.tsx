import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="min-h-screen w-full bg-white text-[#333] font-sans px-8 md:px-16 pt-24 md:pt-32 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 flex-grow">
          
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            <h2 className="text-5xl font-serif text-gray-800">
              Say Hello!
            </h2>
            <div className="w-full">
              <img 
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop" 
                alt="Modern house with a pool" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-between pt-0 md:pt-20">
            <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-4 font-sans text-base items-baseline w-fit mx-auto">
              <span className="font-light text-gray-500 text-left whitespace-nowrap">Phone :</span>
              <a href="tel:+918439144238" className="hover:underline font-light text-gray-700 break-words">+91-84391-44238</a>
              
              <span className="font-light text-gray-500 text-left whitespace-nowrap">WhatsApp:</span>
              <a href="https://wa.me/919412505677" target="_blank" rel="noopener noreferrer" className="hover:underline font-light text-gray-700 break-words">https://wa.me/919412505677</a>
              
              <span className="font-light text-gray-500 text-left whitespace-nowrap">LinkedIn :</span>
              <a href="https://linkedin.com/in/mumair-" target="_blank" rel="noopener noreferrer" className="hover:underline font-light text-gray-700 break-words">linkedin.com/in/mumair-</a>
              
              <span className="font-light text-gray-500 text-left whitespace-nowrap">Email :</span>
              <a href="mailto:umairsaifi10@gmail.com" className="hover:underline font-light text-gray-700 break-words">umairsaifi10@gmail.com</a>
              
              <span className="font-light text-gray-500 text-left whitespace-nowrap">Address:</span>
              <span className="font-light text-gray-700">Available Worldwide</span>
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-7xl md:text-9xl font-serif text-gray-200 tracking-widest leading-none">
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