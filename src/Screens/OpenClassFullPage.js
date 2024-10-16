import React, { useEffect, useState } from "react";
import {Box, Grid,CircularProgress} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { COLLECTIONS, ENTITY_FLAG, STORAGES } from "../constants"; // Adjust the import paths as necessary
import {
  readDocument,
  readDocumentWithImageUrl,
} from "../utils/firebaseUtils";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { useSnackbar } from "../context/SnackbarContext";
import { bookEntity } from "../utils/common";

import MediaDisplay from "../Components/MediaDisplay";
import EntityDetailsSection from "../Components/EntityDetailsSection";
import EntityBookingCard from "../Components/EntityBookingCard";

function OpenClassFullPage() {
  const { openClassId } = useParams();
  console.log("From OpenClassFullPage,", openClassId);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [imageUrl, setImageUrl] = useState(null);
  const [dataItem, setDataItem] = useState(null);
  const [personsAllowed, setPersonsAllowed] = useState(1); // Number of persons

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readDocument(COLLECTIONS.OPEN_CLASSES, openClassId);
        setDataItem(data);
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
    "Hey, I found your Open Class on nritya.co.in. I'm interested"
  );

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
        <EntityBookingCard dataItem={dataItem} personsAllowed={personsAllowed} setPersonsAllowed={setPersonsAllowed}
                totalPrice={totalPrice} handleBook={handleBook} entityType={COLLECTIONS.OPEN_CLASSES}/>

        {/* Additional Workshop Details */}
        <EntityDetailsSection dataItem={dataItem} whatsappMessage={whatsappMessage}/>
      </Grid>

    </Box>
  );
}

export default OpenClassFullPage;
