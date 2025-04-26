import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChartContainer from '../components/charts/ChartContainer';
import DataTable from '../components/tables/DataTable';
import { useTenant } from '../contexts/TenantContext';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// Sample data - in a real app, this would come from your API
const sampleLeads = [
  { id: 1, name: 'John Smith', company: 'Acme Inc', status: 'New', value: 5000, date: '2023-05-15' },
  { id: 2, name: 'Sarah Johnson', company: 'XYZ Corp', status: 'Contacted', value: 7500, date: '2023-05-14' },
  { id: 3, name: 'Michael Brown', company: 'ABC Ltd', status: 'Qualified', value: 10000, date: '2023-05-12' },
  { id: 4, name: 'Emily Davis', company: 'Tech Solutions', status: 'Proposal', value: 15000, date: '2023-05-10' },
  { id: 5, name: 'Robert Wilson', company: 'Global Systems', status: 'Negotiation', value: 20000, date: '2023-05-08' },
];

const leadColumns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'company', label: 'Company', minWidth: 130 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { 
    id: 'value', 
    label: 'Value', 
    minWidth: 100, 
    align: 'right',
    format: (value) => `$${value.toLocaleString()}`,
  },
  { id: 'date', label: 'Date', minWidth: 100 },
];

const salesData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const leadsByStatusData = [
  { name: 'New', value: 25 },
  { name: 'Contacted', value: 35 },
  { name: 'Qualified', value: 20 },
  { name: 'Proposal', value: 15 },
  { name: 'Negotiation', value: 5 },
];

const Dashboard = () => {
  const { tenantConfig } = useTenant();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to {tenantConfig.name} CRM Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Item>
            <Typography variant="h3" component="div">
              42
            </Typography>
            <Typography variant="subtitle1" component="div">
              Active Leads
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item>
            <Typography variant="h3" component="div">
              18
            </Typography>
            <Typography variant="subtitle1" component="div">
              Opportunities
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item>
            <Typography variant="h3" component="div">
              $24k
            </Typography>
            <Typography variant="subtitle1" component="div">
              Revenue (MTD)
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Item>
            <Typography variant="h3" component="div">
              8
            </Typography>
            <Typography variant="subtitle1" component="div">
              Tasks Due Today
            </Typography>
          </Item>
        </Grid>
        
        {/* Charts */}
        <Grid item xs={12} md={8}>
          <ChartContainer 
            title="Monthly Sales Performance" 
            type="bar" 
            data={salesData} 
            dataKey="value" 
            nameKey="name" 
            height={300}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartContainer 
            title="Leads by Status" 
            type="pie" 
            data={leadsByStatusData} 
            dataKey="value" 
            nameKey="name" 
            height={300}
          />
        </Grid>
        
        {/* Table */}
        <Grid item xs={12}>
          <DataTable 
            title="Recent Leads" 
            data={sampleLeads} 
            columns={leadColumns} 
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;