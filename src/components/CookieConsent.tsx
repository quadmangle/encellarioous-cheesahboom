import React from 'react';

interface CookieConsentProps {
  isVisible: boolean;
  onAcceptAll: () => void;
  onDecline: () => void;
  onManage: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ isVisible, onAcceptAll, onDecline, onManage }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <aside
      className="fixed z-[900] left-4 right-4 bottom-28 md:left-auto md:right-8 md:w-[28rem] bg-white/95 dark:bg-dark-card text-light-text dark:text-dark-text border border-white/40 dark:border-white/10 rounded-2xl shadow-2xl backdrop-blur-md p-6 space-y-4"
      role="region"
      aria-label="Cookie consent notification"
      aria-live="polite"
    >
      <div>
        <h2 className="text-lg font-semibold text-primary dark:text-accent">We value your privacy</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          We use cookies to deliver secure operations, optimize performance, and personalize your OPS experience. You can accept
          all cookies or tailor your preferences for analytics and marketing data.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          <button
            type="button"
            onClick={onManage}
            className="text-sm font-semibold text-primary dark:text-accent underline underline-offset-4 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded"
          >
            Manage preferences
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDecline}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-primary dark:text-accent bg-transparent border border-primary/40 dark:border-accent/40 hover:bg-primary/10 dark:hover:bg-accent/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={onAcceptAll}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            Accept all
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsent;
