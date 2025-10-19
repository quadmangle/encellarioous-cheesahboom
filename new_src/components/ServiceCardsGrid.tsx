
import React, { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { SERVICES_DATA } from '../constants';
import type { ServiceKey } from '../types';

interface ServiceCardProps {
  id: ServiceKey;
  title: string;
  icon: string;
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
    className="min-h-[170px] p-7 rounded-3xl gap-4 grid grid-cols-[1fr_auto] grid-rows-[auto_1fr_auto] bg-white/70 dark:bg-dark-card text-[#251541] dark:text-[#f3ecfe] shadow-card-light dark:shadow-card-dark backdrop-blur-lg border border-white/50 dark:border-white/20 transition-all duration-200 ease-in-out cursor-pointer overflow-hidden relative hover:-translate-y-1 hover:scale-105 hover:shadow-card-light-hover dark:hover:shadow-accent/20 animate-fade-in-up"
    style={{ animationDelay: `${200 + index * 100}ms`, opacity: 0 }}
  >
    <div className="text-base font-semibold tracking-wider uppercase self-end">{title}</div>
    <div
      className="text-3xl self-end justify-self-end bg-clip-text text-transparent bg-gradient-to-tr from-primary to-accent drop-shadow-icon-glow-light dark:drop-shadow-icon-glow-dark"
    >
        <i className={icon}></i>
    </div>
    <div className="col-span-2 mt-2.5 text-sm">
      <p className="whitespace-pre-line">{desc}</p>
    </div>
    <div className="col-span-2 mt-3 h-0.5 bg-gradient-to-r from-primary to-accent" />
  </div>
);


interface ServiceCardsGridProps {
    onCardClick: (key: ServiceKey) => void;
}

const ServiceCardsGrid: React.FC<ServiceCardsGridProps> = ({ onCardClick }) => {
  const { language } = useContext(GlobalContext);

  return (
    <div className="w-[min(75rem,_100%)] mx-auto mt-11 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
