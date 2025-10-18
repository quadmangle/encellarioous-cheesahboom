import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../../src/App';

describe('Home page contact workflow', () => {
  beforeEach(() => {
    window.localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    delete global.fetch;
  });

  it('submits the contact form successfully', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true, json: jest.fn() });

    render(<App />);

    const ctaButton = await screen.findByRole('button', { name: /contact us/i });
    fireEvent.click(ctaButton);

    const nameInput = await screen.findByLabelText(/Full name/i);
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Work email/i), {
      target: { value: 'jane.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/How can we help/i), {
      target: { value: 'I would like to learn more about OPS services.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Send message/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.any(Object));
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Your message is on its way to our operations desk/i),
      ).toBeInTheDocument();
    });
  });

  it('surfaces validation feedback when the API rejects the submission', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: [{ msg: 'Name must be between 2 and 120 characters.' }] }),
    });

    render(<App />);

    fireEvent.click(await screen.findByRole('button', { name: /contact us/i }));
    fireEvent.click(screen.getByRole('button', { name: /Send message/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Name must be between 2 and 120 characters/i),
      ).toBeInTheDocument();
    });
  });
});
