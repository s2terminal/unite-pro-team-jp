import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { orange, deepPurple } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: deepPurple[500],
      dark: deepPurple[700],
      light: deepPurple[300],
      contrastText: '#ffffff',
    },
    secondary: {
      main: orange[600],
      dark: orange[800],
      light: orange[300],
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7f7f9',
      paper: '#ffffff',
    },
  },
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
