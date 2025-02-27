import React, { useRef } from 'react'
import { Row, Col , Form } from 'react-bootstrap';
import {LinearProgress, Button as MuiButton} from '@mui/material';
import { useState, useEffect } from 'react';
import { db } from '../config';
import { doc, getDoc,addDoc,updateDoc,collection,where,getDocs,query, deleteDoc } from "firebase/firestore";
import { COLLECTIONS, DRAFT_COLLECTIONS } from '../constants';
import StudioTable from './StudioTable';
import ImageUpload from './ImageUpload';
import { STORAGES } from '../constants';
import MapsInput from './MapsInput';
import { useSelector} from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import indianCities from '../cities.json';
import indianStates from '../states.json';
import danceStyles from '../danceStyles.json';
import { AMENITIES_ICONS } from '../constants';
import {Autocomplete,TextField} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {Stepper,Step,StepLabel} from '@mui/material';
import SuccessMessage from './SucessPage';
import { postData } from '../utils/common';
import { isEqual } from 'lodash';
import StudioWeeklyTimings from './StudioWeeklyTiming';
import { useSnackbar } from '../context/SnackbarContext';

const encodeToUnicode = (text) => {
  const textEncoder = new TextEncoder();
  const utf8Encoded = textEncoder.encode(text);
  return String.fromCharCode(...utf8Encoded);
};

const decodeUnicode = (unicodeString) => {
  const utf8Encoded = unicodeString.split('').map((c) => c.charCodeAt(0));
  const textDecoder = new TextDecoder();
  return textDecoder.decode(new Uint8Array(utf8Encoded));
};

const initialStudioTimings = {
  tuesday: [{ open: "09:00 AM", close: "06:00 PM" }],
  wednesday: [{ open: "09:00 AM", close: "06:00 PM" }],
  thursday: [{ open: "09:00 AM", close: "06:00 PM" }],
  friday: [{ open: "09:00 AM", close: "06:00 PM" }],
  saturday: [{ open: "09:00 AM", close: "06:00 PM" }],
  sunday: [{ open: "09:00 AM", close: "06:00 PM" }],
  monday: [{ open: "09:00 AM", close: "06:00 PM" }],
}

const DRAFT_INTERVAL_TIME = 1000 * 10;

