import React, { useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { LinearProgress, Button as MuiButton } from "@mui/material";
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
import { COLLECTIONS, DRAFT_COLLECTIONS, LEVELS } from "../constants";
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
import { postData } from "../utils/common";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { isEqual } from 'lodash';

const FILTER_LOCATION_KEY = "filterLocation";
const DRAFT_INTERVAL_TIME = 1000 * 10;

function CourseAdd({ instructors, studioId, setCourses }) {
  const showSnackbar = useSnackbar();
  const [newCourseId, setNewCourseId] = useState("");
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);

  const instructorNamesWithIds = instructors.map(
    (instructor) => `${instructor.name} - ${instructor.id}`
  );

  const danceStylesOptions = danceStyles.danceStyles;
  const currentCity = localStorage.getItem(FILTER_LOCATION_KEY) || "";

  const [isReady, setIsReady] = useState(false);
  const [selectedDurationUnit, setSelectedDurationUnit] = useState("");
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [courseTime, setCourseTime] = useState("");
  const [courseDate, setCourseDate] = useState(dayjs(new Date()));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');

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

  const handleCityChange = (event, value) => {
    setSelectedCity(value);
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
      !form.courseFees.value ||
      !description ||
      !selectedDanceStyles?.length ||
      !selectedInstructors?.length ||
      !selectedStudio ||
      !selectedDurationUnit ||
      !selectedLevel ||
      !courseTime ||
      !courseDate ||
      !selectedCity
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

  const handleAddCourse = async (event) => {
    event.preventDefault();
    const form = event.target;

    if (!isValidInputs(form)) {
      showSnackbar("Please fill all the fields.", "error");
      return;
    }

    try {
      const currentUserEmail = JSON.parse(localStorage.getItem("userInfo")).email;
      const dbPayload = {
        courseName: event.target.name.value,
        danceStyles: selectedDanceStyles,
        instructors: selectedInstructors
          ? selectedInstructors?.map?.(
              (instructor) => instructor?.split?.("-")?.[1]?.trim?.() || null
            )
          : null,
        author: JSON.parse(localStorage.getItem("userInfo")).displayName,
        UserId: JSON.parse(localStorage.getItem("userInfo")).UserId,
        creatorEmail: currentUserEmail,
        StudioId: selectedStudio
          ? selectedStudio?.split?.(":")?.[1]?.trim?.() || null
          : null,
        duration: event.target.duration.value,
        durationUnit: selectedDurationUnit,
        level: selectedLevel,
        time: courseTime,
        date: courseDate.format("YYYY-MM-DD"),
        price: event.target.courseFees.value,
        description: description,
        city: selectedCity,
        active: true,
        youtubeViedoLink: event.target.youtubeViedoLink.value,
      };

      setIsSubmitting(true);

      const notifyEmails = currentUserEmail; 
      const metaData = {
        entity_name: dbPayload.courseName,
        time: dbPayload.time,
        date: dbPayload.date,
        StudioId : dbPayload.StudioId
      }
      const response = await postData(dbPayload, COLLECTIONS.COURSES, notifyEmails,metaData) ;
      if (response.ok) {
        const result = await response.json();
        setNewCourseId(result.id);
        setCourses((prev) => [...prev, { id: result.id, ...dbPayload }]);
        clearForm(form);
        resetDraft();
        showSnackbar("Course successfully added.", "success");
        setStep((prev) => prev + 1);
      }

    } catch (error) {
      console.error("Error adding course: ", error);
      showSnackbar(error?.message || "Something went wrong", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = (form) => {
    form.reset();
    setSelectedDanceStyles([]);
    setSelectedInstructors([]);
    setSelectedStudio(null);
    setSelectedDurationUnit("");
    setSelectedLevel("");
    setCourseTime("");
    setCourseDate(dayjs(Date.now()));
    setSelectedCity('');
    setDescription('');
  };

  const handleTimeSelect = (startTime, endTime) => {
    const [currentStartTime, currentEndTime] = courseTime.split(" - ");
    let newTime = `${currentStartTime} - ${currentEndTime}`;

    if (startTime !== null) newTime = `${startTime} - ${currentEndTime}`;
    if (endTime !== null) newTime = `${currentStartTime} - ${endTime}`;

    setCourseTime(newTime);
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
          form.courseFees.value = foundCourse.price;
          form.duration.value = foundCourse.duration;
          setDescription(foundCourse?.description || "");

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
          setCourseTime(foundCourse?.time || "");
          setCourseDate(dayjs(foundCourse?.date || Date.now()));
          setSelectedCity(foundCourse?.city || '');
        } else {
          await addDoc(collection(db, DRAFT_COLLECTIONS.DRAFT_COURSES), {
            name: form.name?.value || "",
            duration: form.duration?.value || "",
            price: form.courseFees?.value || "",
            description: description ,

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
            time: courseTime,
            date: courseDate.format("YYYY-MM-DD"),
            city: selectedCity,
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
    let previousState = null; // Keep track of the previous form state.
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
              const currentState = {
                name: form.name?.value || "",
                price: form.courseFees?.value || "",
                description: description,
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
                duration: form.duration?.value || "",
                durationUnit: selectedDurationUnit,
                level: selectedLevel,
                time: courseTime,
                date: courseDate.format("YYYY-MM-DD"),
                city: selectedCity,
              };
    
              // Check if the current state is different from the previous state
              if (!isEqual(previousState, currentState)) {
                try {
                  await updateDoc(openClassRef, currentState);
                  previousState = currentState; // Update previous state after successful save
                  console.log("Next AutoSave in",DRAFT_INTERVAL_TIME)
                } catch (error) {
                  console.error(error);
                }
              }else{
                  console.log("Nothing for Autosave to save")
              }
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
    courseTime,
    courseDate,
    selectedCity,
    description
  ]);

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
    <div>
      {step === 1 && (
        <Form
          id="addStudioForm"
          onSubmit={handleAddCourse}
          style={{
            backgroundColor: isDarkModeOn ? "#202020" : "",
            color: isDarkModeOn ? "white" : "black",
          }}
        >
          <Form.Group controlId="formBasicAdd">
            <div>
              <Row>
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
                </Col>
                <Col md={6}>
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
                </Col>
              </Row>

              <br />

              <Row>
                <Col md={6}>
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
              </Row>

              <br />

              <Row>
                <Col md={6}>
                  <TimeRange
                    defaultTime={courseTime || "00:00-00:00"}
                    handleSelect={handleTimeSelect}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Course Start Date</Form.Label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <ThemeProvider theme={darkTheme}>
                        <CssBaseline />
                        <DatePicker
                          sx={{ width: "100%" }}
                          value={courseDate}
                          onChange={(newValue) => setCourseDate(newValue)}
                        />
                      </ThemeProvider>
                    </DemoContainer>
                  </LocalizationProvider>
                </Col>
              </Row>

              <br />

              <Row>
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
                    name="courseFees"
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
                <Col md={6}>
                  <Form.Label>Brief Description</Form.Label>
                  <ReactQuill
                    theme="snow"
                    placeholder="Enter Description"
                    value={description}
                    onChange={setDescription}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Label>Youtube video link</Form.Label>
                  <Form.Control
                    rows={1}
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
                    Next
                  </MuiButton>
                </Col>
              </Row>
            </div>
          </Form.Group>
        </Form>
      )}
      {isSubmitting && <LinearProgress />}
      {step === 2 && (
        <>
          <Row>
            <Col>
              <ImageUpload
                entityId={newCourseId}
                title={"Course Images"}
                storageFolder={STORAGES.COURSEICON}
                maxImageCount={1}
              ></ImageUpload>
            </Col>
          </Row>
          <Row style={{ margin: "1rem 0" }}>
            <Col style={{ textAlign: "right" }}>
              <MuiButton
                variant="contained"
                style={{
                  color: "white",
                  backgroundColor: isDarkModeOn ? "#892cdc" : "black",
                }}
                onClick={() => setStep((prev) => prev - 1)}
              >
                Done
              </MuiButton>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default CourseAdd;
