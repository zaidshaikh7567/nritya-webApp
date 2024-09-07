import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Button as MuiButton } from "@mui/material";
import { db } from "../config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { COLLECTIONS, LEVELS } from "../constants";
import ImageUpload from "./ImageUpload";
import { STORAGES } from "../constants";
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import danceStyles from "../danceStyles.json";
import { Autocomplete, TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import TimeRange from "./TimeRange";
import { useSnackbar } from "../context/SnackbarContext";
import cities from '../cities.json';

const FILTER_LOCATION_KEY = "filterLocation";

function OpenClassUpdate({ workshopId, instructors, studioId }) {
  const currentCity = localStorage.getItem(FILTER_LOCATION_KEY) || "";

  const showSnackbar = useSnackbar();

  const [selectedStudio, setSelectedStudio] = useState(null);
  const [selectedInstructors, setSelectedInstructors] = useState([]);

  const danceStylesOptions = danceStyles.danceStyles;
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [openClassTime, setOpenClassTime] = useState("");
  const [openClassDate, setOpenClassDate] = useState(dayjs(new Date()));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const instructorNamesWithIds = instructors.map(
    (instructor) => `${instructor.name} - ${instructor.id}`
  );

  const darkTheme = createTheme({
    palette: {
      mode: isDarkModeOn ? "dark" : "light",
    },
  });

  const handleDanceStylesChange = (event, value) => {
    setSelectedDanceStyles(value);
  };

  const [selectedOpenClassId, setSelectedOpenClassId] = useState("");
  const [selectedOpenClass, setSelectedOpenClass] = useState(null);

  const handleSelectStudio = async (event) => {
    event.preventDefault();
    const selected = event.target.value;
    const selectedId = selected.split(":").pop().trim();
    setSelectedOpenClassId(selectedId);
    try {
      const studioDoc = await getDoc(
        doc(db, COLLECTIONS.OPEN_CLASSES, selectedId)
      );
      if (studioDoc.exists) {
        setSelectedOpenClass(studioDoc.data());
      } else {
        setSelectedOpenClass(null);
      }
    } catch (error) {
      console.error("Error fetching workshop data:", error, selectedId);
    }
  };

  const isValidInputs = (form) => {
    let validationFailed = true;
    if (
      !form.openClassName.value ||
      !form.openClassVenue.value ||
      !form.description.value ||
      !selectedDanceStyles?.length ||
      !selectedInstructors?.length ||
      !selectedStudio ||
      !selectedDuration ||
      !selectedLevel ||
      !openClassTime ||
      !openClassDate ||
      !selectedCity
    )
      validationFailed = false;

    return validationFailed;
  };

  const handleUpdateStudio = async (event) => {
    event.preventDefault();
    const form = event.target;

    if (!selectedOpenClassId) return;

    if (!isValidInputs(form)) {
      showSnackbar("Please fill all the fields.", "error");
      return;
    }

    try {
      const dbPayload = {
        openClassName: form.openClassName.value,
        venue: form.openClassVenue.value,
        description: form.description.value,
        danceStyles: selectedDanceStyles,
        instructors: selectedInstructors
          ? selectedInstructors?.map?.(
              (instructor) => instructor?.split?.("-")?.[1]?.trim?.() || null
            )
          : null,
        author: JSON.parse(localStorage.getItem("userInfo")).displayName,
        UserId: JSON.parse(localStorage.getItem("userInfo")).UserId,
        creatorEmail: JSON.parse(localStorage.getItem("userInfo")).email,
        StudioId: selectedStudio
          ? selectedStudio?.split?.(":")?.[1]?.trim?.() || null
          : null,
        duration: selectedDuration,
        level: selectedLevel,
        time: openClassTime,
        date: openClassDate.format("YYYY-MM-DD"),
        city: selectedCity,
      };

      setIsSubmitting(true);

      const studioRef = doc(db, COLLECTIONS.OPEN_CLASSES, selectedOpenClassId);

      await updateDoc(studioRef, dbPayload);

      clearForm(form);
      showSnackbar("Open class successfully updated.", "success");
    } catch (error) {
      console.error("Error updating workshop: ", error);
      showSnackbar(error?.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
    document.getElementById("updateStudioForm").reset();
  };

  const clearForm = (form) => {
    form.reset();
    setSelectedDanceStyles([]);
    setSelectedInstructors([]);
    setSelectedStudio(null);
    setSelectedDuration("");
    setSelectedLevel("");
    setOpenClassTime("");
    setOpenClassDate(dayjs(new Date()));
    setSelectedCity('');
    setSelectedOpenClass(null);
    setSelectedOpenClassId("");
  };

  const handleDurationChange = (event, value) => {
    setSelectedDuration(value);
  };

  const handleLevelChange = (event, value) => {
    setSelectedLevel(value);
  };

  const handleCityChange = (event, value) => {
    setSelectedCity(value);
  };

  const handleSelectStudioValue = (event, value) => {
    setSelectedStudio(value);
  };

  const handleInstructorChange = (event, value) => {
    setSelectedInstructors(value);
  };

  const handleTimeSelect = (startTime, endTime) => {
    const [currentStartTime, currentEndTime] = openClassTime.split(" - ");
    let newTime = `${currentStartTime} - ${currentEndTime}`;

    if (startTime !== null) newTime = `${startTime} - ${currentEndTime}`;
    if (endTime !== null) newTime = `${currentStartTime} - ${endTime}`;

    setOpenClassTime(newTime);
  };

  useEffect(() => {
    if (selectedOpenClass) {
      const addedInstructors = instructors
        .filter((instructor) =>
          selectedOpenClass.instructors.includes(instructor.id)
        )
        .map((instructor) => `${instructor.name} - ${instructor.id}`);

      setSelectedInstructors(addedInstructors);
      if (selectedOpenClass && selectedOpenClass.danceStyles)
        setSelectedDanceStyles(selectedOpenClass.danceStyles);

      if (selectedOpenClass && selectedOpenClass.duration)
        setSelectedDuration(selectedOpenClass.duration);

      if (selectedOpenClass && selectedOpenClass.level)
        setSelectedLevel(selectedOpenClass.level);

      if (selectedOpenClass && selectedOpenClass.time)
        setOpenClassTime(selectedOpenClass.time);

      if (selectedOpenClass && selectedOpenClass.date)
        setOpenClassDate(dayjs(selectedOpenClass.date));

      if (selectedOpenClass && selectedOpenClass.StudioId) {
        const studios = studioId.map((studio) => studio.split(":")[1].trim());
        const currentStudioIndex = studios.findIndex(
          (studio) => studio === selectedOpenClass.StudioId
        );
        setSelectedStudio(studioId[currentStudioIndex] || null);
      }

      setSelectedCity(selectedOpenClass?.city || '');
    }
  }, [selectedOpenClass]);

  return (
    <div
      style={{
        backgroundColor: isDarkModeOn ? "#202020" : "",
        color: isDarkModeOn ? "white" : "black",
      }}
    >
      <br></br>
      <Form id="updateStudioForm" onSubmit={handleUpdateStudio}>
        <Form.Group controlId="formBasicUpdate">
          <Form.Label>Id</Form.Label>
          <Form.Control
            as="select"
            name="nameId"
            style={{
              backgroundColor: isDarkModeOn ? "#333333" : "",
              color: isDarkModeOn ? "white" : "black",
            }}
            onChange={handleSelectStudio}
          >
            <option value="">Select a open class...</option>
            {workshopId && workshopId.length > 0 ? (
              workshopId.map((workshopItem) => (
                <option key={workshopItem} value={workshopItem}>
                  {workshopItem}
                </option>
              ))
            ) : (
              <option value="">No open class yet!</option>
            )}
          </Form.Control>

          <div>
            <Row>
              <Col md={6}>
                <ImageUpload
                  entityId={selectedOpenClassId}
                  title={"Open class Images"}
                  storageFolder={STORAGES.OPENCLASSICON}
                  maxImageCount={1}
                ></ImageUpload>
              </Col>

              <Col md={6}>
              <br />
                <Form.Label>Open Class Name</Form.Label>
                <Form.Control
                  rows={1}
                  defaultValue={
                    selectedOpenClass ? selectedOpenClass.openClassName : ""
                  }
                  style={{
                    backgroundColor: isDarkModeOn ? "#333333" : "",
                    color: isDarkModeOn ? "white" : "black",
                  }}
                  type="textarea"
                  placeholder="Enter open class name"
                  name="openClassName"
                />

                <br />

                <Form.Label>Dance Styles</Form.Label>
                <ThemeProvider theme={darkTheme}>
                  <CssBaseline />

                  <Autocomplete
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    multiple
                    id="tags-standard"
                    options={danceStylesOptions}
                    value={selectedDanceStyles}
                    onChange={handleDanceStylesChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder="Select Dance Styles"
                        style={{
                          backgroundColor: isDarkModeOn ? "#333333" : "",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                      />
                    )}
                  />
                </ThemeProvider>

                <br />

                <Form.Label>Names of Instructors</Form.Label>
                <ThemeProvider theme={darkTheme}>
                  <CssBaseline />
                  <Autocomplete
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    multiple
                    id="tags-standard"
                    options={instructorNamesWithIds}
                    value={selectedInstructors}
                    onChange={handleInstructorChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder="Select Instructors"
                        style={{
                          backgroundColor: isDarkModeOn ? "#333333" : "",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                      />
                    )}
                  />
                </ThemeProvider>
              </Col>
            </Row>

            <br />

            <Row>
              <Col md={6}>
                <Form.Label>Duration (in hours)</Form.Label>
                <ThemeProvider theme={darkTheme}>
                  <CssBaseline />

                  <Autocomplete
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    id="tags-standard"
                    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                    value={selectedDuration}
                    onChange={handleDurationChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder="Select Duration"
                        style={{
                          backgroundColor: isDarkModeOn ? "#333333" : "",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                      />
                    )}
                  />
                </ThemeProvider>
              </Col>

              <Col md={6}>
                <TimeRange
                  defaultTime={openClassTime || "00:00-00:00"}
                  handleSelect={handleTimeSelect}
                />
              </Col>
            </Row>

            <br />

            <Row>
              <Col md={6}>
                <Form.Label>Date</Form.Label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <ThemeProvider theme={darkTheme}>
                      <CssBaseline />
                      <DatePicker
                        sx={{ width: "100%" }}
                        value={openClassDate}
                        onChange={(newValue) => setOpenClassDate(newValue)}
                      />
                    </ThemeProvider>
                  </DemoContainer>
                </LocalizationProvider>
              </Col>
              <Col md={6}>
                <Form.Label>Level</Form.Label>
                <ThemeProvider theme={darkTheme}>
                  <CssBaseline />

                  <Autocomplete
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    id="tags-standard"
                    options={[LEVELS.ALL, LEVELS.BEGINNERS, LEVELS.INTERMEDIATE, LEVELS.ADVANCED]}
                    value={selectedLevel}
                    onChange={handleLevelChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder="Select Level"
                        style={{
                          backgroundColor: isDarkModeOn ? "#333333" : "",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                      />
                    )}
                  />
                </ThemeProvider>
              </Col>
            </Row>

            <br />

            <Row>
              <Col md={6}>
                <Form.Label>Venue</Form.Label>
                <Form.Control
                  rows={1}
                  defaultValue={
                    selectedOpenClass ? selectedOpenClass.venue : ""
                  }
                  style={{
                    backgroundColor: isDarkModeOn ? "#333333" : "",
                    color: isDarkModeOn ? "white" : "black",
                  }}
                  type="text"
                  placeholder="Enter Venue"
                  name="openClassVenue"
                />
              </Col>
              <Col md={6}>
                <Form.Label>City</Form.Label>
                <ThemeProvider theme={darkTheme}>
                  <CssBaseline />

                  <Autocomplete
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    id="tags-standard"
                    options={cities.cities}
                    value={selectedCity}
                    onChange={handleCityChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder="Select City"
                        style={{
                          backgroundColor: isDarkModeOn ? "#333333" : "",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                      />
                    )}
                  />
                </ThemeProvider>
              </Col>
            </Row>

            <br />

            <Row>
              <Col md={6}>
                <Form.Label>Studio</Form.Label>
                <ThemeProvider theme={darkTheme}>
                  <CssBaseline />

                  <Autocomplete
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    id="tags-standard"
                    options={studioId}
                    value={selectedStudio}
                    onChange={handleSelectStudioValue}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder="Select Studio"
                        style={{
                          backgroundColor: isDarkModeOn ? "#333333" : "",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                      />
                    )}
                  />
                </ThemeProvider>
              </Col>
              <Col md={6}>
                <Form.Label>Brief Description</Form.Label>
                <Form.Control
                  rows={3}
                  defaultValue={
                    selectedOpenClass ? selectedOpenClass.description : ""
                  }
                  style={{
                    backgroundColor: isDarkModeOn ? "#333333" : "",
                    color: isDarkModeOn ? "white" : "black",
                  }}
                  as="textarea"
                  placeholder="Enter Description"
                  name="description"
                />
              </Col>
            </Row>

            <br />
            <hr></hr>

            <Row>
              <Col xs={6}></Col>
              <Col xs={6} className="d-flex justify-content-end">
                <MuiButton
                  variant="contained"
                  style={{
                    color: "white",
                    backgroundColor: isDarkModeOn ? "#892cdc" : "black",
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Update Open Class
                </MuiButton>
              </Col>
            </Row>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
}

export default OpenClassUpdate;
