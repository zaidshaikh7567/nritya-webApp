import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { LinearProgress, Button as MuiButton } from "@mui/material";
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

function CourseUpdate({ courseId, instructors, studioId }) {
  const currentCity = localStorage.getItem(FILTER_LOCATION_KEY) || "";

  const showSnackbar = useSnackbar();

  const [selectedStudio, setSelectedStudio] = useState(null);
  const [selectedInstructors, setSelectedInstructors] = useState([]);

  const danceStylesOptions = danceStyles.danceStyles;
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const [selectedDurationUnit, setSelectedDurationUnit] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [courseTime, setCourseTime] = useState("");
  const [courseDate, setCourseDate] = useState(dayjs(new Date()));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');

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

  const baseStyles = {
    backgroundColor: isDarkModeOn ? "#333333" : "",
    color: isDarkModeOn ? "white" : "black",
    height: 'auto',
  };

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const isValidInputs = (form) => {
    let validationFailed = true;
    if (
      !form.name.value ||
      !form.courseFees.value ||
      !form.duration.value ||
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

  const handleSelectStudio = async (event) => {
    event.preventDefault();
    const selected = event.target.value;
    const selectedId = selected.split(":").pop().trim();
    setSelectedCourseId(selectedId);
    try {
      const studioDoc = await getDoc(doc(db, COLLECTIONS.COURSES, selectedId));
      if (studioDoc.exists) {
        setSelectedCourse(studioDoc.data());
      } else {
        setSelectedCourse(null);
      }
    } catch (error) {
      console.error("Error fetching course data:", error, selectedId);
    }
  };

  const handleUpdateStudio = async (event) => {
    event.preventDefault();
    const form = event.target;

    if (!selectedCourseId) return;

    if (!isValidInputs(form)) {
      showSnackbar("Please fill all the fields.", "error");
      return;
    }

    try {
      const dbPayload = {
        courseName: form.name.value,
        duration: form.duration.value,
        price: form.courseFees.value,
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
        durationUnit: selectedDurationUnit,
        level: selectedLevel,
        time: courseTime,
        date: courseDate.format("YYYY-MM-DD"),
        city: selectedCity,
        youtubeViedoLink: form.youtubeViedoLink.value,
      };

      setIsSubmitting(true);

      const studioRef = doc(db, COLLECTIONS.COURSES, selectedCourseId);

      await updateDoc(studioRef, dbPayload);

      clearForm(form);
      showSnackbar("Open class successfully updated.", "success");
    } catch (error) {
      console.error("Error updating course: ", error);
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
    setSelectedDurationUnit("");
    setSelectedLevel("");
    setCourseTime("");
    setCourseDate(dayjs(new Date()));
    setSelectedCity('');
    setSelectedCourse(null);
    setSelectedCourseId("");
    setDescription('');
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

  const handleSelectStudioValue = (event, value) => {
    setSelectedStudio(value);
  };

  const handleInstructorChange = (event, value) => {
    setSelectedInstructors(value);
  };

  const handleTimeSelect = (startTime, endTime) => {
    const [currentStartTime, currentEndTime] = courseTime.split(" - ");
    let newTime = `${currentStartTime} - ${currentEndTime}`;

    if (startTime !== null) newTime = `${startTime} - ${currentEndTime}`;
    if (endTime !== null) newTime = `${currentStartTime} - ${endTime}`;

    setCourseTime(newTime);
  };

  useEffect(() => {
    if (selectedCourse) {
      const addedInstructors = instructors
        .filter((instructor) =>
          selectedCourse.instructors.includes(instructor.id)
        )
        .map((instructor) => `${instructor.name} - ${instructor.id}`);

      setSelectedInstructors(addedInstructors);
      if (selectedCourse && selectedCourse.danceStyles)
        setSelectedDanceStyles(selectedCourse.danceStyles);

      if (selectedCourse && selectedCourse.durationUnit)
        setSelectedDurationUnit(selectedCourse.durationUnit);

      if (selectedCourse && selectedCourse.level)
        setSelectedLevel(selectedCourse.level);

      if (selectedCourse && selectedCourse.time)
        setCourseTime(selectedCourse.time);

      if (selectedCourse && selectedCourse.date)
        setCourseDate(dayjs(selectedCourse.date));

      if (selectedCourse && selectedCourse.StudioId) {
        const studios = studioId.map((studio) => studio.split(":")[1].trim());
        const currentStudioIndex = studios.findIndex(
          (studio) => studio === selectedCourse.StudioId
        );
        setSelectedStudio(studioId[currentStudioIndex] || null);
      }

      setSelectedCity(selectedCourse?.city || '');
      setDescription(selectedCourse?.description || '');
    }
  }, [selectedCourse]);

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
              ...baseStyles,
            }}
            onChange={handleSelectStudio}
          >
            <option value="">Select a course...</option>
            {courseId && courseId.length > 0 ? (
              courseId.map((courseItem) => (
                <option key={courseItem} value={courseItem}>
                  {courseItem}
                </option>
              ))
            ) : (
              <option value="">No course yet!</option>
            )}
          </Form.Control>

          <div>
            <Row>
              <Col md={6}>
                <ImageUpload
                  entityId={selectedCourseId}
                  title={"Course Images"}
                  storageFolder={STORAGES.COURSEICON}
                  maxImageCount={1}
                ></ImageUpload>
              </Col>

              <Col md={6}>
                <br />
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  rows={1}
                  defaultValue={selectedCourse ? selectedCourse.courseName : ""}
                  style={{
                    ...baseStyles,
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
                      ...baseStyles,
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
                          ...baseStyles,
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
                      ...baseStyles,
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
                          ...baseStyles,
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
                      defaultValue={
                        selectedCourse ? selectedCourse.duration : ""
                      }
                      rows={1}
                      style={{
                        ...baseStyles,
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
                          ...baseStyles,
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
                              ...baseStyles,
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
                  defaultTime={courseTime || "00:00-00:00"}
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
                        value={courseDate}
                        onChange={(newValue) => setCourseDate(newValue)}
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
                      ...baseStyles,
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
                          ...baseStyles,
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
                  defaultValue={selectedCourse ? selectedCourse.price : ""}
                  style={{
                    ...baseStyles,
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
                      ...baseStyles,
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
                          ...baseStyles,
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
                      ...baseStyles,
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
                          ...baseStyles,
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
              <Form.Label>Youtube video link</Form.Label>
                  <Form.Control
                    rows={1}
                    defaultValue={
                      selectedCourse ? selectedCourse.youtubeViedoLink : ""
                    }
                    style={{
                      ...baseStyles,
                    }}
                    type="text"
                    placeholder="Enter youtube video link"
                    name="youtubeViedoLink"
                  />
              </Col>
            </Row>

            <hr></hr>
            <hr></hr>

            <Row>
              <Col xs={6}></Col>
              <Col xs={6} className="d-flex justify-content-end">
                <MuiButton
                  variant="contained"
                  style={{
                    ...baseStyles,
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Update Course
                </MuiButton>
              </Col>
            </Row>
          </div>
        </Form.Group>
        {isSubmitting && <LinearProgress />}
      </Form>
    </div>
  );
}

export default CourseUpdate;
