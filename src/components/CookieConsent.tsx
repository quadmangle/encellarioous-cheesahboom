import React, { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';

interface CookieConsentProps {
  isVisible: boolean;
  onAcceptAll: () => void;
  onDecline: () => void;
  onManage: () => void;
}

const copy = {
  en: {
    heading: 'We value your privacy',
    message:
      'We use cookies to deliver secure operations, optimize performance, and personalize your OPS experience. You can accept all cookies or tailor your preferences for analytics and marketing data.',
    manage: 'Manage preferences',
    decline: 'Decline',
    accept: 'Accept all',
    ariaLabel: 'Cookie consent notification',
  },
  es: {
    heading: 'Valoramos su privacidad',
    message:
      'Usamos cookies para ofrecer operaciones seguras, optimizar el rendimiento y personalizar su experiencia OPS. Puede aceptar todas las cookies o ajustar sus preferencias para analítica y marketing.',
    manage: 'Administrar preferencias',
    decline: 'Rechazar',
    accept: 'Aceptar todo',
    ariaLabel: 'Aviso de consentimiento de cookies',
  },
} as const;

const CookieConsent: React.FC<CookieConsentProps> = ({ isVisible, onAcceptAll, onDecline, onManage }) => {
  const { language } = useContext(GlobalContext);
  const content = copy[language];

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      className="fixed z-[900] left-4 right-4 bottom-28 md:left-auto md:right-8 md:w-[28rem] bg-white/95 dark:bg-dark-card text-light-text dark:text-dark-text border border-white/40 dark:border-white/10 rounded-2xl shadow-2xl backdrop-blur-md p-6 space-y-4"
      role="region"
      aria-label={content.ariaLabel}
      aria-live="polite"
    >
      <div>
        <h2 className="text-lg font-semibold text-primary dark:text-accent">{content.heading}</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{content.message}</p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          <button
            type="button"
            onClick={onManage}
            className="text-sm font-semibold text-primary dark:text-accent underline underline-offset-4 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
          >
            {content.manage}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDecline}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-primary dark:text-accent bg-transparent border border-primary/40 dark:border-accent/40 hover:bg-primary/10 dark:hover:bg-accent/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            {content.decline}
          </button>
          <button
            type="button"
            onClick={onAcceptAll}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            {content.accept}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsent;
