import styled from 'styled-components';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

const CardContainer = styled.div`
  background: ${({ theme }) =>
    theme === 'light' ? '#fff' : 'var(--background-color-dark)'};
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 2rem;
  margin: 1rem;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Card = ({ title, description }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <CardContainer theme={theme}>
      <h3>{title}</h3>
      <p>{description}</p>
    </CardContainer>
  );
};

export default Card;
