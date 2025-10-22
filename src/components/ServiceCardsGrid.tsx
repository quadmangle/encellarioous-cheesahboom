
import React, { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { SERVICES_DATA } from '../constants';
import Icon from './Icon';
import type { IconName, ServiceKey } from '../types';

interface ServiceCardProps {
  id: ServiceKey;
  title: string;
  icon: IconName;
  desc: string;
  onClick: () => void;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ id, title, icon, desc, onClick, index }) => (
  <div
    id={`card-${id}`}
    onClick={onClick}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    tabIndex={0}
    role="button"
    aria-label={`Learn more about ${title}`}
    className="min-h-[180px] p-7 rounded-3xl gap-4 grid grid-cols-[1fr_auto] grid-rows-[auto_1fr_auto] bg-gradient-to-br from-white/95 via-sky-50/80 to-indigo-100/60 dark:from-[#1c274c]/95 dark:via-[#221b3f]/90 dark:to-[#311d58]/95 text-slate-900 dark:text-slate-100 shadow-[0_26px_48px_-22px_rgba(15,23,42,0.55)] dark:shadow-[0_26px_54px_-24px_rgba(8,10,35,0.8)] border border-white/60 dark:border-white/15 backdrop-blur-xl transition-all duration-300 ease-out cursor-pointer overflow-hidden relative hover:-translate-y-1 hover:shadow-[0_36px_70px_-28px_rgba(59,130,246,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 animate-fade-in-up"
    style={{ animationDelay: `${200 + index * 100}ms`, opacity: 0 }}
  >
    <div className="text-sm font-semibold tracking-[0.3em] uppercase self-end text-slate-900 dark:text-slate-100">{title}</div>
    <div
      className="text-3xl self-end justify-self-end bg-clip-text text-transparent bg-gradient-to-tr from-primary via-accent to-primary drop-shadow-icon-glow-light dark:drop-shadow-icon-glow-dark"
    >
      <Icon name={icon} className="w-7 h-7" />
    </div>
    <div className="col-span-2 mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
      <p className="whitespace-pre-line">{desc}</p>
    </div>
    <div className="col-span-2 mt-4 h-1 rounded-full bg-gradient-to-r from-primary via-accent to-primary/80 opacity-90 dark:opacity-100" />
  </div>
);


interface ServiceCardsGridProps {
    onCardClick: (key: ServiceKey) => void;
}

const ServiceCardsGrid: React.FC<ServiceCardsGridProps> = ({ onCardClick }) => {
  const { language } = useContext(GlobalContext);

  return (
    <div className="w-[min(75rem,_100%)] mx-auto mt-8 sm:mt-9 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {(Object.keys(SERVICES_DATA) as ServiceKey[]).map((key, index) => {
        const service = SERVICES_DATA[key][language];
        return (
          <ServiceCard
            key={key}
            id={key}
            index={index}
            title={service.title}
            icon={service.icon}
            desc={service.desc}
            onClick={() => onCardClick(key)}
          />
        );
      })}
    </div>
  );
};

export default ServiceCardsGrid;
