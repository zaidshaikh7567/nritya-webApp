import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Box, Grid, CircularProgress, LinearProgress, Typography, Button, Chip, Divider, Dialog, DialogTitle, DialogContent, Card, CardContent, DialogActions, FormControlLabel, Checkbox, TextField } from "@mui/material";
import  Dance8  from '../Components/DanceImg/Dance8.jpg';
import { readDocumentWithImageUrl } from '../utils/firebaseUtils';
import { BASEURL_PROD, STORAGES } from '../constants';
import MediaDisplay from '../Components/MediaDisplay';
import ShareButton from "../Components/ShareButton";
import { CHIP_LEVELS_DESIGN } from "../constants";
import nearby from '../assets/images/nearby.png';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { formatDateString } from '../utils/common';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import RoomIcon from '@mui/icons-material/Room';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import inrIcon from '../assets/images/inr.png'; // Adjust the path as necessary
import locationIcon from '../assets/images/location.png';
import clockIcon from '../assets/images/clock.png';
import { RoomServiceOutlined } from '@mui/icons-material';
import EventBookingDialog from './EventBookingDialog';
import {convertTo12HourFormat} from '../utils/timeUtils';

const findMinTime = (data, targetDate) => {
  let minTime = Infinity; 

  for (const variant of data.variants) {
    const variantStartDate = variant.date;


    if (variantStartDate === targetDate) {
      const variantTime = variant.time;
      if (variantTime < minTime || minTime === Infinity) {
        minTime = variantTime;
      }
    }
  }

  return minTime;
};



