import React, { createContext, useContext, useState, useEffect } from 'react';

const TenantContext = createContext();

export const useTenant = () => useContext(TenantContext);

export const TenantProvider = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState(null);
  const [tenantConfig, setTenantConfig] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load tenant information from user session or URL
    const loadTenantInfo = async () => {
      try {
        // This would be replaced with actual tenant detection logic
        // For example, from subdomain, URL parameter, or user session
        const tenantId = window.location.hostname.split('.')[0];
        
        // Fetch tenant configuration from API
        // const config = await fetchTenantConfig(tenantId);
        const config = {
          id: tenantId,
          name: tenantId.charAt(0).toUpperCase() + tenantId.slice(1),
          theme: {
            primary: '#1976d2',
            secondary: '#dc004e',
          },
          features: {
            charts: true,
            advancedFilters: true,
          }
        };
        
        setCurrentTenant(tenantId);
        setTenantConfig(config);
      } catch (error) {
        console.error('Failed to load tenant information', error);
      } finally {
        setLoading(false);
      }
    };

    loadTenantInfo();
  }, []);

  const value = {
    currentTenant,
    tenantConfig,
    loading,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};