import React from 'react';
import type { ModalType } from '../types';

interface FooterProps {
  onOpenModal: (type: Exclude<ModalType, 'SERVICE' | 'SEARCH' | null>) => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenModal }) => {
  return (
    <footer className="w-full bg-white/20 dark:bg-dark-footer/50 backdrop-blur-lg text-gray-800 dark:text-white text-sm fixed left-0 bottom-0 z-40 rounded-t-2xl border-t border-white/30 dark:border-white/10">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between p-4 sm:px-8">
        <span className="font-medium tracking-wide">© 2025 OPS Online Support</span>
        <div className="flex items-center gap-4 sm:gap-6 font-semibold">
          <button
            type="button"
            onClick={() => onOpenModal('CONTACT')}
            className="hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
          >
            User Feedback
          </button>
          <button
            type="button"
            onClick={() => onOpenModal('TERMS')}
            className="hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
          >
            T &amp; C
          </button>
          <button
            type="button"
            onClick={() => onOpenModal('COOKIES')}
            className="hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
          >
            Cookie Consent
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;