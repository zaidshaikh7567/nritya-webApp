import React, { useState, useEffect } from "react";
import { Button, Row, Col, Form, Table } from "react-bootstrap";
import { db } from "../config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { COLLECTIONS } from "../constants";
import AlertPopup from "./AlertPopup";
import ImageUpload from "./ImageUpload";
import { STORAGES } from "../constants";
import MapsInput from "./MapsInput";
import { useSelector } from "react-redux"; // Import useSelector and useDispatch
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import TimeRangePicker from "./TimeRangePicker";
import indianCities from "../cities.json";
import indianStates from "../states.json";
import danceStyles from "../danceStyles.json";
import { AMENITIES_ICONS } from "../constants";
import { Autocomplete, LinearProgress, TextField } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { FaMinus, FaPlus } from "react-icons/fa";
import { MultiSelect } from "primereact/multiselect";
import { putData } from "../utils/common";
import StudioWeeklyTimings from "./StudioWeeklyTiming";
import { useSnackbar } from "../context/SnackbarContext";
import { updateDaysFormat } from "../utils/mapping";

const initialStudioTimings = {
  monday: [{ open: "09:00 AM", close: "06:00 PM" }],
  tuesday: [{ open: "09:00 AM", close: "06:00 PM" }],
  wednesday: [{ open: "09:00 AM", close: "06:00 PM" }],
  thursday: [{ open: "09:00 AM", close: "06:00 PM" }],
  friday: [{ open: "09:00 AM", close: "06:00 PM" }],
  saturday: [{ open: "09:00 AM", close: "06:00 PM" }],
  sunday: [{ open: "09:00 AM", close: "06:00 PM" }],
};

const daysOfWeek = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
const categoryMap = {
  Kids: "Kids",
  Adults: "Adults",
  Women_Only: "Women Only",
  Men_Only: "Men Only",
  Seniors: "Seniors",
  All: "All Ages, Open to All",
  Couples: "Couples",
  Families: "Families",
};

const encodeToUnicode = (text) => {
  const textEncoder = new TextEncoder();
  const utf8Encoded = textEncoder.encode(text);
  return String.fromCharCode(...utf8Encoded);
};

const decodeUnicode = (unicodeString = "") => {
  const utf8Encoded = unicodeString.split("").map((c) => c.charCodeAt(0));
  const textDecoder = new TextDecoder();
  return textDecoder.decode(new Uint8Array(utf8Encoded));
};

