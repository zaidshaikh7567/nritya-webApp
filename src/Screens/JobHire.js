import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Box, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';

const theme = createTheme();

const JobHire = () => {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const jobList = []; // Example job list. Replace with actual job data from state or props.

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          padding: theme.spacing(4),
          backgroundColor: isDarkModeOn ? '#202020' : 'white',
          color: isDarkModeOn ? 'white' : 'black',
          minHeight: '75vh',
        }}
      >
        <Typography
          variant="h5"
          sx={{ marginBottom: theme.spacing(2), color: isDarkModeOn ? 'white' : theme.palette.primary.main }}
        >
          Job Openings
        </Typography>
        {jobList.length === 0 ? (
          <Box sx={{ textAlign: 'center', marginTop: theme.spacing(4) }}>
            <Typography variant="h6" sx={{ color: isDarkModeOn ? 'white' : 'black' }}>
              Job openings coming soon!
            </Typography>
          </Box>
        ) : (
          <Paper sx={{ padding: theme.spacing(2), backgroundColor: isDarkModeOn ? '#333' : 'white', color: isDarkModeOn ? 'white' : 'black' }}>
            <List>
              {jobList.map((job, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={job.title}
                    secondary={job.description}
                    primaryTypographyProps={{ style: { color: isDarkModeOn ? 'white' : 'black' } }}
                    secondaryTypographyProps={{ style: { color: isDarkModeOn ? 'white' : 'black' } }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default JobHire;
