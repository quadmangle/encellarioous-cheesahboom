import styled from 'styled-components';

const CardContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  margin: 1rem;
  width: 300px;
`;

const Card = ({ title, description }) => {
  return (
    <CardContainer>
      <h3>{title}</h3>
      <p>{description}</p>
    </CardContainer>
  );
};

export default Card;
