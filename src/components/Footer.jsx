import styled from 'styled-components';

const FooterContainer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-sm);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: var(--space-md) var(--space-xl);
  color: var(--color-text-secondary);
  font-size: 0.95rem;
`;

const GovernanceLinks = styled.nav`
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;

  a {
    color: var(--color-text-secondary);
  }
`;

const Footer = () => (
  <FooterContainer aria-label="Site governance footer">
    <span>© {new Date().getFullYear()} OPS Online Support.</span>
    <GovernanceLinks aria-label="Governance">
      <a href="/sitemap.xml">Sitemap</a>
      <a href="/privacy">Privacy</a>
      <a href="/accessibility">Accessibility</a>
      <a href="/incident-response">Incident Response</a>
    </GovernanceLinks>
  </FooterContainer>
);

export default Footer;
