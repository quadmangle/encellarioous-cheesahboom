import React, { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import type { ModalType, ServiceKey } from '../types';
import LanguageToggle from './LanguageToggle';
import Icon from './Icon';

interface HeaderProps {
  onOpenModal: (type: ModalType) => void;
  onNavigateToService: (key: ServiceKey) => void;
  activeServiceKey: ServiceKey;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal, onNavigateToService, activeServiceKey }) => {
  const { language, setLanguage, theme, setTheme } = useContext(GlobalContext);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'es' : 'en');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const navLinks: { key: ServiceKey; en: string; es: string }[] = [
    { key: 'ops', en: 'Business Operations', es: 'Operaciones' },
    { key: 'cc', en: 'Contact Center', es: 'Centro de Contacto' },
    { key: 'it', en: 'IT Support', es: 'Soporte IT' },
    { key: 'pro', en: 'Professionals', es: 'Profesionales' },
  ];

  return (
    <header className="w-full max-w-6xl mx-auto flex items-center justify-between p-5 sm:px-8 font-semibold bg-transparent">
      <span className="font-bold text-4xl text-accent tracking-widest drop-shadow-logo-glow select-none">OPS</span>
      <nav className="hidden lg:flex gap-9">
        {navLinks.map((link) => (
          <button
            key={link.key}
            type="button"
            onClick={() => onNavigateToService(link.key)}
            className={`text-lg relative transition-colors duration-200 outline-none ${
              activeServiceKey === link.key ? 'text-primary dark:text-accent' : 'hover:text-primary focus:text-primary'
            }`}
            aria-current={activeServiceKey === link.key ? 'page' : undefined}
          >
            {link[language]}
          </button>
        ))}
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