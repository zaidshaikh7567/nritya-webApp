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

const FILTER_LOCATION_KEY = "filterLocation";
const DRAFT_INTERVAL_TIME = 1000 * 10;

function WorkshopAdd({ instructors, studioId, setWorkshop }) {
  const showSnackbar = useSnackbar();
  const [newWorkshopId, setNewWorkshopId] = useState("");
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);

  const instructorNamesWithIds = instructors.map(
    (instructor) => `${instructor.name} - ${instructor.id}`
  );

  const danceStylesOptions = danceStyles.danceStyles;
  const currentCity = localStorage.getItem(FILTER_LOCATION_KEY) || "";

  const [isReady, setIsReady] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [workshopTime, setWorkshopTime] = useState("");
  const [workshopDate, setWorkshopDate] = useState(dayjs(new Date()));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [step, setStep] = useState(1);

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
      !form.workshopName.value ||
      !form.workshopFees.value ||
      !selectedDanceStyles?.length ||
      !selectedInstructors?.length ||
      !description ||
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

  const resetDraft = async () => {
    const q = query(
      collection(db, DRAFT_COLLECTIONS.DRAFT_WORKSHOPS),
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
        DRAFT_COLLECTIONS.DRAFT_WORKSHOPS,
        foundStudio.id
      );

      await deleteDoc(studioRef);
    }
  };

  const handleAddWorkshop = async (event) => {
    event.preventDefault();
    const form = event.target;

    if (!isValidInputs(form)) {
      showSnackbar("Please fill all the fields.", "error");
      return;
    }

    try {
      const currentUserEmail = JSON.parse(localStorage.getItem("userInfo")).email;
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
        creatorEmail: currentUserEmail,
        StudioId: selectedStudio
          ? selectedStudio?.split?.(":")?.[1]?.trim?.() || null
          : null,
        duration: selectedDuration,
        level: selectedLevel,
        time: workshopTime,
        description: description,
        date: workshopDate.format("YYYY-MM-DD"),
        price: event.target.workshopFees.value,
        capacity: event.target.capacity.value,
        venue: event.target.workshopVenue.value,
        city: selectedCity,
        active: true,
        youtubeViedoLink: event.target.youtubeViedoLink.value,
      };

      setIsSubmitting(true);
      const notifyEmails = currentUserEmail; 
      const metaData = {
        entity_name: dbPayload.workshopName,
        time: dbPayload.time,
        date: dbPayload.date,
        StudioId : dbPayload.StudioId
      }
      const response = await postData(dbPayload, COLLECTIONS.WORKSHOPS, notifyEmails, metaData) ;
      if (response.ok) {
        const result = await response.json();
        setNewWorkshopId(result.id);
        setWorkshop((prev) => [...prev, { id: result.id, ...dbPayload }]);
        
        clearForm(form);
        resetDraft();
        showSnackbar("Workshop successfully added.", "success");
        setStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error adding workshop: ", error);
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
    setSelectedDuration("");
    setSelectedLevel("");
    setWorkshopTime("");
    setWorkshopDate(dayjs(new Date()));
    setSelectedCity('');
    setDescription('');
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
          collection(db, DRAFT_COLLECTIONS.DRAFT_WORKSHOPS),
          where(
            "UserId",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).UserId
          )
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          let workshops = [];

          querySnapshot.forEach((doc) => {
            workshops.push({ id: doc.id, ...doc.data() });
          });

          let foundWorkshop = workshops[0];

          form.workshopName.value = foundWorkshop?.workshopName || "";
          form.workshopFees.value = foundWorkshop?.price || 0;
          form.capacity.value = foundWorkshop?.capacity || 0;
          form.workshopVenue.value = foundWorkshop?.venue || "";
          setDescription(foundWorkshop?.description || "");

          setSelectedDanceStyles(
            foundWorkshop?.danceStyles?.length ? foundWorkshop.danceStyles : []
          );

          setSelectedInstructors(
            instructors
              .filter((instructor) =>
                foundWorkshop?.instructors.includes(instructor.id)
              )
              .map((instructor) => `${instructor.name} - ${instructor.id}`)
          );

          const studios = studioId.map((studio) => studio.split(":")[1].trim());
          const currentStudioIndex = studios.findIndex(
            (studio) => studio === foundWorkshop?.StudioId
          );
          if (currentStudioIndex > 0)
            setSelectedStudio(studioId[currentStudioIndex]);

          setSelectedDuration(foundWorkshop?.duration || "");

          setSelectedLevel(foundWorkshop?.level || "");

          setWorkshopTime(foundWorkshop?.time || "");

          setWorkshopDate(dayjs(foundWorkshop?.date || Date.now()));

          setSelectedCity(foundWorkshop?.city || '');
        } else {
          await addDoc(collection(db, DRAFT_COLLECTIONS.DRAFT_WORKSHOPS), {
            workshopName: form.workshopName?.value || "",
            price: form.workshopFees?.value || 0,
            venue: form.capacity?.value || 0,
            venue: form.workshopVenue?.value || "",
            description: description,
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
            duration: selectedDuration,
            level: selectedLevel,
            time: workshopTime,
            date: workshopDate.format("YYYY-MM-DD"),
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

    async function main() {
      const form = document.getElementById("addStudioForm");

      try {
        const q = query(
          collection(db, DRAFT_COLLECTIONS.DRAFT_WORKSHOPS),
          where(
            "UserId",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).UserId
          )
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          let workshops = [];

          querySnapshot.forEach((doc) => {
            workshops.push({ id: doc.id, ...doc.data() });
          });

          let foundWorkshop = workshops[0];

          const workshopRef = doc(
            db,
            DRAFT_COLLECTIONS.DRAFT_WORKSHOPS,
            foundWorkshop.id
          );

          intervalId = setInterval(async () => {
            try {
              await updateDoc(workshopRef, {
                workshopName: form.workshopName?.value || "",
                price: form.workshopFees?.value || 0,
                venue: form.capacity?.value || 0,
                venue: form.workshopVenue?.value || "",
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
                duration: selectedDuration,
                level: selectedLevel,
                time: workshopTime,
                date: workshopDate.format("YYYY-MM-DD"),
                city: selectedCity
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
    description,
    selectedStudio,
    selectedDuration,
    selectedLevel,
    workshopTime,
    workshopDate,
    selectedCity,
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
          onSubmit={handleAddWorkshop}
          style={{
            backgroundColor: isDarkModeOn ? "#202020" : "",
            color: isDarkModeOn ? "white" : "black",
          }}
        >
          <Form.Group controlId="formBasicAdd">
            <div>
              <Row>
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
              </Row>

              <br />

              <Row>
                <Col md={6}>
                  <TimeRange
                    defaultTime={workshopTime || "00:00-00:00"}
                    handleSelect={handleTimeSelect}
                  />
                </Col>
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
                    name="workshopFees"
                  />
                </Col>
              </Row>

              <br />

              <Row>
                <Col md={6}>
                  <Form.Label>Maximum capacity</Form.Label>
                  <Form.Control
                    rows={1}
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    type="number"
                    placeholder="Enter capacity"
                    name="capacity"
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
                  {/* <Form.Control
                    rows={3}
                    style={{
                      backgroundColor: isDarkModeOn ? "#333333" : "",
                      color: isDarkModeOn ? "white" : "black",
                    }}
                    as="textarea"
                    placeholder="Enter Description"
                    name="description"
                  /> */}


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
              <Row>
                <hr></hr>
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
                entityId={newWorkshopId}
                title={"Workshop Images"}
                storageFolder={STORAGES.WORKSHOPICON}
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

export default WorkshopAdd;
