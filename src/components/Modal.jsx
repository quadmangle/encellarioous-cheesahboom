import styled from 'styled-components';
import Button from './Button';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 5px;
  width: 500px;
`;

const Modal = ({ title, children, onClose }) => {
  return (
    <ModalContainer>
      <ModalContent>
        <h2>{title}</h2>
        {children}
        <Button onClick={onClose}>Close</Button>
      </ModalContent>
    </ModalContainer>
  );
};

export default Modal;
