
import React, { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';

const Hero: React.FC = () => {
  const { language } = useContext(GlobalContext);
  const content = {
    en: {
      title: "Scale your business with\n24/7 expert support",
      subtitle: "OPS provides managed services, IT solutions, and remote professionals to drive your growth.",
      button: "BOOK A CONSULTATION",
    },
    es: {
      title: "Escale su negocio con\nsoporte experto 24/7",
      subtitle: "OPS ofrece servicios gestionados, soluciones de TI y profesionales remotos para impulsar su crecimiento.",
      button: "RESERVAR UNA CONSULTA",
    },
  };

  return (
    <section className="bg-transparent dark:bg-transparent text-center py-12 px-4 max-w-4xl mx-auto text-[#12253f] dark:text-gray-200">
      <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight whitespace-pre-line animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
        {content[language].title}
      </h1>
      <p className="text-base md:text-lg text-[#3d4754] dark:text-gray-400 mb-7 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms', opacity: 0 }}>
        {content[language].subtitle}
      </p>
      <button className="bg-[#12253f] dark:bg-accent text-white border-none py-3 px-8 font-semibold text-sm rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 animate-fade-in-up" style={{ animationDelay: '300ms', opacity: 0 }}>
        {content[language].button}
      </button>
    </section>
  );
};

export default Hero;