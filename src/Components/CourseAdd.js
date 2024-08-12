import React, { useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Button as MuiButton } from "@mui/material";
import { useState } from "react";
import { db } from "../config";
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { COLLECTIONS, DRAFT_COLLECTIONS } from "../constants";
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

const FILTER_LOCATION_KEY = "filterLocation";
const DRAFT_INTERVAL_TIME = 1000 * 10;

function CourseAdd({ instructors, studioId, setCourses }) {
  const showSnackbar = useSnackbar();
  const [newWorkshopId, setNewWorkshopId] = useState("");
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);

  const instructorNamesWithIds = instructors.map(
    (instructor) => `${instructor.name} - ${instructor.id}`
  );

  const danceStylesOptions = danceStyles.danceStyles;

  const [isReady, setIsReady] = useState(false);
  const [selectedDurationUnit, setSelectedDurationUnit] = useState("");
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

  const handleDurationUnitChange = (event, value) => {
    setSelectedDurationUnit(value);
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

  const isValidInputs = (form) => {
    let validationFailed = true;
    if (
      !form.name.value ||
      !form.duration.value ||
      !form.workshopFees.value ||
      !form.workshopVenue.value ||
      !form.description.value ||
      !selectedDanceStyles?.length ||
      !selectedInstructors?.length ||
      !selectedStudio ||
      !selectedDurationUnit ||
      !selectedLevel ||
      !workshopTime ||
      !workshopDate
    )
      validationFailed = false;

    return validationFailed;
  };

  const resetDraft = async () => {
    const q = query(
      collection(db, DRAFT_COLLECTIONS.DRAFT_COURSES),
      where("UserId", "==", JSON.parse(localStorage.getItem("userInfo")).UserId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      let studios = [];

      querySnapshot.forEach((doc) => {
        studios.push({ id: doc.id, ...doc.data() });
      });

      let foundStudio = studios[0];

      const studioRef = doc(
        db,
        DRAFT_COLLECTIONS.DRAFT_COURSES,
        foundStudio.id
      );

      await deleteDoc(studioRef);
    }
  };

  const handleAddStudio = async (event) => {
    event.preventDefault();
    const form = event.target;

    if (!isValidInputs(form)) {
      showSnackbar("Please fill all the fields.", "error");
      return;
    }

    try {
      const dbPayload = {
        name: event.target.name.value,
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
        duration: event.target.duration.value,
        durationUnit: selectedDurationUnit,
        level: selectedLevel,
        time: workshopTime,
        date: workshopDate.format("YYYY-MM-DD"),
        price: event.target.workshopFees.value,
        venue: event.target.workshopVenue.value,
        description: event.target.description.value,
        city: localStorage.getItem(FILTER_LOCATION_KEY) || null,
      };

      const workshopRef = await addDoc(
        collection(db, COLLECTIONS.COURSES),
        dbPayload
      );

      setNewWorkshopId(workshopRef.id);
      setCourses((prev) => [...prev, { id: workshopRef.id, ...dbPayload }]);

      const userRef = doc(
        db,
        "User",
        JSON.parse(localStorage.getItem("userInfo")).UserId
      );
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        if (userSnap.data() != null) {
          await updateDoc(userRef, {
            CourseCreated: [...userSnap.data().CourseCreated, workshopRef.id],
          });
        }
      }

      clearForm(form);
      resetDraft();
      showSnackbar("Course successfully added.", "success");
    } catch (error) {
      console.error("Error adding workshop: ", error);
      showSnackbar(error?.message || "Something went wrong", "error");
    }
  };

  const clearForm = (form) => {
    form.reset();
    setSelectedDanceStyles([]);
    setSelectedInstructors([]);
    setSelectedStudio(null);
    setSelectedDurationUnit('');
    setSelectedLevel("");
    setWorkshopTime("");
    setWorkshopDate(dayjs(Date.now()));
  };

  const handleTimeSelect = (startTime, endTime) => {
    const [currentStartTime, currentEndTime] = workshopTime.split(" - ");
    let newTime = `${currentStartTime} - ${currentEndTime}`;

    if (startTime !== null) newTime = `${startTime} - ${currentEndTime}`;
    if (endTime !== null) newTime = `${currentStartTime} - ${endTime}`;

    setWorkshopTime(newTime);
  };

  useEffect(() => {
    async function main() {
      const form = document.getElementById("addStudioForm");

      try {
        const q = query(
          collection(db, DRAFT_COLLECTIONS.DRAFT_COURSES),
          where(
            "UserId",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).UserId
          )
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          let courses = [];

          querySnapshot.forEach((doc) => {
            courses.push({ id: doc.id, ...doc.data() });
          });

          let foundCourse = courses[0];

          form.name.value = foundCourse.name;
          form.workshopFees.value = foundCourse.price;
          form.workshopVenue.value = foundCourse.venue;
          form.description.value = foundCourse.description;
          form.duration.value = foundCourse.duration;

          setSelectedDanceStyles(
            foundCourse?.danceStyles?.length ? foundCourse.danceStyles : []
          );

          setSelectedInstructors(
            instructors
              .filter((instructor) =>
                foundCourse?.instructors.includes(instructor.id)
              )
              .map((instructor) => `${instructor.name} - ${instructor.id}`)
          );

          const studios = studioId.map((studio) => studio.split(":")[1].trim());
          const currentStudioIndex = studios.findIndex(
            (studio) => studio === foundCourse?.StudioId
          );
          if (currentStudioIndex > 0)
            setSelectedStudio(studioId[currentStudioIndex]);

          setSelectedDurationUnit(foundCourse.durationUnit);

          setSelectedLevel(foundCourse?.level || "");
          setWorkshopTime(foundCourse?.time || "");
          setWorkshopDate(dayjs(foundCourse?.date || Date.now()));
        } else {
          await addDoc(collection(db, DRAFT_COLLECTIONS.DRAFT_COURSES), {
            name: form.name.value,
            duration: form.duration.value,
            price: form.workshopFees.value,
            venue: form.workshopVenue.value,
            description: form.description.value,

            danceStyles: selectedDanceStyles,
            instructors: selectedInstructors
              ? selectedInstructors?.map?.(
                  (instructor) =>
                    instructor?.split?.("-")?.[1]?.trim?.() || null
                )
              : null,
            author: JSON.parse(localStorage.getItem("userInfo")).displayName,
            UserId: JSON.parse(localStorage.getItem("userInfo")).UserId,
            creatorEmail: JSON.parse(localStorage.getItem("userInfo")).email,
            StudioId: selectedStudio
              ? selectedStudio?.split?.(":")?.[1]?.trim?.() || null
              : null,
            durationUnit: selectedDurationUnit,
            level: selectedLevel,
            time: workshopTime,
            date: workshopDate.format("YYYY-MM-DD"),
            city: localStorage.getItem(FILTER_LOCATION_KEY) || null,
          });
        }

        setIsReady(true);
      } catch (error) {
        console.error(error);
      }
    }

    main();
  }, []);

  useEffect(() => {
    let intervalId = null;

    async function main() {
      const form = document.getElementById("addStudioForm");

      try {
        const q = query(
          collection(db, DRAFT_COLLECTIONS.DRAFT_COURSES),
          where(
            "UserId",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).UserId
          )
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          let openClasses = [];

          querySnapshot.forEach((doc) => {
            openClasses.push({ id: doc.id, ...doc.data() });
          });

          let foundOpenClasses = openClasses[0];

          const openClassRef = doc(
            db,
            DRAFT_COLLECTIONS.DRAFT_COURSES,
            foundOpenClasses.id
          );

          intervalId = setInterval(async () => {
            try {
              await updateDoc(openClassRef, {
                name: form.name.value,
                danceStyles: selectedDanceStyles,
                instructors: selectedInstructors
                  ? selectedInstructors?.map?.(
                      (instructor) =>
                        instructor?.split?.("-")?.[1]?.trim?.() || null
                    )
                  : null,
                StudioId: selectedStudio
                  ? selectedStudio?.split?.(":")?.[1]?.trim?.() || null
                  : null,
                duration: form.duration.value,
                durationUnit: selectedDurationUnit,
                level: selectedLevel,
                time: workshopTime,
                date: workshopDate.format("YYYY-MM-DD"),
                price: form.workshopFees.value,
                venue: form.workshopVenue.value,
                description: form.description.value,
              });
            } catch (error) {
              console.error(error);
            }
          }, DRAFT_INTERVAL_TIME);
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (isReady) main();

    return () => clearInterval(intervalId);
  }, [
    isReady,
    selectedDanceStyles,
    selectedInstructors,
    selectedStudio,
    selectedDurationUnit,
    selectedLevel,
    workshopTime,
    workshopDate,
  ]);

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
                    title={"Course Images"}
                    storageFolder={STORAGES.COURSEICON}
                    maxImageCount={1}
                  ></ImageUpload>
                </Col>

                <Col md={6}>
                  <Form.Label>Couese Name</Form.Label>
                  <Form.Control
                    rows={1}
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    type="textarea"
                    placeholder="Enter course name"
                    name="name"
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
                  <Row>
                    <Col md={6}>
                      <Form.Label>Duration</Form.Label>
                      <Form.Control
                        rows={1}
                        style={{
                          backgroundColor: isDarkModeOn ? "#333333" : "",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                        type="number"
                        placeholder="Enter Duration"
                        name="duration"
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label>Duration In Units</Form.Label>
                      <ThemeProvider theme={darkTheme}>
                        <CssBaseline />

                        <Autocomplete
                          style={{
                            backgroundColor: isDarkModeOn ? "#333333" : "",
                            color: isDarkModeOn ? "white" : "black",
                          }}
                          id="tags-standard"
                          options={["Months", "Weeks", "Days"]}
                          value={selectedDurationUnit}
                          onChange={handleDurationUnitChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              placeholder="Select Duration In Units"
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
                  <Form.Label>Course Start Date</Form.Label>
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
                  <Form.Label>Brief Description</Form.Label>
                  <Form.Control
                    rows={3}
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    as="textarea"
                    placeholder="Enter Description"
                    name="description"
                  />
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
                    Add Course
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
            New Course Created with id {newWorkshopId}. Now u can upload images
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

export default CourseAdd;
