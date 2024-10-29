import React, { useEffect } from "react";
import { Grid, Typography as MUITypography, Box, IconButton,Button, Chip } from "@mui/material";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { useSelector } from "react-redux";
import { FaDirections } from "react-icons/fa";
import locationIcon from '../assets/images/location.png';
import { RoomServiceOutlined } from "@mui/icons-material";
import nearby from '../assets/images/nearby.png';

function EntityVenueBox({dataItem}) {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
  return (
    <Grid item>
        <Box
          sx={{
            bgcolor: isDarkModeOn ? "black" : "",
            boxShadow: '3',
            p: 2,
            borderRadius: '8px',
          }}
        >
          <Box display="flex" alignItems="center">
            <Grid item>
              {locationIcon ? (
                <img 
                  src={locationIcon} 
                  alt="Location" 
                  style={{ width: 24, height: 24 }} // Adjust size as needed
                />
              ) : (
                <RoomServiceOutlined sx={{ color: '#735eab' }} />
              )}
            </Grid>
            <MUITypography
              variant="h5"
              style={{ color: isDarkModeOn ? 'white' : 'black', textTransform: 'none' }}
            >
              Venue
            </MUITypography>
          </Box>
          <Grid item xs={12}>
          <MUITypography
            variant="body1"
            sx={{ color: isDarkModeOn ? 'white' : 'black', marginTop: 1 }}
          >
            {`${dataItem?.studioDetails?.buildingName || ''}${dataItem?.studioDetails?.buildingName ? ', ' : ''}${dataItem?.studioDetails?.street || ''}${dataItem?.studioDetails?.street ? ', ' : ''}${dataItem?.studioDetails?.city || 'Address'}`}
          </MUITypography>
          </Grid>
          <Grid item xs={12} style={{ paddingTop: '2rem' }}>
  {dataItem?.studioDetails?.geolocation?.lat !== undefined && dataItem?.studioDetails?.geolocation?.lng !== undefined && (
    <Button
      variant="contained"
      href={`https://www.google.com/maps/dir/?api=1&destination=${dataItem?.studioDetails?.geolocation?.lat},${dataItem?.studioDetails?.geolocation?.lng}`}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        textTransform: "none",
        fontSize: 16,
        padding: "8px 16px",
        backgroundColor: "#735EAB",
        color: "white !important",
        fontWeight: "bold",
        width: "100%", // Makes the button full-width
        "&:hover": {
          backgroundColor: "#96ab5e", // Prevents color change on hover
        },
      }}
      endIcon={
        <img
          src={nearby} // Replace with your image URL or import
          alt="Directions"
          style={{ width: "24px", height: "24px", filter: isDarkModeOn ? 'invert(1)' : 'none' }} // Adjust size as needed
        />
      }
    >
      Get Directions
    </Button>
  )}
</Grid>

        </Box>
      </Grid>
  )
}

export default EntityVenueBox
