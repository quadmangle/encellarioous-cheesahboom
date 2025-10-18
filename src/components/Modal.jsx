import styled, { keyframes } from 'styled-components';
import Button from './Button';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContent = styled.div`
  background: ${({ theme }) =>
    theme === 'light' ? '#fff' : 'var(--background-color-dark)'};
  color: ${({ theme }) =>
    theme === 'light' ? 'var(--text-color-light)' : 'var(--text-color-dark)'};
  padding: 2rem;
  border-radius: 8px;
  width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Modal = ({ title, children, onClose }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <ModalContainer>
      <ModalContent theme={theme}>
        <h2>{title}</h2>
        {children}
        <Button onClick={onClose}>Close</Button>
      </ModalContent>
    </ModalContainer>
  );
};

export default Modal;
