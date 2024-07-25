import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Button as MuiButton } from "@mui/material";
import { useState } from "react";
import { db } from "../config";
import { doc, getDoc, addDoc, updateDoc, collection } from "firebase/firestore";
import { COLLECTIONS } from "../constants";
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

function StudioAdd({ instructors, studioId }) {
  const [newWorkshopId, setNewWorkshopId] = useState("");
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);

  const instructorNamesWithIds = instructors.map(
    (instructor) => `${instructor.name} - ${instructor.id}`
  );

  const danceStylesOptions = danceStyles.danceStyles;

  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [workshopTime, setWorkshopTime] = useState("");
  const [workshopDate, setWorkshopDate] = useState(dayjs(new Date()));

  const darkTheme = createTheme({
    palette: {
      mode: isDarkModeOn ? "dark" : "light",
    },
  });

  const handleDanceStylesChange = (event, value) => {
    setSelectedDanceStyles(value);
  };

  const handleDurationChange = (event, value) => {
    setSelectedDuration(value);
  };

  const handleLevelChange = (event, value) => {
    setSelectedLevel(value);
  };

  const handleSelectStudio = (event, value) => {
    setSelectedStudio(value);
  };

  const handleInstructorChange = (event, value) => {
    setSelectedInstructors(value);
  };

  const handleAddStudio = async (event) => {
    event.preventDefault();
    const title = event.target.workshopName.value;
    if (!title) return;

    try {
      const dbPayload = {
        workshopName: event.target.workshopName.value,
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
        price: event.target.workshopFees.value,
        venue: event.target.workshopVenue.value,
      };

      const workshopRef = await addDoc(
        collection(db, COLLECTIONS.WORKSHOPS),
        dbPayload
      );

      setNewWorkshopId(workshopRef.id);
      const userRef = doc(
        db,
        "User",
        JSON.parse(localStorage.getItem("userInfo")).UserId
      );
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        if (userSnap.data() != null) {
          await updateDoc(userRef, {
            WorkshopCreated: [
              ...userSnap.data().WorkshopCreated,
              workshopRef.id,
            ],
          });
        }
      }
    } catch (error) {
      console.error("Error adding workshop: ", error);
    }
  };

  const handleTimeSelect = (startTime, endTime) => {
    const [currentStartTime, currentEndTime] = workshopTime.split(" - ");
    let newTime = `${currentStartTime} - ${currentEndTime}`;

    if (startTime !== null) newTime = `${startTime} - ${currentEndTime}`;
    if (endTime !== null) newTime = `${currentStartTime} - ${endTime}`;

    setWorkshopTime(newTime);
  };

  return (
    <div>
      <div>
        <Form
          id="addStudioForm"
          onSubmit={handleAddStudio}
          style={{
            backgroundColor: isDarkModeOn ? "#202020" : "",
            color: isDarkModeOn ? "white" : "black",
          }}
        >
          <Form.Group controlId="formBasicAdd">
            <div>
              <Row>
                <Col md={6}>
                  <ImageUpload
                    entityId={newWorkshopId}
                    title={"Workshop Images"}
                    storageFolder={STORAGES.WORKSHOPICON}
                    maxImageCount={1}
                  ></ImageUpload>
                </Col>

                <Col md={6}>
                  <Form.Label>Workshop Name</Form.Label>
                  <Form.Control
                    rows={1}
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
                      options={["Beginner", "Intermediate", "Advanced"]}
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
                  <Form.Label>Venue</Form.Label>
                  <Form.Control
                    rows={1}
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    type="text"
                    placeholder="Enter Venue"
                    name="workshopVenue"
                  />
                </Col>
              </Row>

              <br />

              <Row>
                <Col md={6}>
                  <Form.Label>Studio (optional)</Form.Label>
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
                      onChange={handleSelectStudio}
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
                <Col md={6}></Col>
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
                  >
                    Add Workshop
                  </MuiButton>
                </Col>
              </Row>
            </div>
          </Form.Group>
        </Form>

        {newWorkshopId === "" ? (
          ""
        ) : (
          <p>
            New Studio Created with id {newWorkshopId}. Now u can upload images
            regarding them
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", height: "auto" }}>
        <br></br>
      </div>

      <br></br>
    </div>
  );
}

export default StudioAdd;
