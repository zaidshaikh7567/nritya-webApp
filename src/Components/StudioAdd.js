import React from 'react'
import { Card, Button, Row, Col , Form,Accordion,Table,Toast,Dropdown,Badge } from 'react-bootstrap';
import {Button as MuiButton} from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection,where,getDocs,query } from "firebase/firestore";
import { COLLECTIONS } from '../constants';
import StudioTable from './StudioTable';
import ImageUpload from './ImageUpload';
import { STORAGES } from '../constants';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import MapsInput from './MapsInput';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import indianCities from '../cities.json';
import danceStyles from '../danceStyles.json';
import { AMENITIES_ICONS } from '../constants';
import {Autocomplete,TextField} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {Stepper,Step,StepLabel,Box} from '@mui/material';
import SuccessMessage from './SucessPage';
import BasicDemo from './BasicDemo';


const encodeToUnicode = (text) => {
  const textEncoder = new TextEncoder();
  const utf8Encoded = textEncoder.encode(text);
  return String.fromCharCode(...utf8Encoded);
};

const colorCombinations = [
  { background: 'success', text: 'white' },
  { background: 'warning', text: 'black' },
  { background: 'danger', text: 'white' },
  { background: 'info', text: 'black' },
];

const optionsDays = [
  { value: 'M', label: 'Monday' },
  { value: 'T', label: 'Tuesday' },
  { value: 'W', label: 'Wednessday' },
  { value: 'Th', label: 'Thrusday' },
  { value: 'F', label: 'Friday' },
  { value: 'S', label: 'Saturday' },
  { value: 'Sun', label: 'Sunday' },
]



