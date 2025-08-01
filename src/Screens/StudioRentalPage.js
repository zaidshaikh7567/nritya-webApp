import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Breadcrumbs, Link, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import StudioRentalCalendar from '../Components/StudioRentalCalendar';
import { useAuth } from '../context/AuthContext';
import Head from 'next/head';

function StudioRentalPage() {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const { currentUser } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const darkTheme = createTheme({
    palette: {
      mode: isDarkModeOn ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    // Set page title for CSR
    document.title = 'Studio Rental Management - Nritya';
    
    // Check if user is logged in and has studio owner permissions
    const checkAuthorization = async () => {
      try {
        // Simulate authorization check
        // In real implementation, you would check user roles/permissions
        if (currentUser) {
          // Check if user owns any studios
          // This would typically involve an API call to verify studio ownership
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Authorization check failed:', error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [currentUser]);

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4">Loading...</Typography>
        </Container>
      </ThemeProvider>
    );
  }

  if (!isAuthorized) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            You need to be logged in as a studio owner to access this page.
          </Alert>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            Studio Rental Management
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            Please log in with your studio owner account to manage rental availability and pricing.
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <>
      <Head>
        <title>Studio Rental Management - Nritya</title>
        <meta name="description" content="Manage your studio rental availability and pricing with our Calendly-like interface." />
        <meta name="keywords" content="studio rental, availability management, pricing, dance studio, booking" />
      </Head>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 2 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 3, color: 'text.secondary' }}>
            <Link color="inherit" href="/">
              Home
            </Link>
            <Link color="inherit" href="/creatorDashboard">
              Dashboard
            </Link>
            <Typography color="text.primary">Studio Rental</Typography>
          </Breadcrumbs>

          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ color: 'text.primary', mb: 1 }}>
              Studio Rental Management
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Manage your studio&apos;s availability and pricing for rentals. Set up time slots, 
              pricing, and availability schedules similar to Calendly.
            </Typography>
          </Box>

          {/* Main Component */}
          <StudioRentalCalendar />
        </Container>
      </ThemeProvider>
    </>
  );
}

export default StudioRentalPage; 