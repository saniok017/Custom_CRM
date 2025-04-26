import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useIsAuthenticated } from '@azure/msal-react';

// Authentication components
import { loginRequest } from './authConfig';
import { callMsGraph } from './graph';
import { ProfileData } from './components/ProfileData';

// Layout and pages
import { TenantProvider } from './contexts/TenantContext';
import ThemedApp from './components/layout/ThemedApp';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Accounts from './pages/Accounts';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

import './App.css';
import Button from 'react-bootstrap/Button';

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                callMsGraph(response.accessToken).then((response) => setGraphData(response));
            });
    }

    return (
        <>
            <h5 className="profileContent">Welcome {accounts[0].name}</h5>
            {graphData ? (
                <ProfileData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestProfileData}>
                    Request Profile
                </Button>
            )}
        </>
    );
};

/**
 * Main application component that combines authentication with routing
 */
export default function App() {
    return (
        <div className="App">
            <AuthenticatedTemplate>
                <ProfileContent />
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                <TenantProvider>
                    <ThemedApp>
                        <Router>
                            <Routes>
                                <Route path="/dashboard" element={
                                        <MainLayout>
                                            <Dashboard />
                                        </MainLayout>
                                } />
                                <Route path="/contacts" element={
                                        <MainLayout>
                                            <Contacts />
                                        </MainLayout>
                                } />
                                <Route path="/accounts" element={
                                        <MainLayout>
                                            <Accounts />
                                        </MainLayout>
                                } />
                                <Route path="/analytics" element={
                                        <MainLayout>
                                            <Analytics />
                                        </MainLayout>
                                } />
                                <Route path="/settings" element={
                                        <MainLayout>
                                            <Settings />
                                        </MainLayout>
                                } />
                                <Route path="/*" element={
                                        <MainLayout>
                                            <Dashboard />
                                        </MainLayout>
                                } />
                            </Routes>
                        </Router>
                    </ThemedApp>
                </TenantProvider>
            </UnauthenticatedTemplate>
        </div>
    );
}
