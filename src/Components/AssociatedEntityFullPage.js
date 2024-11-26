import React, { useEffect, useState } from "react";
import {Box, Grid, CircularProgress, LinearProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { COLLECTIONS, STORAGES, ENTITY_FLAG } from "../constants"; // Adjust the import paths as necessary
import { readDocument, readDocumentWithImageUrl } from "../utils/firebaseUtils";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { useSnackbar } from "../context/SnackbarContext";
import { BASEURL_DEV, BASEURL_PROD } from "../constants";
import { displayRazorpayPaymentSdk } from "../utils/payment_module"; 
import MediaDisplay from "../Components/MediaDisplay";
import EntityDetailsSection from "../Components/EntityDetailsSection";
import EntityBookingCard from "../Components/EntityBookingCard";
import EntityVenueBox from "../Components/EntityVenueBox";
import { useAlert } from '../context/AlertContext';
import PageMeta from "./PageMeta";
import { useAuth } from "../context/AuthContext";
 

function AssociatedEntityFullPage({ entityCollectionName, storageCollectionName, defaultImageUrl }) {
  const { entityId } = useParams();
  const showAlert = useAlert();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const { setShowSignInModal } = useAuth();
  const [imageUrl, setImageUrl] = useState(null);
  const [dataItem, setDataItem] = useState(null);
  const [personsAllowed, setPersonsAllowed] = useState(1);
  const BASE_URL = BASEURL_PROD;
  const currentUser = JSON.parse(localStorage.getItem("userInfo"))?.UserId;
  const currentUserEmail = JSON.parse(localStorage.getItem("userInfo"))?.email;
  const currentName = JSON.parse(localStorage.getItem("userInfo"))?.displayName;
  const [isBooking, setIsBooking] = useState(false);

  const totalPrice = dataItem && personsAllowed
    ? (dataItem.price || 0) * personsAllowed + (dataItem.extraCharges || 0)
    : 0;
    console.log("AssociatedEntityFullPage",entityId,entityCollectionName, storageCollectionName, defaultImageUrl)
    
    const handleBook = async () => {
      if (!currentUser) {
        showSnackbar("Please login to book", "warning");
        // navigate("/login");
        setShowSignInModal(true);
        return;
      }

      try {
        console.log(`${currentName}, ${currentUserEmail}, ${dataItem}, ${entityId}, ${personsAllowed}, ${totalPrice}, ${BASE_URL}, ${entityCollectionName}, ${currentUser}`);
        setIsBooking(true);
        await displayRazorpayPaymentSdk({
          currentName: currentName,
          currentUserEmail: currentUserEmail,
          dataItem: dataItem,
          entityId: entityId,
          personsAllowed: personsAllowed,
          totalPrice: totalPrice,
          BASE_URL: BASE_URL,
          collection_name: entityCollectionName,
          userId: currentUser,
          showAlert
        });
      } catch (error) {
        showSnackbar(error?.message || "Something went wrong", "error");
      }finally{
        setIsBooking(false);
      }
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readDocument(entityCollectionName, entityId);
        setDataItem(data);
        if (data && data.StudioId) {
          const studioDetails = await readDocument(COLLECTIONS.STUDIO, data.StudioId);
          setDataItem(prevData => ({ ...prevData, studioDetails }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showSnackbar("Failed to load details.", "error");
      }
    };

    const fetchImage = async () => {
      try {
        const url = await readDocumentWithImageUrl(storageCollectionName, entityId);
        setImageUrl(url || defaultImageUrl);
      } catch (error) {
        console.error("Error fetching image URL:", error);
        setImageUrl(defaultImageUrl);
      }
    };

    if (entityId) {
      fetchData();
      fetchImage();
    }
  }, [entityId, showSnackbar, entityCollectionName, storageCollectionName]);

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

  return (
    <>
      <PageMeta
        title={dataItem?.workshopName || dataItem?.openClassName || dataItem?.courseName || ""}
        description={`${dataItem?.workshopName || dataItem?.openClassName || dataItem?.courseName}, ${dataItem?.city}, ${dataItem?.price}, ${dataItem?.danceStyles?.join?.(',')}`}
        image={imageUrl || "https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"}
      />

      <Box
        sx={{
          padding: "0rem",
          minHeight: "100vh",
          color: isDarkModeOn ? "white" : "black",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <MediaDisplay
              youtubeViedoLink={dataItem.youtubeViedoLink}
              imageUrl={imageUrl}
              altText={dataItem.name || "Entity Image"}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <EntityBookingCard
              dataItem={dataItem}
              personsAllowed={personsAllowed}
              setPersonsAllowed={setPersonsAllowed}
              totalPrice={totalPrice}
              handleBook={handleBook}
              entityType={entityCollectionName}
            />
            {isBooking && <LinearProgress/> }
          </Grid>
          <Grid item xs={12} lg={8}>
            <EntityDetailsSection dataItem={dataItem} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <EntityVenueBox dataItem={dataItem} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default AssociatedEntityFullPage;
