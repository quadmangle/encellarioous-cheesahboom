import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'ops-theme-preference';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    document.body?.setAttribute('data-theme', stored);
    return stored;
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const initial = prefersDark ? 'dark' : 'light';
  document.body?.setAttribute('data-theme', initial);
  return initial;
};

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const body = document.body;
    body.setAttribute('data-theme', theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      setTheme((currentTheme) => {
        const nextTheme = event.matches ? 'dark' : 'light';
        return window.localStorage.getItem(STORAGE_KEY)
          ? currentTheme
          : nextTheme;
      });
    };

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery?.addListener) {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery?.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