function StudioUpdate({
  studio,
  setStudio,
  studioId,
  setStudioId,
  instructors,
}) {
  const showSnackbar = useSnackbar();
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [selectedStudioId, setSelectedStudioId] = useState(null);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedStudioFrozenClassRows, setSelectedStudioFrozenClassRows] =
    useState(-1);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [defaultTime, setDefaultTime] = useState("00:00-00:00");

  const locationOptions = indianCities.cities;
  const stateOptions = indianStates.states;
  const danceStylesOptions = danceStyles.danceStyles;
  const amenityKeys = Object.keys(AMENITIES_ICONS).map(String);
  const [showUpdateSuccessAlert, setShowUpdateSuccessAlert] = useState(false);
  const [showUpdateErrorAlert, setShowUpdateErrorAlert] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);
  const isDarkModeOn = useSelector(selectDarkModeStatus); // Use useSelector to access isDarkModeOn
  const [timings, setTimings] = useState(initialStudioTimings);
  const [mapAddress, setMapAddress] = useState('');

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

  const handleAmenitiesChange = (event, value) => {
    setSelectedAmenities(value);
  };

  const [tableData, setTableData] = useState({
    0: {
      className: "",
      danceForms: "",
      days: "",
      time: "",
      instructors: [],
      fee: "",
      level: "",
      freeTrial: false,
      classCategory: [],
    },
  });

  const handleTimePickerOpen = (index, time) => {
    //console.log("handleTimePickerOpen",time,index)
    setDefaultTime(time);
    setSelectedRowIndex(index);
    setShowTimePicker(true);
  };

  const handleTimePickerClose = () => {
    setShowTimePicker(false);
    setSelectedRowIndex(null);
    //console.log("---------")
  };

  const handleTimeSelect = (startTime, endTime) => {
    setTableData((prevData) => {
      const newData = { ...prevData };

      if (selectedRowIndex !== null && newData[selectedRowIndex]) {
        const currentTime = newData[selectedRowIndex].time;

        if (currentTime !== undefined) {
          const [currentStartTime, currentEndTime] = currentTime.split(" - ");

          if (startTime !== null) {
            newData[selectedRowIndex].time = `${startTime} - ${currentEndTime}`;
          }
          if (endTime !== null) {
            newData[selectedRowIndex].time = `${currentStartTime} - ${endTime}`;
          }
        }
      }

      return newData;
    });

    setSelectedRow(selectedRowIndex);
  };

  useEffect(() => {
    // Fetch the list of studios created by the user from localStorage
    const studiosOfUser =
      JSON.parse(localStorage.getItem("StudioCreated")) || [];
    setStudio(studiosOfUser);

    // Create the list of studio IDs with the format "studioName: studioId"
    const studioIdList = studiosOfUser.map(
      (studio) => `${studio.studioName} : ${studio.id}`
    );
    setStudioId(studioIdList);

    //console.log("studio:", studio);
    //console.log("studioId", studioId);
  }, []);

  useEffect(() => {
    // Fetch data for the selected studio when studioId changes
    if (selectedStudio) {
      //console.log("Studio Instructors Names",selectedStudio.instructorsNames)
      setSelectedInstructors(selectedStudio.instructorsNames);
      if (selectedStudio && selectedStudio.danceStyles) {
        setSelectedDanceStyles(selectedStudio.danceStyles.split(","));
      }
      if (selectedStudio && selectedStudio.addAmenities) {
        setSelectedAmenities(selectedStudio.addAmenities.split(","));
      }
      if (selectedStudio && selectedStudio.tableData) {
        const maxIndex = Math.max(...Object.keys(tableData).map(Number));
        setSelectedStudioFrozenClassRows(maxIndex);
      }
      if (selectedStudio && selectedStudio?.timings) {
        setTimings(selectedStudio.timings);
      }
      if (selectedStudio && selectedStudio?.mapAddress) {
        setMapAddress(selectedStudio?.mapAddress);
      }
    }
  }, [selectedStudio]);

  const handleSelectStudio = async (event) => {
    event.preventDefault();
    const selected = event.target.value;
    const selectedId = selected.split(":").pop().trim();
    setSelectedStudioId(selectedId);
    try {
      const studioDoc = await getDoc(doc(db, COLLECTIONS.STUDIO, selectedId));
      if (studioDoc.exists) {
        setSelectedStudio(studioDoc.data());
        if (studioDoc.data().geolocation) {
          const loc = studioDoc.data().geolocation;
          setSelectedLocation(loc || null);
          //console.log("StudioUpdate Selected location",selectedLocation,loc)
        }

        if (studioDoc.data().tableData) {
          setTableData(studioDoc.data().tableData);
          //selectedStudioFrozenClassRows()
          const maxIndex = Math.max(...Object.keys(tableData).map(Number));
          setSelectedStudioFrozenClassRows(maxIndex);
          //console.log("Yo We got...",tableData,Array.isArray(tableData),isMapOfMaps(tableData),maxIndex)
        } else {
          setTableData({
            0: {
              className: "",
              danceForms: "",
              days: "",
              time: "",
              instructors: [],
              fee: "",
              level: "",
              freeTrial: false,
              classCategory: [],
            },
          });
        }
      } else {
        setSelectedStudio(null); // No matching studio found
      }
    } catch (error) {
      console.error("Error fetching studio data:", error, selectedId);
    }
  };

  const handleInstructorChange = (event, value) => {
    setSelectedInstructors(value);
  };

  const handleUpdateStudio = async (event) => {
    event.preventDefault();

    const errorMessage = validate();

    if (errorMessage) {
      return showSnackbar(errorMessage, "error");
    }

    setIsSubmitting(true);
    const nameIdLocal = event.target.nameId.value;
    const indexOfColon = nameIdLocal.lastIndexOf(":");
    const studioId = nameIdLocal.substring(indexOfColon + 1).trim();

    if (!studioId) {
      //console.log("Invalid or empty studio id")
      return;
    }

    //console.log(studioId)

    if (!studioId) {
      //console.log("Invalid or empty studio id")
      return;
    }

    //console.log(studioId)

    //const description = encodeToUnicode(event.target.description.value);
    //const geolocation = selectedLocation;

    try {
      // Update the studio document with the new values
      ////console.log(description,geolocation)
      const dbPayload = {
        studioName: event.target.studioName.value,
        aboutStudio: event.target.aboutStudio.value,
        founderName: event.target.founderName.value,
        aboutFounder: event.target.aboutFounder.value,
        mobileNumber: event.target.mobileNumber.value,
        whatsappNumber: event.target.whatsappNumber.value,
        mailAddress: event.target.mailAddress.value,
        danceStyles: selectedDanceStyles.join(","),
        numberOfHalls: event.target.numberOfHalls.value,
        maximumOccupancy: event.target.maximumOccupancy.value,
        instructorsNames: selectedInstructors,
        status: "OPEN",
        tableData: tableData,
        buildingName: event.target.buildingName.value,
        street: event.target.street.value,
        city: event.target.city.value,
        landmark: event.target.landmark.value,
        pincode: event.target.pincode.value,
        state: event.target.state.value,
        country: "India",
        mapAddress,
        geolocation: selectedLocation,
        gstNumber: event.target.gstNumber.value,
        enrolledId: [],
        reviews: [],
        author: JSON.parse(localStorage.getItem("userInfo")).displayName,
        UserId: JSON.parse(localStorage.getItem("userInfo")).UserId,
        addAmenities: selectedAmenities.join(","),
        enrollmentProcess: encodeToUnicode(
          event.target.enrollmentProcess.value
        ),
        instagram: event.target.instagram.value,
        facebook: event.target.facebook.value,
        youtube: event.target.youtube.value,
        twitter: event.target.twitter.value,
        timings,
      };

      const response = await putData(dbPayload, COLLECTIONS.STUDIO, studioId);
      if (response.ok) {
        //console.log("Studio updated successfully");
        // alert("Studio Update successfully");
        showSnackbar("Studio Details Updated Successfully", "success");
        setShowUpdateSuccessAlert(true);
        setShowUpdateErrorAlert(false);
      } else {
        setShowUpdateSuccessAlert(false);
        setShowUpdateErrorAlert(true);
      }
    } catch (error) {
      console.error("Error updating studio: ", error);
      setShowUpdateSuccessAlert(false);
      setShowUpdateErrorAlert(true);
    } finally {
      setIsSubmitting(false);
    }
    // Reset input fields to their initial values when a new studio is selected
    document.getElementById("updateStudioForm").reset();
  };

  const handleAddColumn = () => {
    setTableData((prevData) => {
      const newData = prevData.map((row) => ({
        ...row,
        [Object.keys(row).length]: "",
      }));
      return newData;
    });
  };

  const handleAddRow = () => {
    setTableData((prevData) => {
      const newRowKey = Object.keys(prevData).length; // Use the current number of rows as the new row key
      return { ...prevData, [newRowKey]: { ...tableData[0] } };
    });
  };

  const handleRemoveRow = (index) => {
    setTableData((prevData) => {
      const newData = { ...prevData };
      delete newData[index];
      return newData;
    });
  };

  const handleTableChange = (index, field, value) => {
    setTableData((prevData) => {
      if (field === "days") {
        value = Array.isArray(value) ? value.join(",") : value;
      }

      return {
        ...prevData,
        [index]: {
          ...prevData[index],
          [field]: value,
        },
      };
    });
  };

  const validate = () => {
    const form = document.getElementById("updateStudioForm");

    if (!form.studioName.value) return "Studio name is required";
    if (!form.aboutStudio.value) return "About Studio is required";
    if (!form.founderName.value) return "Founder name is required";
    if (!form.aboutFounder.value) return "About Founder is required";
    if (!form.mobileNumber.value) return "Mobile number is required";
    if (!form.whatsappNumber.value) return "WhatsApp number is required";
    if (!form.numberOfHalls.value) return "Number of halls is required";
    if (!form.maximumOccupancy.value) return "Maximum occupancy is required";
    if (!selectedDanceStyles.length)
      return "At least one dance style must be selected";

    if (!Object.values(timings).every((slots) => slots.length > 0)) {
      return "All timing slots must be filled";
    }
    if (!Object.values(tableData).length) {
      return "At least one class entry is required";
    }
    for (const entry of Object.values(tableData)) {
      if (!entry.className?.trim()) return "Class name is required";
      if (!entry.danceForms?.trim()) return "Dance forms are required";
      if (!entry.days?.trim()) return "Days are required";
      if (!entry.time?.trim()) return "Time is required";
      if (!entry.fee?.trim()) return "Fee is required";
      if (!entry.level?.trim()) return "Level is required";
      if (!entry.instructors.length)
        return "At least one instructor is required";
      if (!entry.classCategory.length || !entry.classCategory[0]?.trim())
        return "Class category is required";
    }

    if (!form.buildingName.value) return "Building name is required";
    if (!form.street.value) return "Street is required";
    if (!form.city.value) return "City is required";
    if (!form.pincode.value) return "Pincode is required";
    if (!form.state.value) return "State is required";
    if (!mapAddress) return "Address is required";
    if (!selectedLocation) return "Location selection is required";
  };

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
              height: "auto", // Let it adjust to content
              lineHeight: "1.5em",
              padding: "8px",
            }}
            onChange={handleSelectStudio}
          >
            <option value="">Select a studio...</option>
            {studioId && studioId.length > 0 ? (
              studioId.map((studioItem) => (
                <option key={studioItem} value={studioItem}>
                  {studioItem}
                </option>
              ))
            ) : (
              <option value="">No studio yet!</option>
            )}
          </Form.Control>
        </Form.Group>

        <h3
          style={{
            backgroundColor: isDarkModeOn ? "#202020" : "",
            color: isDarkModeOn ? "white" : "black",
          }}
        >
          Basic Details
        </h3>
        <Row>
          <Col md={6}>
            <Form.Label>Studio Name *</Form.Label>
            <Form.Control
              rows={1}
              defaultValue={selectedStudio ? selectedStudio.studioName : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              type="textarea"
              placeholder="Enter studio name"
              name="studioName"
            />

            <Form.Label>About Studio *</Form.Label>
            <Form.Control
              rows={6}
              defaultValue={selectedStudio ? selectedStudio.aboutStudio : ""}
              style={{
                minHeight: "150px",
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              as="textarea"
              placeholder="Enter studio details"
              name="aboutStudio"
            />
          </Col>
          <Col md={6}>
            <Form.Label>Founder's Name *</Form.Label>
            <Form.Control
              rows={1}
              defaultValue={selectedStudio ? selectedStudio.founderName : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              type="textarea"
              placeholder="Enter studio name"
              name="founderName"
            />

            <Form.Label>About Founder *</Form.Label>
            <Form.Control
              rows={6}
              defaultValue={selectedStudio ? selectedStudio.aboutFounder : ""}
              style={{
                height: "150px",
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              as="textarea"
              placeholder="Enter studio details"
              name="aboutFounder"
            />
          </Col>
        </Row>
        <hr></hr>

        <h3
          style={{
            backgroundColor: isDarkModeOn ? "#202020" : "",
            color: isDarkModeOn ? "white" : "black",
          }}
        >
          Contact Details
        </h3>
        <Row>
          <Col md={6}>
            <Form.Label>Mobile Number *</Form.Label>
            <Form.Control
              defaultValue={selectedStudio ? selectedStudio.mobileNumber : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              rows={1}
              placeholder="Enter studio details"
              name="mobileNumber"
              type="number"
            />

            <Form.Label>WhatsApp Number *</Form.Label>
            <Form.Control
              defaultValue={selectedStudio ? selectedStudio.whatsappNumber : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              rows={1}
              placeholder="Enter studio details"
              name="whatsappNumber"
              type="number"
            />
          </Col>
          <Col md={6}>
            <Form.Label>Mail Address</Form.Label>
            <Form.Control
              defaultValue={selectedStudio ? selectedStudio.mailAddress : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              type="textarea"
              rows={1}
              placeholder="Enter studio details"
              name="mailAddress"
            />
          </Col>
        </Row>
        <hr></hr>

        <h3
          style={{
            backgroundColor: isDarkModeOn ? "#202020" : "",
            color: isDarkModeOn ? "white" : "black",
          }}
        >
          Studio Details
        </h3>
        <Row>
          <Col md={6}>
            <Form.Label>Dance Styles *</Form.Label>

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

            <Form.Label>Number of Hall(s) *</Form.Label>
            <Form.Control
              defaultValue={selectedStudio ? selectedStudio.numberOfHalls : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              rows={1}
              placeholder="Number of Hall(s)"
              name="numberOfHalls"
              type="number"
            />
          </Col>
          <Col md={6}>
            <Form.Label>Maximum Occupancy *</Form.Label>
            <Form.Control
              defaultValue={
                selectedStudio ? selectedStudio.maximumOccupancy : ""
              }
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              rows={1}
              placeholder="Maximum Occupancy"
              name="maximumOccupancy"
              type="number"
            />
          </Col>
        </Row>
        <hr></hr>

        <h3
          style={{
            backgroundColor: isDarkModeOn ? "#202020" : "",
            color: isDarkModeOn ? "white" : "black",
          }}
        >
          Instructor Details
        </h3>
        <Form.Label>Names of Instructors</Form.Label>
        <Row>
          <Col xs={6}>
            <div
              style={{
                backgroundColor: isDarkModeOn ? "#202020" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
            >
              <Row>
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
                        placeholder="Select Dance Styles"
                        style={{
                          backgroundColor: isDarkModeOn ? "#333333" : "",
                          color: isDarkModeOn ? "white" : "black",
                        }}
                      />
                    )}
                  />
                </ThemeProvider>
                <a
                  href="#/modifyInstructors"
                  rel="noreferrer"
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    color: isDarkModeOn ? "cyan" : "blue",
                  }}
                >
                  Go to Instrcutors' Add/update Page?
                </a>
              </Row>
            </div>
          </Col>
        </Row>
        <hr></hr>

        <h3
          style={{
            backgroundColor: isDarkModeOn ? "#202020" : "",
            color: isDarkModeOn ? "white" : "black",
          }}
        >
          Address Details
        </h3>
        <Row>
          <Col md={6}>
            <Form.Label>Building Name *</Form.Label>
            <Form.Control
              defaultValue={selectedStudio ? selectedStudio.buildingName : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              as="textarea"
              rows={1}
              placeholder="Enter building name"
              name="buildingName"
            />

            <Form.Label>Street *</Form.Label>
            <Form.Control
              defaultValue={selectedStudio ? selectedStudio.street : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              as="textarea"
              rows={1}
              placeholder="Enter street"
              name="street"
            />
            <Form.Label>City *</Form.Label>
            <Form.Control
              as="select"
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
                height: "auto", // Let it adjust to content
                lineHeight: "1.5em", // Mimics rows={1}
                padding: "8px",
              }}
              name="city"
              value={selectedStudio ? selectedStudio.city : ""}
              onChange={(e) => {
                const newCity = e.target.value;
                setSelectedStudio((prevState) => ({
                  ...prevState,
                  city: newCity,
                }));
              }}
            >
              <option value="">Select a city</option>
              {locationOptions.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col md={6}>
            <Form.Label>Landmark</Form.Label>
            <Form.Control
              defaultValue={selectedStudio ? selectedStudio.landmark : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              as="textarea"
              rows={1}
              placeholder="Enter landmark"
              name="landmark"
            />

            <Form.Label>Pincode *</Form.Label>
            <Form.Control
              defaultValue={selectedStudio ? selectedStudio.pincode : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              as="textarea"
              rows={1}
              placeholder="Enter pincode"
              name="pincode"
              type="number"
            />

            <Form.Label>State *</Form.Label>
            <Form.Control
              as="select"
              style={{
                padding: "0 1.5rem",
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              rows={1}
              placeholder="Enter state"
              name="state"
              value={selectedStudio ? selectedStudio.state : ""}
            >
              <option value="">Select a State</option>
              {stateOptions.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </Form.Control>
          </Col>

          <Form.Label>Save exact Address</Form.Label>
          <MapsInput
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            mapAddress={mapAddress}
            setMapAddress={setMapAddress}
          ></MapsInput>
        </Row>
        <hr></hr>

        <h3
          style={{
            backgroundColor: isDarkModeOn ? "#202020" : "white",
            color: isDarkModeOn ? "white" : "black",
          }}
        >
          Additional Details
        </h3>
        <Row>
          <Col md={4}>
            <Form.Label>GST Number</Form.Label>
            <Form.Control
              defaultValue={selectedStudio ? selectedStudio.gstNumber : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              type="number"
              rows={1}
              placeholder="GST Number"
              name="gstNumber"
            />
          </Col>
          <Col md={8}>
            <Form.Label>Add Amenities</Form.Label>

            <ThemeProvider theme={darkTheme}>
              <CssBaseline />

              <Autocomplete
                style={{
                  backgroundColor: isDarkModeOn ? "#333333" : "",
                  color: isDarkModeOn ? "white" : "black",
                }}
                multiple
                id="tags-standard"
                options={amenityKeys}
                value={selectedAmenities}
                onChange={handleAmenitiesChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Select Amenities"
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
        <Row>
          <Col>
            <Form.Label>Enrollment Process</Form.Label>
            <Form.Control
              defaultValue={
                selectedStudio
                  ? decodeUnicode(selectedStudio?.enrollmentProcess)
                  : ""
              }
              rows={6}
              style={{
                height: "150px",
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              as="textarea"
              placeholder="Enrollment Process"
              name="enrollmentProcess"
            />
          </Col>
        </Row>

        <br></br>
        <span>Time Table Of dance classes</span>
        <div
          style={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            scrollbarColor: isDarkModeOn ? "#888 #333" : "#ccc #fff",
          }}
        >
          <Table bordered variant="light">
            <thead>
              <tr>
                <th
                  style={{
                    padding: "0rem",
                    textAlign: "center",
                    minWidth: "15rem",
                    border: "1px solid black",
                  }}
                >
                  Class Name
                </th>
                <th
                  style={{
                    padding: "0rem",
                    textAlign: "center",
                    minWidth: "10rem",
                    border: "1px solid black",
                  }}
                >
                  Dance Form
                </th>
                <th
                  style={{
                    padding: "0rem",
                    textAlign: "center",
                    minWidth: "15rem",
                    border: "1px solid black",
                  }}
                >
                  Days
                </th>
                <th
                  style={{
                    padding: "0rem",
                    textAlign: "center",
                    minWidth: "15rem",
                    border: "1px solid black",
                  }}
                >
                  Time
                </th>
                <th
                  style={{
                    padding: "0rem",
                    textAlign: "center",
                    minWidth: "20rem",
                    border: "1px solid black",
                  }}
                >
                  Instructors
                </th>
                <th
                  style={{
                    padding: "0rem",
                    textAlign: "center",
                    minWidth: "8rem",
                    border: "1px solid black",
                  }}
                >
                  Fee (₹)
                </th>
                <th
                  style={{
                    padding: "0rem",
                    textAlign: "center",
                    minWidth: "10rem",
                    border: "1px solid black",
                  }}
                >
                  Level
                </th>
                <th
                  style={{
                    padding: "0rem",
                    textAlign: "center",
                    minWidth: "8rem",
                    border: "1px solid black",
                  }}
                >
                  Free Trial
                </th>
                <th
                  style={{
                    padding: "0rem",
                    textAlign: "center",
                    minWidth: "15rem",
                    border: "1px solid black",
                  }}
                >
                  Class Category
                </th>
                <th style={{ padding: 0 }}>
                  <Button variant="primary" onClick={handleAddRow}>
                    <FaPlus />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tableData).map((rowKey, index) => (
                <tr key={rowKey}>
                  <td style={{ padding: "0rem" }}>
                    <Form.Control
                      type="text"
                      value={tableData[rowKey].className}
                      onChange={(e) =>
                        handleTableChange(rowKey, "className", e.target.value)
                      }
                      style={{
                        height: "auto",
                        lineHeight: "1.5em",
                        padding: "8px",
                      }}
                    />
                  </td>
                  <td style={{ padding: "0rem" }}>
                    <Form.Control
                      as="select"
                      value={tableData[rowKey].danceForms}
                      onChange={(e) =>
                        handleTableChange(rowKey, "danceForms", e.target.value)
                      }
                      style={{
                        height: "auto",
                        lineHeight: "1.5em",
                        padding: "8px",
                      }}
                    >
                      <option value="">Select a dance form</option>
                      {danceStylesOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Control>
                  </td>
                  <td style={{ padding: "0rem" }}>
                    <MultiSelect
                      value={
                        tableData[rowKey] &&
                        tableData[rowKey].days &&
                        updateDaysFormat(
                          tableData?.[rowKey]?.days
                            ?.split?.(",")
                            ?.filter?.((day) => day !== "")
                        )
                      }
                      onChange={(event) =>
                        handleTableChange(rowKey, "days", event.target.value)
                      }
                      options={daysOfWeek}
                      placeholder="class days"
                      maxSelectedLabels={7}
                      className="w-full md:w-20rem"
                      style={{ color: "#000", width: "100%" }}
                    />
                  </td>
                  <td style={{ padding: "0rem" }}>
                    <Form.Control
                      type="text"
                      value={tableData[rowKey].time}
                      //onChange={(e) => handleTableChange(rowKey, 'time', e.target.value)}
                      onClick={() =>
                        handleTimePickerOpen(rowKey, tableData[rowKey].time)
                      }
                    />
                    {showTimePicker && (
                      <TimeRangePicker
                        show={showTimePicker}
                        handleClose={handleTimePickerClose}
                        handleSelect={handleTimeSelect}
                        defaultTime={
                          tableData[selectedRowIndex]?.time || "00:00-00:00"
                        } // selectedRowIndex
                      />
                    )}
                  </td>
                  <td style={{ padding: "0rem", width: "20rem" }}>
                    <Autocomplete
                      multiple
                      options={instructorNamesWithIds}
                      value={
                        tableData[rowKey] && tableData[rowKey].instructors
                          ? tableData[rowKey].instructors
                          : []
                      }
                      onChange={(_, values) =>
                        handleTableChange(rowKey, "instructors", values)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          placeholder="Select Instructors"
                        />
                      )}
                    />
                  </td>
                  <td style={{ padding: "0rem" }}>
                    <Form.Control
                      type="number"
                      value={tableData[rowKey].fee ? tableData[rowKey].fee : ""}
                      onChange={(e) =>
                        handleTableChange(rowKey, "fee", e.target.value)
                      }
                      style={{
                        height: "auto",
                        lineHeight: "1.5em",
                        padding: "8px",
                      }}
                    />
                  </td>
                  <td style={{ padding: "0rem" }}>
                    <Form.Control
                      as="select"
                      value={
                        tableData[rowKey].level ? tableData[rowKey].level : ""
                      }
                      onChange={(e) =>
                        handleTableChange(rowKey, "level", e.target.value)
                      }
                      style={{
                        height: "auto",
                        lineHeight: "1.5em",
                        padding: "8px",
                      }}
                    >
                      <option value="">Select a Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Misc">Misc</option>
                    </Form.Control>
                  </td>
                  <td style={{ padding: "0rem", border: "1px solid black" }}>
                    <Form.Control
                      style={{
                        backgroundColor: "white",
                        height: "auto",
                        lineHeight: "1.5em",
                        padding: "8px",
                      }}
                      as="select"
                      value={
                        tableData[index]?.freeTrial
                          ? tableData[index].freeTrial
                          : ""
                      }
                      onChange={(e) =>
                        handleTableChange(index, "freeTrial", e.target.value)
                      }
                    >
                      <option value="">Select a value</option>
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </Form.Control>
                  </td>
                  <td style={{ padding: "0rem", width: "20rem" }}>
                    <Form.Control
                      style={{
                        backgroundColor: "white",
                        height: "auto",
                        lineHeight: "1.5em",
                        padding: "8px",
                      }}
                      as="select"
                      value={
                        Array.isArray(tableData[index].classCategory) &&
                        tableData[index].classCategory?.length
                          ? tableData[index].classCategory[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleTableChange(index, "classCategory", [
                          e.target.value,
                        ])
                      }
                    >
                      <option value="">Select Class Category</option>
                      {Object.values(categoryMap).map((value, idx) => (
                        <option key={idx} value={value}>
                          {value}
                        </option>
                      ))}
                    </Form.Control>
                  </td>
                  <td style={{ padding: "0rem" }}>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveRow(rowKey)}
                    >
                      <FaMinus />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <br></br>

        <h3
          style={{
            margin: "12px 0",
            backgroundColor: isDarkModeOn ? "#202020" : "",
            color: isDarkModeOn ? "white" : "black",
          }}
        >
          Studio Timings *
        </h3>
        <StudioWeeklyTimings timings={timings} setTimings={setTimings} />

        <h3
          style={{
            margin: "32px 0 0 0",
            backgroundColor: isDarkModeOn ? "#202020" : "",
            color: isDarkModeOn ? "white" : "black",
          }}
        >
          Social Media Links
        </h3>
        <Row>
          <Col md={4}>
            <Form.Label>Instagram</Form.Label>
            <Form.Control
              defaultValue={selectedStudio ? selectedStudio.instagram : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              type="text"
              rows={1}
              placeholder="Instagram Link"
              name="instagram"
            />
          </Col>
          <Col md={4}>
            <Form.Label>Facebook</Form.Label>
            <Form.Control
              defaultValue={selectedStudio ? selectedStudio.facebook : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              type="text"
              rows={1}
              placeholder="Facebook Link"
              name="facebook"
            />
          </Col>
          <Col md={4}>
            <Form.Label>YouTube</Form.Label>
            <Form.Control
              defaultValue={selectedStudio ? selectedStudio.youtube : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              type="text"
              rows={1}
              placeholder="YouTube Link"
              name="youtube"
            />
          </Col>
          <Col md={4}>
            <Form.Label>Twitter</Form.Label>
            <Form.Control
              defaultValue={selectedStudio ? selectedStudio.twitter : ""}
              style={{
                backgroundColor: isDarkModeOn ? "#333333" : "",
                color: isDarkModeOn ? "white" : "black",
              }}
              type="text"
              rows={1}
              placeholder="Twitter Link"
              name="twitter"
            />
          </Col>
        </Row>

        <br></br>
        {studioId && studioId.length > 0 && selectedStudioId && (
          <>
            <div>
              <ImageUpload
                entityId={selectedStudioId}
                title={"Studio Images"}
                storageFolder={STORAGES.STUDIOIMAGES}
                maxImageCount={10} minImageCount={5}
              />
            </div>
            <br />
            <div>
              <ImageUpload
                entityId={selectedStudioId}
                title={"Studio Icon"}
                storageFolder={STORAGES.STUDIOICON}
                maxImageCount={1} minImageCount={1}
              />
            </div>
            <div>
              <ImageUpload
                entityId={selectedStudioId}
                title={"Studio Announcement Images"}
                storageFolder={STORAGES.STUDIOANNOUNCEMENTS}
                maxImageCount={10} minImageCount={0}
              />
            </div>
            <br />
          </>
        )}
        {showUpdateSuccessAlert && (
          <AlertPopup
            type="info"
            message="Studio Updated successfully"
            timeOfDisplay={3000}
            fontSize="10px"
            fontWeight="bold"
          />
        )}
        {showUpdateErrorAlert && (
          <AlertPopup
            type="warning"
            message="Studio Update failed"
            timeOfDisplay={3000}
            fontSize="10px"
            fontWeight="bold"
          />
        )}
        <Button
          style={{
            backgroundColor: isDarkModeOn ? "#892CDC" : "black",
            color: "white",
          }}
          type="submit"
          disabled={isSubmitting}
        >
          Update Studio
        </Button>
        {isSubmitting && <LinearProgress />}
      </Form>
    </div>
  );
}

export default StudioUpdate;
