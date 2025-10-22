import React, { useContext } from 'react';
import type { MutableRefObject } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { SERVICES_DATA } from '../constants';
import type { ServiceKey } from '../types';

interface ServiceBreakdownProps {
  activeService: ServiceKey;
  sectionRef: MutableRefObject<HTMLElement | null>;
  onRequestInfo?: () => void;
}

const copy = {
  en: {
    introLabel: 'Now exploring',
    capabilities: 'Key roles & capabilities',
  },
  es: {
    introLabel: 'Explorando',
    capabilities: 'Roles y capacidades clave',
  },
};

const ServiceBreakdown: React.FC<ServiceBreakdownProps> = ({ activeService, sectionRef, onRequestInfo }) => {
  const { language } = useContext(GlobalContext);
  const service = SERVICES_DATA[activeService][language];
  const { modal } = service;
  const { introLabel, capabilities } = copy[language];

  return (
    <section
      ref={sectionRef}
      id="service-details"
      className="w-[min(75rem,_100%)] mx-auto mt-16 px-4"
      aria-labelledby="service-details-heading"
    >
      <article className="relative overflow-hidden rounded-3xl border border-[#c7d2fe]/70 dark:border-[#7f5af0]/30 bg-gradient-to-br from-white/95 via-indigo-50/80 to-sky-100/60 dark:from-[#1b2550]/95 dark:via-[#211b43]/92 dark:to-[#311d58]/95 p-10 shadow-[0_26px_48px_-22px_rgba(15,23,42,0.55)] dark:shadow-[0_30px_52px_-24px_rgba(5,8,30,0.9)] backdrop-blur-xl">
        <header className="mb-6">
          <p className="uppercase tracking-[0.35em] text-xs font-semibold text-primary/80 dark:text-accent/80 mb-3">
            {introLabel}
          </p>
          <h2 id="service-details-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {service.title}
          </h2>
          <p className="text-base text-slate-700 dark:text-slate-200 whitespace-pre-line">
            {modal.content}
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-start">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-900 dark:text-indigo-100 mb-4">
              {capabilities}
            </h3>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
              {modal.features.map((feature, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <span className="mt-1 text-accent drop-shadow-icon-glow-light dark:text-accent">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/60 dark:bg-white/5 rounded-2xl border border-white/40 dark:border-white/10 p-5 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-200">
              {service.desc}
            </p>
            <button
              type="button"
              onClick={onRequestInfo ?? (() => {})}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white font-semibold text-sm tracking-wide hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!onRequestInfo}
            >
              {language === 'en' ? 'Request more info' : 'Solicitar más información'}
            </button>
          </div>
        </div>
      </article>
    </section>
  );
};

export default ServiceBreakdown;
