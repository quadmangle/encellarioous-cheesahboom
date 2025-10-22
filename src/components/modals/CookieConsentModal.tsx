import React, { useContext, useEffect, useRef, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { useMovable } from '../../hooks/useMovable';
import Icon from '../Icon';
import LanguageToggle from '../LanguageToggle';
import { GlobalContext } from '../../contexts/GlobalContext';
import type { CookiePreferences, ModalProps } from '../../types';

interface CookieConsentModalProps extends ModalProps {
  preferences: CookiePreferences;
  onSave: (preferences: CookiePreferences) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
}

type PreferenceKey = keyof CookiePreferences;

const CookieConsentModal: React.FC<CookieConsentModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSave,
  onAcceptAll,
  onRejectAll,
  showBackdrop = true,
}) => {
  const { language } = useContext(GlobalContext);
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  useMovable(modalRef, headerRef, resizeHandleRef);

  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);

  useEffect(() => {
    if (isOpen) {
      setLocalPreferences(preferences);
    }
  }, [isOpen, preferences]);

  const copy = {
    en: {
      title: 'Cookie preferences',
      description:
        'Choose how OPS Online Support uses cookies to enhance security, analytics, and personalized services. Strictly necessary cookies remain active to keep the platform compliant and reliable.',
      categories: {
        necessary: {
          title: 'Strictly necessary',
          detail: 'Required for security, authentication, and regulatory compliance. These cookies keep essential services running and cannot be disabled.',
        },
        analytics: {
          title: 'Performance & analytics',
          detail: 'Helps us understand site usage, improve digital experiences, and monitor Core Web Vitals responsibly.',
        },
        marketing: {
          title: 'Personalization & marketing',
          detail: 'Supports tailored content, campaigns, and chatbot memory to deliver relevant communications.',
        },
      },
      actions: {
        save: 'Save preferences',
        acceptAll: 'Accept all',
        reject: 'Decline non-essential',
        close: 'Close',
      },
    },
    es: {
      title: 'Preferencias de cookies',
      description:
        'Elija cómo OPS Online Support utiliza cookies para reforzar la seguridad, la analítica y los servicios personalizados. Las cookies estrictamente necesarias permanecen activas para mantener la plataforma conforme y confiable.',
      categories: {
        necessary: {
          title: 'Estrictamente necesarias',
          detail: 'Requeridas para la seguridad, la autenticación y el cumplimiento normativo. Estas cookies mantienen los servicios esenciales y no se pueden desactivar.',
        },
        analytics: {
          title: 'Rendimiento y analítica',
          detail: 'Nos ayuda a comprender el uso del sitio, mejorar la experiencia digital y monitorear Core Web Vitals de forma responsable.',
        },
        marketing: {
          title: 'Personalización y marketing',
          detail: 'Permite contenido personalizado, campañas y memoria del chatbot para ofrecer comunicaciones relevantes.',
        },
      },
      actions: {
        save: 'Guardar preferencias',
        acceptAll: 'Aceptar todo',
        reject: 'Rechazar no esenciales',
        close: 'Cerrar',
      },
    },
  } as const;

  const content = copy[language];

  const handleToggle = (key: PreferenceKey) => {
    if (key === 'necessary') {
      return;
    }
    setLocalPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    onSave(localPreferences);
  };

  const handleAcceptAll = () => {
    setLocalPreferences({ necessary: true, analytics: true, marketing: true });
    onAcceptAll();
  };

  const handleRejectAll = () => {
    setLocalPreferences({ necessary: true, analytics: false, marketing: false });
    onRejectAll();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      showBackdrop={showBackdrop}
      modalClassName="w-full max-w-2xl px-4 md:px-0 top-[4vh] md:top-[3vh] left-1/2 -translate-x-1/2"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-dark-modal text-light-text dark:text-dark-text rounded-3xl shadow-2xl overflow-hidden border border-white/40 dark:border-white/10"
      >
        <div ref={headerRef} className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-800 cursor-move">
          <h2 className="text-lg font-semibold">{content.title}</h2>
          <div className="flex items-center gap-3">
            <LanguageToggle size="sm" />
            <button
              type="button"
              onClick={onClose}
              onMouseDown={(event) => event.stopPropagation()}
              className="text-2xl leading-none text-accent hover:text-primary transition-colors"
              aria-label={content.actions.close}
            >
              &times;
            </button>
          </div>
        </div>
        <div className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <p className="text-sm text-gray-700 dark:text-gray-300">{content.description}</p>
          {(Object.keys(content.categories) as PreferenceKey[]).map((key) => {
            const category = content.categories[key];
            const isLocked = key === 'necessary';
            const isEnabled = localPreferences[key];
            const toggleLabel = `${category.title}: ${isEnabled ? 'enabled' : 'disabled'}`;
            const toggleClassName = [
              'group relative inline-flex h-9 w-16 items-center overflow-hidden rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rose-400',
              isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer',
              isEnabled
                ? 'border-transparent bg-gradient-to-r from-rose-500 via-rose-500 to-red-500 shadow-[0_10px_24px_rgba(244,63,94,0.45)]'
                : 'border-gray-300/70 dark:border-gray-600/60 bg-gray-300/80 dark:bg-gray-700/80 shadow-inner',
              !isLocked && isEnabled ? 'hover:shadow-[0_12px_28px_rgba(244,63,94,0.55)]' : '',
              !isLocked && !isEnabled ? 'hover:bg-gray-200/90 dark:hover:bg-gray-600/80' : '',
            ]
              .filter((className) => Boolean(className))
              .join(' ');
            const knobClassName = [
              'relative z-[2] flex h-7 w-7 items-center justify-center rounded-full shadow-lg transition-all duration-300',
              isEnabled ? 'translate-x-7' : 'translate-x-1',
              isLocked
                ? 'bg-gray-200 dark:bg-gray-500 text-gray-600'
                : isEnabled
                  ? 'bg-gradient-to-br from-white via-white to-rose-50 text-rose-500'
                  : 'bg-white dark:bg-gray-50 text-gray-500',
            ]
              .filter((className) => Boolean(className))
              .join(' ');

            return (
              <div
                key={key}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-gray-50/80 dark:bg-gray-900/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-primary dark:text-accent">{category.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{category.detail}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    aria-disabled={isLocked}
                    aria-label={toggleLabel}
                    disabled={isLocked}
                    onClick={() => handleToggle(key)}
                    className={toggleClassName}
                  >
                    <span className="visually-hidden">{toggleLabel}</span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute left-3 z-[1] text-[0.65rem] font-semibold tracking-[0.18em] text-white transition-opacity duration-300 ${
                        isEnabled ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      ON
                    </span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute right-3 z-[1] text-[0.65rem] font-semibold tracking-[0.18em] transition-opacity duration-300 ${
                        isEnabled ? 'opacity-0' : 'opacity-100'
                      } ${isLocked ? 'text-gray-400 dark:text-gray-400' : 'text-gray-500 dark:text-gray-300'}`}
                    >
                      OFF
                    </span>
                    <span className={knobClassName}>
                      {isLocked ? (
                        <Icon name="lock" className="h-3.5 w-3.5" />
                      ) : (
                        <span
                          aria-hidden="true"
                          className={`rounded-full transition-all duration-300 ${
                            isEnabled
                              ? 'h-3 w-3 bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.55)]'
                              : 'h-2.5 w-2.5 bg-gray-300 dark:bg-gray-500'
                          }`}
                        />
                      )}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-6 py-4 bg-gray-100 dark:bg-gray-800 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRejectAll}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-primary dark:text-accent border border-primary/40 dark:border-accent/40 hover:bg-primary/10 dark:hover:bg-accent/10 transition-colors"
            >
              {content.actions.reject}
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-accent transition-colors"
            >
              {content.actions.acceptAll}
            </button>
          </div>
          <div className="flex-1 md:text-right">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-dark transition-colors"
            >
              {content.actions.save}
            </button>
          </div>
        </div>
        <div ref={resizeHandleRef} className="absolute bottom-2 right-3 text-gray-400 dark:text-gray-600">
          <Icon name="expand" className="w-5 h-5 rotate-90" />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CookieConsentModal;
