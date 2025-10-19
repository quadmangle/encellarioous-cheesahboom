import React, { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { ModalType } from '../types';

interface HeaderProps {
  onOpenModal: (type: ModalType) => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {
  const { language, setLanguage, theme, setTheme } = useContext(GlobalContext);

  const toggleLanguage = () => setLanguage(language === 'en' ? 'es' : 'en');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const navLinks = [
    { en: 'Business Operations', es: 'Operaciones' },
    { en: 'Contact Center', es: 'Centro de Contacto' },
    { en: 'IT Support', es: 'Soporte IT' },
    { en: 'Professionals', es: 'Profesionales' },
  ];

  return (
    <header className="w-full max-w-6xl mx-auto flex items-center justify-between p-5 sm:px-8 font-semibold bg-transparent">
      <span className="font-bold text-4xl text-accent tracking-widest drop-shadow-logo-glow select-none">OPS</span>
      <nav className="hidden lg:flex gap-9">
        {navLinks.map((link) => (
          <a key={link.en} href="#" className="text-lg relative transition-colors duration-200 hover:text-primary focus:text-primary outline-none">
            {link[language]}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onOpenModal('SEARCH')} 
          title="Search Services"
          className="bg-primary/80 text-white rounded-md py-1.5 px-3 font-bold text-base transition-colors duration-200 hover:bg-accent focus:bg-accent outline-none"
        >
          <i className="fas fa-search"></i>
        </button>
        <button onClick={toggleLanguage} className="bg-primary text-white rounded-md py-1.5 px-4 font-bold text-base transition-colors duration-200 hover:bg-accent focus:bg-accent outline-none">
          {language === 'en' ? 'ES' : 'EN'}
        </button>
        <button onClick={toggleTheme} className="bg-primary text-white rounded-md py-1.5 px-4 font-bold text-base transition-colors duration-200 hover:bg-accent focus:bg-accent outline-none capitalize">
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </header>
  );
};

export default Header;