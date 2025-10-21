import React, { useContext, useState } from 'react';
import Icon from './Icon';
import type { IconName, ModalType, Language } from '../types';
import { GlobalContext } from '../contexts/GlobalContext';

type FABModalType = Exclude<ModalType, 'SERVICE' | 'SEARCH' | 'TERMS' | 'COOKIES' | null>;

interface FABsProps {
  onOpenModal: (type: FABModalType) => void;
  onScrollToTop: () => void;
  onScrollToServices: () => void;
}

type FABActionKey = 'CONTACT' | 'JOIN' | 'CHAT' | 'SERVICES' | 'HOME';

type FABAction = {
  key: FABActionKey;
  icon: IconName;
  title: string;
  onTrigger: () => void;
};

const FABs: React.FC<FABsProps> = ({ onOpenModal, onScrollToTop, onScrollToServices }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { language } = useContext(GlobalContext);

  const labels: Record<FABActionKey, Record<Language, string>> = {
    CONTACT: { en: 'Contact Us', es: 'Contáctenos' },
    JOIN: { en: 'Join Our Team', es: 'Únete a nuestro equipo' },
    CHAT: { en: 'Chat with Chattia', es: 'Chatea con Chattia' },
    SERVICES: { en: 'View Services', es: 'Ver servicios' },
    HOME: { en: 'Back to top', es: 'Volver arriba' },
  } as const;

  const baseActions: Array<Omit<FABAction, 'title'>> = [
    { key: 'CONTACT', icon: 'envelope', onTrigger: () => onOpenModal('CONTACT') },
    { key: 'JOIN', icon: 'user-plus', onTrigger: () => onOpenModal('JOIN') },
    { key: 'CHAT', icon: 'chat', onTrigger: () => onOpenModal('CHAT') },
    { key: 'SERVICES', icon: 'layers', onTrigger: onScrollToServices },
    { key: 'HOME', icon: 'home', onTrigger: onScrollToTop },
  ];

  const fabActions: FABAction[] = baseActions.map((action) => ({
    ...action,
    title: labels[action.key][language],
  }));

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="hidden lg:block fixed bottom-10 right-10 z-50">
      <div className="relative">
        {isOpen && (
          <div className="flex flex-col items-center mb-4 space-y-3 animate-fade-in-up-fast">
            {fabActions.map((action, index) => (
              <button
                key={action.key}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  action.onTrigger();
                  setIsOpen(false);
                }}
                className="w-14 h-14 rounded-full bg-accent text-white shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 opacity-0"
                title={action.title}
                aria-label={action.title}
              >
                <Icon name={action.icon} className="w-5 h-5" />
              </button>
            ))}
          </div>
        )}
        <button
          onClick={toggleMenu}
          className="w-16 h-16 rounded-full bg-primary text-white shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 focus:outline-none hover:bg-accent"
          aria-label="Toggle action menu"
          aria-expanded={isOpen}
        >
          <Icon
            name={isOpen ? 'close' : 'plus'}
            className={`w-6 h-6 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45' : ''}`}
          />
        </button>
      </div>
    </div>
  );
};

export default FABs;
