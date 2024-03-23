import React, { useState,useEffect } from 'react';
import StudioCard from "../Components/StudioCard";
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { Form, Button, Col, Row, Image, Modal, FormControl,Badge, ButtonGroup } from 'react-bootstrap';
import {Badge as MuiBadge,Chip as MuiChip, Stack as MuiStack} from '@mui/material';

import indianCities from '../cities.json';
import {refreshLocation} from '../redux/actions/refreshLocationAction';
import SmallCard from '../Components/SmallCard';

const FILTER_LOCATION_KEY = 'filterLocation';
const FILTER_DISTANCES_KEY = 'filterDistances';
const FILTER_DANCE_FORMS_KEY = 'filterDanceForms';
const FILTER_USER_GEO_LOC = "browserGeoLoc";
const danceForms = ['Ballet', 'Hip Hop', 'Salsa', 'Kathak'];
const distances = [2,5,10,20]

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedDistances, setSelectedDistances] = useState('');
  const [selectedDanceForm, setSelectedDanceForm] = useState('');
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const dispatch = useDispatch();
  console.log("dark mode", isDarkModeOn)

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  }

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };
  const countActiveFilters = () => {
    let count = 0;
    if (localStorage.getItem(FILTER_DISTANCES_KEY)) count++;
    if (localStorage.getItem(FILTER_DANCE_FORMS_KEY)) count++;
    return count;
  };

  const handleSearch = () => {
    // Perform the search and update the results
    let apiEndpoint = `https://nrityaserver-2b241e0a97e5.herokuapp.com/api/search/?query=${query}`;
    //apiEndpoint = `http://127.0.0.1:8000/api/search/?query=${query}`;

    if (localStorage.getItem(FILTER_LOCATION_KEY)) {
      apiEndpoint += `&city=${encodeURIComponent(localStorage.getItem(FILTER_LOCATION_KEY))}`;
    }
  
    if (selectedDanceForm && localStorage.getItem(FILTER_DANCE_FORMS_KEY)) {
      console.log(selectedDanceForm)
      apiEndpoint += `&danceStyle=${encodeURIComponent(localStorage.getItem(FILTER_DANCE_FORMS_KEY))}`;
    }
    var geoLocation = getGeoLocationFromLocalStorage();

    
    if (selectedDistances && geoLocation && localStorage.getItem(FILTER_DISTANCES_KEY)) {
      console.log(selectedDistances,geoLocation)
      apiEndpoint += `&distance=${encodeURIComponent(localStorage.getItem(FILTER_DISTANCES_KEY))}&user_lat=${encodeURIComponent(geoLocation.latitude)}&user_lon=${encodeURIComponent(geoLocation.longitude)}`;
    }
  

    
    const tryUrl1 = 'https://nrityaserver-2b241e0a97e5.herokuapp.com/api/get_all_data/'
    const tryUrl12 = `https://nrityaserver-2b241e0a97e5.herokuapp.com/api/search/?query=adarsh&city=Patna`
    //console.log("https://nrityaserver-2b241e0a97e5.herokuapp.com/api/search/?query=adarsh&city=Patna")
    //apiEndpoint = `http://127.0.0.1:8000/api/help/`;
    //console.log(tryUrl12===apiEndpoint)
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Search results:', data); // Log the data received from the API
        setResults(data);
      })  
      .catch(error => console.error('Error fetching search results:', error));
  };

  const handleApplyFilters = () => {

    localStorage.setItem(FILTER_DISTANCES_KEY, selectedDistances);
    localStorage.setItem(FILTER_DANCE_FORMS_KEY, selectedDanceForm);
    console.log("Location change, redux operation")
    setActiveFilters(countActiveFilters());
    //dispatch(refreshLocation())
    setShowFilters(false);
    handleSearch()
    
  };

  const handleClearFilters = () => {
    setSelectedDistances('');
    setSelectedDanceForm('');
    console.log("handleClearFilters",selectedDistances,selectedDanceForm)
    localStorage.removeItem(FILTER_DISTANCES_KEY);
    localStorage.removeItem(FILTER_DANCE_FORMS_KEY);
    setActiveFilters(0);

    console.log("handleClearFilters",selectedDistances,selectedDanceForm)
    setShowFilters(false);
    handleSearch();
    console.log(results)
  };


  // Retrieve selected filters from local storage on component mount
  useEffect(() => {
    const storedDistances = localStorage.getItem(FILTER_DISTANCES_KEY);
    const storedDanceForm = localStorage.getItem(FILTER_DANCE_FORMS_KEY);
    
    if (storedDistances) {
      setSelectedDistances(storedDistances);
    }
    
    if (storedDanceForm) {
      setSelectedDanceForm(storedDanceForm);
    }
    handleSearch();
    handleClearFilters();
    setActiveFilters(countActiveFilters());
  }, []);
  
  return (
    <div style={{ backgroundColor: isDarkModeOn ? 'black' : 'white', padding: '10px' }}>
      <header>
        <p1 style={{ color: isDarkModeOn ? 'white' : 'black' }}>Search </p1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormControl type="text" placeholder="Enter any specific studio name or just click search" value={query} onChange={handleInputChange}
            style={{ marginRight: '10px', padding: '8px' }}
          />
          <Button
            variant="primary"
            rounded
            style={{
              cursor: 'pointer',
              textTransform: 'none',
              backgroundColor: isDarkModeOn ? '#892CDC' : 'black',
              color: 'white',
              padding: '8px',
            }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
        
      </header>
      <body>

      </body>
      <Modal  show={showFilters} onHide={toggleFilters} backdrop="static">
          <Modal.Header closeButton >
            <Modal.Title >Filters</Modal.Title>
          </Modal.Header>
          <Modal.Body >
            <Row >
              {/* Left side for filters list */}
              <Col md={4}>
                <h5 >Filter By:</h5>
                <hr style={{ margin: '5px 0' }}></hr>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  
                <li
                  style={{ cursor: 'pointer', margin: '5px 0' }}
                  onClick={() => setShowFilters('distances')}
                >
                  Distances
                </li>
                  
                <hr style={{ margin: '5px 0' }}></hr>
                <li
                  style={{ cursor: 'pointer', margin: '5px 0' }}
                  onClick={() => setShowFilters('danceForm')}
                >
                  Dance Forms
                </li>
                <hr style={{ margin: '5px 0' }}></hr>
              </ul>
              </Col>

              {/* Right side for selection lists */}
              <Col md={8}>
              
                {showFilters === 'distances' && (
                  <Form.Group controlId="filterDistances">
                    <Form.Label>Distances:</Form.Label>
                    <Form.Control as="select" value={selectedDistances} onChange={(e) => setSelectedDistances(e.target.value)}>
                      <option value="">Select distance</option>
                      {distances.map((distance) => (
                        <option key={distance} value={distance}>
                          {distance } km
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                )}
                  
                
                {showFilters === 'danceForm' && (
                  <Form.Group controlId="filterDanceForms">
                    <Form.Label>Dance Forms:</Form.Label>
                    <Form.Control as="select" value={selectedDanceForm} onChange={(e) => setSelectedDanceForm(e.target.value)}>
                      <option value="">Select Dance Form</option>
                      {danceForms.map((danceForm) => (
                        <option key={danceForm} value={danceForm}>
                          {danceForm}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                )}
              </Col>
            </Row>
            <ButtonGroup>
            <Button variant="primary" onClick={handleApplyFilters}>
              Apply
            </Button>
            <Button variant="danger" onClick={handleClearFilters} style={{ marginLeft: '10px' }}>
            Clear All Filters
          </Button>
            </ButtonGroup>
          </Modal.Body>
      </Modal>
      <br></br>
      <Row className="align-items-center">
      <Col xs="auto">
       
          <MuiBadge
            onClick={toggleFilters}
            badgeContent={activeFilters}
            color={isDarkModeOn ? "warning" : "secondary"}
            pill
          >
            <MuiChip
              color={isDarkModeOn ? "warning" : "secondary"}
              label="&#9776; filters"
              variant="outlined" 
            />
          </MuiBadge>
        
      </Col>

      {/* Filter Badges */}
      {selectedDistances && (
        <Col xs="auto">
          <MuiBadge color="success" pill>
            <MuiChip
              color="success"
              label={`Distance: ${selectedDistances} km`}
            />
          </MuiBadge>
        </Col>
      )}
      
      {selectedDanceForm && (
        <Col xs="auto">
          <MuiBadge color="info" pill>
            <MuiChip
              color="info"
              label={`Dance Form: ${selectedDanceForm}`}
            />
          </MuiBadge>
        </Col>
      )}

      {(selectedDanceForm || selectedDistances) && (
        <Col xs="auto">
          <MuiBadge
            color="error"
            onClick={handleClearFilters}
            style={{ cursor: 'pointer' }}
            pill
          >
            <MuiChip
              color="error"
              label="Clear All X"
              onClick={handleClearFilters}
              style={{ cursor: 'pointer' }}
            />
          </MuiBadge>
        </Col>
      )}
    </Row>

      <hr></hr>
      <div style={{ display: 'flex', flexWrap: 'wrap', padding: '10px' }}>
      {results.length === 0 ? (
      <div className="" style={{ minHeight:"30vh" }}>
        
      </div>
        ) : (
          results.map((studio, index) => (
            <div key={index} className="studio-card-container" style={{ padding: "0.2rem" }} md={2}>
              <a href={`#/studio/${studio.studioId}`} style={{ textDecoration: "none" }}>
                <SmallCard
                  studioName={studio.studioName}
                  studioAddress={studio.city}
                  studioPrice={studio.price}
                  studioDanceStyles={studio.danceStyles}
                  studioId={studio.studioId}
                  averageRating={studio.avgRating}
                  forceSmallView={1}
                />
              </a>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

function getGeoLocationFromLocalStorage() {
  // Retrieve the stored JSON string from localStorage
  var geoLocString = localStorage.getItem(FILTER_USER_GEO_LOC);

  // Check if the data exists in localStorage
  if (geoLocString !== null) {
    try {
      // Parse the JSON string to get an object
      var geoLocObject = JSON.parse(geoLocString);
      console.log(geoLocObject)
      // Check if the latitude and longitude properties exist in the parsed object
      if (geoLocObject && geoLocObject["latitude"] && geoLocObject["longitude"]) {
        // Extract latitude and longitude from the object
        var latitude = geoLocObject.latitude;
        var longitude = geoLocObject.longitude;

        // Return an object with latitude and longitude
        return { latitude: latitude, longitude: longitude };
      } else {
        console.log('Incomplete data found in localStorage for FILTER_USER_GEO_LOC');
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  } else {
    console.log('No data found in localStorage for FILTER_USER_GEO_LOC');
  }

  // Return null if there's no valid data or an error occurred
  return null;
}


export default SearchPage;
