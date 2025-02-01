import React from "react";
import {
  Box,
  Typography,
  Button,
  ThemeProvider,
  createTheme,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import QRCode from "react-qr-code";
import { BASEURL_PROD } from "../constants";
import venueIcon from "../assets/images/venue-icon.png";
import venueIconWhite from "../assets/images/venue-icon-white.png";
import backIcon from "../assets/images/back-icon.png";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import nearby from "../assets/images/nearby.png";

const theme = createTheme({
  typography: {
    fontFamily: "Instrument Sans",
  },
});

function WorkshopInformation({ workshopClickTicket, setWorkshopClickTicket }) {
  const endpoint_url = BASEURL_PROD + "bookings/availFreeTrial/";
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          mt: { xs: 10, md: 0 },
          position: "relative",
          maxWidth: "600px",
          mx: "auto",
          fontFamily: "Instrument Sans",
        }}
      >
        <Button
          onClick={() => setWorkshopClickTicket(null)}
          sx={{
            position: "absolute",
            top: { xs: -80, md: 0 },
            left: { xs: -15, md: -100 },
            "&:active": { bgcolor: "transparent" },
          }}
        >
          <img
            src={backIcon}
            alt="back"
            style={{ width: "50px", height: "50px" }}
          />
        </Button>

        <Box
          sx={{
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
              sx={{ fontWeight: 700, color: "white" }}
            >
              {workshopClickTicket?.entity_name || ""}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{ fontWeight: 600, color: "#D9D9D9" }}
            >
              Ticket for {workshopClickTicket?.persons_allowed}
            </Typography>
            <Typography
              component="p"
              sx={{
                textAlign: { xs: "center", sm: "right" },
                fontWeight: 700,
                color: "#D9D9D9",
              }}
            >
              Booking ID: {workshopClickTicket?.id || ""}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: isDarkModeOn ? "black" : "white",
              color: isDarkModeOn ? "white" : "black",
            }}
          >
            <Box sx={{ display: { xs: "block", md: "flex" } }}>
              <Box sx={{ flexGrow: 1, textAlign: "center" }}>
                <Box
                  sx={{
                    p: 1,
                    display: "inline-block",
                    borderRadius: 2,
                    bgcolor: "white",
                  }}
                >
                  <QRCode
                    value={endpoint_url + workshopClickTicket?.entity_id || ""}
                    size={120}
                  />
                </Box>
                <Typography
                  variant="h6"
                  component="p"
                  sx={{ mt: 1, fontWeight: 600 }}
                >
                  Admit 1 for once
                </Typography>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  mt: { xs: 2, md: 0 },
                  display: { xs: "flex", md: "block" },
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    component="p"
                    sx={{ fontWeight: 600, fontSize: "18px" }}
                  >
                    Date
                  </Typography>
                  <Typography
                    variant="h6"
                    component="p"
                    sx={{ fontWeight: 500, fontSize: "14px" }}
                  >
                    25th Oct, 2024
                  </Typography>
                  <Typography
                    variant="h6"
                    component="p"
                    sx={{ fontWeight: 600, fontSize: "18px" }}
                  >
                    Time
                  </Typography>
                  <Typography
                    variant="h6"
                    component="p"
                    sx={{ fontWeight: 500, fontSize: "14px" }}
                  >
                    4:00 PM - 6:00 PM
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography
              variant="h6"
              component="p"
              sx={{ mt: "30px", fontWeight: 600 }}
            >
              <img
                src={isDarkModeOn ? venueIconWhite : venueIcon}
                alt="Venue"
                style={{ width: "30px", height: "30px", marginRight: 4 }}
              />
              <span>Venue</span>
            </Typography>

            <Box
              sx={{ mt: 2, display: { xs: "block", md: "flex" }, columnGap: 3 }}
            >
              <Typography sx={{ flexGrow: 1, fontSize: 18, fontWeight: 500 }}>
                {workshopClickTicket?.studio_address || ""}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  flexGrow: 1,
                  mt: { xs: 2, md: 0 },
                  alignSelf: "center",
                  textTransform: "none",
                  fontSize: 16,
                  padding: "8px 16px",
                  backgroundColor: "#735EAB",
                  color: "white",
                  fontWeight: 700,
                  textTransform: "uppercase",
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
              <Typography sx={{ mt: "21px" }}>
                <span>{workshopClickTicket?.name_learner || ""}</span>
                <br />
                <span>+91-6392074436</span>
                <br />
                <span>{workshopClickTicket?.email_learner || ""}</span>
                <br />
                <span style={{ display: "inline-block", marginTop: 8 }}>
                  Booked on Mar 16, 2024, 12:49 PM
                </span>
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 1,
                pt: "15px",
                px: "18px",
                borderRadius: "5px",
                bgcolor: "#D9D9D91A",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>Payment Details</Typography>
              <PaymentDetails />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const PaymentDetails = () => {
  return (
    <Table size="small" sx={{ mt: "10px", border: "none" }}>
      <TableBody sx={{ border: "none" }}>
        <TableRow sx={{ border: "none" }}>
          <TableCell sx={{ p: 0, border: "none", fontSize: "16px" }}>
            Ticket amount
          </TableCell>
          <TableCell
            sx={{ p: 0, border: "none", fontSize: "16px" }}
            align="right"
          >
            ₹1599.00
          </TableCell>
        </TableRow>
        <TableRow sx={{ border: "none" }}>
          <TableCell
            sx={{ p: 0, border: "none", fontSize: "16px", fontWeight: 600 }}
          >
            Booking Fee
          </TableCell>
          <TableCell
            sx={{ p: 0, border: "none", fontSize: "16px", fontWeight: 600 }}
            align="right"
          >
            ₹94.35
          </TableCell>
        </TableRow>
        <TableRow sx={{ border: "none" }}>
          <TableCell sx={{ p: 0, border: "none", fontSize: "16px" }}>
            Base Fee
          </TableCell>
          <TableCell
            sx={{ p: 0, border: "none", fontSize: "16px" }}
            align="right"
          >
            ₹79.95
          </TableCell>
        </TableRow>
        <TableRow sx={{ border: "none" }}>
          <TableCell sx={{ p: 0, border: "none", fontSize: "16px" }}>
            CGST
          </TableCell>
          <TableCell
            sx={{ p: 0, border: "none", fontSize: "16px" }}
            align="right"
          >
            ₹7.20
          </TableCell>
        </TableRow>
        <TableRow sx={{ border: "none" }}>
          <TableCell sx={{ p: 0, border: "none", fontSize: "16px" }}>
            SGST
          </TableCell>
          <TableCell
            sx={{ p: 0, border: "none", fontSize: "16px" }}
            align="right"
          >
            ₹7.20
          </TableCell>
        </TableRow>
        <TableRow sx={{ border: "none" }}>
          <TableCell sx={{ border: "none" }}></TableCell>
          <TableCell sx={{ border: "none" }}></TableCell>
        </TableRow>
        <TableRow sx={{ border: "none" }}>
          <TableCell
            sx={{ p: 0, border: "none", fontSize: "16px", fontWeight: 800 }}
          >
            Total Paid
          </TableCell>
          <TableCell
            sx={{ p: 0, border: "none", fontSize: "16px", fontWeight: 800 }}
            align="right"
          >
            ₹1693.95
          </TableCell>
        </TableRow>
        <TableRow sx={{ border: "none" }}>
          <TableCell sx={{ border: "none" }}></TableCell>
          <TableCell sx={{ border: "none" }}></TableCell>
        </TableRow>
        <TableRow sx={{ border: "none" }}>
          <TableCell sx={{ p: 0, border: "none", fontSize: "16px" }}>
            Payment Method
          </TableCell>
          <TableCell
            sx={{ p: 0, border: "none", fontSize: "16px" }}
            align="right"
          >
            UPI
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default WorkshopInformation;
