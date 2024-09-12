import React, { useEffect, useState } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";
import {
  Box,
  Grid,
  Modal,
  Stack,
  Typography as MUITypography,
  Button,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import { COLLECTIONS, STORAGES } from "../constants";
import { readDocumentWithImageUrl } from "../utils/firebaseUtils";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import dayjs from "dayjs";
import { db } from "../config";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useSnackbar } from "../context/SnackbarContext";
import whatsAppImage from '../assets/images/whatsapp.png';
import callImage from '../assets/images/india_11009487.png';

function WorkshopDetailsModal({
  open,
  handleClose,
  dataItem,
  activateOpenClass,
  deactivateOpenClass,
  actionsAllowed,
}) {
  const showSnackbar = useSnackbar();
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [isBooking, setIsBooking] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("userInfo"))?.UserId;

  const isCreatorOfWorkshop = dataItem.UserId === currentUser;

  const handleBook = async () => {
    try {
      setIsBooking(true);

      addDoc(collection(db, COLLECTIONS.BOOKINGS), {
        StudioId: dataItem.StudioId,
        OpenClassId: dataItem.id,
        UserId: currentUser,
        bookingDate: Date.now(),
      });

      const userRef = doc(db, "User", currentUser);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        if (userSnap.data() != null) {
          await updateDoc(userRef, {
            BookedOpenClasses: [
              ...(userSnap.data().BookedOpenClasses || []),
              dataItem.id,
            ],
          });
        }
      }

      setUserDetails(prev => ({ ...prev, BookedOpenClasses: [...(prev?.BookedOpenClasses || []), dataItem.id] }));

      showSnackbar("Open class booked", "success");
    } catch (error) {
      console.error(error);
      showSnackbar(error?.message || "Something went wrong", "error");
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const userRef = doc(db, "User", currentUser);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setUserDetails(userSnap.data());
      } catch (error) {
        console.log(" error");
      }
    };

    getUser();
  }, []);

  const whatsappMessage = encodeURIComponent("Hey, I found your Studio on nritya.co.in. I'm interested");

  const isBooked = userDetails?.BookedOpenClasses?.includes?.(dataItem?.id);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxHeight: "90%",
          overflow: "auto",
          width: { xs: "90%", md: "60%" },
          bgcolor: isDarkModeOn ? "black" : "background.paper",
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: isDarkModeOn ? "white" : "black",
          boxShadow: 24,
          p: "1rem",
          borderRadius: "8px",
        }}
      >
        <Grid container spacing="8px" rowGap={3}>
          <Grid item xs={12} lg={8} sx={{ minHeight: '300px' }}>
            <img
              src={dataItem.imageUrl}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                height: "100%",
                bgcolor: isDarkModeOn ? "#333333" : "#efefef",
                p: 2,
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <MUITypography
                  variant="h6"
                  component="p"
                  sx={{ color: isDarkModeOn ? "white" : "black" }}
                >
                  {dayjs(dataItem.date).format("LL")}
                </MUITypography>

                <MUITypography
                  variant="h6"
                  component="p"
                  sx={{ color: isDarkModeOn ? "white" : "black" }}
                >
                  {dataItem.time}
                </MUITypography>

                <MUITypography
                  variant="body1"
                  component="p"
                  sx={{ mt: "2rem", color: isDarkModeOn ? "white" : "black" }}
                >
                  {dataItem.venue}
                </MUITypography>
              </Box>

              <Box sx={{ mt: "2rem", textAlign: 'right' }}>
                {!actionsAllowed && !isCreatorOfWorkshop && currentUser && <Button
                  variant="outlined"
                  onClick={handleBook}
                  disabled={isBooked || isBooking}
                  sx={{
                    boxShadow: "none",
                    textTransform: "none",
                    fontSize: 16,
                    padding: "6px 12px",
                    border: "1px solid",
                    lineHeight: 1.5,
                    backgroundColor: "transparent",
                    borderColor: isDarkModeOn ? "white" : "black",
                    color: isDarkModeOn ? "white" : "black",
                    "&:hover": {
                      backgroundColor: "transparent",
                      borderColor: isDarkModeOn ? "white" : "black",
                      boxShadow: "none",
                    },
                    "&:active": {
                      boxShadow: "none",
                      backgroundColor: "transparent",
                      borderColor: isDarkModeOn ? "white" : "black",
                    },
                    "&:focus": {
                      boxShadow: "none",
                    },
                  }}
                >
                  {isBooked ? "Booked" : "Book Now"}
                </Button>}
              </Box>
            </Box>
            {!actionsAllowed && !isCreatorOfWorkshop && currentUser && <MUITypography component={'p'} variant="caption" sx={{ my: '2px', color: isDarkModeOn ? "white" : "black", textAlign: 'center' }}>
              Book your spot
            </MUITypography>}
          </Grid>
          <Grid item sx={{ mt: 1, }}>
            <MUITypography
              variant="h5"
              component="p"
              sx={{ color: isDarkModeOn ? "white" : "black" }}
            >
              {dataItem.openClassName || ""}
              {dataItem.danceStyles.map((dance) => ` | ${dance}`)}
            </MUITypography>
            <MUITypography
              variant="body1"
              component="p"
              sx={{ mt: 1, color: isDarkModeOn ? "white" : "black" }}
            >
              <span>By {dataItem.studioDetails?.studioName || ""}</span>
              {dataItem.studioDetails && dataItem.studioDetails?.whatsappNumber && (
                <IconButton color="success" size="small" target="_blank" href={`https://wa.me/91${dataItem.studioDetails.whatsappNumber}?text=${whatsappMessage}`}>
                  <img src={whatsAppImage} alt="Whatsapp call" style={{ width: 30, height: 28 }} />
                </IconButton>
              )}
              {dataItem.studioDetails && dataItem.studioDetails?.mobileNumber && (
                <IconButton color="primary" size="small" target="_blank" href={`tel:${dataItem.studioDetails.mobileNumber}`}>
                  <img src={callImage} alt="Phone call" style={{ width: 30, height: 28 }} />
                </IconButton>
              )}
            </MUITypography>
            <MUITypography
              variant="body1"
              component="p"
              sx={{ mt: 2, color: isDarkModeOn ? "white" : "black" }}
            >
              {dataItem.description || ""}
            </MUITypography>
          </Grid>
        </Grid>

        <Box sx={{ mt: "1rem", textAlign: "right" }}>
          {actionsAllowed && isCreatorOfWorkshop && (
            <Button
              onClick={() =>
                dataItem?.active
                  ? deactivateOpenClass(dataItem?.id)
                  : activateOpenClass(dataItem?.id)
              }
              variant="outlined"
              sx={{
                mr: "1rem",
                color: "white",
                boxShadow: "none",
                border: "1px solid",
                backgroundColor: dataItem?.active ? "red" : "green",
                borderColor: "white",
                color: "white",
                "&:hover": {
                  backgroundColor: dataItem?.active ? "red" : "green",
                  borderColor: "white",
                  boxShadow: "none",
                },
                "&:active": {
                  boxShadow: "none",
                  backgroundColor: dataItem?.active ? "red" : "green",
                  borderColor: "white",
                },
                "&:focus": {
                  boxShadow: "none",
                },
              }}
            >
              {dataItem?.active ? "Deactivate" : "Activate"}
            </Button>
          )}

          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              color: "white",
              boxShadow: "none",
              border: "1px solid",
              backgroundColor: "transparent",
              borderColor: isDarkModeOn ? "white" : "black",
              color: isDarkModeOn ? "white" : "black",
              "&:hover": {
                backgroundColor: "transparent",
                borderColor: isDarkModeOn ? "white" : "black",
                boxShadow: "none",
              },
              "&:active": {
                boxShadow: "none",
                backgroundColor: "transparent",
                borderColor: isDarkModeOn ? "white" : "black",
              },
              "&:focus": {
                boxShadow: "none",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default function OpenClassCard({
  dataItem,
  activateOpenClass,
  deactivateOpenClass,
  actionsAllowed,
}) {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [imageUrl, setImageUrl] = useState(null);
  const [isWorkshopDetailsModalOpen, setIsWorkshopDetailsModalOpen] =
    useState(false);
  const workshopId = dataItem.id;

  const handleWorkshopDetailsModalOpen = () =>
    setIsWorkshopDetailsModalOpen(true);

  const handleWorkshopDetailsModalClose = () =>
    setIsWorkshopDetailsModalOpen(false);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const url = await readDocumentWithImageUrl(
          STORAGES.OPENCLASSICON,
          workshopId
        );

        setImageUrl(
          url ||
          "https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"
        );
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    };

    fetchImageUrl();
  }, [dataItem.id]);

  const cardStyle = {
    backgroundColor: isDarkModeOn ? "#444" : "white",
    padding: "0px",
    color: isDarkModeOn ? "white" : "black",
    marginRight: "10px",
    width: 320,
    maxWidth: "100%",
    boxShadow: "lg",
    transition: "opacity 0.3s ease",
  };

  const cardHoverStyle = {
    transform: "scale(1.01)",
    cursor: "pointer",
  };

  return (
    <>
      <Card
        variant="solid"
        sx={{
          ...cardStyle,
          "&:hover": cardHoverStyle,
          flex: "none",
        }}
        onClick={handleWorkshopDetailsModalOpen}
      >
        <AspectRatio ratio="1.78" style={{ position: "relative" }}>
          <img
            src={imageUrl}
            loading="lazy"
            alt="Studio Image"
            style={{ maxWidth: "100%", objectFit: "cover", overflow: "hidden" }}
          />
          <Stack
            direction="row"
            spacing={2}
            style={{ position: "absolute", bottom: 0, left: 0, padding: "1px" }}
          >
            {dataItem && dataItem.danceStyles ? (
              dataItem.danceStyles.slice(0, 3).map((form, index) => (
                <Chip
                  key={index}
                  color={index % 2 === 0 ? "danger" : "success"}
                  style={{
                    marginLeft: "10px",
                    marginBottom: "10px",
                    fontSize: "0.8rem",
                  }}
                >
                  {form.trim()}
                </Chip>
              ))
            ) : (
              <Chip
                key={10}
                color={10 % 2 === 0 ? "danger" : "success"}
                style={{ marginBottom: "10px", fontSize: "0.8rem" }}
              >
                {"No danceforms"}
              </Chip>
            )}
          </Stack>
        </AspectRatio>
        <CardContent style={{ padding: "10px", paddingTop: "5px" }}>
          <Box
            fontWeight="md"
            color="neutral"
            textColor="text.primary"
            underline="none"
            overlay
            style={{
              color: isDarkModeOn ? "white" : "black",
              extDecoder: "one",
            }}
          >
            <span>
              {dataItem && dataItem.openClassName ? dataItem.openClassName : ""}
            </span>
            {!dataItem?.active && (
              <span
                style={{
                  marginLeft: "2px",
                  padding: "2px 4px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  background: "red",
                }}
              >
                Inactive
              </span>
            )}
          </Box>
          <Typography
            style={{ color: isDarkModeOn ? "white" : "black" }}
            level="body-xs"
            noWrap
          >
            By {dataItem.studioDetails?.studioName ? dataItem.studioDetails.studioName : ""}
          </Typography>
          <Typography
            style={{ marginTop: 10, color: isDarkModeOn ? "white" : "black" }}
            level="body-xs"
            noWrap
          >
            {dataItem.venue ? dataItem.venue : ""}
          </Typography>
          <Typography
            style={{ color: isDarkModeOn ? "white" : "black" }}
            level="body-xs"
          >
            {dataItem.date || ""} | {dataItem.time || ""}
          </Typography>
        </CardContent>
      </Card>

      <WorkshopDetailsModal
        dataItem={{ ...dataItem, imageUrl }}
        open={isWorkshopDetailsModalOpen}
        handleClose={handleWorkshopDetailsModalClose}
        activateOpenClass={activateOpenClass}
        deactivateOpenClass={deactivateOpenClass}
        actionsAllowed={actionsAllowed}
      />
    </>
  );
}
