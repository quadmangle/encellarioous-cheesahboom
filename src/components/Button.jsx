import styled from 'styled-components';

const Button = styled.button`
  background: var(--primary-color);
  color: var(--text-color-dark);
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--secondary-color);
    transform: translateY(-2px);
  }
`;

export default Button;
