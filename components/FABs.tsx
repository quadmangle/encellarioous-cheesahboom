import React, { useState } from 'react';
import type { ModalType } from '../types';

interface FABsProps {
  onOpenModal: (type: ModalType) => void;
}

const FABs: React.FC<FABsProps> = ({ onOpenModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  const fabActions = [
    { type: 'CHAT', icon: 'fa-comments', title: 'Chat with Chattia' },
    { type: 'JOIN', icon: 'fa-user-plus', title: 'Join Our Team' },
    { type: 'CONTACT', icon: 'fa-envelope', title: 'Contact Us' },
  ] as const;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="hidden lg:block fixed bottom-10 right-10 z-50">
      <div className="relative">
        {isOpen && (
          <div className="flex flex-col items-center mb-4 space-y-3 animate-fade-in-up-fast">
            {fabActions.map((action, index) => (
              <button
                key={action.type}
                style={{ animationDelay: `${index * 50}ms`}}
                onClick={() => {
                  onOpenModal(action.type);
                  setIsOpen(false);
                }}
                className="w-14 h-14 rounded-full bg-accent text-white shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 opacity-0"
                title={action.title}
              >
                <i className={`fas ${action.icon} text-xl`}></i>
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
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-plus'} text-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45' : ''}`}></i>
        </button>
      </div>
    </div>
  );
};

export default FABs;
