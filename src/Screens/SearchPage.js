import React, { useState,useEffect } from 'react';
import StudioCard from "../Components/StudioCard";
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { Form, Button, Col, Row, Image, Modal, FormControl,Badge, ButtonGroup, Container } from 'react-bootstrap';
import {Badge as MuiBadge,Chip as MuiChip,Autocomplete as MuiAutocomplete, TextField as MuiTextField,createTheme,ThemeProvider,Button as MuiButton, Stack as MuiStack,Grid as MuiGrid} from '@mui/material';
import axios from 'axios';
import indianCities from '../cities.json';
import {refreshLocation} from '../redux/actions/refreshLocationAction';
import SmallCard from '../Components/SmallCard';
import danceStyles from '../danceStyles.json'
import CardSliderCard from '../Components/CardSliderCard';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';


const FILTER_LOCATION_KEY = 'filterLocation';
const FILTER_DISTANCES_KEY = 'filterDistances';
const FILTER_DANCE_FORMS_KEY = 'filterDanceForms';
const FILTER_USER_GEO_LOC = "browserGeoLoc";
//const danceForms = ['Ballet', 'Hip Hop', 'Salsa', 'Kathak'];
const distances = [2,5,10,20]

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedDistances, setSelectedDistances] = useState('');
  const [selectedDanceForm, setSelectedDanceForm] = useState('');
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterValue, setShowFilterValue] = useState('distances');
  const [activeFilters, setActiveFilters] = useState(0);
  const [suggestions, setSuggestions] = useState([]);

  const dispatch = useDispatch();
  const danceForms = danceStyles.danceStyles;
  console.log("dark mode", isDarkModeOn)

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  }

  const themeBar = createTheme({
    palette: {
      mode: isDarkModeOn? 'dark' : 'light', // Dynamically set dark or light mode
    },
  });


  const handleInputChange = (event,value) => {
    setQuery(value);
  };
  const countActiveFilters = () => {
    let count = 0;
    if (localStorage.getItem(FILTER_DISTANCES_KEY)) count++;
    if (localStorage.getItem(FILTER_DANCE_FORMS_KEY)) count++;
    return count;
  };

  const handleSearch = () => {
    // Perform the search and update the results
    if (query == null){
        setQuery('')
    }
    let apiEndpoint = `https://nrityaserver-2b241e0a97e5.herokuapp.com/api/search/?query=${query}`;

    if (localStorage.getItem(FILTER_LOCATION_KEY)) {
      apiEndpoint += `&city=${encodeURIComponent(localStorage.getItem(FILTER_LOCATION_KEY))}`;
    }
  
    if (localStorage.getItem(FILTER_DANCE_FORMS_KEY)) {
      console.log(selectedDanceForm)
      apiEndpoint += `&danceStyle=${encodeURIComponent(localStorage.getItem(FILTER_DANCE_FORMS_KEY))}`;
    }
    var geoLocation = getGeoLocationFromLocalStorage();

    
    if (selectedDistances && geoLocation && localStorage.getItem(FILTER_DISTANCES_KEY)) {
      console.log(selectedDistances,geoLocation)
      apiEndpoint += `&distance=${encodeURIComponent(localStorage.getItem(FILTER_DISTANCES_KEY))}&user_lat=${encodeURIComponent(geoLocation.latitude)}&user_lon=${encodeURIComponent(geoLocation.longitude)}`;
    }
    console.log("API SERACH",apiEndpoint)
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Search results:', data); // Log the data received from the API
        setResults(data);
      })  
      .catch(error => console.error('Error fetching search results:', error));
  };

  const handleChange = async (event, value) => {
    const baseUrl = "https://nrityaserver-2b241e0a97e5.herokuapp.com/api"
    //setQuery(event.target.value);
    console.log(value)
    setQuery(value);

    if (value.length >= 3) {
      try {
        const FILTER_LOCATION_KEY = 'filterLocation';
        const defaultCity = 'New Delhi';

        const city = localStorage.getItem(FILTER_LOCATION_KEY) || defaultCity;
        const cityParam = encodeURIComponent(city || defaultCity);

        const endpoint = `${baseUrl}/autocomplete?query=${value}&city=${cityParam}`;

        //const endpoint = baseUrl + `/autocomplete?query=${value}&city=Patna`;
        const response = await axios.get(endpoint);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
      }
    } else {
      // Clear suggestions if the input length is less than 3 characters
      setSuggestions([]);
    }

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
    
      console.log("API SearchPage done",storedDanceForm)
  
    
    if (storedDistances) {
      setSelectedDistances(storedDistances);
    }
    
    if (storedDanceForm) {
      console.log("API SearchPage Setting selectedDanceForm",storedDanceForm)
      setSelectedDanceForm(storedDanceForm);
      console.log("API SearchPage done  selectedDanceForm",selectedDanceForm)
    }
    console.log("API SearchPage done  selectedDanceForm",selectedDanceForm)
    setActiveFilters(countActiveFilters());
    handleSearch();
  }, []);
  
  return (
    <div style={{ backgroundColor: isDarkModeOn ? '#202020' : 'white', padding: '10px' }}>
      <header>
      <Container style={{ width: '100%' }}>
        <MuiGrid container alignItems="center">
        <MuiGrid item xs={12}>
          <ThemeProvider theme={themeBar}>
            <MuiStack style={{ width: '100%',paddingRight: 0,marginTop:0 , marginLeft:0,marginBottom:0 }} direction="row" spacing={1}>
              <MuiAutocomplete
                value={query}
                onInputChange={handleChange}
                onChange={handleInputChange}
                options={suggestions}
                getOptionLabel={(option) => option.toString()}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Search"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <InputAdornment position="end" style={{ marginRight: 0, marginTop:0, marginLeft:0 ,marginBottom:0}}>
                          <SearchIcon
                            style={{
                              cursor: 'pointer',
                              color: isDarkModeOn ? '#892CDC' : 'black',
                              marginRight: 1
                            }}
                            onClick={handleSearch}
                          />
                        </InputAdornment>
                      ),
                      style: {
                        paddingRight: 0,marginTop:0 , marginLeft:0,marginBottom:0
                      },
                    }}
                  />
                )}
                style={{ flex: 1 }}
              />
            </MuiStack>
          </ThemeProvider>
        </MuiGrid>

        </MuiGrid>
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
              variant={isDarkModeOn ? "outlined" : "contained"}
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
              variant={isDarkModeOn ? "outlined" : "contained"}
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
              variant={isDarkModeOn ? "outlined" : "contained"}
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
              variant={isDarkModeOn ? "outlined" : "contained"}
              
            />
          </MuiBadge>
        </Col>
      )}
      </Row>
      </Container>

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
                  onClick={() => (setShowFilterValue('distances'),setShowFilters(true))}
                >
                  Distances
                </li>
                  
                <hr style={{ margin: '5px 0' }}></hr>
                <li
                  style={{ cursor: 'pointer', margin: '5px 0' }}
                  onClick={() => (setShowFilterValue('danceForm'),setShowFilters(true))}
                >
                  Dance Forms
                </li>
                <hr style={{ margin: '5px 0' }}></hr>
              </ul>
              </Col>

              <Col md={8}>
              
                {showFilters && showFilterValue === 'distances' && (
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
                  
                
                {showFilters && showFilterValue === 'danceForm' && (
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

      <hr></hr>
      <div style={{ display: 'flex', flexWrap: 'wrap', padding: '10px' }}>
      {results.length === 0 ? (
      <div className="" style={{ minHeight:"30vh" }}>
        
      </div>
        ) : (
          results.map((studio, index) => (
            <div key={index} className="studio-card-container" style={{ padding: "0.2rem" }} md={2}>
              <a href={`#/studio/${studio.studioId}`} style={{ textDecoration: "none" }}>
                <CardSliderCard studio={studio}/>
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
