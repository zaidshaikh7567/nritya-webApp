import React from "react";
import { Box, Typography, Button } from '@mui/material';
import QRCode from 'react-qr-code';
import { BASEURL_PROD } from '../constants';
import venueIcon from "../assets/images/venue-icon.png";
import venueIconWhite from "../assets/images/venue-icon-white.png";
// import shareIcon from "../assets/images/share-icon.png";
import backIcon from "../assets/images/back-icon.png";
import directionIcon from "../assets/images/direction-icon.png";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { GrShare } from "react-icons/gr";
import nearby from '../assets/images/nearby.png';

function BookingInformation({ currentClickTicket, setCurrentClickTicket }) {

  const endpoint_url = BASEURL_PROD + "bookings/availFreeTrial/";
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  return (
    <Box sx={{ mt: { xs: 10, md: 0 }, position: 'relative', maxWidth: "600px", mx: 'auto', fontFamily: "Instrument Sans" }}>
        <Button onClick={() => setCurrentClickTicket(null)} sx={{ position: 'absolute', top: { xs: -80, md: 0 }, left: { xs: -15, md: -100 }, '&:active': { bgcolor: 'transparent' } }}>
          <img src={backIcon} alt='back' style={{ width: "50px", height: "50px" }} />
        </Button>

        <Box sx={{ borderRadius: 4, bgcolor: "#735EAB", boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}>
          <Box sx={{ px: 3, pt: 3, pb: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700, color: "white" }}>{currentClickTicket.name_class}</Typography>
            <Typography variant="h6" component="p" sx={{ fontWeight: 600, color: '#D9D9D9' }}>Ticket for 1</Typography>
            <Typography component="p" sx={{ textAlign: { xs: 'center', sm: 'right' }, fontWeight: 700, color: '#D9D9D9' }}>
              Booking ID: {currentClickTicket.id}
            </Typography>
          </Box>

          <Box sx={{ p: 3, borderRadius: 3, bgcolor: isDarkModeOn ? "black" : 'white', color: isDarkModeOn ? "white" : 'black' }}>
            <Box sx={{ display: { xs: 'block', md: 'flex' } }}>
              <Box sx={{ flexShrink: 0, textAlign: 'center' }}>
                <Box sx={{ p: 1, display: 'inline-block', borderRadius: 2, bgcolor: "white" }}>
                  <QRCode value={(endpoint_url + currentClickTicket.id)} size={120} />
                </Box>
                 <Typography variant="h6" component="p" sx={{ mt: 1, fontWeight: 600, fontWeight: 600 }}>Admit 1 for once</Typography>
              </Box>

              <Box sx={{ mb: { xs: 2, md: 0 }, flexGrow: 1, display: 'flex', justifyContent: { xs: 'center', md: 'end' }, alignItems: 'center' }}>
                <Typography component="p" sx={{ fontSize: 18, fontWeight: 500 }}>
                  Valid till 31st Oct, 2024 ; 22:14:07
                </Typography>
              </Box>
            </Box>

            <Typography component="p" sx={{ fontWeight: 500 }}>
              Check out the latest class timings <GrShare size={16} />
            </Typography>

            <Typography variant="h6" component="p" sx={{ fontWeight: 600 }}>
              <img src={isDarkModeOn ? venueIconWhite : venueIcon} alt="Venue" style={{ width: "30px", height: "30px", marginRight: 4 }} />
              <span>Venue</span>
            </Typography>

            <Box sx={{ mt: 2, display: { xs: 'block', md: 'flex' }, columnGap: 3 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
                {currentClickTicket.studio_address}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: { xs: 2, md: 0 },
                  alignSelf: 'center',
                  textTransform: "none",
                  fontSize: 16,
                  padding: "8px 16px",
                  backgroundColor: "#735EAB",
                  color: 'white',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#96ab5e",
                  },
                }}
                endIcon={
                  <img
                    src={nearby}
                    alt="Directions button"
                    style={{ width: "24px", height: "24px" }}
                  />
                }
              >
                Get Directions
              </Button>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontWeight: 700 }}>Booking Details</Typography>
              <Typography>
                <span>{currentClickTicket?.name_learner || ""}</span><br />
                <span>+91-6392074436</span><br />
                <span>{currentClickTicket?.email_learner ||  ""}</span><br />
                <span style={{ display: 'inline-block', marginTop: 8 }}>Booked on Mar 16, 2024, 12:49 PM</span>
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontWeight: 700 }}>Payment Details</Typography>
              <Typography sx={{ fontSize: 26, fontWeight: 700 }}>FREE</Typography>
            </Box>
          </Box>
        </Box>
    </Box>
  );
}

export default BookingInformation;