import React, { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { SERVICES_DATA } from '../constants';
import type { ServiceKey } from '../types';

const copy = {
  en: {
    heading: 'Service delivery breakdown',
    description:
      'Explore the exact capabilities offered within each managed service so you can match OPS talent to your operational gaps.',
  },
  es: {
    heading: 'Desglose de entrega de servicios',
    description:
      'Explore las capacidades específicas de cada servicio gestionado para alinear el talento de OPS con sus necesidades operativas.',
  },
};

const ServiceBreakdown: React.FC = () => {
  const { language } = useContext(GlobalContext);

  return (
    <section className="w-[min(75rem,_100%)] mx-auto mt-16 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#12253f] dark:text-gray-100 mb-4">
          {copy[language].heading}
        </h2>
        <p className="text-base text-[#3d4754] dark:text-gray-400 max-w-3xl mx-auto">
          {copy[language].description}
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {(Object.entries(SERVICES_DATA) as [ServiceKey, typeof SERVICES_DATA[ServiceKey]][]).map(([key, data]) => {
          const service = data[language];
          const { modal } = service;

          return (
            <article
              key={key}
              className="bg-white/80 dark:bg-dark-card border border-white/40 dark:border-white/10 rounded-3xl p-8 shadow-card-light dark:shadow-card-dark backdrop-blur-lg"
            >
              <header className="mb-4">
                <h3 className="text-xl font-semibold text-primary dark:text-accent mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-[#3d4754] dark:text-gray-400 whitespace-pre-line">
                  {service.desc}
                </p>
              </header>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-[#12253f] dark:text-gray-200 mb-3">
                  {language === 'en' ? 'Key roles & capabilities' : 'Roles y capacidades clave'}
                </h4>
                <ul className="space-y-2 text-sm text-[#1f2b3a] dark:text-gray-300">
                  {modal.features.map((feature, index) => (
                    <li key={index} className="flex gap-2 items-start">
                      <span className="mt-1 text-primary dark:text-accent">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ServiceBreakdown;
