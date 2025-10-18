import styled from 'styled-components';

const Button = styled.button`
  background: var(--color-accent);
  color: var(--color-text-inverse);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 0.65rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(17, 85, 204, 0.15);

  &:hover,
  &:focus-visible {
    background: var(--color-accent-hover);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
  }
`;

export default Button;
