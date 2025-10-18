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
  padding: var(--space-sm) var(--space-xl);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Brand = styled(NavLink)`
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--color-text-primary);
`;

const NavLinks = styled.ul`
  display: flex;
  gap: var(--space-md);
  list-style: none;
  margin: 0;
  padding: 0;

  a {
    color: var(--color-text-secondary);
    font-weight: 500;
    padding: var(--space-2xs) var(--space-xs);
    border-radius: var(--radius-sm);

    &.active {
      color: var(--color-text-primary);
      background: var(--color-accent-muted);
    }

    &:hover,
    &:focus-visible {
      color: var(--color-text-primary);
      background: var(--color-accent-muted);
    }
  }
`;

const Controls = styled.div`
  display: flex;
  gap: var(--space-xs);
`;

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const toggleLanguage = () => {
    const nextLanguage = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <Nav aria-label={t('nav.primary', 'Primary')}>
      <Brand to="/">OPS</Brand>
      <NavLinks>
        <li>
          <NavLink to="/" end>
            {t('nav.business-ops')}
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact-center">{t('nav.contact-center')}</NavLink>
        </li>
        <li>
          <NavLink to="/it-support">{t('nav.it-support')}</NavLink>
        </li>
        <li>
          <NavLink to="/professional-services">{t('nav.professionals')}</NavLink>
        </li>
      </NavLinks>
      <Controls>
        <Button
          type="button"
          onClick={toggleLanguage}
          aria-label={t('nav.toggle-language', 'Toggle language')}
        >
          {i18n.language === 'en' ? 'ES' : 'EN'}
        </Button>
        <Button
          type="button"
          onClick={toggleTheme}
          aria-pressed={theme === 'dark'}
          aria-label={
            theme === 'light'
              ? t('nav.enable-dark-mode', 'Enable dark mode')
              : t('nav.enable-light-mode', 'Enable light mode')
          }
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </Button>
      </Controls>
    </Nav>
  );
};

export default Navbar;
