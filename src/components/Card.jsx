import { useId } from 'react';
import styled from 'styled-components';

const CardContainer = styled.article`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  min-height: 220px;
  box-shadow: 0 18px 40px rgba(8, 19, 36, 0.12);
  transition: transform var(--transition-base),
    box-shadow var(--transition-base);

  &:hover,
  &:focus-within {
    transform: translateY(-4px);
    box-shadow: 0 20px 50px rgba(8, 19, 36, 0.18);
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--color-text-primary);
  }

  p {
    margin: 0;
    color: var(--color-text-secondary);
  }
`;

const Card = ({ title, description }) => {
  const headingId = useId();
  return (
    <CardContainer tabIndex={0} aria-labelledby={headingId}>
      <h3 id={headingId}>{title}</h3>
      <p>{description}</p>
    </CardContainer>
  );
};

export default Card;
