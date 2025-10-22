import React, { useState, useContext, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServiceCardsGrid from './components/ServiceCardsGrid';
import Footer from './components/Footer';
import ServiceModal from './components/modals/ServiceModal';
import SearchModal from './components/modals/SearchModal';
import ChatbotModal from './components/modals/ChatbotModal';
import JoinModal from './components/modals/JoinModal';
import ContactModal from './components/modals/ContactModal';
import TermsModal from './components/modals/TermsModal';
import CookieConsent from './components/CookieConsent';
import CookieConsentModal from './components/modals/CookieConsentModal';
import FABs from './components/FABs';
import MobileNav from './components/MobileNav';
import ServicesMenu from './components/ServicesMenu';
import ServiceBreakdown from './components/ServiceBreakdown';
import { GlobalContext } from './contexts/GlobalContext';
import type { CookiePreferences, ModalType, ServiceKey } from './types';
const COOKIE_STORAGE_KEY = 'ops-cookie-preferences-v1';
const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedService, setSelectedService] = useState<ServiceKey | undefined>(undefined);
  const [activeServicePage, setActiveServicePage] = useState<ServiceKey>('ops');
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(DEFAULT_COOKIE_PREFERENCES);
  const [isCookieBannerVisible, setIsCookieBannerVisible] = useState(false);
  const { theme } = useContext(GlobalContext);
  const pageTopRef = useRef<HTMLDivElement | null>(null);
  const servicePageRef = useRef<HTMLElement | null>(null);
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

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedPreferences = window.localStorage.getItem(COOKIE_STORAGE_KEY);
      if (storedPreferences) {
        const parsed = JSON.parse(storedPreferences) as Partial<CookiePreferences>;
        setCookiePreferences({
          necessary: true,
          analytics: Boolean(parsed?.analytics),
          marketing: Boolean(parsed?.marketing),
        });
        setIsCookieBannerVisible(false);
      } else {
        setIsCookieBannerVisible(true);
      }
    } catch (error) {
      console.error('Unable to load cookie preferences', error);
      setCookiePreferences(DEFAULT_COOKIE_PREFERENCES);
      setIsCookieBannerVisible(true);
    }
  }, []);

  const handleScrollToTop = () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToServiceSection = () => {
    if (!servicePageRef.current) {
      return;
    }

    servicePageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleScrollToServices = () => {
    setIsServicesMenuOpen(false);

    scrollToServiceSection();
  };

  const handleServiceClick = (serviceKey: ServiceKey) => {
    setIsServicesMenuOpen(false);
    setActiveServicePage(serviceKey);

    scrollToServiceSection();
  };

  const handleServiceCardClick = (serviceKey: ServiceKey) => {
    handleServiceClick(serviceKey);
    handleOpenModal('SERVICE', serviceKey);
  };

  const persistCookiePreferences = (preferences: CookiePreferences, hideBanner = true) => {
    const normalized: CookiePreferences = {
      necessary: true,
      analytics: Boolean(preferences.analytics),
      marketing: Boolean(preferences.marketing),
    };

    setCookiePreferences(normalized);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(normalized));
      } catch (error) {
        console.error('Unable to persist cookie preferences', error);
      }
    }

    if (hideBanner) {
      setIsCookieBannerVisible(false);
    }
  };

  const handleAcceptAllCookies = () => {
    persistCookiePreferences({ necessary: true, analytics: true, marketing: true });
    if (activeModal === 'COOKIES') {
      handleCloseModal();
    }
  };

  const handleRejectCookies = () => {
    persistCookiePreferences({ necessary: true, analytics: false, marketing: false });
    if (activeModal === 'COOKIES') {
      handleCloseModal();
    }
  };

  const handleSaveCookiePreferences = (preferences: CookiePreferences) => {
    persistCookiePreferences(preferences);
    if (activeModal === 'COOKIES') {
      handleCloseModal();
    }
  };

  const handleManageCookies = () => {
    handleOpenModal('COOKIES');
  };

  return (
    <div
      ref={pageTopRef}
      className={`font-sans bg-light-bg dark:bg-dark-bg transition-colors duration-300 min-h-screen relative pb-24`}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-grid-light dark:bg-grid-dark opacity-40 dark:opacity-100 z-0"></div>
      <div className="relative z-10">
        <Header
          onOpenModal={handleOpenModal}
          onNavigateToService={handleServiceClick}
          activeServiceKey={activeServicePage}
        />
        <main>
          <Hero onPrimaryAction={() => handleOpenModal('CONTACT')} />
          <ServiceCardsGrid onCardClick={handleServiceCardClick} />
          <ServiceBreakdown
            activeService={activeServicePage}
            sectionRef={servicePageRef}
            onRequestInfo={() => handleOpenModal('CONTACT')}
          />
        </main>
        <Footer
          onOpenModal={handleOpenModal}
          onScrollToTop={handleScrollToTop}
          onScrollToServices={handleScrollToServices}
        />
        <MobileNav
          onOpenModal={handleOpenModal}
          onToggleServicesMenu={toggleServicesMenu}
        />
        <FABs
          onOpenModal={handleOpenModal}
          onScrollToTop={handleScrollToTop}
          onScrollToServices={handleScrollToServices}
        />
      </div>

      <ServicesMenu
        isOpen={isServicesMenuOpen}
        onClose={toggleServicesMenu}
        onServiceClick={handleServiceClick}
        activeService={activeServicePage}
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
      <TermsModal
        isOpen={activeModal === 'TERMS'}
        onClose={handleCloseModal}
      />
      <CookieConsent
        isVisible={isCookieBannerVisible && activeModal !== 'COOKIES'}
        onAcceptAll={handleAcceptAllCookies}
        onDecline={handleRejectCookies}
        onManage={handleManageCookies}
      />
      <CookieConsentModal
        isOpen={activeModal === 'COOKIES'}
        onClose={handleCloseModal}
        preferences={cookiePreferences}
        onSave={handleSaveCookiePreferences}
        onAcceptAll={handleAcceptAllCookies}
        onRejectAll={handleRejectCookies}
      />
    </div>
  );
};

export default App;