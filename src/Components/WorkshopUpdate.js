import React, { useState, useEffect, useMemo } from "react";
import { Form } from "react-bootstrap";
import {
  Box,
  Button,
  Container,
  Grid,
  Button as MuiButton,
  Paper,
  Typography,
  FormControl,
  ButtonGroup,
  Select,
  MenuItem,
} from "@mui/material";
import { db } from "../config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { COLLECTIONS, LEVELS } from "../constants";
import ImageUpload from "./ImageUpload";
import { STORAGES } from "../constants";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import danceStyles from "../danceStyles.json";
import { Autocomplete, TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useSnackbar } from "../context/SnackbarContext";
import indianCities from "../cities.json";
import indianStates from "../states.json";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { putData } from "../utils/common";
import { useNavigate, useParams } from "react-router-dom";
import { useLoader } from "../context/LoaderContext";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ImageIcon from "@mui/icons-material/Image";
import UploadIcon from "@mui/icons-material/Upload";
import MapsInput from "./MapsInput";
import WorkshopStep2EventInfo from "./WorkshopStep2EventInfo";

const FORM_FIELD_HEIGHT = 56;

const cityOptions = indianCities.cities;
const stateOptions = indianStates.states;
const danceStylesOptions = danceStyles.danceStyles;

const initialValue = {
  workshopName: "",
  description: "",
  danceStyles: [],
  videoLink: "",
  workshopImage: null,
  level: "",
  startDate: null,
  endDate: null,
  venueType: "Studio",
  venueDetails: null,
  events: [
    {
      date: null,
      startTime: null,
      endTime: null,
      description: "",
      pricingOptions: [
        {
          price: "",
          capacity: "",
          description: "",
        },
      ],
    },
  ],
};

