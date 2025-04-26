import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTenant } from '../../contexts/TenantContext';

const ThemedApp = ({ children }) => {
  const { tenantConfig, loading } = useTenant();
  
  const theme = React.useMemo(() => {
    if (loading || !tenantConfig.theme) {
      return createTheme(); // Default theme
    }
    
    return createTheme({
      palette: {
        primary: {
          main: tenantConfig.theme.primary || '#1976d2',
        },
        secondary: {
          main: tenantConfig.theme.secondary || '#dc004e',
        },
      },
    });
  }, [tenantConfig, loading]);

  if (loading) {
    return <div>Loading tenant configuration...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemedApp;