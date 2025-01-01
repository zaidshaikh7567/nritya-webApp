import React from "react";
import { Box, Typography } from '@mui/material';
import { BASEURL_PROD } from '../constants';
import QRCode from 'react-qr-code';
import venueIcon from "../assets/images/venue-icon.png";
import venueIconWhite from "../assets/images/venue-icon-white.png";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { GrShare } from "react-icons/gr";

function BookingLists({ bookingData, setCurrentClickTicket }) {
  const endpoint_url = BASEURL_PROD + "bookings/availFreeTrial/";
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  return (
    <Box sx={{ maxWidth: "600px", mx: 'auto', fontFamily: "Instrument Sans" }}>
      <Box onClick={() => setCurrentClickTicket(bookingData)} sx={{ cursor: 'pointer', borderRadius: 4, bgcolor: "#735EAB", boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}>
        <Box sx={{ px: 3, pt: 3, pb: 1, textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="h4" component="p" sx={{ fontWeight: 700, color: "white" }}>{bookingData.name_class}</Typography>
          <Typography variant="h6" component="p" sx={{ fontWeight: 600, color: '#D9D9D9' }}>Ticket for 1</Typography>
          <Typography component="p" sx={{ textAlign: { xs: 'center', sm: 'right' }, fontWeight: 700, color: '#D9D9D9' }}>
            Booking ID: {bookingData.id}
          </Typography>
        </Box>

        <Box sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, borderRadius: 3, bgcolor: isDarkModeOn ? "black" : 'white' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: "white" }}>
              <QRCode value={(endpoint_url + bookingData.id)} size={120} />
            </Box>
            <Typography variant="h6" component="p" sx={{ mt: 1, fontWeight: 600, color: isDarkModeOn ? "white" : 'black' }}>Admit 1 for once</Typography>
          </Box>



          <Box sx={{ flex: 1, display: "flex", justifyContent: 'center', alignItems: { xs: 'center', sm: "normal" } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" component="p" sx={{ flex: 1, mb: { xs: 5, sm: 0 }, fontWeight: 500, color: isDarkModeOn ? 'white' : 'black' }}>Valid till 31st Oct, 2024 ; 22:14:07</Typography>
              <Typography variant="h6" component="p" sx={{ color: isDarkModeOn ? 'white' : 'black', fontWeight: 600 }}>
                <img src={isDarkModeOn ? venueIconWhite : venueIcon} alt="Venue" style={{ width: "30px", height: "30px", marginRight: 4 }} />
                <span>Venue</span>
              </Typography>
              <Typography variant="h6" component="p" sx={{ fontWeight: 500, color: isDarkModeOn ? 'white' : 'black' }}>{bookingData.studio_address}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box>
        <Typography component="p" sx={{ mt: 1, color: isDarkModeOn ? "white" : 'black' }}>
          Check out the latest class timings <GrShare size={16} />
        </Typography>
      </Box>
    </Box>
  );
}

export default BookingLists;
