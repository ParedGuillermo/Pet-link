import React from 'react';

const HeroSection = ({ onReportClick }) => (
  <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-6 text-center shadow-xl rounded-3xl min-h-[300px] flex flex-col justify-center max-w-4xl mx-auto transition-transform duration-300 hover:scale-[1.02]">
    <h1 className="mb-4 text-2xl font-bold">
      ¿Tu mascota se ha perdido?
    </h1>
    <p className="max-w-full mb-8 text-base leading-relaxed">
      Te ayudamos a encontrarla rápidamente con nuestra red y tecnología.
    </p>
    <button
      onClick={onReportClick}
      className="px-6 py-3 text-base font-semibold transition-transform duration-150 bg-orange-500 rounded-full shadow-md hover:bg-orange-600 active:scale-95"
      aria-label="Reportar mascota perdida"
      type="button"
    >
      Reportar mascota perdida
    </button>
  </section>
);

export default HeroSection;
