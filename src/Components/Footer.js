import React from 'react';
import { Container, Grid, Typography, IconButton, Divider } from '@mui/material';
import { FaFacebook, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { styled } from '@mui/material/styles';





function Footer() {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const ResponsiveTypography = styled(Typography)(({ theme }) => ({
    textTransform: 'none',
    color: 'white',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem',
    },
  }));

  const socialIconStyle = { fontSize: '24px', color: 'white', marginRight: '10px' };
  const linkStyle = { color: 'white', marginRight: '10px' };

  return (
    <div style={{ backgroundColor: isDarkModeOn ? 'black' : 'black' }}>
      <Divider />
      <footer style={{ backgroundColor: isDarkModeOn ? 'black' : 'black', padding: '15px 0 0' }}>
        <Container>
          <Grid container justifyContent="space-between" columnGap={3} rowGap={3}>
            <Grid container justifyContent="center" py={1} >
              <ResponsiveTypography variant="h3" sx={{
                color: "gray", mb: 2, fontSize: { md: '5.49rem' },
                '@media (min-width: 301px) and (max-width: 400px)': {
                  fontSize: '1.3rem',  // Adjust for mobile devices
                },
                '@media (min-width: 401px) and (max-width: 500px)': {
                  fontSize: '1.7rem',  // Adjust for mobile devices
                },
                '@media (min-width: 501px) and (max-width: 600px)': {
                  fontSize: '2.2rem',  // Adjust for mobile devices
                },
                '@media (min-width: 601px) and (max-width: 700px)': {
                  fontSize: '2.63rem', // Adjust for mobile devices
                },
                '@media (min-width: 701px) and (max-width: 800px)': {
                  fontSize: '3.11rem', // Adjust for mobile devices
                },
                '@media (min-width: 785px) and (max-width: 960px)': {
                  fontSize: '3.5rem', // Adjust for tablets
                },
                '@media (min-width: 961px) and (max-width: 1242px)': {
                  fontSize: '4.2rem', // Adjust for small laptops
                },
                '@media (min-width: 1281px)': {
                  fontSize: '5.4rem', // For larger screens
                }
              }}>
                Discover the beat in your city!
              </ResponsiveTypography>

            </Grid>
            {/* <Grid item xs={12} sm={12} md={12} textAlign="center" py={1}>
              
            </Grid> */}
            <Grid item xs={12} sm={6} md={3} textAlign="left" py={1}>
              <Typography variant="body1" style={{ color: 'white' }}>
                Introducing India&apos;s first dance tech platform connecting dance enthusiasts with top dance studios in the city.
              </Typography>

              <div style={{ marginTop: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton
                  component="a"
                  href="https://www.instagram.com/nritya.co.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...socialIconStyle, fontSize: '2.2rem' }} 
                  sx={{ paddingLeft: 0 }}
                >
                  <FaInstagram className='genericHoverEffect' />
                </IconButton>
                <IconButton
                  component="a"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...socialIconStyle, fontSize: '2.2rem' }} 
                >
                  <FaFacebook className='genericHoverEffect' />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://in.linkedin.com/company/nritya"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...socialIconStyle, fontSize: '2.2rem' }} 
                >
                  <FaLinkedin className='genericHoverEffect' />
                </IconButton>
                <IconButton
                  component="a"
                  href="mailto:nritya.contact@gmail.com"
                  style={{ ...socialIconStyle, fontSize: '2.2rem' }} 
                >
                  <FaEnvelope />
                </IconButton>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3} py={1}>
              <Typography variant="h6" style={{ color: 'white', fontSize: 20 }}>
                Quick Links
              </Typography>
              <Typography variant="body2">
                <a href="#/ourServices" style={linkStyle}>Our Services</a>
              </Typography>
              <Typography variant="body2">
                <a href="#/modifyStudios" style={linkStyle}>List Studios</a>
              </Typography>
              <Typography variant="body2">
                <a href="#/search/studios" style={linkStyle}>Search Studios</a>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3} py={1}>
              <Typography variant="h6" style={{ color: 'white', fontSize: 20 }}>
                Company
              </Typography>
              <Typography variant="body2">
                <a href="#/npolicies/0" style={linkStyle}>Privacy Policy</a>
              </Typography>
              <Typography variant="body2">
                <a href="#/npolicies/1" style={linkStyle}>Terms and Conditions</a>
              </Typography>
              <Typography variant="body2">
                <a href="#/npolicies/2" style={linkStyle}>Cancellation & Refund</a>
              </Typography>
              <Typography variant="body2">
                <a href="#/npolicies/3" style={linkStyle}>Service Delivery</a>
              </Typography>
              <Typography hidden variant="body2">
                <a href="#/aboutus" style={linkStyle}>About Us</a>
              </Typography>
              <Typography variant="body2" sx={{textDecoration: 'none'}}>
                <a href="#/contactus" style={linkStyle}>Contact Us</a>
              </Typography>
            </Grid>
          </Grid>

        </Container>

        <Grid justifyContent="center"
          style={{
            backgroundColor: isDarkModeOn ? 'black' : 'black',
            padding: '15px 0',
            textAlign: 'center'
          }}
        >
          <Typography variant="body1" style={{ color: 'white' }}>
            &copy; 2024 NrityaTech Solutions Pvt. Ltd. All Rights Reserved.</Typography>
        </Grid>
      </footer>
    </div>
  );
}

export default Footer;