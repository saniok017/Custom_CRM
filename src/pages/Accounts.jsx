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
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  CardContent,
  Tabs,
  Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import { useTenant } from '../contexts/TenantContext';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

// Sample data - in a real app, this would come from your Dynamics CRM API
const sampleAccounts = [
  { 
    id: '1', 
    name: 'Acme Corporation', 
    industry: 'Manufacturing',
    type: 'Customer',
    status: 'Active',
    revenue: 5000000,
    employees: 250,
    phone: '(555) 123-4567',
    email: 'info@acmecorp.com',
    website: 'www.acmecorp.com',
    address: '123 Main St, Anytown, CA 94105',
    primaryContact: 'John Smith',
    lastActivity: '2023-05-15',
    createdDate: '2020-03-10'
  },
  { 
    id: '2', 
    name: 'XYZ Industries', 
    industry: 'Technology',
    type: 'Partner',
    status: 'Active',
    revenue: 12000000,
    employees: 500,
    phone: '(555) 234-5678',
    email: 'contact@xyzindustries.com',
    website: 'www.xyzindustries.com',
    address: '456 Tech Blvd, Innovation City, WA 98052',
    primaryContact: 'Sarah Johnson',
    lastActivity: '2023-05-12',
    createdDate: '2019-07-22'
  },
  { 
    id: '3', 
    name: 'Global Enterprises', 
    industry: 'Finance',
    type: 'Customer',
    status: 'Inactive',
    revenue: 30000000,
    employees: 1200,
    phone: '(555) 345-6789',
    email: 'info@globalenterprises.com',
    website: 'www.globalenterprises.com',
    address: '789 Finance Ave, Metropolis, NY 10001',
    primaryContact: 'Michael Brown',
    lastActivity: '2023-04-05',
    createdDate: '2018-11-15'
  },
  { 
    id: '4', 
    name: 'Tech Solutions Inc', 
    industry: 'Technology',
    type: 'Customer',
    status: 'Active',
    revenue: 8500000,
    employees: 320,
    phone: '(555) 456-7890',
    email: 'support@techsolutions.com',
    website: 'www.techsolutions.com',
    address: '101 Innovation Way, Silicon Valley, CA 94024',
    primaryContact: 'Emily Davis',
    lastActivity: '2023-05-18',
    createdDate: '2021-02-08'
  },
  { 
    id: '5', 
    name: 'Omega Consulting', 
    industry: 'Consulting',
    type: 'Prospect',
    status: 'Active',
    revenue: 3200000,
    employees: 75,
    phone: '(555) 567-8901',
    email: 'info@omegaconsulting.com',
    website: 'www.omegaconsulting.com',
    address: '222 Consulting Dr, Advisorville, IL 60601',
    primaryContact: 'Robert Wilson',
    lastActivity: '2023-05-10',
    createdDate: '2022-01-15'
  },
];

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const AccountCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const Accounts = () => {
  const { tenantConfig } = useTenant();
  const { instance, accounts } = useMsal();
  const [accountsData, setAccountsData] = useState(sampleAccounts);
  const [filteredAccounts, setFilteredAccounts] = useState(sampleAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    industry: [],
    type: [],
    status: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('grid');
  const [detailTab, setDetailTab] = useState(0);

  // In a real app, this would fetch accounts from Dynamics CRM
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch data from Dynamics CRM here
        // Example:
        // const response = await instance.acquireTokenSilent({
        //   ...loginRequest,
        //   account: accounts[0],
        // });
        // const data = await fetchDynamicsAccounts(response.accessToken);
        // setAccountsData(data);
        
        // Using sample data for now
        setTimeout(() => {
          setAccountsData(sampleAccounts);
          setFilteredAccounts(sampleAccounts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Filter accounts based on search term and filters
  useEffect(() => {
    let result = accountsData;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(account => 
        account.name.toLowerCase().includes(term) ||
        account.industry.toLowerCase().includes(term) ||
        account.primaryContact.toLowerCase().includes(term)
      );
    }
    
    // Apply industry filters
    if (filters.industry.length > 0) {
      result = result.filter(account => filters.industry.includes(account.industry));
    }
    
    // Apply type filters
    if (filters.type.length > 0) {
      result = result.filter(account => filters.type.includes(account.type));
    }
    
    // Apply status filters
    if (filters.status.length > 0) {
      result = result.filter(account => filters.status.includes(account.status));
    }
    
    setFilteredAccounts(result);
    setPage(0);
  }, [accountsData, searchTerm, filters]);

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
      industry: [],
      type: [],
      status: []
    });
    setSearchTerm('');
  };

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
  };

  const handleCloseDialog = () => {
    setSelectedAccount(null);
    setDetailTab(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleDetailTabChange = (event, newValue) => {
    setDetailTab(newValue);
  };

  // Get paginated data
  const paginatedAccounts = filteredAccounts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Table columns
  const columns = [
    { id: 'name', label: 'Account Name', minWidth: 170 },
    { id: 'industry', label: 'Industry', minWidth: 100 },
    { id: 'type', label: 'Type', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { 
      id: 'revenue', 
      label: 'Annual Revenue', 
      minWidth: 120, 
      align: 'right',
      format: (value) => `$${value.toLocaleString()}`,
    },
    { id: 'employees', label: 'Employees', minWidth: 100, align: 'right' },
    { id: 'primaryContact', label: 'Primary Contact', minWidth: 150 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Accounts
      </Typography>
      
      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search accounts..."
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
          <Grid item xs={6} md={2}>
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
              Add Account
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleViewModeChange('grid')}
                sx={{ mr: 1 }}
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleViewModeChange('table')}
              >
                Table
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {/* Filter options */}
        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Industry:
            </Typography>
            <Box sx={{ mb: 1 }}>
              {['Manufacturing', 'Technology', 'Finance', 'Consulting', 'Healthcare'].map(industry => (
                <FilterChip
                  key={industry}
                  label={industry}
                  clickable
                  color={filters.industry.includes(industry) ? "primary" : "default"}
                  onClick={() => toggleFilter('industry', industry)}
                />
              ))}
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              Account Type:
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
      
      {/* Account List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredAccounts.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {paginatedAccounts.map(account => (
                <Grid item xs={12} sm={6} md={4} key={account.id}>
                  <AccountCard elevation={2} onClick={() => handleAccountClick(account)}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" noWrap>
                          {account.name}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {account.industry}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" noWrap>{account.address}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{account.phone}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {account.employees.toLocaleString()} employees
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AttachMoneyIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          ${(account.revenue / 1000000).toFixed(1)}M revenue
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                        <Chip 
                          label={account.type} 
                          size="small" 
                          color={account.type === 'Customer' ? 'primary' : 'default'}
                        />
                        <Chip 
                          label={account.status} 
                          size="small" 
                          color={account.status === 'Active' ? 'success' : 'default'}
                        />
                      </Box>
                    </CardContent>
                  </AccountCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="accounts table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <StyledTableCell
                        key={column.id}
                        align={column.align || 'left'}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAccounts.map((account) => (
                    <TableRow 
                      hover 
                      role="checkbox" 
                      tabIndex={-1} 
                      key={account.id}
                      onClick={() => handleAccountClick(account)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {columns.map((column) => {
                        const value = account[column.id];
                        return (
                          <TableCell key={column.id} align={column.align || 'left'}>
                            {column.format ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAccounts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No accounts found</Typography>
          <Typography variant="body2" color="textSecondary">
            Try adjusting your search or filters
          </Typography>
        </Paper>
      )}
      
      {/* Account Detail Dialog */}
      {selectedAccount && (
        <Dialog 
          open={Boolean(selectedAccount)} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">{selectedAccount.name}</Typography>
            </Box>
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
          
          <Tabs
            value={detailTab}
            onChange={handleDetailTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Overview" />
            <Tab label="Contacts" />
            <Tab label="Opportunities" />
            <Tab label="Activities" />
          </Tabs>
          
          <DialogContent dividers>
            {detailTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Account Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Industry:</strong> {selectedAccount.industry}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Type:</strong> {selectedAccount.type}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {selectedAccount.status}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Annual Revenue:</strong> ${selectedAccount.revenue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Employees:</strong> {selectedAccount.employees.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Created Date:</strong> {selectedAccount.createdDate}
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Primary Contact
                  </Typography>
                  <Typography variant="body2">
                    {selectedAccount.primaryContact}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Contact Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">{selectedAccount.address}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">{selectedAccount.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">{selectedAccount.email}</Typography>
                    </Box>
                    <Typography variant="body2">
                      <strong>Website:</strong> {selectedAccount.website}
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Activity Information
                  </Typography>
                  <Typography variant="body2">
                    <strong>Last Activity:</strong> {selectedAccount.lastActivity}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Account Summary
                  </Typography>
                  <Typography variant="body2">
                    {selectedAccount.name} is a {selectedAccount.type.toLowerCase()} in the {selectedAccount.industry} industry with {selectedAccount.employees} employees and annual revenue of ${selectedAccount.revenue.toLocaleString()}.
                  </Typography>
                </Grid>
              </Grid>
            )}
            
            {detailTab === 1 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Associated Contacts
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  No contacts are currently associated with this account.
                </Typography>
              </Box>
            )}
            
            {detailTab === 2 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Opportunities
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  No opportunities are currently associated with this account.
                </Typography>
              </Box>
            )}
            
            {detailTab === 3 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Recent Activities
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  No recent activities found for this account.
                </Typography>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button variant="contained" color="primary">
              Edit Account
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Accounts;