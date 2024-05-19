import React from 'react';
import { Container, Grid, Typography, IconButton, Divider } from '@mui/material';
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';

function Footer() {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));

  const socialIconStyle = { fontSize: '24px', color: isDarkModeOn ? 'white' : 'black', marginRight: '10px' };
  const linkStyle = { color: isDarkModeOn ? 'white' : 'black', marginRight: '10px' };

  return (
    <div style={{ backgroundColor: isDarkModeOn ? 'black' : 'white' }}>
      <Divider />
      <footer style={{ background: isDarkModeOn ? 'black' : 'white', padding: '10px 0' }}>
        <Container>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} sm={6} md={3} textAlign="center" py={1}>
              <Typography variant="body2" style={{ color: isDarkModeOn ? 'white' : 'black' }}>
                India's first dedicated dance-tech connecting dance enthusiasts to dance studios. Learner's get a free trial from studio. Discover the beat in your city.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} textAlign="center" py={1}>
              <Typography variant="h6" style={{ color: isDarkModeOn ? 'white' : 'black',fontSize: 20 }}>
                Follow Us
              </Typography>
              <div>
                <IconButton component="a" href="https://www.instagram.com/nritya.co.in/" target="_blank" rel="noopener noreferrer" style={socialIconStyle}>
                  <FaInstagram className='genericHoverEffect' />
                </IconButton>
                <IconButton component="a" href="https://in.linkedin.com/company/nritya" target="_blank" rel="noopener noreferrer" style={socialIconStyle}>
                  <FaLinkedin className='genericHoverEffect' />
                </IconButton>
                <IconButton component="a" href="mailto:nritya.contact@gmail.com" style={socialIconStyle}>
                  <FaEnvelope />
                </IconButton>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3} textAlign="center" py={1}>
              <Typography variant="h6" style={{ color: isDarkModeOn ? 'white' : 'black',fontSize: 20 }}>
                About
              </Typography>
              <Typography variant="body2">
                <a href="#/aboutus" style={linkStyle}>About Us</a>
               </Typography>
               <Typography variant="body2">
                <a href="#/contactus" style={linkStyle}>Contact Us</a>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} textAlign="center" py={1}>
              <Typography variant="h6" style={{ color: isDarkModeOn ? 'white' : 'black' ,fontSize: 20}}>
                Quick Links
              </Typography>
              <Typography variant="body2">
                <a href="#/jobs" style={linkStyle}>Job Hire</a>
              </Typography>
              <Typography variant="body2">
                <a href="#/modifyStudios" style={linkStyle}>List Studios</a>
              </Typography>
              <Typography variant="body2">
                <a href="#/search/studios" style={linkStyle}>Search Studios</a>
              </Typography>
            </Grid>
          </Grid>
          <Grid container justifyContent="center" py={1}>
            <Typography variant="body2" style={{ fontFamily: 'Times-Roman', fontSize: 12, color: isDarkModeOn ? 'white' : 'black' }}>
              &copy; Nritya@2024
            </Typography>
          </Grid>
        </Container>
      </footer>
    </div>
  );
}

export default Footer;
