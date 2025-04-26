import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Business as BusinessIcon,
    BarChart as AnalyticsIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useIsAuthenticated } from '@azure/msal-react';

const NavItem = styled(ListItem)(({ theme, active }) => ({
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(0.5),
    backgroundColor: active ? theme.palette.action.selected : 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const Navigation = () => {
    const location = useLocation();
    const isAuthenticated = useIsAuthenticated();

    const navItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Contacts', icon: <PeopleIcon />, path: '/contacts' },
        { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ];
    const ExtendedNavItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Accounts', icon: <BusinessIcon />, path: '/accounts' },
        { text: 'Contacts', icon: <PeopleIcon />, path: '/contacts' },
        { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <List component="nav">
                {(isAuthenticated ? ExtendedNavItems : navItems).map((item) => (
                    <NavItem
                        button
                        component={Link}
                        to={item.path}
                        key={item.text}
                        active={location.pathname === item.path ? 1 : 0}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </NavItem>
                ))}
            </List>
            <Divider sx={{ my: 2 }} />
        </Box>
    );
};

export default Navigation;