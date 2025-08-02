'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Refresh,
  Visibility,
  Receipt,
  Payment,
  Error,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { BASEURL_PROD } from '../../src/constants';
import ClientHeader from '../components/ClientHeader';
import ClientFooter from '../components/ClientFooter';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount || 0);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Success':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Failed':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Success':
      return <CheckCircle color="success" />;
    case 'Pending':
      return <Schedule color="warning" />;
    case 'Failed':
      return <Error color="error" />;
    default:
      return <Payment />;
  }
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });
  const BASESERVER_URL = 'http://0.0.0.0:8000/'
  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Memoize fetchTransactions to prevent infinite loops
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isLoggedIn || !userInfo.UserId) {
        setError('Please log in to view your transactions');
        setLoading(false);
        return;
      }

      // Build query parameters - only use userId
      const user_id = userInfo.UserId;
      const url  = `${BASESERVER_URL}payments/transactions/user/${user_id}`
      console.log("HIIIIII ",url)
      const response = await fetch(url);
      const data = await response.json();
      console.log(data)

      if (data.success) {
        setTransactions(data.transactions || []);
        setPagination(prev => ({
          ...prev,
          total: data.total_count || 0
        }));
      } else {
        setError(data.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, userInfo.UserId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRefresh = () => {
    fetchTransactions();
  };

  const handleViewTransaction = (transaction) => {
    // Navigate to transaction details or show modal
    console.log('View transaction:', transaction);
  };

  const handleViewBooking = (booking) => {
    if (booking?.booking_id) {
      window.open(`/ticket/${booking.booking_id}`, '_blank');
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ClientHeader />
        <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
          <Box sx={{ 
            flex: 1,
            bgcolor: '#f8f9fa',
            py: 4
          }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                  Please log in to view your transactions
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  You need to be logged in to access your transaction history.
                </Typography>
              </Card>
            </Box>
          </Box>
        </main>
        <ClientFooter/>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
        <Box sx={{ 
          flex: 1,
          bgcolor: '#f8f9fa',
          py: 4
        }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
            
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                color: '#735EAB',
                mb: 2,
                textTransform:'none'
              }}>
                💳 My Transaction History
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                View all your payment transactions
              </Typography>
            </Box>

            {/* User Info */}
            <Card sx={{ mb: 3, p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: '#735EAB',
                textTransform:'none'
              }}>
                👤 User Information
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>User ID:</strong> {userInfo.UserId}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {userInfo.email || 'Not provided'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Name:</strong> {userInfo.displayName || 'Not provided'}
              </Typography>
            </Card>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Loading */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Transactions Table */}
            {!loading && transactions.length > 0 && (
              <Card>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#735EAB' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                          Transaction ID
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                          Amount
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                          Payment Method
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                          Razorpay IDs
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                          Date
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                          Workshop ID
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.transaction_id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {transaction.transaction_id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(transaction.payment_status)}
                              label={transaction.payment_status}
                              color={getStatusColor(transaction.payment_status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {formatAmount(transaction.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {transaction.payment_method || 'Unknown'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              {transaction.razorpay_payment_id && (
                                <Typography variant="caption" sx={{ display: 'block', fontFamily: 'monospace' }}>
                                  Pay: {transaction.razorpay_payment_id}
                                </Typography>
                              )}
                              {transaction.razorpay_order_id && (
                                <Typography variant="caption" sx={{ display: 'block', fontFamily: 'monospace' }}>
                                  Order: {transaction.razorpay_order_id}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(transaction.created_at)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {transaction.booking?.workshop_id || 'N/A'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            )}

            {/* No Transactions */}
            {!loading && transactions.length === 0 && !error && (
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                  No transactions found
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  You haven&apos;t made any transactions yet. Book a workshop to see your transaction history.
                </Typography>
              </Card>
            )}

            {/* Pagination */}
            {!loading && pagination.total > pagination.limit && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={Math.ceil(pagination.total / pagination.limit)}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#735EAB'
                    }
                  }}
                />
              </Box>
            )}

            {/* Summary */}
            {!loading && transactions.length > 0 && (
              <Card sx={{ mt: 3, p: 2 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Showing {transactions.length} of {pagination.total} transactions
                </Typography>
              </Card>
            )}

            {/* Refresh Button */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                sx={{ borderColor: '#735EAB', color: '#735EAB' }}
              >
                Refresh Transactions
              </Button>
            </Box>
          </Box>
        </Box>
      </main>
      <ClientFooter/>
    </div>
  );
} 