import React from 'react';
import Icon from './Icon';
import type { IconName, ModalType } from '../types';

interface MobileNavProps {
  onOpenModal: (type: ModalType) => void;
  onToggleServicesMenu: () => void;
  onNavigateToCompliance: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onOpenModal, onToggleServicesMenu, onNavigateToCompliance }) => {
  const navItems: Array<{ type: 'HOME' | 'JOIN' | 'CHAT' | 'SERVICES' | 'CONTACT' | 'COMPLIANCE'; icon: IconName; label: string }> = [
    { type: 'HOME', icon: 'home', label: 'Home' },
    { type: 'JOIN', icon: 'user-plus', label: 'Join Us' },
    { type: 'CHAT', icon: 'chat', label: 'Chat' },
    { type: 'SERVICES', icon: 'layers', label: 'Services' },
    { type: 'CONTACT', icon: 'envelope', label: 'Contact' },
    { type: 'COMPLIANCE', icon: 'check-circle', label: 'OPS CySec' },
  ];

  const handleNavClick = (type: typeof navItems[number]['type']) => {
    switch (type) {
      case 'HOME':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'SERVICES':
        onToggleServicesMenu();
        break;
      case 'COMPLIANCE':
        onNavigateToCompliance();
        break;
      case 'CHAT':
      case 'JOIN':
      case 'CONTACT':
        onOpenModal(type);
        break;
      default:
        break;
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/70 dark:bg-dark-footer/80 backdrop-blur-lg shadow-top-nav-light dark:shadow-top-nav-dark z-40 rounded-t-2xl border-t border-white/30 dark:border-white/10">
      <div className="flex justify-around items-center h-20">
        {navItems.map(item => (
          <button
            key={item.label}
            onClick={() => handleNavClick(item.type)}
            className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors w-1/5"
            aria-label={item.label}
          >
            <Icon name={item.icon} className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;