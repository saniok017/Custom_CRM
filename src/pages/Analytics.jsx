import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTenant } from '../contexts/TenantContext';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

// Sample data - in a real app, this would come from your Dynamics CRM API
const sampleSalesData = [
  { month: 'Jan', value: 12000 },
  { month: 'Feb', value: 19000 },
  { month: 'Mar', value: 15000 },
  { month: 'Apr', value: 22000 },
  { month: 'May', value: 28000 },
  { month: 'Jun', value: 25000 },
  { month: 'Jul', value: 30000 },
  { month: 'Aug', value: 27000 },
  { month: 'Sep', value: 32000 },
  { month: 'Oct', value: 35000 },
  { month: 'Nov', value: 40000 },
  { month: 'Dec', value: 45000 },
];

const sampleLeadSourceData = [
  { source: 'Website', count: 45 },
  { source: 'Referral', count: 30 },
  { source: 'Social Media', count: 25 },
  { source: 'Email Campaign', count: 20 },
  { source: 'Trade Show', count: 15 },
];

const sampleSalesByRepData = [
  { name: 'John Smith', value: 120000 },
  { name: 'Sarah Johnson', value: 150000 },
  { name: 'Michael Brown', value: 90000 },
  { name: 'Emily Davis', value: 180000 },
  { name: 'Robert Wilson', value: 135000 },
];

const sampleConversionRateData = [
  { stage: 'Lead', rate: 100 },
  { stage: 'Qualified Lead', rate: 65 },
  { stage: 'Opportunity', rate: 40 },
  { stage: 'Proposal', rate: 25 },
  { stage: 'Negotiation', rate: 15 },
  { stage: 'Closed Won', rate: 10 },
];

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const ChartPlaceholder = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  height: 300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(2),
}));

const Analytics = () => {
  const { tenantConfig } = useTenant();
  const { instance, accounts } = useMsal();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('year');
  const [salesData, setSalesData] = useState(sampleSalesData);
  const [leadSourceData, setLeadSourceData] = useState(sampleLeadSourceData);
  const [salesByRepData, setSalesByRepData] = useState(sampleSalesByRepData);
  const [conversionRateData, setConversionRateData] = useState(sampleConversionRateData);

  // In a real app, this would fetch analytics data from Dynamics CRM
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch data from Dynamics CRM here
        // Example:
        // const response = await instance.acquireTokenSilent({
        //   ...loginRequest,
        //   account: accounts[0],
        // });
        // const data = await fetchDynamicsAnalytics(response.accessToken, timeRange);
        // setSalesData(data.sales);
        // setLeadSourceData(data.leadSources);
        // setSalesByRepData(data.salesByRep);
        // setConversionRateData(data.conversionRates);
        
        // Using sample data for now
        setTimeout(() => {
          setSalesData(sampleSalesData);
          setLeadSourceData(sampleLeadSourceData);
          setSalesByRepData(sampleSalesByRepData);
          setConversionRateData(sampleConversionRateData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Calculate total sales
  const totalSales = salesData.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate top performing rep
  const topRep = salesByRepData.reduce((prev, current) => 
    (prev.value > current.value) ? prev : current, { value: 0 });
  
  // Calculate average deal size
  const avgDealSize = Math.round(totalSales / 120); // Assuming 120 deals in the period
  
  // Calculate lead-to-opportunity conversion rate
  const leadToOppRate = conversionRateData.find(item => item.stage === 'Opportunity')?.rate || 0;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="time-range-label">Time Range</InputLabel>
            <Select
              labelId="time-range-label"
              id="time-range"
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
          
          <Button variant="contained" onClick={() => setLoading(true)}>
            Refresh Data
          </Button>
        </Box>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* KPI Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    Total Sales
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                    ${totalSales.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    +12% from previous period
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    Top Performing Rep
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                    {topRep.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    ${topRep.value.toLocaleString()} in sales
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    Average Deal Size
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                    ${avgDealSize.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                    -3% from previous period
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">
                    Lead-to-Opportunity
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                    {leadToOppRate}%
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    +5% from previous period
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
          
          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <StyledCard>
                <CardHeader title="Sales Performance" />
                <Divider />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Monthly sales performance for the selected period
                  </Typography>
                  <ChartPlaceholder>
                    <Typography variant="body1" color="text.secondary">
                      Bar Chart: Sales by Month
                    </Typography>
                  </ChartPlaceholder>
                </CardContent>
              </StyledCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardHeader title="Lead Sources" />
                <Divider />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Distribution of leads by source
                  </Typography>
                  <ChartPlaceholder>
                    <Typography variant="body1" color="text.secondary">
                      Pie Chart: Lead Sources
                    </Typography>
                  </ChartPlaceholder>
                </CardContent>
              </StyledCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardHeader title="Sales by Representative" />
                <Divider />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Performance comparison across sales team
                  </Typography>
                  <ChartPlaceholder>
                    <Typography variant="body1" color="text.secondary">
                      Horizontal Bar Chart: Sales by Rep
                    </Typography>
                  </ChartPlaceholder>
                </CardContent>
              </StyledCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardHeader title="Sales Funnel" />
                <Divider />
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Conversion rates through sales pipeline stages
                  </Typography>
                  <ChartPlaceholder>
                    <Typography variant="body1" color="text.secondary">
                      Funnel Chart: Conversion Rates
                    </Typography>
                  </ChartPlaceholder>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Analytics;