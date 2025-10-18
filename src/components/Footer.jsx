import styled from 'styled-components';

const FooterContainer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--primary-color);
  color: var(--text-color-dark);
  padding: 1rem 2rem;

  a {
    color: var(--text-color-dark);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: var(--secondary-color);
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <span>© 2025 OPS Online Support.</span>
      <a href="/sitemap.xml">Site Map</a>
    </FooterContainer>
  );
};

export default Footer;
