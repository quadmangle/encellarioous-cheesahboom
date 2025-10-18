import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../../src/App';

describe('App navigation and controls', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders primary navigation links in English by default', async () => {
    render(<App />);

    expect(
      await screen.findByRole('heading', {
        name: /Empower Your Business/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Business Operations/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contact Center/i })).toBeInTheDocument();
  });

  it('toggles to Spanish when the language switch is pressed', async () => {
    render(<App />);

    const languageToggle = screen.getByRole('button', { name: /toggle language/i });
    fireEvent.click(languageToggle);

    await waitFor(() => {
      expect(
        screen.getByRole('link', { name: /Centro de Contacto/i }),
      ).toBeInTheDocument();
    });
  });

  it('persists theme toggling to dark mode', async () => {
    render(<App />);

    const themeToggle = screen.getByRole('button', { name: /enable dark mode/i });
    fireEvent.click(themeToggle);

    await waitFor(() => {
      expect(document.body).toHaveAttribute('data-theme', 'dark');
    });
  });
});
