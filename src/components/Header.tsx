import React, { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import type { ModalType, ServiceKey } from '../types';
import LanguageToggle from './LanguageToggle';
import Icon from './Icon';
import { SERVICES_DATA } from '../constants';

interface HeaderProps {
  onOpenModal: (type: ModalType) => void;
  onNavigateToService: (key: ServiceKey) => void;
  onNavigateToCompliance: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal, onNavigateToService, onNavigateToCompliance }) => {
  const { language, theme, setTheme } = useContext(GlobalContext);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const complianceLabel = language === 'en' ? 'OPS CySec Core' : 'OPS CySec Core';

  return (
    <header className="w-full max-w-6xl mx-auto flex items-center justify-between p-5 sm:px-8 font-semibold bg-transparent">
      <span className="font-bold text-4xl text-accent tracking-widest drop-shadow-logo-glow select-none">OPS</span>
      <nav className="hidden lg:flex gap-9">
        {(Object.keys(SERVICES_DATA) as ServiceKey[]).map((key) => {
          const label = SERVICES_DATA[key][language].title;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigateToService(key)}
              className="text-lg relative transition-colors duration-200 hover:text-primary focus:text-primary outline-none"
            >
              {label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onNavigateToCompliance}
          className="text-lg relative transition-colors duration-200 hover:text-primary focus:text-primary outline-none"
        >
          {complianceLabel}
        </button>
      </nav>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onOpenModal('SEARCH')}
          title="Search Services"
          className="bg-primary/80 text-white rounded-md py-1.5 px-3 font-bold text-base transition-colors duration-200 hover:bg-accent focus:bg-accent outline-none"
        >
          <Icon name="search" className="w-4 h-4" />
        </button>
        <LanguageToggle />
        <button onClick={toggleTheme} className="bg-primary text-white rounded-md py-1.5 px-4 font-bold text-base transition-colors duration-200 hover:bg-accent focus:bg-accent outline-none capitalize">
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </header>
  );
};

export default Header;