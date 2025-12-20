
import React from 'react';
import { 
  InteriorDesignIcon, 
  ModellingIcon, 
  CommercialIcon, 
  SpacePlanningIcon, 
  RenderingIcon, 
  ProductVisIcon 
} from './icons/ServiceIcons';

const services = [
  {
    title: "Interior & Exterior Design",
    description: "Our team crafts meticulously detailed designs for both indoor and outdoor spaces, ensuring functionality, aesthetics, and harmony.",
    icon: <InteriorDesignIcon className="w-full h-full" />
  },
  {
    title: "3D Modelling",
    description: "We transform concepts into lifelike 3D models, providing you with a realistic visualization of your project before construction begins.",
    icon: <ModellingIcon className="w-full h-full" />
  },
  {
    title: "Commercial Design",
    description: "From retail stores to office buildings, we create innovative designs that enhance brand identity and customer experience.",
    icon: <CommercialIcon className="w-full h-full" />
  },
  {
    title: "Space Planning",
    description: "Our expertise in space planning maximizes efficiency and flow within your space, optimizing layouts for both residential and commercial projects.",
    icon: <SpacePlanningIcon className="w-full h-full" />
  },
  {
    title: "Rendering Service",
    description: "Enhancing 3D models with detailed design elements, materials, and lighting scenarios for vivid visualizations of your architectural projects.",
    icon: <RenderingIcon className="w-full h-full" />
  },
  {
    title: "Product Visualization",
    description: "We create stunning renderings and animations that showcase product designs with precision and realism, elevating your marketing.",
    icon: <ProductVisIcon className="w-full h-full" />
  }
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="min-h-screen w-full flex flex-col bg-white text-gray-800 px-8 md:px-24 pt-24 md:pt-32 pb-8">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col border-t border-gray-300 pt-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 md:gap-y-24 mb-16">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="flex flex-col items-start gap-6 group transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 text-gray-800 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-orange-100/30 p-1 rounded-lg -ml-2 -mt-2 absolute w-12 h-12 -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {service.icon}
              </div>
              <h3 className="text-lg md:text-xl font-light uppercase tracking-widest text-gray-800">
                {service.title}
              </h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm md:text-base pr-4">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <footer className="w-full text-center text-sm text-gray-500 pt-8 mt-auto">
        © Mohd Umair 2025
      </footer>
    </section>
  );
};

export default ServicesSection;
