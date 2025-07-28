import React from 'react';
import { Container, Grid, Typography, Paper, Box, Stepper, Step, StepLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
// import aboutUsImage from '../assets/aboutUsImage.jpg'; // Add an image to the assets folder

const theme = createTheme();

function AboutUs() {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const steps = [
    'March 2023: Idea formulated',
    'Nov 2023: Company Registered',
    'June 2024: Logo Trademarked',
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          padding: theme.spacing(4),
          backgroundColor: isDarkModeOn ? '#202020' : 'white',
          color: isDarkModeOn ? 'white' : 'black',
          minHeight: '100vh',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{ marginBottom: theme.spacing(2), color: isDarkModeOn ? 'white' : theme.palette.primary.main }}
            >
              About Nritya
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: isDarkModeOn ? 'white' : theme.palette.primary.main,
                marginBottom: theme.spacing(2),
              }}
            >
              Discover the beat in your city.
            </Typography>
            <Typography variant="body1" paragraph>
              Nritya is India&apos;s first dance tech community that connects dance enthusiasts to dance studios across the country. We are dedicated to promoting dance as a form of art and fitness by leveraging technology to create a vibrant community of learners and performers.
            </Typography>
            <Typography variant="body1" paragraph>
              Our platform offers a seamless way to discover and book dance classes, providing learners with opportunities to experience free trials from various dance studios. Whether you are a beginner or an experienced dancer, Nritya has something for everyone.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            sx={{ marginBottom: theme.spacing(2), textAlign: 'center', color: isDarkModeOn ? 'white' : theme.palette.primary.main }}
          >
            Our Journey from 0 to 1
          </Typography>
          <Stepper activeStep={-1} alternativeLabel >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <p style={{ color: isDarkModeOn ? 'white' : 'black' }}>{label}</p>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          </Grid>
        </Grid>
        <Box hidden sx={{ marginTop: theme.spacing(4) }}>
          <Paper
            sx={{
              padding: theme.spacing(4),
              textAlign: 'center',
              backgroundColor: isDarkModeOn ? '#333' : 'white',
              color: isDarkModeOn ? 'white' : 'black',
            }}
            elevation={3}
          >
            <Typography
              variant="h5"
              sx={{ marginBottom: theme.spacing(2), color: isDarkModeOn ? 'white' : theme.palette.primary.main }}
            >
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              Our mission is to democratize dance education and make it accessible to everyone. By bringing together a diverse community of dance enthusiasts and studios, we aim to foster a culture of learning, creativity, and expression through dance.
            </Typography>
          </Paper>
        </Box>
        <Box hidden sx={{ marginTop: theme.spacing(4) }}>
          <Paper
            sx={{
              padding: theme.spacing(4),
              textAlign: 'center',
              backgroundColor: isDarkModeOn ? '#333' : 'white',
              color: isDarkModeOn ? 'white' : 'black',
            }}
            elevation={3}
          >
            <Typography
              variant="h5"
              sx={{ marginBottom: theme.spacing(2), color: isDarkModeOn ? 'white' : theme.palette.primary.main }}
            >
              Our Vision
            </Typography>
            <Typography variant="body1" paragraph>
              We envision a world where dance is celebrated and accessible to all, breaking barriers and building connections across cultures and communities. Nritya aspires to be the leading platform for dance enthusiasts to learn, grow, and connect with like-minded individuals.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default AboutUs;
