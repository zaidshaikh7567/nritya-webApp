'use client'

import React from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, Avatar } from '@mui/material';
import { FaHeart, FaUsers, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const ClientHeader = dynamic(() => import('../components/ClientHeader'), {
  ssr: false
});

const ClientFooter = dynamic(() => import('../components/ClientFooter'), {
  ssr: false
});

const AboutUs = () => {
  const stats = [
    { icon: <FaUsers size={30} />, number: "1000+", label: "Happy Dancers" },
    { icon: <FaMapMarkerAlt size={30} />, number: "50+", label: "Cities Covered" },
    { icon: <FaStar size={30} />, number: "500+", label: "Dance Studios" },
    { icon: <FaHeart size={30} />, number: "10000+", label: "Bookings Made" }
  ];

  const team = [
    {
      name: "Nritya Team",
      role: "Dance Enthusiasts",
      description: "A passionate team dedicated to connecting dancers with the best studios across India."
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          About Nritya
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          India&apos;s first dance tech platform connecting dance enthusiasts with top dance studios in the city
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          We believe that everyone deserves to discover the joy of dance. Our mission is to make dance accessible, 
          discoverable, and enjoyable for everyone across India. Whether you&apos;re a beginner looking for your first 
          class or an experienced dancer seeking new challenges, Nritya is your gateway to the vibrant world of dance.
        </Typography>
      </Box>

      {/* Stats Section */}
      <Box mb={8}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {stat.number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mission & Vision */}
      <Grid container spacing={6} mb={8}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Our Mission
            </Typography>
            <Typography variant="body1" color="text.secondary">
              To democratize access to quality dance education by connecting passionate dancers with the best 
              dance studios and instructors across India. We strive to create a vibrant community where every 
              dance enthusiast can find their perfect match.
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Our Vision
            </Typography>
            <Typography variant="body1" color="text.secondary">
              To become the leading dance discovery platform in India, fostering a culture where dance is 
              accessible to everyone, regardless of their location, background, or experience level.
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* What We Do */}
      <Box mb={8}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}>
          What We Do
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Studio Discovery
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We help you discover the best dance studios in your city with detailed profiles, 
                class schedules, and authentic reviews from real students.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Easy Booking
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Book free trial classes and workshops with just a few clicks. Get instant confirmations 
                and manage all your bookings through your personal dashboard.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Community Building
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Connect with fellow dance enthusiasts, share experiences, and discover new dance styles 
                through our vibrant and supportive community.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Team Section */}
      <Box>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}>
          Our Team
        </Typography>
        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto', 
                    mb: 3,
                    bgcolor: 'primary.main',
                    fontSize: '3rem'
                  }}
                >
                  N
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {member.name}
                </Typography>
                <Typography variant="h6" color="primary.main" gutterBottom>
                  {member.role}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {member.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Contact CTA */}
      <Box textAlign="center" mt={8}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Ready to Start Your Dance Journey?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Join thousands of dancers who have discovered their passion through Nritya
        </Typography>
        <Typography variant="h6" sx={{ 
          px: 4, 
          py: 2, 
          bgcolor: 'primary.main', 
          color: 'white',
          borderRadius: 2,
          cursor: 'pointer',
          display: 'inline-block',
          '&:hover': { bgcolor: 'primary.dark' }
        }}>
          Explore Studios
        </Typography>
      </Box>
        </Container>
      </main>
      <ClientFooter />
    </div>
  );
};

export default AboutUs; 