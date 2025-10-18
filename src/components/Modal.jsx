import { useContext, useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import Button from './Button';
import { ThemeContext } from '../ThemeContext';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(5, 13, 30, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-xl);
  animation: ${fadeIn} 0.2s ease;
  z-index: 1000;
`;

const ModalContent = styled.section`
  background: var(--color-surface);
  color: var(--color-text-primary);
  padding: var(--space-xl);
  border-radius: var(--radius-md);
  width: min(520px, 100%);
  display: grid;
  gap: var(--space-md);
  border: 1px solid var(--color-border);
  box-shadow: 0 30px 60px rgba(8, 19, 36, 0.45);
`;

const ModalHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-sm);

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

const CloseButton = styled(Button)`
  background: transparent;
  color: var(--color-text-secondary);
  box-shadow: none;
  padding: var(--space-2xs) var(--space-xs);
  border: 1px solid transparent;

  &:hover,
  &:focus-visible {
    background: var(--color-accent-muted);
    color: var(--color-text-primary);
  }
`;

const modalRoot = () => {
  let root = document.getElementById('modal-root');
  if (!root) {
    root = document.createElement('div');
    root.setAttribute('id', 'modal-root');
    document.body.appendChild(root);
  }
  return root;
};

const Modal = ({ title, children, onClose, ariaDescribedBy }) => {
  const { theme } = useContext(ThemeContext);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const lastFocusedElement = useRef(null);
  const titleId = useId();

  useEffect(() => {
    lastFocusedElement.current = document.activeElement;
    const element = contentRef.current;

    if (element) {
      const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        element.focus();
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }

      if (event.key === 'Tab' && element) {
        const focusable = element.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (lastFocusedElement.current instanceof HTMLElement) {
        lastFocusedElement.current.focus();
      }
    };
  }, [onClose]);

  const handleOverlayClick = (event) => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  return createPortal(
    <ModalOverlay
      ref={overlayRef}
      onMouseDown={handleOverlayClick}
      data-theme={theme}
    >
      <ModalContent
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
      >
        <ModalHeader>
          <h2 id={titleId}>{title}</h2>
          <CloseButton
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </CloseButton>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalOverlay>,
    modalRoot(),
  );
};

export default Modal;
