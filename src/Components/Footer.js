import React from 'react';
import { Container, Grid, Typography, IconButton, Divider } from '@mui/material';
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import NrityaSVG from './NrityaSVG';
import { styled } from '@mui/material/styles';





function Footer() {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));

  const ResponsiveTypography = styled(Typography)(({ theme }) => ({
    textTransform: 'none',
    color:'white',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem',
    },
  }));

  const socialIconStyle = { fontSize: '24px', color:  'white' , marginRight: '10px' };
  const linkStyle = { color: 'white' , marginRight: '10px' };

  return (
    <div style={{ backgroundColor: isDarkModeOn ? 'black' : 'black'}}>
      <Divider />
      <footer style={{ backgroundColor: isDarkModeOn ? 'black' : 'black', padding: '15px 0 0' }}>
        <Container>
          <Grid container justifyContent="space-between" alignItems="center">
          <Grid container justifyContent="center" py={1} >
          <ResponsiveTypography variant="h4">
            Discover the beat in your city!
          </ResponsiveTypography>

 
          </Grid>
            <Grid item xs={12} sm={12} md={12} textAlign="center" py={1}>
              <Typography variant="body1" style={{ textAlign: 'left',color: 'white'}}>
                Introducing India's first dance tech platform connecting dance enthusiasts with top dance studios in the city. Enjoy a free trial class at your chose dance studio and immerse yourself in the world of dance. Start your journey with us today! 
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} textAlign="center" py={1}>
              <Typography variant="h6" style={{ color:'white',fontSize: 20 }}>
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
              <Typography variant="h6" style={{color:'white',fontSize: 20 }}>
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
              <Typography variant="h6" style={{ color:'white' ,fontSize: 20}}>
                Quick Links
              </Typography>
              <Typography variant="body2">
                <a href="#/modifyStudios" style={linkStyle}>List Studios</a>
              </Typography>
              <Typography variant="body2">
                <a href="#/search/studios" style={linkStyle}>Search Studios</a>
              </Typography>
              <Typography variant="body2">
                <a href="#/kyc" style={linkStyle}>Creator's Account Kyc</a>
              </Typography>
              <Typography variant="body2">
                <a href="#/modifyInstructors" style={linkStyle}>Instructor listing</a>
              </Typography>
            </Grid>
          </Grid>
          
        </Container>

        <Grid justifyContent="center" py={1}
          style={{
            backgroundColor: isDarkModeOn ? 'black' : 'black',
            padding: '15px 0 8px',
            textAlign: 'center'
          }}
        >
            <Typography variant="body2" style={{fontSize: '12px', color: 'white' }}>
              &copy; 2024 Nritya. All Rights Reserved.</Typography>
          </Grid>
      </footer>
    </div>
  );
}

export default Footer;
