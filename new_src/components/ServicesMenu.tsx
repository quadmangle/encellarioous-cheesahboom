import React, { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { SERVICES_DATA } from '../constants';
import type { ServiceKey } from '../types';

interface ServicesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceClick: (key: ServiceKey) => void;
}

const ServicesMenu: React.FC<ServicesMenuProps> = ({ isOpen, onClose, onServiceClick }) => {
  const { language } = useContext(GlobalContext);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center lg:hidden"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-dark-modal w-full max-w-md mx-auto rounded-t-2xl p-4 pb-6 mb-20 shadow-lg animate-fade-in-up"
        style={{ animationDuration: '0.3s' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
        <h3 className="text-center font-bold text-lg mb-4 text-light-text dark:text-dark-text">
          {language === 'en' ? 'Our Services' : 'Nuestros Servicios'}
        </h3>
        <div className="max-h-[40vh] overflow-y-auto no-scrollbar">
          <ul className="space-y-2">
            {(Object.keys(SERVICES_DATA) as ServiceKey[]).map((key) => {
              const service = SERVICES_DATA[key][language];
              return (
                <li key={key}>
                  <button
                    onClick={() => onServiceClick(key)}
                    className="w-full text-left p-3 rounded-lg flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <i className={`${service.icon} text-xl w-6 text-center text-primary dark:text-accent`}></i>
                    <span className="font-semibold text-light-text dark:text-dark-text">{service.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServicesMenu;