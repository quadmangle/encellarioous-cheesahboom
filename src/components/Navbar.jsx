import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import Button from './Button';
import { ThemeContext } from '../ThemeContext';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  a {
    color: #fff;
    margin: 0 1rem;
    text-decoration: none;

    &.active {
      font-weight: bold;
    }
  }
`;

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  return (
    <Nav>
      <NavLink to="/">OPS</NavLink>
      <NavLinks>
        <NavLink to="/">{t('nav.business-ops')}</NavLink>
        <NavLink to="/contact-center">{t('nav.contact-center')}</NavLink>
        <NavLink to="/it-support">{t('nav.it-support')}</NavLink>
        <NavLink to="/professional-services">{t('nav.professionals')}</NavLink>
      </NavLinks>
      <div>
        <Button onClick={toggleLanguage}>{i18n.language === 'en' ? 'ES' : 'EN'}</Button>
        <Button onClick={toggleTheme}>{theme === 'light' ? 'Dark' : 'Light'}</Button>
      </div>
    </Nav>
  );
};

export default Navbar;
