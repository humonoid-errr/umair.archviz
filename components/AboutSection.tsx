import React from 'react';

interface AboutContent {
  heading: string;
  p1: string;
  p2: string;
  p3: string;
}

interface AboutSectionProps {
  content: AboutContent;
}

const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
  return (
    <section id="about" className="min-h-screen w-full flex flex-col bg-white text-gray-800 px-8 md:px-16 pt-24 md:pt-32 pb-8">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col border-t border-gray-300 pt-10">
        <div className="w-full">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col items-start gap-8">
            <h2 className="text-3xl font-light uppercase tracking-[0.2em]">
              {content.heading}
            </h2>
            <div className="w-full">
              <img
                src="https://raw.githubusercontent.com/humonoid-errr/umair.archviz/refs/heads/main/mypic/Background.jpg"
                alt="Modern interior with a view of sand dunes"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-base font-light leading-relaxed text-gray-600 space-y-4">
              <p>{content.p1}</p>
              <p>{content.p2}</p>
              <p>{content.p3}</p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* Left Column - Text Content */}
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-light uppercase tracking-[0.2em] mb-8">
                {content.heading}
              </h2>
              <div className="text-base md:text-lg font-light leading-relaxed text-gray-600 max-w-lg mt-16 space-y-6">
                <p>{content.p1}</p>
                <p>{content.p2}</p>
                <p>{content.p3}</p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1588796144858-295b21a34a8a?q=80&w=1974&auto-format&fit=crop"
                alt="Modern interior with a view of sand dunes"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full text-center text-sm text-gray-500 pt-16 mt-auto">
        © Mohd Umair 2025
      </footer>
    </section>
  );
};

export default AboutSection;
