import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

const LayoutContainer = styled.div`
  background: ${({ theme }) =>
    theme === 'light'
      ? 'var(--background-color-light)'
      : 'var(--background-color-dark)'};
  color: ${({ theme }) =>
    theme === 'light' ? 'var(--text-color-light)' : 'var(--text-color-dark)'};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  padding: 1rem 2rem;
`;

const Layout = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <LayoutContainer theme={theme}>
      <Navbar />
      <Main>{children}</Main>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
