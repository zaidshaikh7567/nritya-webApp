import React from "react";
import { Box, createTheme, ThemeProvider, Typography } from "@mui/material";
import { BASEURL_PROD } from "../constants";
import QRCode from "react-qr-code";
import venueIcon from "../assets/images/venue-icon.png";
import venueIconWhite from "../assets/images/venue-icon-white.png";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";

const theme = createTheme({
  typography: {
    fontFamily: "Instrument Sans",
  },
});

function WorkshopList({ bookingData, setWorkshopClickTicket }) {
  const endpoint_url = BASEURL_PROD + "bookings/availFreeTrial/";
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          maxWidth: "600px",
          mx: "auto",
          fontFamily: "Instrument Sans",
          color: isDarkModeOn ? "white" : "black",
        }}
      >
        <Box
          onClick={() => setWorkshopClickTicket(bookingData)}
          sx={{
            cursor: "pointer",
            borderRadius: 4,
            bgcolor: "#735EAB",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
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
              {bookingData?.name_class || "NULL"}
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
              Ticket for {bookingData?.persons_allowed || "NULL"}
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
              Booking ID: {bookingData?.id || "NULL"}
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
                  value={endpoint_url + bookingData?.entity_id || ""}
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
                Admit 1 for once
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
                      NULL
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
                      NULL
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
                    src={isDarkModeOn ? venueIconWhite : venueIcon}
                    alt="Venue"
                    style={{ width: "30px", height: "30px", marginRight: 4 }}
                  />
                  <span>Venue</span>
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
                  {bookingData?.studio_address || "NULL"}
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
