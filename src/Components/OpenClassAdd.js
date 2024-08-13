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

function OpenClassAdd({ instructors, studioId, setOpenClass }) {
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
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [openClassTime, setOpenClassTime] = useState("");
  const [openClassDate, setOpenClassDate] = useState(dayjs(new Date()));
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      !openClassDate
    )
      validationFailed = false;

    return validationFailed;
  };

  const resetDraft = async () => {
    const q = query(
      collection(db, DRAFT_COLLECTIONS.DRAFT_OPEN_CLASSES),
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
        DRAFT_COLLECTIONS.DRAFT_OPEN_CLASSES,
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
        openClassName: event.target.openClassName.value,
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
        venue: event.target.openClassVenue.value,
        description: event.target.description.value,
        city: localStorage.getItem(FILTER_LOCATION_KEY) || null,
        active: true,
      };

      setIsSubmitting(true);

      const workshopRef = await addDoc(
        collection(db, COLLECTIONS.OPEN_CLASSES),
        dbPayload
      );

      setNewWorkshopId(workshopRef.id);
      setOpenClass((prev) => [...prev, { id: workshopRef.id, ...dbPayload }]);

      const userRef = doc(
        db,
        "User",
        JSON.parse(localStorage.getItem("userInfo")).UserId
      );
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        if (userSnap.data() != null) {
          await updateDoc(userRef, {
            OpenClassCreated: [
              ...(userSnap.data()?.OpenClassCreated || []),
              workshopRef.id,
            ],
          });
        }
      }

      clearForm(form);
      resetDraft();
      showSnackbar("Open class successfully added.", "success");
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
    setOpenClassTime("");
    setOpenClassDate(dayjs(new Date()));
  };

  const handleTimeSelect = (startTime, endTime) => {
    const [currentStartTime, currentEndTime] = openClassTime.split(" - ");
    let newTime = `${currentStartTime} - ${currentEndTime}`;

    if (startTime !== null) newTime = `${startTime} - ${currentEndTime}`;
    if (endTime !== null) newTime = `${currentStartTime} - ${endTime}`;

    setOpenClassTime(newTime);
  };

  useEffect(() => {
    async function main() {
      const form = document.getElementById("addStudioForm");

      try {
        const q = query(
          collection(db, DRAFT_COLLECTIONS.DRAFT_OPEN_CLASSES),
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

          let foundOpenClass = openClasses[0];

          form.openClassName.value = foundOpenClass?.openClassName || "";
          form.openClassVenue.value = foundOpenClass?.venue || "";
          form.description.value = foundOpenClass?.description || "";

          setSelectedDanceStyles(
            foundOpenClass?.danceStyles?.length
              ? foundOpenClass.danceStyles
              : []
          );

          setSelectedInstructors(
            instructors
              .filter((instructor) =>
                foundOpenClass?.instructors.includes(instructor.id)
              )
              .map((instructor) => `${instructor.name} - ${instructor.id}`)
          );

          const studios = studioId.map((studio) => studio.split(":")[1].trim());
          const currentStudioIndex = studios.findIndex(
            (studio) => studio === foundOpenClass?.StudioId
          );
          if (currentStudioIndex > 0)
            setSelectedStudio(studioId[currentStudioIndex]);

          setSelectedDuration(foundOpenClass?.duration || "");

          setSelectedLevel(foundOpenClass?.level || "");

          setOpenClassTime(foundOpenClass?.time || "");

          setOpenClassDate(dayjs(foundOpenClass?.date || Date.now()));
        } else {
          await addDoc(collection(db, DRAFT_COLLECTIONS.DRAFT_OPEN_CLASSES), {
            openClassName: form.openClassName.value,
            venue: form.openClassVenue.value,
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
            duration: selectedDuration,
            level: selectedLevel,
            time: openClassTime,
            date: openClassDate.format("YYYY-MM-DD"),
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
          collection(db, DRAFT_COLLECTIONS.DRAFT_OPEN_CLASSES),
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
            DRAFT_COLLECTIONS.DRAFT_OPEN_CLASSES,
            foundOpenClasses.id
          );

          intervalId = setInterval(async () => {
            try {
              await updateDoc(openClassRef, {
                openClassName: form.openClassName.value,
                venue: form.openClassVenue.value,
                description: form.description.value,
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
                time: openClassTime,
                date: openClassDate.format("YYYY-MM-DD"),
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
    selectedDuration,
    selectedLevel,
    openClassTime,
    openClassDate,
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
                    title={"Open Class Images"}
                    storageFolder={STORAGES.OPENCLASSICON}
                    maxImageCount={1}
                  ></ImageUpload>
                </Col>

                <Col md={6}>
                  <Form.Label>Open Class Name</Form.Label>
                  <Form.Control
                    rows={1}
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
                  <Form.Label>Venue</Form.Label>
                  <Form.Control
                    rows={1}
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
                <Col md={6}></Col>
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
                    Add Open Class
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
            New Open Class Created with id {newWorkshopId}. Now u can upload
            images regarding them
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

export default OpenClassAdd;
