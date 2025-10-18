import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
    --line-height-base: 1.6;
    --focus-ring: #2f7bff;
    --transition-base: 0.2s ease;

    --space-2xs: 0.25rem;
    --space-xs: 0.5rem;
    --space-sm: 0.75rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --radius-sm: 0.5rem;
    --radius-md: 0.75rem;
  }

  [data-theme='light'] {
    color-scheme: light;
    --color-background: #f7f9fc;
    --color-surface: #ffffff;
    --color-surface-muted: #eff2f9;
    --color-border: #d7dce5;
    --color-text-primary: #1d2735;
    --color-text-secondary: #4f5d75;
    --color-text-inverse: #ffffff;
    --color-accent: #1155cc;
    --color-accent-hover: #0d47a1;
    --color-accent-muted: #e8f1ff;
    --color-danger: #c62828;
  }

  [data-theme='dark'] {
    color-scheme: dark;
    --color-background: #0b1628;
    --color-surface: #16294b;
    --color-surface-muted: #102039;
    --color-border: #244064;
    --color-text-primary: #f5f7fb;
    --color-text-secondary: #c5d0e6;
    --color-text-inverse: #081324;
    --color-accent: #4c9aff;
    --color-accent-hover: #2684ff;
    --color-accent-muted: #082448;
    --color-danger: #ef5350;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    font-family: var(--font-family-base);
    line-height: var(--line-height-base);
    background-color: var(--color-background);
    color: var(--color-text-primary);
    min-height: 100%;
  }

  body {
    display: flex;
    flex-direction: column;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  a {
    color: var(--color-accent);
    text-decoration: none;
    transition: color var(--transition-base);
  }

  a:hover,
  a:focus-visible {
    color: var(--color-accent-hover);
  }

  button, input, textarea, select {
    font: inherit;
    color: inherit;
  }

  button {
    transition: background-color var(--transition-base),
      color var(--transition-base),
      transform var(--transition-base),
      box-shadow var(--transition-base);
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  main {
    flex: 1;
    width: 100%;
  }

  ::selection {
    background: var(--color-accent);
    color: var(--color-text-inverse);
  }
`;

export default GlobalStyle;
