import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";

const EmptyState = () => {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      textAlign="center"
      padding={3}
    >
      <LocationOffIcon style={{ fontSize: 80, color: '#9e9e9e' }} />
      <Typography variant="h5" sx={{color: isDarkModeOn ? 'white' : 'black',}}gutterBottom>
        { "We don't serve this area."}
      </Typography>
      <br/>
      <Typography variant="p" sx={{color: isDarkModeOn ? 'white' : 'black',}}gutterBottom>
        { "Studio owners be first to list Studio and events in city."}
      </Typography>
      
    </Box>
  );
};

export default EmptyState;
