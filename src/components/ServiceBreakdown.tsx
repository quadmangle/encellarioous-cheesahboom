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
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {copy[language].heading}
        </h2>
        <p className="text-base text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
          {copy[language].description}
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {(Object.entries(SERVICES_DATA) as [ServiceKey, typeof SERVICES_DATA[ServiceKey]][]).map(([key, data]) => {
          const service = data[language];
          const { modal } = service;
          const headingId = `service-breakdown-heading-${key}`;

          return (
            <article
              key={key}
              id={`service-section-${key}`}
              aria-labelledby={headingId}
              className="relative overflow-hidden rounded-3xl border border-[#c7d2fe]/70 dark:border-[#7f5af0]/30 bg-gradient-to-br from-white/95 via-indigo-50/80 to-sky-100/60 dark:from-[#1b2550]/95 dark:via-[#211b43]/92 dark:to-[#311d58]/95 p-8 shadow-[0_26px_48px_-22px_rgba(15,23,42,0.55)] dark:shadow-[0_30px_52px_-24px_rgba(5,8,30,0.9)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_70px_-28px_rgba(99,102,241,0.55)]"
            >
              <header className="mb-4">
                <h3 id={headingId} className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-base text-slate-700 dark:text-slate-200 whitespace-pre-line">
                  {service.desc}
                </p>
              </header>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-900 dark:text-indigo-100 mb-4">
                  {language === 'en' ? 'Key roles & capabilities' : 'Roles y capacidades clave'}
                </h4>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  {modal.features.map((feature, index) => (
                    <li key={index} className="flex gap-2 items-start">
                      <span className="mt-1 text-accent drop-shadow-icon-glow-light dark:text-accent">•</span>
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
