'use client'

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  TextareaAutosize,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const ClientHeader = dynamic(() => import('../components/ClientHeader'), {
  ssr: false
});

const ClientFooter = dynamic(() => import('../components/ClientFooter'), {
  ssr: false
});

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [subject, setSubject] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // You can add API call here
  };

  const contactInfo = [
    {
      icon: <FaPhone size={24} />,
      title: "Phone",
      details: "+91 6392074436",
      link: "tel:+916392074436"
    },
    {
      icon: <FaEnvelope size={24} />,
      title: "Email",
      details: "nritya.contact@gmail.com",
      link: "mailto:nritya.contact@gmail.com"
    },
    {
      icon: <FaMapMarkerAlt size={24} />,
      title: "Address",
      details: "NrityaTech Solutions Pvt. Ltd., India",
      link: "#"
    },
    {
      icon: <FaClock size={24} />,
      title: "Business Hours",
      details: "Mon - Fri: 9:00 AM - 6:00 PM",
      link: "#"
    }
  ];

  const subjects = [
    "General Inquiry",
    "Studio Registration",
    "Technical Support",
    "Partnership",
    "Feedback",
    "Other"
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
          Contact Us
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Get in touch with us. We&apos;d love to hear from you!
        </Typography>
      </Box>

      <Grid container spacing={6}>
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Get In Touch
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Have questions about our services? Want to register your dance studio? 
            Need technical support? We&apos;re here to help!
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            {contactInfo.map((info, index) => (
              <Card key={index} sx={{ mb: 2, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: 'primary.main' }}>
                    {info.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {info.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      component="a"
                      href={info.link}
                      sx={{ 
                        textDecoration: 'none',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      {info.details}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          {/* WhatsApp Contact */}
          <Card sx={{ p: 3, bgcolor: '#25D366', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FaWhatsapp size={24} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  WhatsApp Support
                </Typography>
                <Typography variant="body2">
                  Get instant support via WhatsApp
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
              Send us a Message
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={subject}
                      label="Subject"
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    >
                      {subjects.map((subj) => (
                        <MenuItem key={subj} value={subj}>
                          {subj}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    multiline
                    rows={6}
                    variant="outlined"
                    placeholder="Tell us how we can help you..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Box mt={8}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 6 }}>
          Frequently Asked Questions
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                How do I register my dance studio?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You can register your dance studio by clicking on &quot;List Studios&quot; in the footer or 
                contacting us directly. We&apos;ll guide you through the registration process.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                How do I book a dance class?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Browse through our list of studios, select your preferred class, and click on &quot;Book Now&quot;. 
                You&apos;ll receive a confirmation email with all the details.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                What payment methods do you accept?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We accept various payment methods including credit cards, debit cards, UPI, and net banking. 
                All transactions are secure and encrypted.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Can I cancel my booking?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please refer to our cancellation policy. Currently, we do not allow customer cancellations, 
                but studios may cancel classes due to unforeseen circumstances.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
        </Container>
      </main>
      <ClientFooter />
    </div>
  );
};

export default ContactUs; 