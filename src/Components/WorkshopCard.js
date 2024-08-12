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
} from "@mui/material";
import { useSelector } from "react-redux";
import { COLLECTIONS, STORAGES } from "../constants";
import { readDocumentWithImageUrl } from "../utils/firebaseUtils";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import dayjs from "dayjs";
import { db } from "../config";
import { deleteDoc, doc } from "firebase/firestore";
import { useSnackbar } from "../context/SnackbarContext";

function WorkshopDetailsModal({ open, handleClose, dataItem, deleteWorkshop }) {
  const showSnackbar = useSnackbar();
  const currentUser = JSON.parse(localStorage.getItem("userInfo"))?.UserId;

  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const isCreatorOfWorkshop = dataItem.UserId === currentUser;

  const handleDelete = async () => {
    try {
      await deleteWorkshop(dataItem.id);
      handleClose();
      showSnackbar("Workshop deleted!", "success");
    } catch (error) {
      console.log(error);
    }
  };

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
        <Grid container spacing="8px">
          <Grid item xs={12} md={8}>
            <Box sx={{ height: "300px" }}>
              <img
                src={dataItem.imageUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
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

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <MUITypography
                  variant="h5"
                  sx={{
                    mt: "2rem",
                    alignSelf: "center",
                    color: isDarkModeOn ? "white" : "black",
                  }}
                >
                  ₹{dataItem.price}
                </MUITypography>
                {/*                 <Button
                  variant="outlined"
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
                  Book Now
                </Button> */}
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <MUITypography
              variant="h5"
              component="p"
              sx={{ mt: 1, color: isDarkModeOn ? "white" : "black" }}
            >
              {dataItem.workshopName || ""}
              {dataItem.danceStyles.map((dance) => ` | ${dance}`)}
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
          {isCreatorOfWorkshop && (
            <Button
              onClick={handleDelete}
              variant="outlined"
              sx={{
                mr: "1rem",
                color: "white",
                boxShadow: "none",
                border: "1px solid",
                backgroundColor: "red",
                borderColor: "white",
                color: "white",
                "&:hover": {
                  backgroundColor: "red",
                  borderColor: "white",
                  boxShadow: "none",
                },
                "&:active": {
                  boxShadow: "none",
                  backgroundColor: "red",
                  borderColor: "white",
                },
                "&:focus": {
                  boxShadow: "none",
                },
              }}
            >
              Delete
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

export default function WorkshopCard({ dataItem, deleteWorkshop }) {
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
          STORAGES.WORKSHOPICON,
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
            {dataItem && dataItem.workshopName ? dataItem.workshopName : ""}
          </Box>
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
        deleteWorkshop={deleteWorkshop}
      />
    </>
  );
}
