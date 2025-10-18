import styled from 'styled-components';
import { useContext } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ThemeContext } from '../ThemeContext';

const LayoutContainer = styled.div`
  background: ${({ theme }) => (theme === 'light' ? '#fff' : '#333')};
  color: ${({ theme }) => (theme === 'light' ? '#333' : '#fff')};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  background: ${({ theme }) => (theme === 'light' ? '#333' : '#666')};
  color: #fff;
  padding: 1rem;
`;

const Main = styled.main`
  flex: 1;
  padding: 1rem;
`;

const FooterContainer = styled.footer`
  background: ${({ theme }) => (theme === 'light' ? '#333' : '#666')};
  color: #fff;
  padding: 1rem;
`;

const Layout = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <LayoutContainer theme={theme}>
      <Header theme={theme}>
        <Navbar />
      </Header>
      <Main>{children}</Main>
      <FooterContainer theme={theme}>
        <Footer />
      </FooterContainer>
    </LayoutContainer>
  );
};

export default Layout;
