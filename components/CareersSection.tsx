import React from 'react';

const CareersSection: React.FC = () => {
  return (
    <section id="careers" className="min-h-screen w-full flex items-center justify-center bg-white text-gray-800 p-8 md:p-16 pt-40">
      <div className="text-center max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-light uppercase tracking-[0.2em] mb-4">
          Careers
        </h2>
        <p className="text-base md:text-lg font-light leading-relaxed text-gray-600">
          We are always looking for talented individuals to join our team.
        </p>
        <p className="text-base md:text-lg font-light leading-relaxed text-gray-600 mt-2">
          Please check back later for specific openings or feel free to send your portfolio to our contact email.
        </p>
      </div>
    </section>
  );
};

export default CareersSection;
