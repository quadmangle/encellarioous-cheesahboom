import React, { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';

interface LanguageToggleProps {
  size?: 'md' | 'sm';
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ size = 'md', className = '' }) => {
  const { language, setLanguage } = useContext(GlobalContext);

  const buttonClasses = [
    'inline-flex items-center justify-center rounded-md bg-[#6C5DD3] text-white font-semibold shadow-lg border border-white/20 backdrop-blur-sm transition-colors duration-200',
    size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm',
    'hover:bg-[#5A48C6] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 w-auto',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const nextLanguageLabel = language === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés';
  const displayLabel = language === 'en' ? 'EN' : 'ES';

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      onMouseDown={(event) => event.stopPropagation()}
      className={buttonClasses}
      aria-pressed={language === 'es'}
      aria-label={nextLanguageLabel}
    >
      {displayLabel}
    </button>
  );
};

export default LanguageToggle;
