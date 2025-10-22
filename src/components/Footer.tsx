import React, { useContext } from 'react';
import type { ModalType } from '../types';
import { GlobalContext } from '../contexts/GlobalContext';

interface FooterProps {
  onOpenModal: (type: Exclude<ModalType, 'SERVICE' | 'SEARCH' | null>) => void;
  onScrollToTop: () => void;
  onScrollToServices: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenModal, onScrollToTop, onScrollToServices }) => {
  const { language } = useContext(GlobalContext);

  const copy = {
    en: {
      backToTop: 'Back to top',
      services: 'Explore services',
      feedback: 'User Feedback',
      terms: 'T & C',
      cookies: 'Cookie Consent',
    },
    es: {
      backToTop: 'Volver arriba',
      services: 'Explorar servicios',
      feedback: 'Comentarios de usuarios',
      terms: 'Términos y Condiciones',
      cookies: 'Consentimiento de cookies',
    },
  } as const;

  const labels = copy[language];
  const buttonClassName =
    'hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded';

  return (
    <footer className="w-full bg-white/20 dark:bg-dark-footer/50 backdrop-blur-lg text-gray-800 dark:text-white text-sm fixed left-0 bottom-0 z-40 rounded-t-2xl border-t border-white/30 dark:border-white/10">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 sm:px-8">
        <span className="font-medium tracking-wide">© 2025 OPS Online Support</span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-6 font-semibold justify-end">
          <button type="button" onClick={onScrollToTop} className={buttonClassName}>
            {labels.backToTop}
          </button>
          <button type="button" onClick={onScrollToServices} className={buttonClassName}>
            {labels.services}
          </button>
          <span className="hidden sm:inline-block h-4 w-px bg-gray-400/40 dark:bg-white/20" aria-hidden="true" />
          <button type="button" onClick={() => onOpenModal('CONTACT')} className={buttonClassName}>
            {labels.feedback}
          </button>
          <button type="button" onClick={() => onOpenModal('TERMS')} className={buttonClassName}>
            {labels.terms}
          </button>
          <button type="button" onClick={() => onOpenModal('COOKIES')} className={buttonClassName}>
            {labels.cookies}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;