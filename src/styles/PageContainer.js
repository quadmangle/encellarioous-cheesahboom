import styled from 'styled-components';

const PageContainer = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-lg) var(--space-xl);
  display: grid;
  gap: var(--space-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  box-shadow: 0 14px 30px rgba(8, 19, 36, 0.1);
`;

export default PageContainer;
