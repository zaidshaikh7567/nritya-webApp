import React, { useState, useEffect } from "react";
import StudioCard from "../Components/StudioCard";
import { useSelector, useDispatch } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import {Form, Button, Col,Row, Image, Modal, FormControl, Badge, ButtonGroup,
      Container,} from "react-bootstrap";
import { Badge as MuiBadge, Chip as MuiChip, Autocomplete as MuiAutocomplete,
  TextField as MuiTextField, createTheme,ThemeProvider, Button as MuiButton,
  Stack as MuiStack,Grid as MuiGrid, Box } from "@mui/material";
import Select from "react-select";
import axios from "axios";
import indianCities from "../cities.json";
import { refreshLocation } from "../redux/actions/refreshLocationAction";
import SmallCard from "../Components/SmallCard";
import danceStyles from "../danceStyles.json";
import CardSliderCard from "../Components/CardSliderCard";
import './SearchPage.css';
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { COLLECTIONS, LEVELS } from "../constants";
import { collection,doc, query as firebaseQuery, getDoc, getDocs,where,
} from "firebase/firestore";
import { db } from "../config";
import NWorkshopCard from "../Components/NWorkshopCard";
import NOpenClassCard from "../Components/NOpenClassCard";
import NCourseCard from "../Components/NCourseCard";

const FILTER_LOCATION_KEY = "filterLocation";
const FILTER_SEARCH_TYPE_KEY = "filterSearchType";
const FILTER_DISTANCES_KEY = "filterDistances";
const FILTER_DANCE_FORMS_KEY = "filterDanceForms";
const FILTER_USER_GEO_LOC = "browserGeoLoc";

const levelsTypes = [LEVELS.ALL, LEVELS.BEGINNERS, LEVELS.INTERMEDIATE, LEVELS.ADVANCED]
const MAX_PRICE  = 10**10

const distances = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const searchTypes = [
  { name: "studio", label: "Studios", collection: COLLECTIONS.STUDIO },
  { name: "workshop", label: "Workshops", collection: COLLECTIONS.WORKSHOPS },
  { name: "openClass",label: "Open Classes",collection: COLLECTIONS.OPEN_CLASSES},
  { name: "course", label: "Courses", collection: COLLECTIONS.COURSES },
];