function NewWorkshop() {
    const { workshopId } = useParams();
    const [workshopData, setWorkshopData] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [imageUrl, setImageUrl] = useState(Dance8);
    const isDarkModeOn = useSelector(selectDarkModeStatus);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isBooking, setIsBooking] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem("userInfo"))?.UserId;

    const shareUrl = window.location.href;

    const handleBook = async () => {
        console.log("Booking workshop...");
    }

    useEffect(() => {
        const fetchWorkshopData = async () => {
            try {
                const url = `${BASEURL_PROD}crud/get_workshop_by_id/${workshopId}`;
                const response = await fetch(url);
                console.log("Workshop ", url);
                if (!response.ok) {
                    throw new Error('Failed to fetch workshop data');
                }
                const data = await response.json();

               
                
                console.log("Workshop data response", data);
                setWorkshopData(data);

                if (data && data.variants) {
                  const targetDate = data.start_date
                  const time = findMinTime(data, targetDate);
                  
                  setStartTime(time); // Set the minimum time in state
                }

                
                
            } catch (error) {
                console.error('Error fetching workshop data:', error);
            }
        };

        fetchWorkshopData();
         const fetchImage = async () => {
              const url = await readDocumentWithImageUrl(STORAGES.WORKSHOPICON, workshopId);
              setImageUrl(url);
            };
            fetchImage();
    }, [workshopId]);


      const [openDialog, setOpenDialog] = useState(false);
      
    
      const handleBookNow = () => setOpenDialog(true);
      const handleCloseDialog = () => {
        setOpenDialog(false);
      };
    



  return (

    <Box
        sx={{
          padding: "0rem",
        
          color: isDarkModeOn ? "white" : "black",
        }}
      >
        <Grid container spacing={2} marginBottom={2} >
            <Grid item xs={12} lg={8} sx={{ display: "flex", flexDirection: "column" }}>
              <img
                  src={imageUrl || "https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"}
                  alt={workshopData?.name || "Entity Image"}
                  style={{ width: "100%", height: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
                  
                />
            </Grid>
            <Grid item xs={12} lg={4} sx={{ display: "flex", flexDirection: "column" }}> 
              <Box
                sx={{
                  bgcolor: isDarkModeOn ? "black" : "",
                  boxShadow: '3',
                  p: 3,
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "space-between",
                  
                  flex: 1,
                }}
              >
                {/* Entity Info */}
                <Box>
                  <Typography variant="h4" style={{ color: isDarkModeOn ? 'white' : 'black', textTransform: 'none',textTransform: 'none', textDecoration: 'none' }}>
                    {workshopData?.name || workshopData?.courseName || workshopData?.workshopName || workshopData?.openClassName|| "Open Class Name"}
                  </Typography>
                  <br />

                <Box >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <CalendarMonthOutlinedIcon sx={{ color: '#735eab' }} />
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1" style={{ color: isDarkModeOn ? 'white' : 'black',textTransform: 'none', textDecoration:'none' }}>
                                {workshopData?.start_date && formatDateString(workshopData?.start_date) } - {workshopData?.end_date && formatDateString(workshopData?.end_date) }
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid style={{paddingTop:'0.5rem'}} container spacing={2} alignItems="center">
                        <Grid item>
                        {clockIcon ? (
                            <img 
                                src={clockIcon} 
                                alt="Location" 
                                style={{ width: 24, height: 24 }} // Adjust size as needed
                            />
                        ) : (
                          <AccessTimeOutlinedIcon style={{  color: '#735eab' }} />
                        )}
                            
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1" style={{ color: isDarkModeOn ? 'white' : 'black', textTransform:'none' }}>
                                {startTime ? convertTo12HourFormat(startTime) + " onwards" : ""} 
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid style={{paddingTop:'0.5rem'}} container spacing={2} alignItems="center">
                        <Grid item>
                        {locationIcon ? (
                            <img 
                                src={locationIcon} 
                                alt="Location" 
                                style={{ width: 24, height: 24 }} // Adjust size as needed
                            />
                        ) : (
                          <RoomIcon sx={{ color: '#735eab' }} />
                        )}
                            
                        </Grid>
                        <Grid item>
                            <Typography
                                variant="body1"
                                sx={{ color: isDarkModeOn ? 'white' : 'black' }}
                            >
                                {`${workshopData?.buildingName || ''}${workshopData?.buildingName ? ', ' : ''}${workshopData?.street || ''}${workshopData?.street ? ', ' : ''}${workshopData?.city || 'Address'}`}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid  style={{paddingTop:'0.5rem'}} container spacing={2} alignItems="center">
                        <Grid item>
                        {inrIcon ? (
                            <img 
                                src={inrIcon} 
                                alt="INR" 
                                style={{ width: 24, height: 24 }} // Adjust size as needed
                            />
                        ) : (
                          <FontAwesomeIcon style={{paddingLeft:'0.35rem', color: '#735eab' }} icon={faIndianRupeeSign} />
                        )}
                            
                        </Grid>
                        <Grid item>
                          <Typography variant="body1" style={{ color: isDarkModeOn ? 'white' : 'black' }}>
                            {workshopData?.min_price ? `${workshopData?.min_price} onwards` : 'Free'}
                          </Typography>
                        </Grid>

                    </Grid>
                </Box>

                </Box>

                {/* Booking Section */}
                <Box
                  sx={{
                    mt: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    color: isDarkModeOn ? 'white' : 'black'
                  }}
                >

                  {/* Book Now Button */}
                  <Button
                    variant="contained"
                    onClick={handleBookNow}
                    sx={{
                      textTransform: "none",
                      fontSize: 16,
                      padding: "8px 16px",
                      backgroundColor: "#735EAB",
                      color:"white",
                      fontWeight: 'bold',
                      "&:hover": {
                        backgroundColor: "#96ab5e",
                      },
                    }}
                  >
                    {currentUser ? `Book @₹${workshopData?.min_price} onwards` : `Login to Book @₹${workshopData?.min_price}`}
                  </Button>
                </Box>
              </Box>
          

              {isBooking && <LinearProgress/> }
            </Grid>
        </Grid>

        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} lg={8}>
          <Grid container spacing={1}>
            {/* Row 1: About with Share Button */}
            <Grid item xs={12} >
              <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2 }}>
                <Typography
                  variant="h4"
                  style={{ color: isDarkModeOn ? 'white' : 'black', textTransform: 'none', borderBottom: '4px solid #735eab', // Change thickness and color here
                    display: 'inline-block', // Ensures the underline wraps around the text
                }}
                  
                >
                  About
                </Typography>
                <ShareButton shareUrl={shareUrl} />
              </Box>
            </Grid>

            {/* Row 2: Kuchipudi */}
            <Grid item xs={12} >
            {workshopData?.dance_styles && workshopData?.dance_styles.length > 0 && (
            <>
              {workshopData?.dance_styles.split(",").map((style, index) => (
                <Chip
                  key={index}
                  label={style}
                  sx={{
                    bgcolor: index % 2 === 0 ? '#44367d'   // purple
                                    : index % 2 === 1 ? '#96ab5e'   // 
                                
                                    : '#64b5f6',                     // Blue
                    color: 'white',
                    marginRight: '0.5rem',
                    fontSize: '0.8rem',
                    fontWeight: 'bold' ,
                    "&:hover":{
                    transform: 'translate(0.3rem, -0.1rem)'
                  }
                  }}
                />
              ))}
            </>
              )}
            </Grid>

            {/* Row 3: Level */}
            <Grid item xs={12}>
              <Chip
                sx={{
                  marginLeft: "10px",
                  marginBottom: "10px",
                  fontSize: "0.8rem",
                  bgcolor: CHIP_LEVELS_DESIGN[workshopData?.level || "All"]?.backgroundColor,  // Set the background color
                  color: CHIP_LEVELS_DESIGN[workshopData?.level ||  "All"]?.color,  // Set the text color
                  fontWeight: 'bold', 
                }}
                label={workshopData?.level ||  "All"}
              />
            </Grid>
            <Grid item xs={12}>
            <Divider
                    sx={{
                      "&.MuiDivider-root": {
                        "&::before": {
                          border: `thin solid #735eaf`,
                        },
                        "&::after": {
                          border: `thin solid #735eaf`,
                        },
                      },
                    }}
                  >
                    Description
                  </Divider>

          </Grid>

          
            {/* Row 4: Description */}
            <Grid item xs={12}>
              <div
                style={{ color: isDarkModeOn ? 'white' : 'black' }}
                className="description-box"
                dangerouslySetInnerHTML={{ __html: workshopData?.description || "Workshop Description" }}
              />
            </Grid>
          </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
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
            <Typography
              variant="h5"
              style={{ color: isDarkModeOn ? 'white' : 'black', textTransform: 'none' }}
            >
              Venue
            </Typography>
          </Box>
          <Grid item xs={12}>
          <Typography
            variant="body1"
            sx={{ color: isDarkModeOn ? 'white' : 'black', marginTop: 1 }}
          >
            {`${workshopData?.building|| ''}${workshopData?.buildingName ? ', ' : ''}${workshopData?.street || ''}${workshopData?.street ? ', ' : ''}${workshopData?.city || 'Address'}`}
          </Typography>
          </Grid>
          <Grid item xs={12} style={{ paddingTop: '2rem' }}>
            {workshopData?.geolocation?.lat !== undefined && workshopData?.geolocation?.lng !== undefined && (
              <Button
                variant="contained"
                href={`https://www.google.com/maps/dir/?api=1&destination=${workshopData?.geolocation?.lat},${workshopData?.geolocation?.lng}`}
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
          </Grid>
        </Grid>
        <EventBookingDialog
        open={openDialog}
        onClose={handleCloseDialog}
        workshopData={workshopData}

      />
      </Box>

  )
}

export default NewWorkshop
