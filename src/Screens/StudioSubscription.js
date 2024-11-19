import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography, Box, Paper } from '@mui/material';
import { AccessTime as AccessTimeIcon } from '@mui/icons-material';

import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";

export default function StudioSubscription() {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const theme = createTheme({
    palette: {
      mode: isDarkModeOn ? 'dark' : 'light',
      background: {
        default: isDarkModeOn ? '#202020' : '#fafafa',
        paper: isDarkModeOn ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDarkModeOn ? 'white' : '#000000'
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: '75vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: 'background.default',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: "50%",
            borderRadius: 4,
            boxShadow: 3,
            backgroundColor: 'background.paper',
          }}
        >
          <Box textAlign="center" sx={{ mb: 2 }}>
            <AccessTimeIcon htmlColor="#735EAB" sx={{ fontSize: 50 }} />
          </Box>

          <Typography align="center" variant="h4" color="#735EAB" gutterBottom>
            Trial Mode
          </Typography>

          <Typography variant="h6" color="text.primary" align="center" paragraph>
            You are currently using the application in trial mode.
          </Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