function StudioAdd({instructors}) {
    const [newStudioId, setNewStudioId] = useState("")
    const [tableData, setTableData] = useState(
      { className: '', danceForms: '', days: '', time: '', instructors: '', fee:'',level:'' ,status: ''},
    );
    const [showToast, setShowToast] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const isDarkModeOn = useSelector(selectDarkModeStatus); // Use useSelector to access isDarkModeOn
    const [selectedInstructors, setSelectedInstructors] = useState([]);
    const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const instructorNamesWithIds = instructors.map((instructor) => `${instructor.name} - ${instructor.id}`);


    //const [dropdownVisible, setDropdownVisible] = useState(false);
    const locationOptions = indianCities.cities;
    const danceStylesOptions = danceStyles.danceStyles;
    const amenityKeys = Object.keys(AMENITIES_ICONS).map(String);
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleRestart = () => {
      setActiveStep(0);
      setNewStudioId("");
    };



    //console.log("danceStyles ",danceStylesOptions)

    const darkTheme = createTheme({
      palette: {
        mode: isDarkModeOn?'dark':'light',
      },
    });
    

    const handleToggleInstructor = (instructor) => {
      setSelectedInstructors((prevSelected) => {
        // Check if the instructor is already selected
        const isAlreadySelected = prevSelected.some((selected) => selected.id === instructor.id);
  
        // If selected, remove the instructor; if not selected, add the instructor
        return isAlreadySelected
          ? prevSelected.filter((selected) => selected.id !== instructor.id)
          : [...prevSelected, instructor];
      });
    };

    const handleDanceStylesChange = (event, value) => {
      setSelectedDanceStyles(value);
    };  

    const handleAmentiesChange = (event, value) => {
      setSelectedAmenities(value);
    };

    const handleInstructorChange = (event, value) => {
      setSelectedInstructors(value);
    };
  
      console.log("Studio Add",newStudioId)
      const handleAddStudio = async (event) => {
        event.preventDefault();
        const title = event.target.studioName.value;
        if (!title) {
          return;
        }
        console.log(JSON.parse(localStorage.getItem('userInfo')))
        const creatorRef = doc(db, "User", JSON.parse(localStorage.getItem('userInfo')).UserId);
        let isPremium=true
        console.log("selectedLocation to be added",selectedLocation)
            
        //body: event.target.body.value,
        try {
            const studioRef = await addDoc(collection(db, COLLECTIONS.STUDIO), {
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
              tableData: tableData,
              buildingName: event.target.buildingName.value,
              street: event.target.street.value,
              city: event.target.city.value,
              landmark: event.target.landmark.value,
              pincode: event.target.pincode.value,
              state: event.target.state.value,
              country: "India",
              geolocation : selectedLocation,
              aadharNumber: event.target.aadharNumber.value ,
              gstNumber: event.target.gstNumber.value,
              enrolledId:[],
              reviews:[],
              author: JSON.parse(localStorage.getItem('userInfo')).displayName,
              UserId: JSON.parse(localStorage.getItem('userInfo')).UserId,
              isPremium: isPremium,
              addAmenities: selectedAmenities.join(","),
              enrollmentProcess: encodeToUnicode(event.target.enrollmentProcess.value),
              creatorEmail: JSON.parse(localStorage.getItem('userInfo')).email,
              instagram: event.target.instagram.value,
              facebook: event.target.facebook.value,
              youtube: event.target.youtube.value,
              twitter: event.target.twitter.value,
              visibilty:1,

            });
            console.log("Studio added successfully");
            setNewStudioId(studioRef.id)
            const userRef = doc(db, "User", JSON.parse(localStorage.getItem('userInfo')).UserId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              console.log("User there",userSnap.data());
              if(userSnap.data() != null){
                await updateDoc(userRef,{
                  
                  StudioCreated: [...userSnap.data().StudioCreated,studioRef.id]
                });
                console.log("Studio added back successfully");
              }else{
                console.log("userSnap.data() null")
              }
            } else {
              console.log("User not found but studio created... error");
            }

            handleNext()
          
        } catch (error) {
          console.error("Error adding studio: ", error);
        }
     
      };
      

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

                <Form.Label>Studio Name</Form.Label>
                <Form.Control rows={1} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="textarea" placeholder="Enter studio name" name="studioName" />
                
                <Form.Label>About Studio</Form.Label>
                <Form.Control rows={6} style={{  minHeight: '10rem', backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" placeholder="Enter studio details" name="aboutStudio" />
                
                </Col>
                <Col md={6}>
                <Form.Label>Founder's Name</Form.Label>
                <Form.Control rows={1} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="textarea" placeholder="Enter studio name" name="founderName" />
                
                <Form.Label>About Founder</Form.Label>
                <Form.Control rows={6} style={{  minheight: '10rem', backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" placeholder="Enter studio details" name="aboutFounder" />
                
                </Col>
                </Row>
                <hr></hr>

                <h3 style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Contact Details</h3>
                <Row>
                <Col md={6}>

                <Form.Label>Mobile Number</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Enter studio details" name="mobileNumber" type="number"  />

                <Form.Label>WhatsApp Number</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Enter studio details" name="whatsappNumber" type="number"  />
                </Col>
                <Col md={6}>
                <Form.Label>Mail Address</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="email" rows={1} placeholder="Enter studio details" name="mailAddress" />
                
                  </Col>
                </Row>
                <hr></hr>
                
                <h3 style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Studio Details</h3>
                <Row>
                  <Col md={6}>
                <Form.Label >Dance Styles</Form.Label>
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
                <Form.Label>Number of Halls</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Number of Hall" name="numberOfHalls" type="number" />
                </Col>
                <Col md={6}>
                <Form.Label>Maximum Occupancy</Form.Label>
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
                  <Col xs={6} className="d-flex justify-content-end">
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
                          placeholder="Select Dance Styles"
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
                
                <h3 style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Class Schedule</h3>
                <span>Time Table Of dance classes</span>
                <StudioTable tableData={tableData} setTableData={setTableData}/>

                <h3 style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Additional Details</h3>
                <Row>
                <Col md={4}>
                  <Form.Label>Owner's Aadhar Number</Form.Label>
                  <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="number" rows={1} placeholder="Enter aadhar Number" name="aadharNumber" />
                  
                
                </Col>
                <Col md={4}>
                  <Form.Label>GST Number</Form.Label>
                  <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="text" rows={1} placeholder="GST Number" name="gstNumber" />
                  
                  
                </Col>
                <Col md={4}>
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
                      placeholder="Select Dance Styles"
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
                <h3 style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>Social Media Links</h3>
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
                  <Col xs={6} className="d-flex justify-content-end">
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
                  <Form.Label>Building Name</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" rows={1} placeholder="Enter building name" name="buildingName" />

                <Form.Label>Street</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" rows={1} placeholder="Enter street" name="street" />
                <Form.Label>City</Form.Label>
                <Form.Control as="select" style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} name="city">
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

                <Form.Label>Pincode</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Enter pincode" name="pincode" type="number"  />
               
                <Form.Label>State</Form.Label>
                <Form.Control style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Enter state" name="state" />
               
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
                  <Col xs={6} className="d-flex justify-content-end">
                    
                    <MuiButton variant="contained" style={{backgroundColor:isDarkModeOn?"#892cdc":"black"}}variant="primary" type="submit" style={{ backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white'  }}>
                      Add Studio & Next
                    </MuiButton>
                  </Col>
                </Row>
                
                </div>

                
                </Form.Group>
            </Form>
            
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
              <ImageUpload entityId={newStudioId} title={"Studio Images"}  storageFolder={STORAGES.STUDIOIMAGES} ></ImageUpload>
              <Row>
                
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
