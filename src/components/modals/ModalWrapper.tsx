
import React, { useEffect, useRef, useCallback } from 'react';

interface ModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
  modalClassName?: string;
  backdropClassName?: string;
  showBackdrop?: boolean;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children, onClose, isOpen, modalClassName = '', backdropClassName = '', showBackdrop = true }) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const handleEscKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      if (showBackdrop) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, showBackdrop, handleEscKey]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showBackdrop && e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-[1000] modal-enter ${
        showBackdrop
          ? 'flex items-start justify-center pt-4 sm:pt-6 bg-black/30 dark:bg-[#1a1930]/50 backdrop-blur-sm'
          : 'pointer-events-none'
      } ${backdropClassName}`}
    >
      <div ref={modalContentRef} className={`fixed modal-content-enter ${!showBackdrop ? 'pointer-events-auto' : ''} ${modalClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;