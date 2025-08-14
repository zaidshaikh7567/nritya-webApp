'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
  Container,
  Skeleton,
  Chip,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from "@mui/material";
import {  
  ArrowBack, 
  TrendingUp,
  AttachMoney, 
  Schedule,
  CalendarToday,
  BarChart,
  Download,
  Refresh
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { BASEURL_PROD } from '../../../src/constants';

// Dynamic imports for client components
const ClientHeader = dynamic(() => import('../../components/ClientHeader'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      width: '100%', 
      height: '7vh', 
      backgroundColor: "black", 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000 
    }}>
      <Skeleton variant="rectangular" animation="wave" sx={{ height: '100%' }} />
    </div>
  )
});

const ClientFooter = dynamic(() => import('../../components/ClientFooter'), {
  ssr: false
});

export default function StudioRentalRevenue({ params }) {
  const { studioId } = params;
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  });

  // Fetch revenue data
  const fetchRevenueData = async (startDate = '', endDate = '') => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${BASEURL_PROD}payments/studio_rental_revenue/${studioId}/`;
      const params = new URLSearchParams();
      
      if (startDate && endDate) {
        params.append('start_date', startDate);
        params.append('end_date', endDate);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log('Fetching revenue data from:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setRevenueData(data.data);
        setDateRange({
          start_date: data.data.date_range.start_date,
          end_date: data.data.date_range.end_date
        });
      } else {
        setError(data.message || 'Failed to fetch revenue data');
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      setError('Failed to fetch revenue data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (studioId) {
      fetchRevenueData();
    }
  }, [studioId]);

  // Handle refresh
  const handleRefresh = () => {
    fetchRevenueData();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format hours
  const formatHours = (hours) => {
    return `${hours.toFixed(1)} hrs`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ClientHeader />
        <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={60} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Skeleton variant="rectangular" height={200} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Skeleton variant="rectangular" height={200} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Skeleton variant="rectangular" height={200} />
                </Grid>
                <Grid item xs={12}>
                  <Skeleton variant="rectangular" height={400} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </main>
        <ClientFooter />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Back Button */}
            <Box sx={{ mb: 3 }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Button variant="text" startIcon={<ArrowBack />}>
                  Back to Dashboard
                </Button>
              </Link>
            </Box>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', textTransform: 'none' }}>
                  Studio Rental Revenue
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Refresh Data">
                    <IconButton onClick={handleRefresh} disabled={loading}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download Report">
                    <IconButton>
                      <Download />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                Studio ID: {studioId}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Date Range: {dateRange.start_date} to {dateRange.end_date}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            )}

            {revenueData && (
              <>
                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <AttachMoney sx={{ fontSize: 40, color: 'success.main' }} />
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                              {formatCurrency(revenueData.summary.total_revenue)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Total Revenue
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CalendarToday sx={{ fontSize: 40, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                              {revenueData.summary.total_bookings}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Total Bookings
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Schedule sx={{ fontSize: 40, color: 'info.main' }} />
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                              {formatHours(revenueData.summary.total_hours)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Total Hours
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <TrendingUp sx={{ fontSize: 40, color: 'warning.main' }} />
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                              {formatCurrency(revenueData.summary.average_revenue_per_booking)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Avg per Booking
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Daily Revenue Table */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, textTransform: 'none' }}>
                      Daily Revenue Breakdown
                    </Typography>
                    
                    {revenueData.daily_revenue.length === 0 ? (
                      <Alert severity="info">
                        No revenue data found for the selected date range.
                      </Alert>
                    ) : (
                      <TableContainer component={Paper} variant="outlined">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Bookings</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Hours</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Revenue</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Avg per Hour</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {revenueData.daily_revenue.map((dayData) => (
                              <TableRow key={dayData.date} hover>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    {format(parseISO(dayData.date), 'MMM dd, yyyy')}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {format(parseISO(dayData.date), 'EEEE')}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip 
                                    label={dayData.bookings} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined"
                                  />
                                </TableCell>
                                <TableCell>{formatHours(dayData.total_hours)}</TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                    {formatCurrency(dayData.total_revenue)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {formatCurrency(dayData.total_revenue / dayData.total_hours)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardContent>
                </Card>

                {/* Time Slot Details */}
                {revenueData.daily_revenue.length > 0 && (
                  <Card sx={{ mt: 4 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 3, textTransform: 'none' }}>
                        Time Slot Performance
                      </Typography>
                      
                      <Grid container spacing={3}>
                        {revenueData.daily_revenue.map((dayData) => (
                          <Grid item xs={12} md={6} key={dayData.date}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                  {format(parseISO(dayData.date), 'MMM dd, yyyy')}
                                </Typography>
                                
                                {dayData.time_slots.map((slot) => (
                                  <Box key={slot.time_range} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        {slot.time_range}
                                      </Typography>
                                      <Chip 
                                        label={`₹${slot.price_per_hour}/hr`} 
                                        size="small" 
                                        color="secondary"
                                      />
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {slot.bookings} bookings • {formatHours(slot.total_hours)}
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                        {formatCurrency(slot.revenue)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ))}
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </Container>
        </Box>
      </main>
      <ClientFooter />
    </div>
  );
}
