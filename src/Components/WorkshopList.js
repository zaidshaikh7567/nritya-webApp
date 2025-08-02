import React, { useEffect, useState } from "react";
import { Box, createTheme, ThemeProvider, Typography } from "@mui/material";
import { BASEURL_PROD } from "../constants";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { useRouter } from "next/navigation";
import axios from "axios";

const theme = createTheme({
  typography: {
    fontFamily: "Instrument Sans",
  },
});

function WorkshopList({ bookingData, setWorkshopClickTicket }) {
  const endpoint_url = BASEURL_PROD + "bookings/availFreeTrial/";
  const client_url  = "https://nritya-webapp-ssr-1-b3a1c0b4b8f2.herokuapp.com/"
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const router = useRouter();
  const [workshopDetails, setWorkshopDetails] = useState(null);

  // Calculate total quantity from items
  const totalQuantity = bookingData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  // Get the first item for display purposes
  const firstItem = bookingData?.items?.[0];
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "TBD";
    return timeString;
  };

  // Fetch workshop details
  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      if (bookingData?.workshop_id) {
        try {
          const response = await axios.get(`${BASEURL_PROD}crud/get_workshop_by_id/${bookingData.workshop_id}`);
          setWorkshopDetails(response.data);
        } catch (error) {
          console.error('Error fetching workshop details:', error);
        }
      }
    };

    fetchWorkshopDetails();
  }, [bookingData?.workshop_id]);

  const handleBookingClick = () => {
    // Navigate to ticket page
    router.push(`/ticket/${bookingData.booking_id}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          maxWidth: "600px",
          mx: "auto",
          fontFamily: "Instrument Sans",
          color: isDarkModeOn ? "white" : "black",
          mb: 3,
        }}
      >
        <Box
          onClick={handleBookingClick}
          sx={{
            cursor: "pointer",
            borderRadius: 4,
            bgcolor: "#735EAB",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0px 6px 8px 0px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <Box
            sx={{
              px: 3,
              pt: 3,
              pb: 1,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Typography
              variant="h4"
              component="p"
              sx={{
                fontFamily: "Instrument Sans",
                fontWeight: 700,
                color: "white",
              }}
            >
              {workshopDetails?.name || "Workshop Booking"}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{
                fontFamily: "Instrument Sans",
                fontWeight: 600,
                color: "#D9D9D9",
              }}
            >
              {totalQuantity} Ticket{totalQuantity !== 1 ? 's' : ''} Booked
            </Typography>
            <Typography
              component="p"
              sx={{
                textAlign: {
                  fontFamily: "Instrument Sans",
                  xs: "center",
                  sm: "right",
                },
                fontWeight: 700,
                color: "#D9D9D9",
              }}
            >
              Booking ID: {bookingData?.booking_id || "N/A"}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 3,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              borderRadius: 3,
              bgcolor: isDarkModeOn ? "black" : "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "white" }}>
                <QRCode
                  value={`${client_url}validate_workshop_bookings/${bookingData?.booking_id || "workshop-booking"}`}
                  size={120}
                />
              </Box>
              <Typography
                variant="h6"
                component="p"
                sx={{
                  fontFamily: "Instrument Sans",
                  mt: 1,
                  fontWeight: 600,
                  color: isDarkModeOn ? "white" : "black",
                }}
              >
                Total Amount: ₹{bookingData?.total_amount || 0}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: { xs: "center", sm: "normal" },
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                  sx={{
                    flex: 1,
                    mb: { xs: 5, sm: 0 },
                    display: "flex",
                    gap: "42px",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      component="p"
                      sx={{ fontFamily: "Instrument Sans", fontWeight: 600 }}
                    >
                      Date
                    </Typography>
                    <Typography
                      component="p"
                      sx={{ fontFamily: "Instrument Sans", fontWeight: 500 }}
                    >
                      {formatDate(firstItem?.date)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      component="p"
                      sx={{ fontFamily: "Instrument Sans", fontWeight: 600 }}
                    >
                      Time
                    </Typography>
                    <Typography
                      component="p"
                      sx={{ fontFamily: "Instrument Sans", fontWeight: 500 }}
                    >
                      {formatTime(firstItem?.time)}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="h6"
                  component="p"
                  sx={{
                    fontFamily: "Instrument Sans",
                    color: isDarkModeOn ? "white" : "black",
                    fontWeight: 600,
                  }}
                >
                  <img
                    src={isDarkModeOn ? "/assets/images/venue-icon-white.png" : "/assets/images/venue-icon.png"}
                    alt="Venue"
                    style={{ width: "30px", height: "30px", marginRight: 4 }}
                  />
                  <span>Items</span>
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  sx={{
                    fontFamily: "Instrument Sans",
                    fontWeight: 500,
                    color: isDarkModeOn ? "white" : "black",
                  }}
                >
                  {bookingData?.items?.length || 0} Event{bookingData?.items?.length !== 1 ? 's' : ''} Booked
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default WorkshopList;
