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
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FILTER_LOCATION_KEY = "filterLocation";

function WorkshopUpdate({ workshopId, instructors, studioId }) {
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
  const [description, setDescription] = useState('');
  const [workshopTime, setWorkshopTime] = useState("");
  const [workshopDate, setWorkshopDate] = useState(dayjs(new Date()));
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

  const [selectedWorkshopId, setSelectedWorkshopId] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  const handleSelectStudio = async (event) => {
    event.preventDefault();
    const selected = event.target.value;
    const selectedId = selected.split(":").pop().trim();
    setSelectedWorkshopId(selectedId);
    try {
      const studioDoc = await getDoc(
        doc(db, COLLECTIONS.WORKSHOPS, selectedId)
      );
      if (studioDoc.exists) {
        setSelectedWorkshop(studioDoc.data());
      } else {
        setSelectedWorkshop(null);
      }
    } catch (error) {
      console.error("Error fetching workshop data:", error, selectedId);
    }
  };

  const isValidInputs = (form) => {
    let validationFailed = true;
    if (
      !form.workshopName.value ||
      !form.workshopFees.value ||
      !description ||
      !selectedDanceStyles?.length ||
      !selectedInstructors?.length ||
      !selectedStudio ||
      !selectedDuration ||
      !selectedLevel ||
      !workshopTime ||
      !workshopDate ||
      !selectedCity
    )
      validationFailed = false;

    return validationFailed;
  };

  const handleUpdateStudio = async (event) => {
    event.preventDefault();
    const form = event.target;

    if (!selectedWorkshopId) return;

    if (!isValidInputs(form)) {
      showSnackbar("Please fill all the fields.", "error");
      return;
    }

    try {
      const dbPayload = {
        workshopName: form.workshopName.value,
        price: form.workshopFees.value,
        capacity: form.capacity.value,
        venue: form.workshopVenue.value,
        description: description,
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
        time: workshopTime,
        date: workshopDate.format("YYYY-MM-DD"),
        city: selectedCity,
        youtubeViedoLink: form.youtubeViedoLink.value,
      };

      setIsSubmitting(true);

      const studioRef = doc(db, COLLECTIONS.WORKSHOPS, selectedWorkshopId);

      await updateDoc(studioRef, dbPayload);

      clearForm(form);
      showSnackbar("Workshop successfully updated.", "success");
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
    setWorkshopTime("");
    setWorkshopDate(dayjs(new Date()));
    setSelectedCity('');
    setSelectedWorkshop(null);
    setSelectedWorkshopId("");
    setDescription('');
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
    const [currentStartTime, currentEndTime] = workshopTime.split(" - ");
    let newTime = `${currentStartTime} - ${currentEndTime}`;

    if (startTime !== null) newTime = `${startTime} - ${currentEndTime}`;
    if (endTime !== null) newTime = `${currentStartTime} - ${endTime}`;

    setWorkshopTime(newTime);
  };

  useEffect(() => {
    if (selectedWorkshop) {
      const addedInstructors = instructors
        .filter((instructor) =>
          selectedWorkshop.instructors.includes(instructor.id)
        )
        .map((instructor) => `${instructor.name} - ${instructor.id}`);

      setSelectedInstructors(addedInstructors);
      if (selectedWorkshop && selectedWorkshop.danceStyles)
        setSelectedDanceStyles(selectedWorkshop.danceStyles);

      if (selectedWorkshop && selectedWorkshop.duration)
        setSelectedDuration(selectedWorkshop.duration);

      if (selectedWorkshop && selectedWorkshop.level)
        setSelectedLevel(selectedWorkshop.level);

      if (selectedWorkshop && selectedWorkshop.time)
        setWorkshopTime(selectedWorkshop.time);

      if (selectedWorkshop && selectedWorkshop.date)
        setWorkshopDate(dayjs(selectedWorkshop.date));

      if (selectedWorkshop && selectedWorkshop.StudioId) {
        const studios = studioId.map((studio) => studio.split(":")[1].trim());
        const currentStudioIndex = studios.findIndex(
          (studio) => studio === selectedWorkshop.StudioId
        );
        setSelectedStudio(studioId[currentStudioIndex] || null);
      }

      setSelectedCity(selectedWorkshop?.city || '');
      setDescription(selectedWorkshop?.description || '');
    }
  }, [selectedWorkshop]);

  useEffect(() => {
    if (isDarkModeOn) {
      const toolbarEle = document.getElementsByClassName("ql-toolbar ql-snow")[0]
      toolbarEle.style.backgroundColor = "white";

      const inputEle = document.getElementsByClassName("ql-container ql-snow")[0];
      inputEle.style.backgroundColor = "white";

      const editEle = document.getElementsByClassName("ql-editor ")[0];
      console.log(editEle);
      inputEle.style.color = "black";
    }
  }, [isDarkModeOn]);

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
            <option value="">Select a workshop...</option>
            {workshopId && workshopId.length > 0 ? (
              workshopId.map((workshopItem) => (
                <option key={workshopItem} value={workshopItem}>
                  {workshopItem}
                </option>
              ))
            ) : (
              <option value="">No workshop yet!</option>
            )}
          </Form.Control>

          <div>
            <Row>
              <Col md={6}>
                <ImageUpload
                  entityId={selectedWorkshopId}
                  title={"Workshop Images"}
                  storageFolder={STORAGES.WORKSHOPICON}
                  maxImageCount={1}
                ></ImageUpload>
              </Col>

              <Col md={6}>
                <br />

                <Form.Label>Workshop Name</Form.Label>
                <Form.Control
                  rows={1}
                  defaultValue={
                    selectedWorkshop ? selectedWorkshop.workshopName : ""
                  }
                  style={{
                    backgroundColor: isDarkModeOn ? "#333333" : "",
                    color: isDarkModeOn ? "white" : "black",
                  }}
                  type="textarea"
                  placeholder="Enter workshop name"
                  name="workshopName"
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
                  defaultTime={workshopTime || "00:00-00:00"}
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
                        value={workshopDate}
                        onChange={(newValue) => setWorkshopDate(newValue)}
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
                <Form.Label>Fees/Price</Form.Label>
                <Form.Control
                  rows={1}
                  defaultValue={selectedWorkshop ? selectedWorkshop.price : ""}
                  style={{
                    backgroundColor: isDarkModeOn ? "#333333" : "",
                    color: isDarkModeOn ? "white" : "black",
                  }}
                  type="number"
                  placeholder="Enter fees/price"
                  name="workshopFees"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Maximum capacity</Form.Label>
                <Form.Control
                  rows={1}
                  defaultValue={selectedWorkshop ? selectedWorkshop.capacity : 0}
                  style={{
                    backgroundColor: isDarkModeOn ? "#333333" : "",
                    color: isDarkModeOn ? "white" : "black",
                  }}
                  type="number"
                  placeholder="Enter capacity"
                  name="capacity"
                />
              </Col>
            </Row>

            <br />

            <Row>
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
            </Row>

            <br />

            <Row>
              <Col md={6}>
                <Form.Label>Brief Description</Form.Label>
                <ReactQuill
                  theme="snow"
                  placeholder="Enter Description"
                  value={description}
                  onChange={setDescription}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Youtube video Id</Form.Label>
                <Form.Control
                  rows={1}
                  defaultValue={
                    selectedWorkshop ? selectedWorkshop.youtubeId : ""
                  }
                  style={{
                    backgroundColor: isDarkModeOn ? "#333333" : "",
                    color: isDarkModeOn ? "white" : "black",
                  }}
                  type="text"
                  placeholder="Enter youtube videoId"
                  name="youtubeId"
                />
              </Col>
            </Row>
            <Row>
                <Col md={6}>
                  <Form.Label>Youtube video Link</Form.Label>
                  <Form.Control
                    rows={1}
                    defaultValue={
                      selectedWorkshop ? selectedWorkshop.youtubeViedoLink : ""
                    }
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    type="text"
                    placeholder="Enter youtube video link"
                    name="youtubeViedoLink"
                  />
                </Col>
              </Row>
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
                  Update Workshop
                </MuiButton>
              </Col>
            </Row>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
}

export default WorkshopUpdate;
