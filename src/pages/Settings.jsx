import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import BusinessIcon from '@mui/icons-material/Business';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PaletteIcon from '@mui/icons-material/Palette';
import LanguageIcon from '@mui/icons-material/Language';
import SaveIcon from '@mui/icons-material/Save';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';

import { useTenant } from '../contexts/TenantContext';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SettingsCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[2]
}));

const Settings = () => {
  const { tenantConfig, updateTenantConfig } = useTenant();
  const { instance, accounts } = useMsal();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    profilePicture: null
  });
  
  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: 30
  });
  
  // Tenant settings state
  const [tenantSettings, setTenantSettings] = useState({
    tenantName: '',
    tenantId: '',
    dynamicsUrl: '',
    apiKey: '',
    environment: 'production'
  });
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    reminderNotifications: true,
    marketingEmails: false
  });
  
  // Display settings state
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    recordsPerPage: 10
  });

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch user data from your backend or Microsoft Graph
        // Example:
        // const response = await instance.acquireTokenSilent({
        //   ...loginRequest,
        //   account: accounts[0],
        // });
        // const userData = await fetchUserProfile(response.accessToken);
        
        // For now, using mock data based on the authenticated user
        if (accounts && accounts.length > 0) {
          const nameParts = accounts[0].name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          setUserProfile({
            firstName,
            lastName,
            email: accounts[0].username || '',
            phone: '(555) 123-4567',
            jobTitle: 'CRM Administrator',
            department: 'IT',
            profilePicture: null
          });
          
          // Mock tenant settings
          setTenantSettings({
            tenantName: 'Your Organization',
            tenantId: accounts[0].tenantId || '',
            dynamicsUrl: 'https://yourorg.crm.dynamics.com',
            apiKey: '••••••••••••••••',
            environment: 'production'
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [accounts, instance]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleUserProfileChange = (event) => {
    const { name, value } = event.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSecuritySettingsChange = (event) => {
    const { name, value, checked } = event.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: name === 'twoFactorEnabled' ? checked : value
    }));
  };
  
  const handleTenantSettingsChange = (event) => {
    const { name, value } = event.target;
    setTenantSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationSettingsChange = (event) => {
    const { name, checked } = event.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleDisplaySettingsChange = (event) => {
    const { name, value } = event.target;
    setDisplaySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, you would save the settings to your backend
      // Example:
      // const response = await instance.acquireTokenSilent({
      //   ...loginRequest,
      //   account: accounts[0],
      // });
      // await saveUserSettings(response.accessToken, {
      //   userProfile,
      //   securitySettings,
      //   tenantSettings,
      //   notificationSettings,
      //   displaySettings
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update tenant context if needed
      if (tenantConfig) {
        updateTenantConfig({
          ...tenantConfig,
          theme: displaySettings.theme,
          language: displaySettings.language
        });
      }
      
      setSaveSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      // Sign out the user
      await instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSaveSuccess(false);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Grid container spacing={3}>
        {/* Settings Navigation */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ mb: { xs: 2, md: 0 } }}>
            <List component="nav" aria-label="settings navigation">
              <ListItemButton 
                selected={activeTab === 0}
                onClick={() => setActiveTab(0)}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
              
              <ListItemButton 
                selected={activeTab === 1}
                onClick={() => setActiveTab(1)}
              >
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary="Security" />
              </ListItemButton>
              
              <ListItemButton 
                selected={activeTab === 2}
                onClick={() => setActiveTab(2)}
              >
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary="Tenant" />
              </ListItemButton>
              
              <ListItemButton 
                selected={activeTab === 3}
                onClick={() => setActiveTab(3)}
              >
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItemButton>
              
              <ListItemButton 
                selected={activeTab === 4}
                onClick={() => setActiveTab(4)}
              >
                <ListItemIcon>
                  <PaletteIcon />
                </ListItemIcon>
                <ListItemText primary="Display" />
              </ListItemButton>
              
              <Divider sx={{ my: 1 }} />
              
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>
        
        {/* Settings Content */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: { xs: 'block', md: 'none' } }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="settings tabs"
              >
                <Tab icon={<PersonIcon />} label="Profile" />
                <Tab icon={<SecurityIcon />} label="Security" />
                <Tab icon={<BusinessIcon />} label="Tenant" />
                <Tab icon={<NotificationsIcon />} label="Notifications" />
                <Tab icon={<PaletteIcon />} label="Display" />
              </Tabs>
            </Box>
            
            {/* Profile Settings */}
            <TabPanel value={activeTab} index={0}>
              <SettingsCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ width: 80, height: 80, mr: 2 }}
                      src={userProfile.profilePicture}
                    >
                      {userProfile.firstName && userProfile.firstName[0]}
                      {userProfile.lastName && userProfile.lastName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {userProfile.firstName} {userProfile.lastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {userProfile.jobTitle} • {userProfile.department}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ mt: 1 }}
                      >
                        Change Photo
                      </Button>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={userProfile.firstName}
                        onChange={handleUserProfileChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={userProfile.lastName}
                        onChange={handleUserProfileChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={userProfile.email}
                        onChange={handleUserProfileChange}
                        margin="normal"
                        type="email"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={userProfile.phone}
                        onChange={handleUserProfileChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        name="jobTitle"
                        value={userProfile.jobTitle}
                        onChange={handleUserProfileChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Department"
                        name="department"
                        value={userProfile.department}
                        onChange={handleUserProfileChange}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </SettingsCard>
            </TabPanel>
            
            {/* Security Settings */}
            <TabPanel value={activeTab} index={1}>
              <SettingsCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Change Password
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        value={securitySettings.currentPassword}
                        onChange={handleSecuritySettingsChange}
                        margin="normal"
                        type={showPassword ? "text" : "password"}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={togglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        value={securitySettings.newPassword}
                        onChange={handleSecuritySettingsChange}
                        margin="normal"
                        type={showPassword ? "text" : "password"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        value={securitySettings.confirmPassword}
                        onChange={handleSecuritySettingsChange}
                        margin="normal"
                        type={showPassword ? "text" : "password"}
                      />
                    </Grid>
                  </Grid>
                  
                  <Button 
                    variant="contained" 
                    color="primary"
                    sx={{ mt: 2 }}
                    disabled={
                      !securitySettings.currentPassword || 
                      !securitySettings.newPassword || 
                      securitySettings.newPassword !== securitySettings.confirmPassword
                    }
                  >
                    Update Password
                  </Button>
                </CardContent>
              </SettingsCard>
              
              <SettingsCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Options
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={securitySettings.twoFactorEnabled}
                        onChange={handleSecuritySettingsChange}
                        name="twoFactorEnabled"
                        color="primary"
                      />
                    }
                    label="Enable Two-Factor Authentication"
                  />
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Session Timeout (minutes)
                    </Typography>
                    <FormControl sx={{ width: 200 }}>
                      <Select
                        value={securitySettings.sessionTimeout}
                        onChange={handleSecuritySettingsChange}
                        name="sessionTimeout"
                      >
                        <MenuItem value={15}>15 minutes</MenuItem>
                        <MenuItem value={30}>30 minutes</MenuItem>
                        <MenuItem value={60}>1 hour</MenuItem>
                        <MenuItem value={120}>2 hours</MenuItem>
                        <MenuItem value={240}>4 hours</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </CardContent>
              </SettingsCard>
            </TabPanel>
            
            {/* Tenant Settings */}
            <TabPanel value={activeTab} index={2}>
              <SettingsCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tenant Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Tenant Name"
                        name="tenantName"
                        value={tenantSettings.tenantName}
                        onChange={handleTenantSettingsChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Tenant ID"
                        name="tenantId"
                        value={tenantSettings.tenantId}
                        onChange={handleTenantSettingsChange}
                        margin="normal"
                        disabled
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </SettingsCard>
              
              <SettingsCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Dynamics CRM Connection
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Dynamics CRM URL"
                        name="dynamicsUrl"
                        value={tenantSettings.dynamicsUrl}
                        onChange={handleTenantSettingsChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="API Key"
                        name="apiKey"
                        value={tenantSettings.apiKey}
                        onChange={handleTenantSettingsChange}
                        margin="normal"
                        type={showPassword ? "text" : "password"}
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              aria-label="toggle api key visibility"
                              onClick={togglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Environment</InputLabel>
                        <Select
                          value={tenantSettings.environment}
                          onChange={handleTenantSettingsChange}
                          name="environment"
                          label="Environment"
                        >
                          <MenuItem value="development">Development</MenuItem>
                          <MenuItem value="test">Test</MenuItem>
                          <MenuItem value="production">Production</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<CloudSyncIcon />}
                    >
                      Test Connection
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      startIcon={<CloudSyncIcon />}
                    >
                      Sync Data
                    </Button>
                  </Box>
                </CardContent>
              </SettingsCard>
            </TabPanel>
            
            {/* Notification Settings */}
            <TabPanel value={activeTab} index={3}>
              <SettingsCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notification Preferences
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Email Notifications" 
                        secondary="Receive notifications via email"
                      />
                      <Switch
                        edge="end"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationSettingsChange}
                        name="emailNotifications"
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText 
                        primary="Push Notifications" 
                        secondary="Receive notifications in your browser"
                      />
                      <Switch
                        edge="end"
                        checked={notificationSettings.pushNotifications}
                        onChange={handleNotificationSettingsChange}
                        name="pushNotifications"
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText 
                        primary="Reminder Notifications" 
                        secondary="Receive reminders for upcoming tasks and events"
                      />
                      <Switch
                        edge="end"
                        checked={notificationSettings.reminderNotifications}
                        onChange={handleNotificationSettingsChange}
                        name="reminderNotifications"
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText 
                        primary="Marketing Emails" 
                        secondary="Receive product updates and marketing information"
                      />
                      <Switch
                        edge="end"
                        checked={notificationSettings.marketingEmails}
                        onChange={handleNotificationSettingsChange}
                        name="marketingEmails"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </SettingsCard>
            </TabPanel>
            
            {/* Display Settings */}
            <TabPanel value={activeTab} index={4}>
              <SettingsCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Appearance
                  </Typography>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={displaySettings.theme}
                      onChange={handleDisplaySettingsChange}
                      name="theme"
                      label="Theme"
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="system">System Default</MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </SettingsCard>
              
              <SettingsCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Regional Settings
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Language</InputLabel>
                        <Select
                          value={displaySettings.language}
                          onChange={handleDisplaySettingsChange}
                          name="language"
                          label="Language"
                        >
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Spanish</MenuItem>
                          <MenuItem value="fr">French</MenuItem>
                          <MenuItem value="de">German</MenuItem>
                          <MenuItem value="ja">Japanese</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Timezone</InputLabel>
                        <Select
                          value={displaySettings.timezone}
                          onChange={handleDisplaySettingsChange}
                          name="timezone"
                          label="Timezone"
                        >
                          <MenuItem value="UTC">UTC</MenuItem>
                          <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                          <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                          <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                          <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                          <MenuItem value="Europe/London">London</MenuItem>
                          <MenuItem value="Europe/Paris">Paris</MenuItem>
                          <MenuItem value="Asia/Tokyo">Tokyo</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Date Format</InputLabel>
                        <Select
                          value={displaySettings.dateFormat}
                          onChange={handleDisplaySettingsChange}
                          name="dateFormat"
                          label="Date Format"
                        >
                          <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                          <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                          <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Records Per Page</InputLabel>
                        <Select
                          value={displaySettings.recordsPerPage}
                          onChange={handleDisplaySettingsChange}
                          name="recordsPerPage"
                          label="Records Per Page"
                        >
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={25}>25</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                          <MenuItem value={100}>100</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </SettingsCard>
            </TabPanel>
          </Paper>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Settings'}
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      <Snackbar
        open={saveSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;