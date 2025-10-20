import React, { useState, useContext, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServiceCardsGrid from './components/ServiceCardsGrid';
import Footer from './components/Footer';
import ServiceModal from './components/modals/ServiceModal';
import SearchModal from './components/modals/SearchModal';
import ChatbotModal from './components/modals/ChatbotModal';
import JoinModal from './components/modals/JoinModal';
import ContactModal from './components/modals/ContactModal';
import FABs from './components/FABs';
import MobileNav from './components/MobileNav';
import ServicesMenu from './components/ServicesMenu';
import ServiceBreakdown from './components/ServiceBreakdown';
import { GlobalContext } from './contexts/GlobalContext';
import type { ModalType, ServiceKey } from './types';

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedService, setSelectedService] = useState<ServiceKey | undefined>(undefined);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const { theme } = useContext(GlobalContext);

  const handleOpenModal = (modalType: ModalType, serviceKey?: ServiceKey) => {
    if (modalType === 'SERVICE' && serviceKey) {
      setSelectedService(serviceKey);
    }
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    if (selectedService) {
      // give a bit of time for modal to close before resetting
      setTimeout(() => setSelectedService(undefined), 300);
    }
  };

  const toggleServicesMenu = () => {
    setIsServicesMenuOpen(!isServicesMenuOpen);
  };

  useEffect(() => {
    // This effect ensures the dark class is applied to the html element for TailwindCSS dark mode to work.
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleServiceClick = (serviceKey: ServiceKey) => {
    setIsServicesMenuOpen(false);
    const sectionId = `service-section-${serviceKey}`;
    const cardId = `card-${serviceKey}`;
    const sectionElement = document.getElementById(sectionId);
    const fallbackElement = document.getElementById(cardId);
    const targetElement = sectionElement ?? fallbackElement;

    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className={`font-sans bg-light-bg dark:bg-dark-bg transition-colors duration-300 min-h-screen relative pb-24`}>
      <div className="absolute top-0 left-0 w-full h-full bg-grid-light dark:bg-grid-dark opacity-40 dark:opacity-100 z-0"></div>
      <div className="relative z-10">
        <Header onOpenModal={handleOpenModal} onNavigateToService={handleServiceClick} />
        <main>
          <Hero onPrimaryAction={() => handleOpenModal('CONTACT')} />
          <ServiceCardsGrid onCardClick={(key) => handleOpenModal('SERVICE', key)} />
          <ServiceBreakdown />
        </main>
        <Footer />
        <MobileNav onOpenModal={handleOpenModal} onToggleServicesMenu={toggleServicesMenu} />
        <FABs onOpenModal={handleOpenModal} />
      </div>

      <ServicesMenu 
        isOpen={isServicesMenuOpen}
        onClose={toggleServicesMenu}
        onServiceClick={handleServiceClick}
      />

      <ServiceModal 
        isOpen={activeModal === 'SERVICE'} 
        onClose={handleCloseModal}
        serviceKey={selectedService}
      />
      <SearchModal 
        isOpen={activeModal === 'SEARCH'} 
        onClose={handleCloseModal}
      />
      <ChatbotModal
        isOpen={activeModal === 'CHAT'}
        onClose={handleCloseModal}
        showBackdrop={false}
      />
      <JoinModal
        isOpen={activeModal === 'JOIN'}
        onClose={handleCloseModal}
        showBackdrop={false}
      />
      <ContactModal
        isOpen={activeModal === 'CONTACT'}
        onClose={handleCloseModal}
        showBackdrop={false}
      />
    </div>
  );
};

export default App;