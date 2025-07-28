'use client'

import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { FaUsers, FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaStar, FaMusic } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const ClientHeader = dynamic(() => import('../components/ClientHeader'), {
  ssr: false
});

const ClientFooter = dynamic(() => import('../components/ClientFooter'), {
  ssr: false
});

const OurServices = () => {
  const services = [
    {
      icon: <FaMusic size={40} />,
      title: "Dance Studio Discovery",
      description: "Find and connect with the best dance studios in your city. Browse through detailed profiles, class schedules, and instructor information."
    },
    {
      icon: <FaSearch size={40} />,
      title: "Advanced Search & Filter",
      description: "Search studios by location, dance style, price range, and availability. Find exactly what you're looking for with our comprehensive filters."
    },
    {
      icon: <FaCalendarAlt size={40} />,
      title: "Easy Booking System",
      description: "Book free trial classes and workshops with just a few clicks. Get instant confirmations and manage your bookings through your account."
    },
    {
      icon: <FaUsers size={40} />,
      title: "Community Features",
      description: "Connect with fellow dance enthusiasts, share experiences, and discover new dance styles through our vibrant community."
    },
    {
      icon: <FaMapMarkerAlt size={40} />,
      title: "Location-Based Services",
      description: "Find studios near you with our location-based search. Get directions and explore studios in your neighborhood."
    },
    {
      icon: <FaStar size={40} />,
      title: "Verified Reviews & Ratings",
      description: "Read authentic reviews from real students and see ratings to make informed decisions about your dance journey."
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box textAlign="center" mb={6}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Our Services
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
              India&apos;s first dance tech platform connecting dance enthusiasts with top dance studios in the city
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>
                      {service.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={8}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Ready to Start Your Dance Journey?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Join thousands of dancers who have discovered their passion through Nritya
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="h6" sx={{ 
                px: 4, 
                py: 2, 
                bgcolor: 'primary.main', 
                color: 'white',
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'primary.dark' }
              }}>
                Explore Studios
              </Typography>
              <Typography variant="h6" sx={{ 
                px: 4, 
                py: 2, 
                border: 2, 
                borderColor: 'primary.main',
                color: 'primary.main',
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'primary.main', color: 'white' }
              }}>
                Learn More
              </Typography>
            </Box>
          </Box>
        </Container>
      </main>
      <ClientFooter />
    </div>
  );
};

export default OurServices; 