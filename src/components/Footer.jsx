import styled from 'styled-components';

const FooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
