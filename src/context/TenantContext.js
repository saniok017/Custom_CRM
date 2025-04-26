import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const TenantContext = createContext();

// Create provider component
export const TenantProvider = ({ children }) => {
  const [currentTenant, setCurrentTenant] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock tenants - in a real app, you would fetch these from your backend
  useEffect(() => {
    // Simulate API call to get tenants
    const fetchTenants = async () => {
      try {
        // Mock data - replace with actual API call
        const mockTenants = [
          { id: 'tenant1', name: 'Tenant 1', color: '#1976d2' },
          { id: 'tenant2', name: 'Tenant 2', color: '#388e3c' },
          { id: 'tenant3', name: 'Tenant 3', color: '#d32f2f' },
        ];
        
        setTenants(mockTenants);
        
        // Set default tenant if none is selected
        const savedTenantId = localStorage.getItem('currentTenantId');
        if (savedTenantId) {
          const savedTenant = mockTenants.find(t => t.id === savedTenantId);
          if (savedTenant) {
            setCurrentTenant(savedTenant);
          } else {
            setCurrentTenant(mockTenants[0]);
          }
        } else {
          setCurrentTenant(mockTenants[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // Function to change the current tenant
  const changeTenant = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setCurrentTenant(tenant);
      localStorage.setItem('currentTenantId', tenantId);
    }
  };

  return (
    <TenantContext.Provider value={{ currentTenant, tenants, loading, changeTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

// Custom hook to use the tenant context
export const useTenant = () => useContext(TenantContext);

export default TenantContext;