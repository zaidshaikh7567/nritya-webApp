import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  Typography as MUITypography,
  Button,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Remove, Add } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CHIP_LEVELS_DESIGN, COLLECTIONS, STORAGES } from "../constants"; // Adjust the import paths as necessary
import {
  readDocument,
  readDocumentWithImageUrl,
} from "../utils/firebaseUtils";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useSnackbar } from "../context/SnackbarContext";
import { bookEntity } from "../utils/common";

import whatsAppImage from "../assets/images/whatsapp.png";
import callImage from "../assets/images/india_11009487.png";
import MediaDisplay from "../Components/MediaDisplay";

function OpenClassFullPage() {
  const { openClassId } = useParams();
  console.log("From OpenClassFullPage,", openClassId);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [imageUrl, setImageUrl] = useState(null);
  const [dataItem, setDataItem] = useState(null);
  const [personsAllowed, setPersonsAllowed] = useState(1); // Number of persons
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const currentUser = JSON.parse(localStorage.getItem("userInfo"))?.UserId;
  const currentUserEmail = JSON.parse(localStorage.getItem("userInfo"))?.email;

  // Define Internet Conversion Charges
  const INTERNET_CONV_CHARGES = 50; // Adjust as needed

  // Calculate Total Price
  const totalPrice =
    dataItem && personsAllowed
      ? 0 * personsAllowed 
      : 0;

  const handleBook = async () => {
    if (!currentUser) {
      showSnackbar("Please login to book", "warning");
      navigate("/login"); // Redirect to login page if not logged in
      return;
    }
    try {
      const bookingData = {
        userId: currentUser,
        entityType: COLLECTIONS.OPEN_CLASSES,
        openClassId: openClassId,
        associatedStudioId: dataItem.StudioId,
        emailLearner: currentUserEmail,
        personsAllowed: personsAllowed,
        pricePerPerson: dataItem.price,
        internetConvCharges: INTERNET_CONV_CHARGES,
        totalPrice: totalPrice,
        // Add other necessary fields here
      };

      const result = await bookEntity(bookingData);
      if (result && result.nSuccessCode === 200) {
        showSnackbar("Workshop booked", "success");
      } else if (result && result.nSuccessCode === 205) {
        const timestampInSeconds = result.bookedAt;
        const timestampInMilliseconds = timestampInSeconds * 1000;
        const date = new Date(timestampInMilliseconds);
        const formattedDate = date.toLocaleString();
        showSnackbar(`Workshop already booked at ${formattedDate}`, "info");
      } else {
        const errorMessage = result
          ? `Error: ${JSON.stringify(result)}`
          : "An unknown error occurred.";
        showSnackbar(errorMessage, "error");
      }
    } catch (error) {
      console.error(error);
      showSnackbar(error?.message || "Something went wrong", "error");
    }
  };

  console.log("OpenClassFullPage before useEffect");
  useEffect(() => {
    const fetchData = async () => {
      console.log("OpenClassFullPage fetchData");
      try {
        const data = await readDocument(COLLECTIONS.OPEN_CLASSES, openClassId);
        console.log("OpenClassFullPage fetchData data", data);
        setDataItem(data);
        console.log("OpenClassFullPage before useEffect", data);
        if (data && data.StudioId) {
          const studioDetails = await readDocument(
            COLLECTIONS.STUDIO,
            data.StudioId
          );
          setDataItem((prevData) => ({ ...prevData, studioDetails }));
        }
      } catch (error) {
        console.error("Error fetching workshop data:", error);
        showSnackbar("Failed to load workshop details.", "error");
      }
    };

    const fetchImage = async () => {
      try {
        const url = await readDocumentWithImageUrl(
          STORAGES.OPENCLASSICON,
          openClassId
        );
        setImageUrl(
          url ||
            "https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"
        );
      } catch (error) {
        console.error("Error fetching image URL:", error);
        setImageUrl(
          "https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"
        );
      }
    };

    if (openClassId) {
      fetchData();
      fetchImage();
    }
  }, [openClassId, showSnackbar]);

  if (!dataItem) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const whatsappMessage = encodeURIComponent(
    "Hey, I found your Studio on nritya.co.in. I'm interested"
  );

  // Handlers for Modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box
      sx={{
        padding: "0rem",
        minHeight: "100vh",
        color: isDarkModeOn ? "white" : "black",
      }}
    >
      <Grid container spacing={2}>
        {/* Workshop Image */}
        <Grid item xs={12} lg={8}>
        <MediaDisplay 
            youtubeId={dataItem.youtubeId} 
            imageUrl={imageUrl} 
            altText={dataItem.openClassName} 
            />
        </Grid>

        {/* Workshop Details */}
        <Grid item xs={12} lg={4}>
          <Box
            sx={{
              bgcolor: isDarkModeOn ? "#333333" : "#efefef",
              p: 3,
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            {/* Workshop Info */}
            <Box>
              <MUITypography variant="h4" style={{color: isDarkModeOn ? 'white' : 'black', textTransform: 'none',textDecoration: 'none'}}>
                {dataItem.openClassName || "Open Class Name"}
              </MUITypography>
              <MUITypography variant="subtitle "style={{color: isDarkModeOn ? 'white' : 'black'}}>
                {(dataItem.date)}
              </MUITypography>
              <br/>
              <MUITypography variant="subtitle" style={{color: isDarkModeOn ? 'white' : 'black'}}>{dataItem.time}</MUITypography>
              <MUITypography variant="body1" sx={{ mt: "1rem",color: isDarkModeOn ? 'white' : 'black' }}>
                {dataItem.city || "City"}
              </MUITypography>
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
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <td style={{ padding: '8px', color: isDarkModeOn ? 'white' : 'black' }}>
            {dataItem && dataItem.price && (
              <span>Price per person</span>
            )}
          </td>
          <td style={{ padding: '8px', color: isDarkModeOn ? 'white' : 'black' }}>
            {dataItem && dataItem.price && (
              <span> ₹{dataItem.price}</span>
            )}
          </td>
        </tr>
        <tr>
         <td style={{ padding: '8px', color: isDarkModeOn ? 'white' : 'black' }}>
            <span sx={{ color: isDarkModeOn ? 'white' : 'black' }}>Person(s)</span>
          </td>
          <td style={{ padding: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              
              <Stack direction="row" spacing={0} alignItems="center">
                <Button
                    variant="contained"
                    onClick={() => setPersonsAllowed((prev) => Math.max(prev - 1, 1))}
                    disabled={personsAllowed <= 1}
                    sx={{
                    flex: 1, // Make the button take full available width
                    height: '40px', // Set the height for uniformity
                    border: '1px solid',
                    borderColor: isDarkModeOn ? 'white' : 'black',
                    color: isDarkModeOn ? 'white' : 'black',
                    backgroundColor: 'red',
                    '&:hover': {
                        backgroundColor: 'darkred',
                    },
                    }}
                >
                    <FaMinus />
                </Button>

                <Button
                    variant="contained"
                    sx={{
                    flex: 1,
                    height: '40px',
                    border: '1px solid',
                    borderColor: isDarkModeOn ? 'white' : 'black',
                    color: isDarkModeOn ? 'white' : 'black', // Adjust text color for contrast
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
                    backdropFilter: 'blur(10px)', // Glassmorphism effect
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Shadow for depth
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Slightly more opaque on hover
                    },
                    }}
                >
                    {personsAllowed}
                </Button>

                <Button
                    variant="contained"
                    onClick={() => setPersonsAllowed((prev) => Math.min(prev + 1, 2))}
                    disabled={personsAllowed >= 2}
                    sx={{
                    flex: 1,
                    height: '40px',
                    border: '1px solid',
                    borderColor: isDarkModeOn ? 'white' : 'black',
                    color: isDarkModeOn ? 'white' : 'black',
                    backgroundColor: 'green',
                    '&:hover': {
                        backgroundColor: 'darkgreen',
                    },
                    }}
                >
                    <FaPlus />
                </Button>
                </Stack>
            </Box>
          </td>
        </tr>
        </tbody>
        </table>

              {/* Book Now Button */}
              <Button
                variant="contained"
                onClick={handleBook}
                sx={{
                  textTransform: "none",
                  fontSize: 16,
                  padding: "8px 16px",
                  backgroundColor: isDarkModeOn ? "white" : "black",
                  color: isDarkModeOn ? "black" : "white",
                  "&:hover": {
                    backgroundColor: isDarkModeOn ? "#f0f0f0" : "#333333",
                  },
                }}
              >
                {currentUser ? `Book Now @${totalPrice}` : "Login to Book"}
              </Button>
              <Button
              hidden={totalPrice===0}
              variant="text"
              onClick={handleOpenModal}
              sx={{
                textTransform: 'none',
                fontSize: 16,
                color: isDarkModeOn ? 'white' : 'black',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'none',
                },
              }}
            >
              Price Breakdown (i)
            </Button>

              {/* Payment Info */}
              {currentUser && (
                <MUITypography
                  variant="caption"
                  sx={{ mt: "0.5rem", textAlign: "center" }}
                >
                  Book and groove at the venue
                </MUITypography>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Additional Workshop Details */}
        <Grid item xs={12}>
          <MUITypography variant="h4" style={{color: isDarkModeOn ? 'white' : 'black',  textTransform: 'none',textDecoration: 'none'}} gutterBottom>
            {dataItem.openClassName || "Open Class Name "}
          </MUITypography>
          <MUITypography variant="subtitle1" style={{color: isDarkModeOn ? 'white' : 'black',  textTransform: 'none',textDecoration: 'none'}} gutterBottom>
            By {dataItem.studioDetails?.studioName || "Studio Name"}
            {dataItem.danceStyles && dataItem.danceStyles.length > 0 && (
              <>
                {" "}
                | {dataItem.danceStyles.join(", ")}
              </>
            )}
          </MUITypography>
          <Chip
                sx={{
                    marginLeft: "10px",
                    marginBottom: "10px",
                    fontSize: "0.8rem",
                    bgcolor: CHIP_LEVELS_DESIGN[dataItem.level]?.backgroundColor || 'grey',  // Fallback to grey
                    color: CHIP_LEVELS_DESIGN[dataItem.level]?.color || 'white',  // Fallback to white
                }}
                label={dataItem.level}
                >
                </Chip>
          <Box sx={{ display: "flex", gap: "0.5rem", mb: "1rem" , color: isDarkModeOn ? 'white' : 'black'}}>
            {dataItem.studioDetails?.whatsappNumber && (
              <IconButton
                color="success"
                size="small"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://wa.me/91${dataItem.studioDetails.whatsappNumber}?text=${whatsappMessage}`}
              >
                <Box
                  component="img"
                  src={whatsAppImage}
                  alt="WhatsApp"
                  sx={{ width: 30, height: 28 }}
                />
              </IconButton>
            )}
            {dataItem.studioDetails?.mobileNumber && (
              <IconButton
                color="primary"
                size="small"
                target="_blank"
                rel="noopener noreferrer"
                href={`tel:${dataItem.studioDetails.mobileNumber}`}
              >
                <Box
                  component="img"
                  src={callImage}
                  alt="Phone Call"
                  sx={{ width: 30, height: 28 }}
                />
              </IconButton>
            )}
          </Box>
          <MUITypography variant="body1 " style={{color: isDarkModeOn ? 'white' : 'black'}}>
            {dataItem.description || "Workshop Description"}
          </MUITypography>
        </Grid>
      </Grid>

      {/* Price Breakdown Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Price Breakdown</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Item</strong></TableCell>
                <TableCell align="right"><strong>Amount (₹)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Price per Person</TableCell>
                <TableCell align="right">{dataItem.price}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Number of Persons</TableCell>
                <TableCell align="right">{personsAllowed}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Subtotal</TableCell>
                <TableCell align="right">
                  {dataItem.price * personsAllowed}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Internet Convenience Charges</TableCell>
                <TableCell align="right">{INTERNET_CONV_CHARGES}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Total Price</strong></TableCell>
                <TableCell align="right">
                  <strong>₹{totalPrice}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OpenClassFullPage;