const getCollectionForSearchType = (searchType) => {
  const searchTypeObject = searchTypes.find(type => type.name === searchType);
  return searchTypeObject ? searchTypeObject.collection : COLLECTIONS.STUDIO;
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedDistances, setSelectedDistances] = useState("");
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [showFilters, setShowFilters] = useState(false);
  const [studioIdName,setStudioIdName] = useState({});
  const [showFilterValue, setShowFilterValue] = useState("distances");
  const [activeFilters, setActiveFilters] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDanceForms, setSelectedDanceForms] = useState([]);
  const [selectedSearchType, setSelectedSearchType] = useState("studio");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(MAX_PRICE);
  const [searchData, setSearchData] = useState({
    workshop: [],
    openClass: [],
    course: [],
  });

  const dispatch = useDispatch();
  const danceForms = danceStyles.danceStyles.map((danceForm) => ({
    value: danceForm,
    label: danceForm,
  }));

  const styles = {
    valueContainer: (base) => ({
      ...base,
      maxHeight: 100,
      overflowY: "auto",
    }),
    multiValue: (base, state) => {
      return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base;
    },
    multiValueLabel: (base, state) => {
      return state.data.isFixed
        ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
        : base;
    },
    multiValueRemove: (base, state) => {
      return state.data.isFixed ? { ...base, display: "none" } : base;
    },
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const themeBar = createTheme({
    palette: {
      mode: isDarkModeOn ? "dark" : "light", // Dynamically set dark or light mode
    },
  });

  const handleInputChange = (event, value) => {
    setQuery(value);
  };
  const countActiveFilters = () => {
    let count = 0;
    if (localStorage.getItem(FILTER_DISTANCES_KEY)) count++;
    if (localStorage.getItem(FILTER_SEARCH_TYPE_KEY)) count++;
    if (selectedLevel && selectedLevel !== LEVELS.ALL) count++;
    if (selectedMaxPrice && selectedMaxPrice != MAX_PRICE) count++;
    const storedDanceForm = localStorage.getItem(FILTER_DANCE_FORMS_KEY);
    if (storedDanceForm) count += JSON.parse(storedDanceForm).length;
    return count;
  };
  const fetchIdNameMp = async (city) => {
    try {
      const apiEndpoint = `https://nrityaserver-2b241e0a97e5.herokuapp.com/api/autocomplete/?&city=${city}`;
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      
      const data = await response.json();
      setStudioIdName(data);
      
    } catch (error) {
      console.error("Error in processing:", error);
    }
  };

  const handleSearch = () => {
    const storedSelectedSearchType =
      localStorage.getItem(FILTER_SEARCH_TYPE_KEY) ||
      selectedSearchType ||
      "studio";

    if (query == null) {
      setQuery("");
    }
    let apiEndpoint = `https://nrityaserver-2b241e0a97e5.herokuapp.com/api/search/?query=${query}`;
    const entity = getCollectionForSearchType(storedSelectedSearchType);

    const city = localStorage.getItem(FILTER_LOCATION_KEY) || "New Delhi";
    apiEndpoint += `&city=${encodeURIComponent(city)}`;
    fetchIdNameMp(city)
    if (storedSelectedSearchType) {
      apiEndpoint += `&entity=${encodeURIComponent(entity)}`;
    }

    if (selectedDanceForms.length > 0) {
      apiEndpoint += `&danceStyle=${encodeURIComponent(selectedDanceForms.join(","))}`;
    }

    if (entity !== COLLECTIONS.STUDIO && selectedLevel && selectedLevel !== LEVELS.ALL) {
      apiEndpoint += `&level=${encodeURIComponent(selectedLevel)}`
    }

    if ((entity === COLLECTIONS.WORKSHOPS || entity === COLLECTIONS.COURSES) && selectedMaxPrice && selectedMaxPrice !== MAX_PRICE) {
      apiEndpoint += `&price=${encodeURIComponent(selectedMaxPrice)}`
    }

    const geoLocation = getGeoLocationFromLocalStorage();
    if (selectedDistances && geoLocation && localStorage.getItem(FILTER_DISTANCES_KEY)) {
      apiEndpoint += `&distance=${encodeURIComponent(selectedDistances)}&user_lat=${encodeURIComponent(geoLocation.latitude)}&user_lon=${encodeURIComponent(geoLocation.longitude)}`;
    }

    console.log("apiEndpoint ", apiEndpoint);
    fetch(apiEndpoint)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = Array.isArray(data) ? data : Object.values(data);
        setResults(formattedData);
      })
      .catch((error) =>
        console.error("Error fetching search results:", error)
      );
  };


  const handleChange = async (event, value) => {
    const baseUrl = "https://nrityaserver-2b241e0a97e5.herokuapp.com/api";
    //setQuery(event.target.value);
    setQuery(value);

    if (value.length >= 3) {
      try {
        const FILTER_LOCATION_KEY = "filterLocation";
        const defaultCity = "New Delhi";

        const city = localStorage.getItem(FILTER_LOCATION_KEY) || defaultCity;
        const cityParam = encodeURIComponent(city || defaultCity);

        const endpoint = `${baseUrl}/autocomplete?query=${value}&city=${cityParam}`;

        //const endpoint = baseUrl + `/autocomplete?query=${value}&city=Patna`;
        const response = await axios.get(endpoint);
        console.log("Response :",response.data)
        const filteredSuggestions = Object.values(response.data).filter(value => value !== null);
        setSuggestions(filteredSuggestions);

      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
      }
    } else {
      // Clear suggestions if the input length is less than 3 characters
      setSuggestions([]);
    }
  };

  const handleApplyFilters = () => {
    localStorage.setItem(FILTER_DISTANCES_KEY, selectedDistances);
    localStorage.setItem(FILTER_SEARCH_TYPE_KEY, selectedSearchType);
    localStorage.setItem(
      FILTER_DANCE_FORMS_KEY,
      JSON.stringify(selectedDanceForms)
    );
    setActiveFilters(countActiveFilters());
    //dispatch(refreshLocation())
    setShowFilters(false);
    handleSearch();
  };

  const handleClearFilters = () => {
    setSelectedDistances("");
    setSelectedDanceForms([]);
    setSelectedSearchType("studio");
    setSelectedMaxPrice(MAX_PRICE);
    setSelectedLevel(LEVELS.ALL);
    localStorage.removeItem(FILTER_DISTANCES_KEY);
    localStorage.removeItem(FILTER_DANCE_FORMS_KEY);
    localStorage.setItem(FILTER_SEARCH_TYPE_KEY, "studio");
    setActiveFilters(countActiveFilters());
    setShowFilters(false);
    handleSearch();
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedDanceForms(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const handleSearchTypeChange = (e) => {
    setSelectedSearchType(e.target.value);
    setSelectedDistances("");
    localStorage.removeItem(FILTER_DISTANCES_KEY);
    if(e.target.value == "studio"){
      setSelectedMaxPrice(MAX_PRICE);
      setSelectedLevel(LEVELS.ALL);
    }
    if(e.target.value == "openClass"){
      setSelectedMaxPrice(MAX_PRICE);
    }
  };

  const handleSearchTypeClick = (clickedSearchType) => {
    localStorage.setItem(FILTER_SEARCH_TYPE_KEY, clickedSearchType);
    localStorage.removeItem(FILTER_DISTANCES_KEY);

    setSelectedDistances("");
    setSelectedLevel(LEVELS.ALL);
    setSelectedMaxPrice(MAX_PRICE);
    setSelectedSearchType(clickedSearchType);
    setActiveFilters(countActiveFilters());
    handleSearch();
  };

  const handleRemoveDistance = () => {
    setSelectedDistances(null);
    localStorage.removeItem(FILTER_DISTANCES_KEY);
    setActiveFilters(countActiveFilters());
    handleSearch();
  };

  const handleRemoveDanceForm = (danceFormToRemove) => {
    const filteredDanceForms = selectedDanceForms.filter(
      (danceForm) => danceForm !== danceFormToRemove
    );
    setSelectedDanceForms(filteredDanceForms);
    localStorage.setItem(
      FILTER_DANCE_FORMS_KEY,
      JSON.stringify(filteredDanceForms)
    );
    setActiveFilters(countActiveFilters());
    handleSearch();
  };

  const handleRemoveSearchType = () => {
    setSelectedSearchType("studio");
    localStorage.setItem(FILTER_SEARCH_TYPE_KEY, "studio");
  };

  // Retrieve selected filters from local storage on component mount
  useEffect(() => {
    const storedDistances = localStorage.getItem(FILTER_DISTANCES_KEY);
    const storedDanceForm = localStorage.getItem(FILTER_DANCE_FORMS_KEY);
    const storedSearchType = localStorage.getItem(FILTER_SEARCH_TYPE_KEY);

    if (storedSearchType) {
      setSelectedSearchType(storedSearchType);
    } else {
      setSelectedSearchType("studio");
      localStorage.setItem(FILTER_SEARCH_TYPE_KEY, "studio");
    }

    if (storedDistances) {
      setSelectedDistances(storedDistances);
    }

    if (storedDanceForm) {
      setSelectedDanceForms(JSON.parse(storedDanceForm));
    }
    setActiveFilters(countActiveFilters());
    handleSearch();
  }, []);

  return (
    <div
      style={{
        backgroundColor: isDarkModeOn ? "#202020" : "white",
        padding: "10px",
        minHeight: "75vh",
      }}
    >
      <header>
        <Container style={{ width: "100%" }}>
          <MuiGrid container alignItems="center">
            <MuiGrid item xs={12}>
              <ThemeProvider theme={themeBar}>
                <MuiStack
                  style={{
                    width: "100%",
                    paddingRight: 0,
                    marginTop: 0,
                    marginLeft: 0,
                    marginBottom: 0,
                  }}
                  direction="row"
                  spacing={1}
                >
                  <MuiAutocomplete
                    value={query}
                    onInputChange={handleChange}
                    onChange={handleInputChange}
                    options={suggestions}
                    getOptionLabel={(option) => option.toString()}
                    renderInput={(params) => (
                      <MuiTextField
                        {...params}
                        label="Search studios, workshops, open classes, courses......"
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              style={{
                                marginRight: 0,
                                marginTop: 0,
                                marginLeft: 0,
                                marginBottom: 0,
                              }}
                            >
                              <SearchIcon
                                style={{
                                  cursor: "pointer",
                                  color: isDarkModeOn ? "#892CDC" : "black",
                                  marginRight: 1,
                                  width:"40px"
                                }}
                                onClick={handleSearch}
                              />
                            </InputAdornment>
                          ),
                          style: {
                            paddingRight: 0,
                            marginTop: 0,
                            marginLeft: 0,
                            marginBottom: 0,
                          },
                        }}
                      />
                    )}
                    style={{ flex: 1/2 }}
                  />
                </MuiStack>
              </ThemeProvider>
            </MuiGrid>
          </MuiGrid>
          <br></br>
          <Row className="align-items-center">
          <div className="horizontal-scroll-wrapper-for-filters"> 
            {searchTypes.map((searchType) => (
              <Col key={searchType.name} xs="auto" style={{ marginTop: "0.5rem" }}>
                <MuiChip
                  label={searchType.label}
                  variant={selectedSearchType === searchType.name ? "outlined" : "contained"}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: selectedSearchType === searchType.name ? "black" : "#D9D9D9",
                    color: selectedSearchType === searchType.name ? "white" : "black",
                    borderRadius: '10px',
                    "&:hover": {
                      bgcolor: selectedSearchType === searchType.name ? "white" : "black",
                      color: selectedSearchType === searchType.name ? "black" : "white",
                    }
                  }}
                  onClick={() => handleSearchTypeClick(searchType.name)}
                />
            </Col>
            ))}
          </div>
          </Row>

          <Row className="align-items-center">
          <div className="horizontal-scroll-wrapper-for-filters"> 
            <Col xs="auto" style={{ marginTop: "0.5rem" }}>
              <MuiBadge
                onClick={toggleFilters}
                badgeContent={activeFilters}
                color={isDarkModeOn ? "warning" : "secondary"}
                pill
              >
                <MuiChip
                  className="rounded-3"
                  color={isDarkModeOn ? "warning" : "secondary"}
                  label="&#9776; filters"
                  variant={isDarkModeOn ? "outlined" : "contained"}
                />
              </MuiBadge>
            </Col>

            {(selectedDanceForms.length || selectedDistances || (selectedLevel && selectedLevel !== LEVELS.ALL) ||(selectedMaxPrice && selectedMaxPrice !== MAX_PRICE)) && (
              <Col xs="auto" style={{ marginTop: "0.5rem" }}>
                <MuiBadge
                  color="error"
                  onClick={handleClearFilters}
                  style={{ cursor: "pointer" }}
                  pill
                >
                  <MuiChip
                    color="error"
                    label="Clear All"
                    onDelete={handleClearFilters}
                    style={{ cursor: "pointer" }}
                    variant={isDarkModeOn ? "outlined" : "contained"}
                    className="rounded-3"
                  />
                </MuiBadge>
              </Col>
            )}

            <Box display="flex">
            {/* Filter Badges */}
            {selectedDistances && (
              <Col xs="auto" style={{ marginTop: "0.5rem" }}>
                <MuiBadge color="success" pill>
                  <MuiChip
                    className="rounded-3"
                    color="success"
                    label={`Distance: ${selectedDistances} km`}
                    variant={isDarkModeOn ? "outlined" : "contained"}
                    onDelete={handleRemoveDistance}
                  />
                </MuiBadge>
              </Col>
            )}

            {(selectedLevel && selectedLevel !== LEVELS.ALL) &&(
              <Col xs="auto">
                {
                  <MuiBadge
                    key={selectedLevel}
                    color="info"
                    style={{
                      marginLeft: "0",
                      marginTop: "0.5rem",
                    }}
                    pill
                  >
                    <MuiChip
                      className="rounded-3"
                      color="info"
                      label={`Level: ${selectedLevel}`}
                      variant={isDarkModeOn ? "outlined" : "contained"}
                      onDelete={() => setSelectedLevel(LEVELS.ALL)}
                    />
                  </MuiBadge>
                }
              </Col>
            )}

            {(selectedMaxPrice && selectedMaxPrice !== MAX_PRICE) &&(
              <Col xs="auto">
                {
                  <MuiBadge
                    key={selectedMaxPrice}
                    color="info"
                    style={{
                      marginLeft: "0",
                      marginTop: "0.5rem",
                    }}
                    pill
                  >
                    <MuiChip
                      className="rounded-3"
                      color="info"
                      label={`Prices Upto: ${selectedMaxPrice}`}
                      variant={isDarkModeOn ? "outlined" : "contained"}
                      onDelete={() => setSelectedMaxPrice(MAX_PRICE)}
                    />
                  </MuiBadge>
                }
              </Col>
            )}

            {selectedDanceForms && (
              <Col xs="auto">
                {selectedDanceForms.map((danceForm, index) => (
                  <MuiBadge
                    key={index}
                    color="info"
                    style={{
                      marginLeft: index !== 0 ? "0.25rem" : "0",
                      marginTop: "0.5rem",
                    }}
                    pill
                  >
                    <MuiChip
                      className="rounded-3"
                      color="info"
                      label={`Dance Form: ${danceForm}`}
                      variant={isDarkModeOn ? "outlined" : "contained"}
                      onDelete={() => handleRemoveDanceForm(danceForm)}
                    />
                  </MuiBadge>
                ))}
              </Col>
            )}
            </Box>
           </div>
          </Row>
        </Container>
      </header>

      <Modal show={showFilters} onHide={toggleFilters} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* Left side for filters list */}
            <Col md={4}>
              <h5>Filter By:</h5>
              <ul style={{ listStyleType: "none", padding: 0 }}>

                {selectedSearchType === "studio" && (
                  <>
                    <hr style={{ margin: "5px 0" }}></hr>
                    <li
                      style={{ cursor: "pointer", margin: "5px 0" }}
                      onClick={() => (
                        setShowFilterValue("distances"), setShowFilters(true)
                      )}
                    >
                      Distances
                    </li>
                  </>
                )}

              {(selectedSearchType === "workshop" || selectedSearchType === "course") && (
                  <>
                    <hr style={{ margin: "5px 0" }}></hr>
                    <li
                      style={{ cursor: "pointer", margin: "5px 0" }}
                      onClick={() => (
                        setShowFilterValue("price"), setShowFilters(true)
                      )}
                    >
                      Price
                    </li>
                  </>
                )}

                {selectedSearchType !== "studio" && (
                  <>
                    <hr style={{ margin: "5px 0" }}></hr>
                    <li
                      style={{ cursor: "pointer", margin: "5px 0" }}
                      onClick={() => (
                        setShowFilterValue("level"), setShowFilters(true)
                      )}
                    >
                      Level
                    </li>
                    
                  </>
                )}

                <hr style={{ margin: "5px 0" }}></hr>
                <li
                  style={{ cursor: "pointer", margin: "5px 0" }}
                  onClick={() => (
                    setShowFilterValue("danceForm"), setShowFilters(true)
                  )}
                >
                  Dance Forms
                </li>
                <hr style={{ margin: "5px 0" }}></hr>
              </ul>
            </Col>

            <Col md={8}>
              {showFilters && showFilterValue === "distances" && (
                <Form.Group controlId="filterDistances">
                  <Form.Label>Distances:</Form.Label>
                  <Form.Control
                    className="p-0"
                    as="select"
                    value={selectedDistances}
                    onChange={(e) => setSelectedDistances(e.target.value)}
                  >
                    <option value="">Select distance</option>
                    {distances.map((distance) => (
                      <option key={distance} value={distance}>
                        {distance} km
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}

              {showFilters && showFilterValue === "level" && (
                <Form.Group controlId="filterLevel">
                  <Form.Label>Level :</Form.Label>
                  <Form.Control
                    className="p-0"
                    as="select"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    <option value="">Select Lavel</option>
                    {levelsTypes.map((level) => (
                      <option key={level} value={level}>
                        {level} 
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}

              {showFilters && showFilterValue === "price" && (
                <Form.Group controlId="filterPrice">
                  <Form.Label>Prices :</Form.Label>
                  <Form.Control
                    className="p-0"
                    as="select"
                    value={selectedMaxPrice}
                    onChange={(e) => setSelectedMaxPrice(e.target.value)}
                  >
                    <option value="">Prices below</option>
                    {[499,999,1499,1999,2999,4999,9999,MAX_PRICE].map((price) => (
                      <option key={price} value={price}>
                        {price >= MAX_PRICE ?"All":price} 
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}

              {showFilters && showFilterValue === "danceForm" && (
                <Form.Group controlId="filterDanceForms">
                  <Form.Label>Dance Forms:</Form.Label>
                  <Select
                    isMulti
                    value={danceForms.filter((option) =>
                      selectedDanceForms.includes(option.value)
                    )}
                    onChange={handleSelectChange}
                    options={danceForms}
                    closeMenuOnSelect={false}
                    placeholder="Select Dance Forms"
                    styles={styles}
                  />
                </Form.Group>
              )}
            </Col>
          </Row>
          <ButtonGroup style={{ marginTop: "1rem" }}>
            <Button variant="primary" onClick={handleApplyFilters}>
              Apply
            </Button>
            <Button
              variant="danger"
              onClick={handleClearFilters}
              style={{ marginLeft: "10px" }}
            >
              Clear All Filters
            </Button>
          </ButtonGroup>
        </Modal.Body>
      </Modal>

      <hr></hr>
      {selectedSearchType === "studio" && (
        <div style={{ display: "flex", flexWrap: "wrap", padding: "10px" }}>
          {results.length === 0 ? (
            <div className="" style={{ minHeight: "30vh" }}></div>
          ) : (
            results.map((studio, index) => (
              <div
                key={index}
                className="studio-card-container"
                style={{ padding: "0.2rem" }}
                md={2}
              >
                <a
                  href={`#/studio/${studio.studioId}`}
                  style={{ textDecoration: "none" }}
                >
                  <CardSliderCard studio={studio} />
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {selectedSearchType === "workshop" && (
        
          <div style={{ display: "flex", flexWrap: "wrap", padding: "10px" }}>
            {results.length === 0 ? (
              <div className="" style={{ minHeight: "30vh" }}></div>
            ) : (
              results.map((data, index) => (
                <div
                  key={index}
                  className="studio-card-container"
                  style={{ padding: "0.2rem" }}
                  md={2}
                >
                  
                    <NWorkshopCard
                    key={data.id}
                    dataItem={data}
                    studioIdName={studioIdName}
                  />
                  
                </div>
              ))
            )}
          </div>
      
        
      )}
      {selectedSearchType === "openClass" && (
         <div style={{ display: "flex", flexWrap: "wrap", padding: "10px" }}>
         {results.length === 0 ? (
           <div className="" style={{ minHeight: "30vh" }}></div>
         ) : (
           results.map((data, index) => (
             <div
               key={index}
               className="studio-card-container"
               style={{ padding: "0.2rem" }}
               md={2}
             >
               <NOpenClassCard
                key={data.id}
                dataItem={data}
                studioIdName={studioIdName}
              />
             </div>
           ))
         )}
       </div>
      )}
      {selectedSearchType === "course" && (
       <div style={{ display: "flex", flexWrap: "wrap", padding: "10px" }}>
       {results.length === 0 ? (
         <div className="" style={{ minHeight: "30vh" }}></div>
       ) : (
         results.map((data, index) => (
           <div
             key={index}
             className="studio-card-container"
             style={{ padding: "0.2rem" }}
             md={2}
           >
             <NCourseCard
            key={data.id}
            dataItem={data}
            studioIdName={studioIdName}
          />
           </div>
         ))
       )}
     </div>
      )}
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
      // Check if the latitude and longitude properties exist in the parsed object
      if (
        geoLocObject &&
        geoLocObject["latitude"] &&
        geoLocObject["longitude"]
      ) {
        // Extract latitude and longitude from the object
        var latitude = geoLocObject.latitude;
        var longitude = geoLocObject.longitude;

        // Return an object with latitude and longitude
        return { latitude: latitude, longitude: longitude };
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  // Return null if there's no valid data or an error occurred
  return null;
}

export default SearchPage;
