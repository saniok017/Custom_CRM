import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import { useTenant } from '../contexts/TenantContext';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

// Sample data - in a real app, this would come from your Dynamics CRM API
const sampleContacts = [
  { 
    id: '1', 
    firstName: 'John', 
    lastName: 'Smith', 
    email: 'john.smith@example.com', 
    phone: '(555) 123-4567', 
    company: 'Acme Inc', 
    jobTitle: 'Sales Manager',
    type: 'Customer',
    status: 'Active',
    lastContact: '2023-05-15'
  },
  { 
    id: '2', 
    firstName: 'Sarah', 
    lastName: 'Johnson', 
    email: 'sarah.johnson@example.com', 
    phone: '(555) 234-5678', 
    company: 'XYZ Corp', 
    jobTitle: 'Marketing Director',
    type: 'Partner',
    status: 'Active',
    lastContact: '2023-05-10'
  },
  { 
    id: '3', 
    firstName: 'Michael', 
    lastName: 'Brown', 
    email: 'michael.brown@example.com', 
    phone: '(555) 345-6789', 
    company: 'ABC Ltd', 
    jobTitle: 'CEO',
    type: 'Customer',
    status: 'Inactive',
    lastContact: '2023-04-22'
  },
  { 
    id: '4', 
    firstName: 'Emily', 
    lastName: 'Davis', 
    email: 'emily.davis@example.com', 
    phone: '(555) 456-7890', 
    company: 'Tech Solutions', 
    jobTitle: 'IT Manager',
    type: 'Prospect',
    status: 'Active',
    lastContact: '2023-05-18'
  },
  { 
    id: '5', 
    firstName: 'Robert', 
    lastName: 'Wilson', 
    email: 'robert.wilson@example.com', 
    phone: '(555) 567-8901', 
    company: 'Global Systems', 
    jobTitle: 'CTO',
    type: 'Customer',
    status: 'Active',
    lastContact: '2023-05-05'
  },
];

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4],
  },
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const Contacts = () => {
  const { tenantConfig } = useTenant();
  const { instance, accounts } = useMsal();
  const [contacts, setContacts] = useState(sampleContacts);
  const [filteredContacts, setFilteredContacts] = useState(sampleContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: [],
    status: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(false);

  // In a real app, this would fetch contacts from Dynamics CRM
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch data from Dynamics CRM here
        // Example:
        // const response = await instance.acquireTokenSilent({
        //   ...loginRequest,
        //   account: accounts[0],
        // });
        // const data = await fetchDynamicsContacts(response.accessToken);
        // setContacts(data);
        
        // Using sample data for now
        setTimeout(() => {
          setContacts(sampleContacts);
          setFilteredContacts(sampleContacts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filter contacts based on search term and filters
  useEffect(() => {
    let result = contacts;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(contact => 
        contact.firstName.toLowerCase().includes(term) ||
        contact.lastName.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.company.toLowerCase().includes(term)
      );
    }
    
    // Apply type filters
    if (filters.type.length > 0) {
      result = result.filter(contact => filters.type.includes(contact.type));
    }
    
    // Apply status filters
    if (filters.status.length > 0) {
      result = result.filter(contact => filters.status.includes(contact.status));
    }
    
    setFilteredContacts(result);
  }, [contacts, searchTerm, filters]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleFilter = (filterType, value) => {
    setFilters(prevFilters => {
      const currentFilters = [...prevFilters[filterType]];
      const index = currentFilters.indexOf(value);
      
      if (index === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(index, 1);
      }
      
      return {
        ...prevFilters,
        [filterType]: currentFilters
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      type: [],
      status: []
    });
    setSearchTerm('');
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleCloseDialog = () => {
    setSelectedContact(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Contacts
      </Typography>
      
      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Button 
              variant="outlined" 
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              fullWidth
            >
              Filters
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              fullWidth
            >
              Add Contact
            </Button>
          </Grid>
        </Grid>
        
        {/* Filter options */}
        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Contact Type:
            </Typography>
            <Box sx={{ mb: 1 }}>
              {['Customer', 'Prospect', 'Partner'].map(type => (
                <FilterChip
                  key={type}
                  label={type}
                  clickable
                  color={filters.type.includes(type) ? "primary" : "default"}
                  onClick={() => toggleFilter('type', type)}
                />
              ))}
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              Status:
            </Typography>
            <Box sx={{ mb: 1 }}>
              {['Active', 'Inactive'].map(status => (
                <FilterChip
                  key={status}
                  label={status}
                  clickable
                  color={filters.status.includes(status) ? "primary" : "default"}
                  onClick={() => toggleFilter('status', status)}
                />
              ))}
            </Box>
            
            <Button 
              variant="text" 
              size="small" 
              onClick={clearFilters}
              sx={{ mt: 1 }}
            >
              Clear All Filters
            </Button>
          </Box>
        )}
      </Paper>
      
      {/* Contact List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredContacts.length > 0 ? (
        <Grid container spacing={2}>
          {filteredContacts.map(contact => (
            <Grid item xs={12} md={6} lg={4} key={contact.id}>
              <ContactCard elevation={2} onClick={() => handleContactClick(contact)}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    {contact.firstName} {contact.lastName}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {contact.jobTitle}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{contact.company}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{contact.email}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{contact.phone}</Typography>
                </Box>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Chip 
                    label={contact.type} 
                    size="small" 
                    color={contact.type === 'Customer' ? 'primary' : 'default'}
                  />
                  <Chip 
                    label={contact.status} 
                    size="small" 
                    color={contact.status === 'Active' ? 'success' : 'default'}
                  />
                </Box>
              </ContactCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No contacts found</Typography>
          <Typography variant="body2" color="textSecondary">
            Try adjusting your search or filters
          </Typography>
        </Paper>
      )}
      
      {/* Contact Detail Dialog */}
      {selectedContact && (
        <Dialog 
          open={Boolean(selectedContact)} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Contact Details
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="h5" gutterBottom>
              {selectedContact.firstName} {selectedContact.lastName}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              {selectedContact.jobTitle} at {selectedContact.company}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Contact Information</Typography>
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">{selectedContact.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">{selectedContact.phone}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Additional Information</Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Type:</strong> {selectedContact.type}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Status:</strong> {selectedContact.status}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Last Contact:</strong> {selectedContact.lastContact}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Notes & Activity
            </Typography>
            <Typography variant="body2" color="textSecondary">
              No recent activities found for this contact.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button variant="contained" color="primary">
              Edit Contact
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Contacts;