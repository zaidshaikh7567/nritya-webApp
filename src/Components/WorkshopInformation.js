import React, { useEffect, useState } from "react";
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
  Chip,
} from "@mui/material";
import QRCode from "react-qr-code";
import { BASEURL_PROD } from "../constants";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { useRouter } from "next/navigation";
import axios from "axios";

const theme = createTheme({
  typography: {
    fontFamily: "Instrument Sans",
  },
});

function WorkshopInformation({ workshopClickTicket, setWorkshopClickTicket }) {
  const endpoint_url = BASEURL_PROD + "bookings/availFreeTrial/";
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const router = useRouter();
  const [workshopDetails, setWorkshopDetails] = useState(null);

  // Calculate total quantity from items
  const totalQuantity = workshopClickTicket?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  // Get the first item for display purposes
  const firstItem = workshopClickTicket?.items?.[0];
  
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

  // Format created date
  const formatCreatedDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch workshop details
  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      if (workshopClickTicket?.workshop_id) {
        try {
          const response = await axios.get(`http://0.0.0.0:8000/crud/get_workshop_by_id/${workshopClickTicket.workshop_id}`);
          setWorkshopDetails(response.data);
        } catch (error) {
          console.error('Error fetching workshop details:', error);
        }
      }
    };

    fetchWorkshopDetails();
  }, [workshopClickTicket?.workshop_id]);

  const handleViewTicket = () => {
    router.push(`/ticket/${workshopClickTicket.booking_id}`);
  };

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
            src="/assets/images/back-icon.png"
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
              {workshopDetails?.name || "Workshop Booking"}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              sx={{ fontWeight: 600, color: "#D9D9D9" }}
            >
              {totalQuantity} Ticket{totalQuantity !== 1 ? 's' : ''} Booked
            </Typography>
            <Typography
              component="p"
              sx={{
                textAlign: { xs: "center", sm: "right" },
                fontWeight: 700,
                color: "#D9D9D9",
              }}
            >
              Booking ID: {workshopClickTicket?.booking_id || ""}
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
                    value={workshopClickTicket?.booking_id || "workshop-booking"}
                    size={120}
                  />
                </Box>
                <Typography
                  variant="h6"
                  component="p"
                  sx={{ mt: 1, fontWeight: 600 }}
                >
                  Total Amount: ₹{workshopClickTicket?.total_amount || 0}
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
                    {formatDate(firstItem?.date)}
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
                    {formatTime(firstItem?.time)}
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
                src={isDarkModeOn ? "/assets/images/venue-icon-white.png" : "/assets/images/venue-icon.png"}
                alt="Venue"
                style={{ width: "30px", height: "30px", marginRight: 4 }}
              />
              <span>Venue Details</span>
            </Typography>

            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>
                {workshopDetails?.building || "Venue details to be added"}
              </Typography>
              <Typography sx={{ mb: 1 }}>
                {workshopDetails?.street || "Address information"}
              </Typography>
              <Typography sx={{ fontWeight: 600, color: '#735EAB' }}>
                {workshopDetails?.city || "City"}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              component="p"
              sx={{ mt: "30px", fontWeight: 600 }}
            >
              <img
                src={isDarkModeOn ? "/assets/images/venue-icon-white.png" : "/assets/images/venue-icon.png"}
                alt="Venue"
                style={{ width: "30px", height: "30px", marginRight: 4 }}
              />
              <span>Booked Events</span>
            </Typography>

            <Box sx={{ mt: 2 }}>
              {workshopClickTicket?.items?.map((item, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>
                    {item.variant_description}
                  </Typography>
                  <Typography sx={{ mb: 1 }}>
                    {item.subvariant_description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '14px' }}>
                      {formatDate(item.date)} at {formatTime(item.time)}
                    </Typography>
                    <Chip 
                      label={`${item.quantity} × ₹${item.price_per_ticket}`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontWeight: 700 }}>Booking Details</Typography>
              <Typography sx={{ mt: "21px" }}>
                <span>{workshopClickTicket?.buyer_name || ""}</span>
                <br />
                <span>{workshopClickTicket?.buyer_phone || ""}</span>
                <br />
                <span>{workshopClickTicket?.buyer_email || ""}</span>
                <br />
                <span style={{ display: "inline-block", marginTop: 8 }}>
                  Booked on {formatCreatedDate(workshopClickTicket?.created_at)}
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
              <PaymentDetails workshopClickTicket={workshopClickTicket} />
            </Box>

            {/* View Full Ticket Button */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                onClick={handleViewTicket}
                sx={{
                  bgcolor: '#735EAB',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#5a4a8a',
                  }
                }}
              >
                View Full Ticket
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const PaymentDetails = ({ workshopClickTicket }) => {
  return (
    <Table size="small" sx={{ mt: "10px", border: "none" }}>
      <TableBody sx={{ border: "none" }}>
        <TableRow sx={{ border: "none" }}>
          <TableCell sx={{ p: 0, border: "none", fontSize: "16px" }}>
            Subtotal
          </TableCell>
          <TableCell
            sx={{ p: 0, border: "none", fontSize: "16px" }}
            align="right"
          >
            ₹{workshopClickTicket?.subtotal || 0}
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
            ₹{workshopClickTicket?.booking_fee || 0}
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
            ₹{workshopClickTicket?.total_amount || 0}
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
            {workshopClickTicket?.payment_method || "Online"}
          </TableCell>
        </TableRow>
        <TableRow sx={{ border: "none" }}>
          <TableCell sx={{ p: 0, border: "none", fontSize: "16px" }}>
            Payment ID
          </TableCell>
          <TableCell
            sx={{ p: 0, border: "none", fontSize: "16px" }}
            align="right"
          >
            {workshopClickTicket?.razorpay_payment_id || "N/A"}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default WorkshopInformation;