function StudioAdd({instructors}) {
    const previousDraftState = useRef(null);
    const showSnackbar = useSnackbar();
    const [newStudioId, setNewStudioId] = useState("")
    const [tableData, setTableData] = useState(
      [{ className: '', danceForms: '', days: '', time: '', instructors: [], fee:'',level:'' ,status: '' ,freeTrial:false ,classCategory: []}],
    );
    const [selectedLocation, setSelectedLocation] = useState(null);
    const isDarkModeOn = useSelector(selectDarkModeStatus); // Use useSelector to access isDarkModeOn
    const [selectedInstructors, setSelectedInstructors] = useState([]);
    const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const instructorNamesWithIds = instructors.map((instructor) => `${instructor.name} - ${instructor.id}`);
    const [isReady, setIsReady] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timings, setTimings] = useState(initialStudioTimings);

    // console.log("==============");
    // console.log("timings", timings);
    // console.log("==============");

    //const [dropdownVisible, setDropdownVisible] = useState(false);
    const locationOptions = indianCities.cities;
    const stateOptions = indianStates.states;
    const danceStylesOptions = danceStyles.danceStyles;
    const amenityKeys = Object.keys(AMENITIES_ICONS).map(String);
    const [activeStep, setActiveStep] = useState(0);

    const validateStep1 = () => {
      const form = document.getElementById("addStudioForm");

      if (!form.studioName.value) return "Studio name is required";
      if (!form.aboutStudio.value) return "About Studio is required";
      if (!form.founderName.value) return "Founder name is required";
      if (!form.aboutFounder.value) return "About Founder is required";
      if (!form.mobileNumber.value) return "Mobile number is required";
      if (!form.whatsappNumber.value) return "WhatsApp number is required";
      if (!form.numberOfHalls.value) return "Number of halls is required";
      if (!form.maximumOccupancy.value) return "Maximum occupancy is required";
      if (!selectedDanceStyles.length) return "At least one dance style must be selected";
    };

    const validateStep2 = () => {
      if (!Object.values(timings).every((slots) => slots.length > 0)) {
        return "All timing slots must be filled";
      }
      if (!tableData.length) {
        return "At least one class entry is required";
      }
      for (const entry of tableData) {
        if (!entry.className?.trim()) return "Class name is required";
        if (!entry.danceForms?.trim()) return "Dance forms are required";
        if (!entry.days?.trim()) return "Days are required";
        if (!entry.time?.trim()) return "Time is required";
        if (!entry.fee?.trim()) return "Fee is required";
        if (!entry.level?.trim()) return "Level is required";
        if (!entry.instructors.length) return "At least one instructor is required";
        if (!entry.classCategory.length || !entry.classCategory[0]?.trim()) return "Class category is required";
      }
    };

    const validateStep3 = () => {
      const form = document.getElementById("addStudioForm");

      if (!form.buildingName.value) return "Building name is required";
      if (!form.street.value) return "Street is required";
      if (!form.city.value) return "City is required";
      if (!form.pincode.value) return "Pincode is required";
      if (!form.state.value) return "State is required";
      if (!selectedLocation) return "Location selection is required";
    };

    const handleNext = () => {
      let errorMessage = '';

      if (activeStep === 0) errorMessage = validateStep1()

      if (activeStep === 1) errorMessage = validateStep2()

      if (errorMessage) {
        return showSnackbar(errorMessage, 'error');
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    const darkTheme = createTheme({
      palette: {
        mode: isDarkModeOn?'dark':'light',
      },
    });

    const handleDanceStylesChange = (event, value) => {
      setSelectedDanceStyles(value);
    };  

    const handleAmentiesChange = (event, value) => {
      setSelectedAmenities(value);
    };

    const handleInstructorChange = (event, value) => {
      setSelectedInstructors(value);
    };

    const resetDraft = async () => {
      try {
        const q = query(
          collection(db, DRAFT_COLLECTIONS.DRAFT_STUDIOS),
          where(
            "UserId",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).UserId
          )
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
            DRAFT_COLLECTIONS.DRAFT_STUDIOS,
            foundStudio.id
          );

          await deleteDoc(studioRef);
        }
      } catch (error) {
        console.error(error);
      }
    };

      const handleAddStudio = async (event) => {
        event.preventDefault();

        if (activeStep < 3) { // If user enter enter/return btn at any place it should validate all
          const errorMessage1 = validateStep1();
          const errorMessage2 = validateStep2();
          const errorMessage3 = validateStep3();
        
          const errorMessages = [errorMessage1, errorMessage2, errorMessage3].filter(Boolean).join(', ');
        
          if (errorMessages) {
            return showSnackbar(errorMessages, 'error');
          }
        }        

        const title = event.target.studioName.value;
        if (!title) {
          return;
        }
        let isPremium=true
        const newData = tableData.reduce((accumulator, current, index) => {
          accumulator[index] = current;
          return accumulator;
        }, {});

        try {
          const currentUserEmail = JSON.parse(localStorage.getItem("userInfo"))?.email;
          const studioData = {
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
              status: 'OPEN',
              tableData: newData,
              buildingName: event.target.buildingName.value,
              street: event.target.street.value,
              city: event.target.city.value,
              landmark: event.target.landmark.value,
              pincode: event.target.pincode.value,
              state: event.target.state.value,
              country: "India",
              geolocation : selectedLocation,
              gstNumber: event.target.gstNumber.value,
              enrolledId:[],
              reviews:[],
              author: JSON.parse(localStorage.getItem('userInfo')).displayName,
              UserId: JSON.parse(localStorage.getItem('userInfo')).UserId,
              isPremium: isPremium,
              addAmenities: selectedAmenities.join(","),
              enrollmentProcess: encodeToUnicode(event.target.enrollmentProcess.value),
              creatorEmail: currentUserEmail,
              instagram: event.target.instagram.value,
              facebook: event.target.facebook.value,
              youtube: event.target.youtube.value,
              twitter: event.target.twitter.value,
              visibilty:1,
              timings
          };
            setIsSubmitting(true);
            const notifyEmails = currentUserEmail
            const metaData = {
              entity_name: studioData.studioName,
              city: studioData.city ,
            }
            const response = await postData(studioData,COLLECTIONS.STUDIO, notifyEmails, metaData) ;
            if (response.ok) {
              const result = await response.json();
              setNewStudioId(result.id)
              resetDraft();
              handleNext();
            }
        } catch (error) {
          console.error("Error adding studio: ", error);
        } finally {
          setIsSubmitting(false);
        }
      };

  const saveDraft = async () => {
    const form = document.getElementById("addStudioForm");

    try {
      const q = query(
        collection(db, DRAFT_COLLECTIONS.DRAFT_STUDIOS),
        where(
          "UserId",
          "==",
          JSON.parse(localStorage.getItem("userInfo")).UserId
        )
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
          DRAFT_COLLECTIONS.DRAFT_STUDIOS,
          foundStudio.id
        );
  
        const newData = tableData.reduce((accumulator, current, index) => {
          accumulator[index] = current;
          return accumulator;
        }, {});
  
        const currentState = {
          studioName: form.studioName.value,
          aboutStudio: form.aboutStudio.value,
          founderName: form.founderName.value,
          aboutFounder: form.aboutFounder.value,
          mobileNumber: form.mobileNumber.value,
          whatsappNumber: form.whatsappNumber.value,
          mailAddress: form.mailAddress.value,
          danceStyles: selectedDanceStyles.join(","),
          numberOfHalls: form.numberOfHalls.value,
          maximumOccupancy: form.maximumOccupancy.value,
          instructorsNames: selectedInstructors,
          status: "OPEN",
          tableData: newData,
          buildingName: form.buildingName.value,
          street: form.street.value,
          city: form.city.value,
          landmark: form.landmark.value,
          pincode: form.pincode.value,
          state: form.state.value,
          country: "India",
          geolocation: selectedLocation,
          gstNumber: form.gstNumber.value,
          enrolledId: [],
          reviews: [],
          author: JSON.parse(localStorage.getItem("userInfo")).displayName,
          UserId: JSON.parse(localStorage.getItem("userInfo")).UserId,
          isPremium: true,
          addAmenities: selectedAmenities.join(","),
          enrollmentProcess: encodeToUnicode(form.enrollmentProcess.value),
          creatorEmail: JSON.parse(localStorage.getItem("userInfo")).email,
          instagram: form.instagram.value,
          facebook: form.facebook.value,
          youtube: form.youtube.value,
          twitter: form.twitter.value,
          visibilty: 1,
          timings,
        };

        if (!isEqual(previousDraftState.current, currentState)) {
          await updateDoc(studioRef, currentState);
          previousDraftState.current = currentState;
          showSnackbar("Draft saved successfully!", "success");
        } else {
          showSnackbar("No changes detected to save.", "info");
        }
      }
    } catch (error) {
      console.error("Error saving draft: ", error);
    }
  };

  useEffect(() => {
    async function main() {
      const form = document.getElementById("addStudioForm");

      try {
        const q = query(
          collection(db, DRAFT_COLLECTIONS.DRAFT_STUDIOS),
          where(
            "UserId",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).UserId
          )
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          let studios = [];

          querySnapshot.forEach((doc) => {
            studios.push({ id: doc.id, ...doc.data() });
          });

          let foundStudio = studios[0];

          form.studioName.value = foundStudio.studioName;
          form.aboutStudio.value = foundStudio.aboutStudio;
          form.founderName.value = foundStudio.founderName;
          form.aboutFounder.value = foundStudio.aboutFounder;
          form.mobileNumber.value = foundStudio.mobileNumber;
          form.whatsappNumber.value = foundStudio.whatsappNumber;
          form.mailAddress.value = foundStudio.mailAddress;
          setSelectedDanceStyles(
            foundStudio.danceStyles.length
              ? foundStudio.danceStyles.split(",")
              : []
          );
          form.numberOfHalls.value = foundStudio.numberOfHalls;
          form.maximumOccupancy.value = foundStudio.maximumOccupancy;
          setSelectedInstructors(foundStudio.instructorsNames);
          form.buildingName.value = foundStudio.buildingName;
          form.street.value = foundStudio.street;
          form.city.value = foundStudio.city;
          form.landmark.value = foundStudio.landmark;
          form.pincode.value = foundStudio.pincode;
          form.state.value = foundStudio.state;
          setSelectedLocation(foundStudio.geolocation);
          // form.aadharNumber.value = foundStudio.aadharNumber;
          form.gstNumber.value = foundStudio.gstNumber;
          setTableData(Object.values(foundStudio.tableData));
          setSelectedAmenities(
            foundStudio.addAmenities.length
              ? foundStudio.addAmenities.split(",")
              : []
          );
          form.enrollmentProcess.value = decodeUnicode(
            foundStudio.enrollmentProcess
          );
          form.instagram.value = foundStudio.instagram;
          form.facebook.value = foundStudio.facebook;
          form.youtube.value = foundStudio.youtube;
          form.twitter.value = foundStudio.twitter;
          if (foundStudio?.timings) setTimings(foundStudio.timings);
        } else {
          await addDoc(collection(db, DRAFT_COLLECTIONS.DRAFT_STUDIOS), {
            studioName: form.studioName.value,
            aboutStudio: form.aboutStudio.value,
            founderName: form.founderName.value,
            aboutFounder: form.aboutFounder.value,
            mobileNumber: form.mobileNumber.value,
            whatsappNumber: form.whatsappNumber.value,
            mailAddress: form.mailAddress.value,
            danceStyles: selectedDanceStyles.join(","),
            numberOfHalls: form.numberOfHalls.value,
            maximumOccupancy: form.maximumOccupancy.value,
            instructorsNames: selectedInstructors,
            status: "OPEN",
            tableData: {
              0: {
                className: "",
                danceForms: "",
                days: "",
                time: "",
                instructors: [],
                fee: "",
                level: "",freeTrial:false, 
                classCategory: []
              },
            },
            buildingName: form.buildingName.value,
            street: form.street.value,
            city: form.city.value,
            landmark: form.landmark.value,
            pincode: form.pincode.value,
            state: form.state.value,
            country: "India",
            geolocation: selectedLocation,
            
            gstNumber: form.gstNumber.value,
            enrolledId: [],
            reviews: [],
            author: JSON.parse(localStorage.getItem("userInfo")).displayName,
            UserId: JSON.parse(localStorage.getItem("userInfo")).UserId,
            isPremium: true,
            addAmenities: selectedAmenities.join(","),
            enrollmentProcess: encodeToUnicode(form.enrollmentProcess.value),
            creatorEmail: JSON.parse(localStorage.getItem("userInfo")).email,
            instagram: form.instagram.value,
            facebook: form.facebook.value,
            youtube: form.youtube.value,
            twitter: form.twitter.value,
            visibilty: 1,
            timings
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
    let previousState = null; 

    async function main() {
      const form = document.getElementById("addStudioForm");

      try {
        const q = query(
          collection(db, DRAFT_COLLECTIONS.DRAFT_STUDIOS),
          where(
            "UserId",
            "==",
            JSON.parse(localStorage.getItem("userInfo")).UserId
          )
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
            DRAFT_COLLECTIONS.DRAFT_STUDIOS,
            foundStudio.id
          );
          
          intervalId = setInterval(async () => {
            
            try {
              const newData = tableData.reduce((accumulator, current, index) => {
                accumulator[index] = current;
                return accumulator;
              }, {});
              const currentState = { 
                studioName: form.studioName.value,
                aboutStudio: form.aboutStudio.value,
                founderName: form.founderName.value,
                aboutFounder: form.aboutFounder.value,
                mobileNumber: form.mobileNumber.value,
                whatsappNumber: form.whatsappNumber.value,
                mailAddress: form.mailAddress.value,
                danceStyles: selectedDanceStyles.join(","),
                numberOfHalls: form.numberOfHalls.value,
                maximumOccupancy: form.maximumOccupancy.value,
                instructorsNames: selectedInstructors,
                status: "OPEN",
                tableData: newData,
                buildingName: form.buildingName.value,
                street: form.street.value,
                city: form.city.value,
                landmark: form.landmark.value,
                pincode: form.pincode.value,
                state: form.state.value,
                country: "India",
                geolocation: selectedLocation,
                
                gstNumber: form.gstNumber.value,
                enrolledId: [],
                reviews: [],
                author: JSON.parse(localStorage.getItem("userInfo"))
                  .displayName,
                UserId: JSON.parse(localStorage.getItem("userInfo")).UserId,
                isPremium: true,
                addAmenities: selectedAmenities.join(","),
                enrollmentProcess: encodeToUnicode(
                  form.enrollmentProcess.value
                ),
                creatorEmail: JSON.parse(localStorage.getItem("userInfo"))
                  .email,
                instagram: form.instagram.value,
                facebook: form.facebook.value,
                youtube: form.youtube.value,
                twitter: form.twitter.value,
                visibilty: 1,
                timings
              }
              
              // Check if the current state is different from the previous state
              if (!isEqual(previousState, currentState)) {
                try {
                  await updateDoc(studioRef, currentState);
                  previousState = currentState; // Update previous state after successful save
                  // console.log("Next AutoSave in",DRAFT_INTERVAL_TIME)
                } catch (error) {
                  console.error(error);
                }
              }else{
                // console.log("Nothing for Autosave to save")
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
    tableData,
    selectedLocation,
    selectedAmenities,
  ]);

  return (
    <div >
          <Stepper activeStep={activeStep} alternativeLabel>
            {['Basic Studio & Owner details', 'Instructors, Classes & Social Media', 'Address & Registration', 'Studio Icon', 'Studio & Class Images'].map((label) => (
              <Step key={label}>
                <StepLabel ><p style={{color:isDarkModeOn?"white":"black"}}>{label}</p></StepLabel>
              </Step>
            ))}
          </Stepper>
          
            < div hidden={activeStep > 2} >
            <Form id="addStudioForm" onSubmit={handleAddStudio} style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>
              <Form.Group controlId="formBasicAdd">
             
                  <div hidden={activeStep !== 0}>
                  <h3 style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Basic Details</h3>
                <Row>
                <Col md={6}>

                <Form.Label>Studio Name *</Form.Label>
                <Form.Control rows={1} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="textarea" placeholder="Enter studio name" name="studioName" />
                
                <Form.Label>About Studio *</Form.Label>
                <Form.Control rows={6} style={{  minHeight: '10rem', backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" placeholder="Enter studio's details" name="aboutStudio" />
                
                </Col>
                <Col md={6}>
                <Form.Label>Founder's Name *</Form.Label>
                <Form.Control rows={1} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="textarea" placeholder="Enter founder name" name="founderName" />
                
                <Form.Label>About Founder *</Form.Label>
                <Form.Control rows={6} style={{  minheight: '10rem', backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" placeholder="Enter founder's details" name="aboutFounder" />
                
                </Col>
                </Row>
                <hr></hr>

                <h3 style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Contact Details</h3>
                <Row>
                <Col md={6}>

                <Form.Label>Mobile Number *</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Enter mobile number" name="mobileNumber" type="number"  />

                <Form.Label>WhatsApp Number *</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Enter whatsapp number" name="whatsappNumber" type="number"  />
                </Col>
                <Col md={6}>
                <Form.Label>Mail Address</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="email" rows={1} placeholder="Enter mail address" name="mailAddress" />
                
                  </Col>
                </Row>
                <hr></hr>
                
                <h3 style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Studio Details</h3>
                <Row>
                  <Col md={6}>
                <Form.Label >Dance Styles *</Form.Label>
                <ThemeProvider theme={darkTheme}>
                  <CssBaseline />

                 <Autocomplete
                  style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }}
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
                      style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }}
                    />
                  )}
                />
                </ThemeProvider>
                <Form.Label>Number of Hall(s) *</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Number of Hall(s)" name="numberOfHalls" type="number" />
                </Col>
                <Col md={6}>
                <Form.Label>Maximum Occupancy *</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }}  rows={1} placeholder="Maximum Occupancy" name="maximumOccupancy" type="number"   />
                </Col>
                </Row>
                <br></br>
                <Row>
                  <Col xs={6}>
                    <MuiButton variant="contained" style={{backgroundColor:isDarkModeOn?"#892cdc":"black"}} disabled >
                      Prev
                    </MuiButton>
                  </Col>
                  <Col xs={6} className="d-flex justify-content-end gap-3">
                    <MuiButton variant="contained" style={{backgroundColor:isDarkModeOn?"#892cdc":"black"}}onClick={saveDraft}>
                      Save to Draft
                    </MuiButton>
                    <MuiButton variant="contained" style={{backgroundColor:isDarkModeOn?"#892cdc":"black"}}onClick={() => handleNext()}>
                      Next
                    </MuiButton>
                  </Col>
                </Row>
                  
                  </div>


               
              
                <div hidden={activeStep !== 1}>


                
            <h3 style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Instructor Details</h3>
                <Form.Label>Names of Instructors</Form.Label>
                <Row>
                  <ThemeProvider theme={darkTheme}>
                    <CssBaseline />

                    <Autocomplete
                      style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }}
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
                          style={{backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }}
                        />
                      )}
                    />
                  </ThemeProvider>
                </Row> 
                <a href="#/modifyInstructors" rel="noreferrer" target="_blank" style={{ textDecoration: 'none', color: isDarkModeOn ? 'cyan' : 'blue' }}>
                      Go to Instrcutors' Add/update Page? 
                    </a>
                <hr></hr>   
                
                <h3 style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Class Schedule *</h3>
                  <span>Time Table Of dance classes</span>
                    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollbarColor: isDarkModeOn ? '#888 #333' : '#ccc #fff', }}>
                      <StudioTable
                        tableData={tableData}
                        setTableData={setTableData}
                        instructorNamesWithIds={instructorNamesWithIds}
                      />
                    </div>
                <h3 style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Additional Details</h3>
                <Row>
                <Col md={4}>
                  <Form.Label>GST Number</Form.Label>
                  <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="text" rows={1} placeholder="GST Number" name="gstNumber" />
                  
                  
                </Col>
                <Col md={8}>
                <Form.Label>Add Amenities</Form.Label>
                  
                  <ThemeProvider theme={darkTheme}>
                  <CssBaseline />

                 <Autocomplete
                  style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }}
                  multiple
                  id="tags-standard"
                  options={amenityKeys}
                  value={selectedAmenities}
                  onChange={handleAmentiesChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      placeholder="Select Amenities"
                      style={{backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }}
                    />
                  )}
                />
                </ThemeProvider>
                </Col>
                </Row>
                <Row>
                <Form.Label>Enrollment Process</Form.Label>
                  <Form.Control rows={12} style={{  height: '150px', backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" placeholder="Enrollment Process" name="enrollmentProcess" />
          
                </Row>

                <h3 style={{ margin: '12px 0', backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Studio Timings *</h3>
                <StudioWeeklyTimings timings={timings} setTimings={setTimings} />

                <h3 style={{ margin: '32px 0 0 0', backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Social Media Links</h3>
               <Row>
               <Col md={4}>
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="text" rows={1} placeholder="Instagram Link" name="instagram" />
                </Col>
                <Col md={4}>
                  <Form.Label>Facebook</Form.Label>
                  <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="text" rows={1} placeholder="Facebook Link" name="facebook" />
                </Col>
                <Col md={4}>
                  <Form.Label>YouTube</Form.Label>
                  <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="text" rows={1} placeholder="YouTube Link" name="youtube" />
                </Col>
                <Col md={4}>
                  <Form.Label>Twitter</Form.Label>
                  <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="text" rows={1} placeholder="Twitter Link" name="twitter" />
                </Col>

               </Row>

               <Row>
                  <Col xs={6}>
                    <MuiButton variant="contained" style={{backgroundColor:isDarkModeOn?"#892cdc":"black"}}onClick={() => handleBack()}>
                      Prev
                    </MuiButton>
                  </Col>
                  <Col xs={6} className="d-flex justify-content-end gap-3">
                    <MuiButton variant="contained" style={{backgroundColor:isDarkModeOn?"#892cdc":"black"}}onClick={saveDraft}>
                      Save to Draft
                    </MuiButton>
                    <MuiButton variant="contained" style={{backgroundColor:isDarkModeOn?"#892cdc":"black"}}onClick={() => handleNext()}>
                      Next
                    </MuiButton>
                  </Col>
                </Row>
              </div>

               
                <div hidden={activeStep !== 2}>

                <h3 style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Address Details</h3>
                <Row>
                  <Col md={6}>
                  <Form.Label>Building Name *</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" rows={1} placeholder="Enter building name" name="buildingName" />

                <Form.Label>Street *</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" rows={1} placeholder="Enter street" name="street" />
                <Form.Label>City *</Form.Label>
                <Form.Control as="select" style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black', height: 'auto', // Let it adjust to content
                    lineHeight: '1.5em', // Mimics rows={1}
                    padding: '8px', }} name="city">
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
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Enter landmark" name="landmark" />

                <Form.Label>Pincode *</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Enter pincode" name="pincode" type="number"  />
               
                <Form.Label>State *</Form.Label>
                <Form.Control as="select" style={{ padding: "0 1.5rem", backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Enter state" name="state">
                <option value="">Select a State</option>
                    {stateOptions.map((city, index) => (
                        <option key={index} value={city}>
                            {city}
                        </option>
                    ))}
                </Form.Control>
               
                </Col>

                <Form.Label>Save exact Address</Form.Label>
                <MapsInput selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}></MapsInput>
                
                </Row>
                

                
              <br></br>

              <Row>
                  <Col xs={6}>
                    <MuiButton variant="contained" style={{backgroundColor:isDarkModeOn?"#892cdc":"black"}}onClick={() => handleBack()}>
                      Prev
                    </MuiButton>
                  </Col>
                  <Col xs={6} className="d-flex justify-content-end gap-3">
                    <MuiButton variant="contained" style={{backgroundColor:isDarkModeOn?"#892cdc":"black"}}onClick={saveDraft}>
                      Save to Draft
                    </MuiButton>
                    <MuiButton variant="contained" disabled={isSubmitting} style={{backgroundColor:isDarkModeOn?"#892cdc":"black", color:'white'}} type="submit">
                      Add Studio & Next
                    </MuiButton>
                  </Col>
                </Row>
                
                </div>

                
                </Form.Group>
            </Form>
            {isSubmitting && <LinearProgress />}
            {
              newStudioId === ""?(""):(<p>New Studio Created with id {newStudioId}. Now u can upload images regarding them</p>)
            }
            
            </div>
          
             
             
            <div hidden={activeStep !== 3}>
              
              <ImageUpload entityId={newStudioId} title={"Studio Icon"} storageFolder={STORAGES.STUDIOICON} maxImageCount={1}></ImageUpload>
              <Row>
                
                <Col xs={12} className="d-flex justify-content-end">
                  <MuiButton variant="contained" style={{backgroundColor:isDarkModeOn?"#892cdc":"black"}}onClick={() => handleNext()}>
                    Next
                  </MuiButton>
                </Col>
              </Row>

              </div>
             
            
             <div hidden={activeStep !== 4}>
              <ImageUpload entityId={newStudioId} title={"Studio Images"} maxImageCount={10} minImageCount={5} storageFolder={STORAGES.STUDIOIMAGES} ></ImageUpload>
            </div>

            <div hidden={activeStep !== 4}>
              <ImageUpload entityId={newStudioId} title={"Studio Announcement Images"}  storageFolder={STORAGES.STUDIOANNOUNCEMENTS} maxImageCount={10}></ImageUpload>

              <Row className='mt-3'>
              <Col xs={12} className="d-flex justify-content-end">
                <MuiButton variant="contained" style={{backgroundColor:isDarkModeOn?"#892cdc":"black"}}onClick={() => handleNext()}>
                  Next
                </MuiButton>
              </Col>
            </Row>
            </div>

            <div  hidden={activeStep !== 5} style={{ display: 'flex',  alignItems: 'center', height: 'auto'}}>
          
                <SuccessMessage StudioId={newStudioId} />
                <br></br>
              
            </div>
        
      <br></br>
      
    </div>
  )
}


export default StudioAdd
