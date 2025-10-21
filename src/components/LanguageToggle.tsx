import React, { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import type { Language } from '../types';

interface LanguageToggleProps {
  size?: 'md' | 'sm';
  className?: string;
}

const LANGUAGE_OPTIONS: Array<{ code: Language; label: string; srLabel: string }> = [
  { code: 'en', label: 'EN', srLabel: 'English' },
  { code: 'es', label: 'ES', srLabel: 'Spanish' },
];

const LanguageToggle: React.FC<LanguageToggleProps> = ({ size = 'md', className = '' }) => {
  const { language, setLanguage } = useContext(GlobalContext);

  const containerClasses = [
    'inline-flex items-center gap-1 rounded-full bg-primary/80 dark:bg-primary/60 text-white shadow-lg border border-white/20',
    size === 'sm' ? 'px-1 py-0.5' : 'px-1.5 py-1',
    'backdrop-blur-sm',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const buttonBase = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm';

  return (
    <div role="group" aria-label="Language selector" className={containerClasses}>
      {LANGUAGE_OPTIONS.map((option) => {
        const isActive = language === option.code;

        return (
          <button
            key={option.code}
            type="button"
            onClick={() => {
              if (!isActive) {
                setLanguage(option.code);
              }
            }}
            onMouseDown={(event) => event.stopPropagation()}
            aria-pressed={isActive}
            className={`rounded-full font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 transition-colors ${
              buttonBase
            } ${isActive ? 'bg-white text-primary shadow' : 'text-white/80 hover:text-white'}`}
          >
            <span className="sr-only">{option.srLabel}</span>
            <span aria-hidden="true">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageToggle;
