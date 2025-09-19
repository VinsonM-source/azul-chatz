// ThemeContext.js

import React, { createContext, useState } from 'react';
import { DefaultTheme, DarkTheme } from 'styled-components/native';

export const ThemeContext = createContext();

const lightTheme = {
  mode: 'light',
  background: '#EAF2FF',
  text: '#000',
  primary: '#1E90FF',
};

const darkTheme = {
  mode: 'dark',
  background: '#121212',
  text: '#fff',
  primary: '#1E90FF',
};

export const ThemeProviderWrapper = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme(theme.mode === 'light' ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