function WorkshopUpdate() {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { setIsLoading } = useLoader();
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const { workshopId } = useParams();

  const [step, setStep] = useState(1);
  const [studios, setStudios] = useState([]);
  const [isVideoLink, setIsVideoLink] = useState(false);
  const [formData, setFormData] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkModeOn ? "dark" : "light",
        },
        typography: {
          fontFamily: '"Nunito Sans", sans-serif',
        },
      }),
    [isDarkModeOn]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, workshopImage: file }));
    }
  };

  const handleDateChange = (name) => (date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleVenueTypeChange = (e) => {
    const venueType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      venueType,
      venueDetails:
        venueType === "Studio"
          ? { studio: "", address: "" }
          : {
              buildingName: "",
              landmark: "",
              streetAddress: "",
              pincode: "",
              city: "",
              state: "",
              mapAddress: "",
              selectedLocation: "",
            },
    }));
  };

  const handleStudioChange = (e) => {
    const studioId = e.target.value;
    const selectedStudio = studios.find(
      (studioIdItem) => studioIdItem?.id === studioId
    );

    const studioAddress = `${
      selectedStudio?.buildingName ? selectedStudio?.buildingName + ", " : ""
    }${selectedStudio?.street}, ${selectedStudio?.city}, ${
      selectedStudio?.state
    }, ${selectedStudio?.country} - ${selectedStudio?.pincode}`;

    setFormData((prev) => ({
      ...prev,
      venueDetails: {
        studio: studioId,
        address: studioAddress || "",
      },
    }));
  };

  const handleIndependentVenueChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      venueDetails: { ...prev.venueDetails, [name]: value },
    }));
  };

  const isValidInputs = () => {
    if (step === 1) {
      if (
        !formData.workshopName ||
        !formData.description ||
        !formData.danceStyles?.length ||
        !formData.level ||
        !formData.venueType ||
        !formData.startDate ||
        !formData.endDate
      ) {
        return false;
      }

      if (!isVideoLink) {
        if (!formData.workshopImage) {
          return false;
        }
      } else {
        if (!formData.videoLink) {
          return false;
        }
      }

      if (formData.venueType === "Studio") {
        if (!formData.venueDetails?.studio || !formData.venueDetails?.address) {
          return false;
        }
      } else {
        if (
          !formData.venueDetails?.buildingName ||
          !formData.venueDetails?.landmark ||
          !formData.venueDetails?.streetAddress ||
          !formData.venueDetails?.pincode ||
          !formData.venueDetails?.city ||
          !formData.venueDetails?.state ||
          !formData.venueDetails?.mapAddress
        ) {
          return false;
        }
      }

      return true;
    } else {
      if (!formData.events?.length) {
        return false;
      }

      for (const event of formData.events) {
        if (
          !event.date ||
          !event.startTime ||
          !event.endTime ||
          !event.description ||
          !event.pricingOptions?.length
        ) {
          return false;
        }

        for (const pricing of event.pricingOptions) {
          if (!pricing.price || !pricing.capacity || !pricing.description) {
            return false;
          }
        }
      }

      return true;
    }
  };

  const gotoStep2 = async (event) => {
    event.preventDefault();

    if (!isValidInputs()) {
      showSnackbar("Please fill all the fields.", "error");
      return;
    }

    setStep((prev) => prev + 1);
  };

  const clearForm = () => {
    setFormData(initialValue);
    setIsVideoLink(false);
  };

  const handleUpdateWorkshop = async (event) => {
    event.preventDefault();

    if (!isValidInputs()) {
      showSnackbar("Please fill all the fields.", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      setIsLoading(true);

      const currentUserEmail = user?.email;
      const currentDateTime = dayjs();

      const dbPayload = {
        creatorEmail: currentUserEmail,
        UserId: user?.UserId,
        createdAt: currentDateTime.toISOString(),
        updatedAt: currentDateTime.toISOString(),
        ...formData,
      };

      dbPayload.endDate = dbPayload.endDate?.toISOString();
      dbPayload.startDate = dbPayload.startDate?.toISOString();

      dbPayload.events = dbPayload.events.map((event) => {
        const convertedEvent = { ...event };

        convertedEvent.date = convertedEvent.date.toISOString();
        convertedEvent.startTime = convertedEvent.startTime.format("HH:mm:ss");
        convertedEvent.endTime = convertedEvent.endTime.format("HH:mm:ss");

        return convertedEvent;
      });

      delete dbPayload.workshopImage;
      delete dbPayload.venueType;

      const response = await putData(
        dbPayload,
        COLLECTIONS.WORKSHOPS,
        workshopId
      );

      if (response.ok) {
        clearForm();
        showSnackbar("Workshop successfully updated.", "success");
        navigate("/workshops");
      } else {
        showSnackbar(`Error ${response}.`, "error");
      }
    } catch (error) {
      showSnackbar(error?.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getStudioCreated = async () => {
      try {
        setIsLoading(true);

        const q = query(
          collection(db, COLLECTIONS.STUDIO),
          where("UserId", "==", user?.UserId)
        );

        const querySnapshot = await getDocs(q);
        const studiosOfUser = querySnapshot.docs
          .filter((doc) => doc.data().studioName)
          .map((doc) => ({ id: doc.id, ...doc.data() }));

        setStudios(studiosOfUser);
      } finally {
        setIsLoading(false);
      }
    };

    getStudioCreated();
  }, []);

  useEffect(() => {
    async function main() {
      try {
        setIsLoading(true);

        const workshopDoc = await getDoc(
          doc(db, COLLECTIONS.WORKSHOPS, workshopId)
        );

        let foundWorkshop = { id: workshopDoc.id, ...workshopDoc.data() };

        let fetchedWorkshopData = {
          workshopName: foundWorkshop?.workshopName || "",
          description: foundWorkshop?.description || "",
          danceStyles: foundWorkshop?.danceStyles || [],
          level: foundWorkshop?.level || "",
          startDate: foundWorkshop?.startDate
            ? dayjs(foundWorkshop.startDate)
            : null,
          endDate: foundWorkshop?.endDate ? dayjs(foundWorkshop.endDate) : null,
          venueDetails: foundWorkshop?.venueDetails || null,
        };

        if (foundWorkshop?.events && foundWorkshop.events?.length) {
          fetchedWorkshopData.events = foundWorkshop.events.map((event) => ({
            ...event,
            startTime: event.startTime
              ? dayjs(event.startTime, "HH:mm:ss")
              : null,
            endTime: event.endTime ? dayjs(event.endTime, "HH:mm:ss") : null,
            date: event.date ? dayjs(event.date) : null,
          }));
        } else {
          fetchedWorkshopData.events = [];
        }

        if (foundWorkshop?.videoLink) {
          fetchedWorkshopData.videoLink = foundWorkshop?.videoLink;
          setIsVideoLink(true);
        }

        if (
          foundWorkshop?.venueDetails &&
          Object.keys(foundWorkshop.venueDetails).includes("studio")
        ) {
          fetchedWorkshopData.venueType = "Studio";
        } else {
          fetchedWorkshopData.venueType = "Independent";
        }

        setFormData((prev) => ({ ...prev, ...fetchedWorkshopData }));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    main();
  }, [workshopId]);

  useEffect(() => {
    if (isDarkModeOn && step === 1) {
      const toolbarEle =
        document.getElementsByClassName("ql-toolbar ql-snow")[0];
      toolbarEle.style.backgroundColor = "white";

      const inputEle = document.getElementsByClassName(
        "ql-container ql-snow"
      )[0];
      inputEle.style.backgroundColor = "white";

      const editEle = document.getElementsByClassName("ql-editor ")[0];
      inputEle.style.color = "black";
    }
  }, [isDarkModeOn, step]);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography
          variant="body1"
          sx={{
            my: 3,
            fontSize: "35px",
            color: isDarkModeOn ? "white" : "black",
            fontFamily: "Nunito Sans",
          }}
        >
          Add new Workshop
        </Typography>

        <Paper
          elevation={2}
          sx={{
            my: 3,
            p: 3,
            borderRadius: 2,
            bgcolor: isDarkModeOn ? "#00000040" : "unset",
          }}
        >
          {step === 1 && (
            <Form id="addStudioForm" onSubmit={gotoStep2}>
              <Typography
                variant="h6"
                sx={{
                  color: isDarkModeOn ? "white" : "black",
                  textTransform: "capitalize",
                }}
                gutterBottom
              >
                Workshop Info
              </Typography>

              <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Workshop Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="workshopName"
                    sx={{ height: FORM_FIELD_HEIGHT }}
                    variant="outlined"
                    InputLabelProps={{ shrink: false }}
                    placeholder="Enter workshop name"
                    value={formData.workshopName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Description
                  </Typography>
                  <ReactQuill
                    theme="snow"
                    placeholder="Enter Description"
                    value={formData.description}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, description: value }));
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "16px" }}
                      gutterBottom
                    >
                      Workshop Media
                    </Typography>
                    <Box sx={{ display: "flex" }}>
                      <ButtonGroup>
                        <Button
                          size="small"
                          variant={!isVideoLink ? "contained" : "outlined"}
                          onClick={() => setIsVideoLink(false)}
                          startIcon={<ImageIcon />}
                          sx={{
                            textTransform: "capitalize",
                            ...(!isVideoLink && {
                              bgcolor: "#67569E",
                              color: "white",
                              "&:hover": {
                                bgcolor: "#67569E",
                                color: "white",
                              },
                            }),
                            ...(isVideoLink && {
                              color: "text.primary",
                              borderColor: "divider",
                              "&:hover": {
                                bgcolor: "action.hover",
                                borderColor: "divider",
                              },
                            }),
                          }}
                        >
                          Upload Image
                        </Button>
                        <Button
                          size="small"
                          variant={isVideoLink ? "contained" : "outlined"}
                          onClick={() => setIsVideoLink(true)}
                          startIcon={<YouTubeIcon />}
                          sx={{
                            textTransform: "capitalize",
                            ...(isVideoLink && {
                              bgcolor: "#67569E",
                              color: "white",
                              "&:hover": {
                                bgcolor: "#67569E",
                                color: "white",
                              },
                            }),
                            ...(!isVideoLink && {
                              color: "text.primary",
                              borderColor: "divider",
                              "&:hover": {
                                bgcolor: "action.hover",
                                borderColor: "divider",
                              },
                            }),
                          }}
                        >
                          YouTube Link
                        </Button>
                      </ButtonGroup>
                    </Box>
                  </Box>

                  {!isVideoLink ? (
                    <Box>
                      <Button
                        fullWidth
                        variant="outlined"
                        component="label"
                        startIcon={<UploadIcon sx={{ fontSize: 20 }} />}
                        sx={{
                          height: FORM_FIELD_HEIGHT,
                          color: isDarkModeOn ? "white" : "black",
                          borderColor: isDarkModeOn ? "#ffffff3b" : "#0000003b",
                          "&:hover": {
                            borderColor: isDarkModeOn
                              ? "#ffffff3b"
                              : "#0000003b",
                          },
                        }}
                      >
                        Upload Workshop Image
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          name="workshopImage"
                          onChange={handleImageUpload}
                        />
                      </Button>
                      {formData?.workshopImage && (
                        <Box
                          sx={{
                            fontSize: 12,
                            marginTop: 1,
                            color: isDarkModeOn ? "white" : "black",
                          }}
                        >
                          Selected file: {formData?.workshopImage?.name}
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <TextField
                      fullWidth
                      name="videoLink"
                      value={formData.videoLink || ""}
                      onChange={handleChange}
                      sx={{ height: FORM_FIELD_HEIGHT }}
                      variant="outlined"
                      InputLabelProps={{ shrink: false }}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Dance Styles
                  </Typography>
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    options={danceStylesOptions}
                    value={formData.danceStyles}
                    onChange={(_, value) => {
                      setFormData((prev) => ({ ...prev, danceStyles: value }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select Dance Styles"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Level
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      displayEmpty
                      sx={{ height: FORM_FIELD_HEIGHT }}
                    >
                      <MenuItem value="">Select level</MenuItem>
                      {Object.values(LEVELS).map((level, index) => (
                        <MenuItem key={index} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Start Date
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ width: "100%" }}
                      name="startDate"
                      value={
                        formData.startDate ? dayjs(formData.startDate) : null
                      }
                      onChange={(newValue) =>
                        handleDateChange("startDate")(
                          newValue ? newValue.toDate() : null
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    End Date
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ width: "100%" }}
                      name="endDate"
                      value={formData.endDate ? dayjs(formData.endDate) : null}
                      onChange={(newValue) =>
                        handleDateChange("endDate")(
                          newValue ? newValue.toDate() : null
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                        />
                      )}
                      minDate={
                        formData.startDate ? dayjs(formData.startDate) : null
                      }
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "16px",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    gutterBottom
                  >
                    Venue Type
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="venueType"
                      value={formData.venueType || ""}
                      onChange={handleVenueTypeChange}
                      displayEmpty
                      sx={{ height: FORM_FIELD_HEIGHT }}
                    >
                      <MenuItem value="Studio">Studio address</MenuItem>
                      <MenuItem value="Independent">
                        Independent location
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {formData.venueType === "Studio" && (
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "16px",
                        color: isDarkModeOn ? "white" : "black",
                      }}
                      gutterBottom
                    >
                      Select Studio Address
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        name="studio"
                        value={formData.venueDetails?.studio || ""}
                        onChange={handleStudioChange}
                        displayEmpty
                        sx={{ height: FORM_FIELD_HEIGHT }}
                      >
                        <MenuItem value="">Select studio address</MenuItem>
                        {studios.map((studio, index) => {
                          const studioAddress = `${
                            studio.buildingName
                              ? studio.buildingName + ", "
                              : ""
                          }${studio.street}, ${studio.city}, ${studio.state}, ${
                            studio.country
                          } - ${studio.pincode}`;

                          return (
                            <MenuItem key={index} value={studio?.id || ""}>
                              {studio?.studioName} - {studioAddress}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {formData.venueType === "Independent" && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "16px" }}
                        gutterBottom
                      >
                        Building Name
                      </Typography>
                      <TextField
                        fullWidth
                        name="buildingName"
                        value={formData.venueDetails?.buildingName || ""}
                        onChange={handleIndependentVenueChange}
                        sx={{ height: FORM_FIELD_HEIGHT }}
                        variant="outlined"
                        InputLabelProps={{ shrink: false }}
                        placeholder="Enter building name"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "16px",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                        gutterBottom
                      >
                        Landmark
                      </Typography>
                      <TextField
                        fullWidth
                        name="landmark"
                        value={formData.venueDetails?.landmark || ""}
                        onChange={handleIndependentVenueChange}
                        sx={{ height: FORM_FIELD_HEIGHT }}
                        variant="outlined"
                        InputLabelProps={{ shrink: false }}
                        placeholder="Enter nearby landmark"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "16px",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                        gutterBottom
                      >
                        Street Address
                      </Typography>
                      <TextField
                        fullWidth
                        name="streetAddress"
                        value={formData.venueDetails?.streetAddress || ""}
                        onChange={handleIndependentVenueChange}
                        sx={{ height: FORM_FIELD_HEIGHT }}
                        variant="outlined"
                        InputLabelProps={{ shrink: false }}
                        placeholder="Enter street address"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "16px",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                        gutterBottom
                      >
                        Pincode
                      </Typography>
                      <TextField
                        fullWidth
                        name="pincode"
                        value={formData.venueDetails?.pincode || ""}
                        onChange={handleIndependentVenueChange}
                        sx={{ height: FORM_FIELD_HEIGHT }}
                        variant="outlined"
                        InputLabelProps={{ shrink: false }}
                        placeholder="Enter pincode"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "16px",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                        gutterBottom
                      >
                        City
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          name="city"
                          value={formData.venueDetails?.city || ""}
                          onChange={handleIndependentVenueChange}
                          displayEmpty
                          sx={{ height: FORM_FIELD_HEIGHT }}
                          variant="outlined"
                          InputLabelProps={{ shrink: false }}
                          placeholder="Enter city"
                        >
                          <MenuItem value="">Select city</MenuItem>
                          {cityOptions.map((city, index) => (
                            <MenuItem key={index} value={city}>
                              {city}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "16px",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                        gutterBottom
                      >
                        State
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          name="state"
                          value={formData.venueDetails?.state || ""}
                          onChange={handleIndependentVenueChange}
                          displayEmpty
                          sx={{ height: FORM_FIELD_HEIGHT }}
                        >
                          <MenuItem value="">Select state</MenuItem>
                          {stateOptions.map((state, index) => (
                            <MenuItem key={index} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "16px",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                        gutterBottom
                      >
                        Google Maps Address
                      </Typography>
                      <MapsInput
                        selectedLocation={
                          formData.venueDetails?.selectedLocation
                        }
                        setSelectedLocation={(data) =>
                          setFormData((prev) => ({
                            ...prev,
                            venueDetails: {
                              ...prev.venueDetails,
                              selectedLocation: data,
                            },
                          }))
                        }
                        mapAddress={formData.venueDetails?.mapAddress}
                        setMapAddress={(data) =>
                          setFormData((prev) => ({
                            ...prev,
                            venueDetails: {
                              ...prev.venueDetails,
                              mapAddress: data,
                            },
                          }))
                        }
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12} sx={{ textAlign: "right" }}>
                  <MuiButton
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    sx={{
                      bgcolor: "#67569E",
                      color: "white",
                      textTransform: "capitalize",
                      "&:hover": { bgcolor: "#67569E", color: "white" },
                    }}
                  >
                    Next
                  </MuiButton>
                </Grid>
              </Grid>
            </Form>
          )}

          {step === 2 && (
            <WorkshopStep2EventInfo
              onBack={() => setStep((prev) => prev - 1)}
              onSubmit={handleUpdateWorkshop}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default WorkshopUpdate;
