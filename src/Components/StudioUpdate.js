import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form, Accordion, Table, Toast,Badge,Dropdown } from 'react-bootstrap';
import { db } from '../config';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { COLLECTIONS } from '../constants';
import AlertPopup from './AlertPopup';
import ImageUpload from './ImageUpload';
import { STORAGES } from '../constants';
import MapsInput from './MapsInput';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import TimeRangePicker from './TimeRangePicker';
import indianCities from '../cities.json';
import danceStyles from '../danceStyles.json';
import { AMENITIES_ICONS } from '../constants';
import {Autocomplete,TextField} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { FaMinus, FaPlus } from 'react-icons/fa';

const colorCombinations = [
  { background: 'success', text: 'white' },
  { background: 'warning', text: 'black' },
  { background: 'danger', text: 'white' },
  { background: 'info', text: 'black' },
];

function isMapOfMaps(data) {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return false; // Not an object (map)
  }

  for (const key in data) {
    if (typeof data[key] !== 'object' || data[key] === null || Array.isArray(data[key])) {
      return false; // Value is not an object (map)
    }
  }

  return true; // It's a map of maps
}

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

function StudioUpdate({ studio, setStudio, studioId, setStudioId, instructors }) {
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [selectedStudioId, setSelectedStudioId] = useState(null);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedStudioFrozenClassRows, setSelectedStudioFrozenClassRows] = useState(-1);
  const [selectedAmenities,setSelectedAmenities] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [defaultTime, setDefaultTime] =  useState("00:00-00:00");

  const locationOptions = indianCities.cities;
  const danceStylesOptions = danceStyles.danceStyles;
  const amenityKeys = Object.keys(AMENITIES_ICONS).map(String);
  const [showUpdateSuccessAlert, setShowUpdateSuccessAlert] = useState(false);
  const [showUpdateErrorAlert, setShowUpdateErrorAlert] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDanceStyles, setSelectedDanceStyles] = useState([]);
  const isDarkModeOn = useSelector(selectDarkModeStatus); // Use useSelector to access isDarkModeOn


  const darkTheme = createTheme({
    palette: {
      mode: isDarkModeOn?'dark':'light',
    },
  });

  const handleDanceStylesChange = (event, value) => {
    setSelectedDanceStyles(value);
  };
  
  
  const handleAmenitiesChange = (event, value) => {
    setSelectedAmenities(value);
  };

  const [tableData, setTableData] = useState({
    0:{
      className: '',
      danceForms: '',
      days: '',
      time: '',
      instructors: '',
      fee:'',
      level:''
    }
});

  const handleTimePickerOpen = (index,time) => {
    console.log("handleTimePickerOpen",time,index)
    setDefaultTime(time)
    setSelectedRowIndex(index);
    setShowTimePicker(true);
  };

  const handleTimePickerClose = () => {
    setShowTimePicker(false);
    setSelectedRowIndex(null); 
    console.log("---------")
  };

  const handleTimeSelect = (startTime, endTime) => {
    setTableData((prevData) => {
      const newData = { ...prevData };
  
      if (selectedRowIndex !== null && newData[selectedRowIndex]) {
        const currentTime = newData[selectedRowIndex].time;
  
        if (currentTime !== undefined) {
          const [currentStartTime, currentEndTime] = currentTime.split(' - ');
  
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
  
  
  useEffect(() => {
    // Fetch the list of studios created by the user from localStorage
    const studiosOfUser = JSON.parse(localStorage.getItem('StudioCreated')) || [];
    setStudio(studiosOfUser);

    // Create the list of studio IDs with the format "studioName: studioId"
    const studioIdList = studiosOfUser.map((studio) => `${studio.studioName} : ${studio.id}`);
    setStudioId(studioIdList);

    console.log("studio:", studio);
    console.log("studioId", studioId);
  }, []);

  useEffect(() => {
    // Fetch data for the selected studio when studioId changes
    if (selectedStudio) {
      console.log("Studio id changes",selectedStudio.instructorsNames)
      setSelectedInstructors((selectedStudio.instructorsNames));
      if (selectedStudio && selectedStudio.danceStyles) {
        setSelectedDanceStyles(selectedStudio.danceStyles.split(','));
      }
      if (selectedStudio && selectedStudio.addAmenities) {
        setSelectedAmenities(selectedStudio.addAmenities.split(','));
      }    
      if(selectedStudio && selectedStudio.tableData){
        const maxIndex = Math.max(...Object.keys(tableData).map(Number));
        setSelectedStudioFrozenClassRows(maxIndex);
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
        if(studioDoc.data().geolocation){
          const  loc = studioDoc.data().geolocation;
          setSelectedLocation(loc);
          console.log("StudioUpdate Selected location",selectedLocation,loc)
        }
        
        if (studioDoc.data().tableData) {
          setTableData(studioDoc.data().tableData);
          //selectedStudioFrozenClassRows()
          const maxIndex = Math.max(...Object.keys(tableData).map(Number));
          selectedStudioFrozenClassRows(maxIndex)
          console.log("Yo We got...",tableData,Array.isArray(tableData),isMapOfMaps(tableData),maxIndex)

        } else {
          setTableData({
            0:{
              className: '',
              danceForms: '',
              days: '',
              time: '',
              instructors: '',
              fee: '',
              level:'',
            }
        });
        }
      } else {
        setSelectedStudio(null); // No matching studio found
      }
    } catch (error) {
      console.error("Error fetching studio data:", error, selectedId);
    }
  };

  const handleUpdateStudio = async (event) => {
    event.preventDefault();
    const nameIdLocal = event.target.nameId.value;
    const indexOfColon = nameIdLocal.lastIndexOf(":");
    const studioId = nameIdLocal.substring(indexOfColon + 1).trim();
    console.log(studioId)

    if (!studioId) {
      console.log("Invalid or empty studio id")
      return;
    }

    //const description = encodeToUnicode(event.target.description.value);
    //const geolocation = selectedLocation;

    try {
      // Update the studio document with the new values
      //console.log(description,geolocation)
      const studioRef = doc(db, COLLECTIONS.STUDIO, studioId);
      await updateDoc(studioRef, {
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
              addAmenities: selectedAmenities.join(","),
              enrollmentProcess: encodeToUnicode(event.target.enrollmentProcess.value),
              instagram: event.target.instagram.value,
              facebook: event.target.facebook.value,
              youtube: event.target.youtube.value,
              twitter: event.target.twitter.value,
      });

      console.log("Studio updated successfully");
      alert("Studio Update successfully")
      setShowUpdateSuccessAlert(true);
      setShowUpdateErrorAlert(false);
    } catch (error) {
      console.error("Error updating studio: ", error);
      setShowUpdateSuccessAlert(false);
      setShowUpdateErrorAlert(true);
    }
    // Reset input fields to their initial values when a new studio is selected
    document.getElementById("updateStudioForm").reset();
  };

  const handleAddColumn = () => {
    setTableData((prevData) => {
      const newData = prevData.map((row) => ({
        ...row,
        [Object.keys(row).length]: ''
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
      return {
        ...prevData,
        [index]: {
          ...prevData[index],
          [field]: value
        }
      };
    });
  };

  return (
    <div>
      <br></br>
            <Form id="updateStudioForm" onSubmit={handleUpdateStudio}>
              <Form.Group controlId="formBasicUpdate">
                <Form.Label>Id</Form.Label>
                <Form.Control as="select" name="nameId" style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }}  onChange={handleSelectStudio}>
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

                <h3 style={{ backgroundColor: isDarkModeOn ? '#181818' : '', color: isDarkModeOn ? 'white' : 'black' }}>Basic Details</h3>
                <Row>
                <Col md={6}>

                <Form.Label>Studio Name</Form.Label>
                <Form.Control rows={1} defaultValue={selectedStudio ? selectedStudio.studioName : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="textarea" placeholder="Enter studio name" name="studioName" />
                
                <Form.Label>About Studio</Form.Label>
                <Form.Control rows={6} defaultValue={selectedStudio ? selectedStudio.aboutStudio : ''} style={{  minHeight: '150px', backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" placeholder="Enter studio details" name="aboutStudio" />
                
                </Col>
                <Col md={6}>
                <Form.Label>Founder's Name</Form.Label>
                <Form.Control rows={1} defaultValue={selectedStudio ? selectedStudio.founderName : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="textarea" placeholder="Enter studio name" name="founderName" />
                
                <Form.Label>About Founder</Form.Label>
                <Form.Control rows={6} defaultValue={selectedStudio ? selectedStudio.aboutFounder : ''} style={{  height: '150px', backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" placeholder="Enter studio details" name="aboutFounder" />
                
                </Col>
                </Row>
                <hr></hr>

                <h3 style={{ backgroundColor: isDarkModeOn ? '#181818' : '', color: isDarkModeOn ? 'white' : 'black' }}>Contact Details</h3>
                <Row>
                <Col md={6}>

                <Form.Label>Mobile Number</Form.Label>
                <Form.Control defaultValue={selectedStudio ? selectedStudio.mobileNumber : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Enter studio details" name="mobileNumber" type="number"  />

                <Form.Label>WhatsApp Number</Form.Label>
                <Form.Control defaultValue={selectedStudio ? selectedStudio.whatsappNumber : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Enter studio details" name="whatsappNumber" type="number"  />
                </Col>
                <Col md={6}>
                <Form.Label>Mail Address</Form.Label>
                <Form.Control defaultValue={selectedStudio ? selectedStudio.mailAddress : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="textarea" rows={1} placeholder="Enter studio details" name="mailAddress" />
                
                  </Col>
                </Row>
                <hr></hr>
                
                <h3 style={{ backgroundColor: isDarkModeOn ? '#181818' : '', color: isDarkModeOn ? 'white' : 'black' }}>Studio Details</h3>
                <Row>
                  <Col md={6}>
                <Form.Label>Dance Styles</Form.Label>
                
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
                <Form.Control defaultValue={selectedStudio ? selectedStudio.numberOfHalls : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} rows={1} placeholder="Number of Hall" name="numberOfHalls" type="number" />
                </Col>
                <Col md={6}>
                <Form.Label>Maximum Occupancy</Form.Label>
                <Form.Control defaultValue={selectedStudio ? selectedStudio.maximumOccupancy : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }}  rows={1} placeholder="Maximum Occupancy" name="maximumOccupancy" type="number"   />
                </Col>
                </Row>
                <hr></hr>
                
                <h3 style={{ backgroundColor: isDarkModeOn ? '#181818' : '', color: isDarkModeOn ? 'white' : 'black' }}>Instructor Details</h3>
                <Form.Label>Names of Instructors</Form.Label>
                <Row >
      
      <Col xs={6}>
      <div style={{ backgroundColor: isDarkModeOn ? '#181818' : '', color: isDarkModeOn ? 'white' : 'black' }}>
        <Dropdown className="d-inline mx-2">
          <Dropdown.Toggle variant="warning" id="dropdown-autoclose-true">
            Add/Remove Instrcutors
          </Dropdown.Toggle>
          <Dropdown.Menu style={{marginTop: '1px', backgroundColor: isDarkModeOn ? '#d3d3d3' : 'black', color: isDarkModeOn ? 'white' : 'white' }}>
            {instructors.map((instructor) => (
              <div style={{backgroundColor: isDarkModeOn ? '#d3d3d3' : 'black', color: isDarkModeOn ? '#181818' : '' }} key={instructor.id}>
                <Form.Check
                  type="checkbox"
                  id={`checkbox-${instructor.id}`}
                  label={`${instructor.name} - ${instructor.id.slice(-4)}`}
                  checked={selectedInstructors.some((selected) => selected.id === instructor.id)}
                  onChange={() => handleToggleInstructor(instructor)}
                  style={{ flex: 1 }} 
                />
              </div>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <br></br>
        <a href="#/modifyInstructors" rel="noreferrer" target="_blank" style={{ textDecoration: 'none', color: isDarkModeOn ? 'cyan' : 'blue' }}>
          Go to Instrcutors' Add/update Page? 
        </a>
      </div>
      </Col>
      <Col xs={12} md={6}>
        {selectedInstructors.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <p style={{ color: isDarkModeOn ? 'white' : 'black' }}>Selected Instructors:</p>
            {selectedInstructors.map((selected, index) => (
              <li key={selected.id} style={{ display: 'inline-block', marginRight: '10px' }}>
                <Badge
                  bg={colorCombinations[index % colorCombinations.length].background}
                  style={{
                    color: colorCombinations[index % colorCombinations.length].text,
                    marginLeft: '5px',
                  }}
                  pill
                >
                  {selected.name} - {selected.id.slice(-4)}{' '}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <p>No instructors selected.</p>
        )}
      </Col>
      </Row>  
      <hr></hr>
                   
                <h3 style={{ backgroundColor: isDarkModeOn ? '#181818' : '', color: isDarkModeOn ? 'white' : 'black' }}>Address Details</h3>
                <Row>
                  <Col md={6}>
                  <Form.Label>Building Name</Form.Label>
                <Form.Control defaultValue={selectedStudio ? selectedStudio.buildingName : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" rows={1} placeholder="Enter building name" name="buildingName" />

                <Form.Label>Street</Form.Label>
                <Form.Control defaultValue={selectedStudio ? selectedStudio.street : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" rows={1} placeholder="Enter street" name="street" />
                <Form.Label>City</Form.Label>
                  <Form.Control
                      as="select"
                      style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }}
                      name="city"
                      value={selectedStudio ? selectedStudio.city : ''}
                      onChange={(e) => {
                          const newCity = e.target.value;
                          setSelectedStudio(prevState => ({
                              ...prevState,
                              city: newCity
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
                <Form.Control defaultValue={selectedStudio ? selectedStudio.landmark : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" rows={1} placeholder="Enter landmark" name="landmark" />

                <Form.Label>Pincode</Form.Label>
                <Form.Control defaultValue={selectedStudio ? selectedStudio.pincode : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" rows={1} placeholder="Enter pincode" name="pincode" type="number"  />
               
                <Form.Label>State</Form.Label>
                <Form.Control defaultValue={selectedStudio ? selectedStudio.state : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" rows={1} placeholder="Enter state" name="state" />
               
                </Col>
                
                <Form.Label>Save exact Address</Form.Label>
                <MapsInput selectedLocation={selectedStudio && selectedStudio.geolocation ? selectedStudio.geolocation : selectedLocation}
                            setSelectedLocation={setSelectedLocation} />

                </Row>
                <hr></hr>

                
                <h3 style={{ backgroundColor: isDarkModeOn ? '#181818' : 'white', color: isDarkModeOn ? 'white' : 'black' }}>Additional Details</h3>
                <Row>
                  <Col md={4}>
                    <Form.Label>Owner's Aadhar Number</Form.Label>
                    <Form.Control defaultValue={selectedStudio ? selectedStudio.aadharNumber : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="number" rows={1} placeholder="Enter aadhar Number" name="aadharNumber" />
                  </Col>
                  <Col md={4}>
                      <Form.Label>GST Number</Form.Label>
                      <Form.Control defaultValue={selectedStudio ? selectedStudio.gstNumber : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="number" rows={1} placeholder="GST Number" name="gstNumber" />
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
                      onChange={handleAmenitiesChange}
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
                  
                  <Col>
                    <Form.Label>Enrollment Process</Form.Label>
                    <Form.Control defaultValue={selectedStudio ? decodeUnicode(selectedStudio.enrollmentProcess) : ''} rows={6} style={{  height: '150px', backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} as="textarea" placeholder="Enrollment Process" name="enrollmentProcess" />
              
                  </Col>
                </Row>

              <br></br>
            <span>Time Table Of dance classes</span>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Dance Forms</th>
                  <th>Days</th>
                  <th>Time</th>
                  <th>Instructors</th>
                  <th>Fee</th>
                  <th>Level</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(tableData).map((rowKey, index) => (
                  <tr key={rowKey}
                  >
                    <td style={{padding:'0rem'}}>
                      <Form.Control
                        type="text"
                        value={tableData[rowKey].className}
                        onChange={(e) => handleTableChange(rowKey, 'className', e.target.value)}
                      />
                    </td>
                    <td style={{padding:'0rem'}}>
                      <Form.Control
                        as="select"
                        value={tableData[rowKey].danceForms}
                        onChange={(e) => handleTableChange(rowKey, 'danceForms', e.target.value)}
                      >
                        <option value="">Select a dance form</option>
                        {danceStylesOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                        </Form.Control>
                    </td>
                    <td style={{padding:'0rem'}}>
                      <Form.Control
                        type="text"
                        value={tableData[rowKey].days}
                        onChange={(e) => handleTableChange(rowKey, 'days', e.target.value)}
                      />
                    </td>
                    <td style={{padding:'0rem'}}>
                      <Form.Control
                        type="text"
                        value={tableData[rowKey].time}
                        //onChange={(e) => handleTableChange(rowKey, 'time', e.target.value)}
                        onClick={() => handleTimePickerOpen(rowKey,tableData[rowKey].time)}
                      />
                      {showTimePicker && (
                      <TimeRangePicker
                        show={showTimePicker}
                        handleClose={handleTimePickerClose}
                        handleSelect={handleTimeSelect}
                        defaultTime={tableData[selectedRowIndex]?.time || "00:00-00:00"} // selectedRowIndex
                      />
                    )}
                    </td>
                    <td style={{padding:'0rem'}}>
                      <Form.Control
                        type="text"
                        value={tableData[rowKey].instructors?tableData[rowKey].instructors:""}
                        onChange={(e) => handleTableChange(rowKey, 'instructors', e.target.value)}
                      />
                    </td>
                    <td style={{padding:'0rem'}}>
                      <Form.Control
                        type="text"
                        value={tableData[rowKey].fee?tableData[rowKey].fee:""}
                        onChange={(e) => handleTableChange(rowKey, 'fee', e.target.value)}
                      />
                    </td>
                    <td style={{padding:'0rem'}}>
                      <Form.Control
                        as="select"
                        value={tableData[rowKey].level?tableData[rowKey].level:""}
                        onChange={(e) => handleTableChange(rowKey, 'level', e.target.value)}
                      >
                        <option value="">Select a Level</option>
                         <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Misc">Misc</option>

                        </Form.Control>
                    </td>
                    <td style={{padding:'0rem'}}>
                      {index === 0 ? (
                        <Button variant="primary" onClick={handleAddRow}>
                          <FaPlus/>
                        </Button>
                      ) : (
                        <>
                        {console.log('Yo',rowKey <= selectedStudioFrozenClassRows, rowKey,selectedStudioFrozenClassRows)}
                        
                        <Button variant="danger" onClick={() => handleRemoveRow(rowKey)} disabled={rowKey <= selectedStudioFrozenClassRows} >
                         <FaMinus/>
                        </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </Table>
            <br></br>
            <h3 style={{ backgroundColor: isDarkModeOn ? '#181818' : '', color: isDarkModeOn ? 'white' : 'black' }}>Social Media Links</h3>
               <Row>
            <Col md={4}>
                          <Form.Label>Instagram</Form.Label>
                          <Form.Control defaultValue={selectedStudio ? selectedStudio.instagram : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="text" rows={1} placeholder="Instagram Link" name="instagram" />
                        </Col>
                        <Col md={4}>
                          <Form.Label>Facebook</Form.Label>
                          <Form.Control defaultValue={selectedStudio ? selectedStudio.facebook : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="text" rows={1} placeholder="Facebook Link" name="facebook" />
                        </Col>
                        <Col md={4}>
                          <Form.Label>YouTube</Form.Label>
                          <Form.Control defaultValue={selectedStudio ? selectedStudio.youtube : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="text" rows={1} placeholder="YouTube Link" name="youtube" />
                        </Col>
                        <Col md={4}>
                          <Form.Label>Twitter</Form.Label>
                          <Form.Control defaultValue={selectedStudio ? selectedStudio.twitter : ''} style={{ backgroundColor: isDarkModeOn ? '#333333' : '', color: isDarkModeOn ? 'white' : 'black' }} type="text" rows={1} placeholder="Twitter Link" name="twitter" />
                        </Col>
                        </Row>

            <br></br>
            <Button style={{ backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white'  }} type="submit">
              Update Studio
            </Button>
            </Form>
            {studioId && studioId.length > 0 && selectedStudioId && (
              <>
                <div>
                  <ImageUpload entityId={selectedStudioId} title={"Studio Images"} storageFolder={STORAGES.STUDIOIMAGES} />
                </div>
                <br />
                <button onClick={() => {
                            console.log("selectedLocation ",selectedLocation);
                          }}>
                          Click me
                        </button>
                <div>
                  <ImageUpload entityId={selectedStudioId} title={"Studio Icon"} storageFolder={STORAGES.STUDIOICON} maxImageCount={1} />
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
    </div>
  );
}

export default StudioUpdate;
