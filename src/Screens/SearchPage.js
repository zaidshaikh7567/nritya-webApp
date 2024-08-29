import React, { useState, useEffect } from "react";
import StudioCard from "../Components/StudioCard";
import { useSelector, useDispatch } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import {Form, Button, Col,Row, Image, Modal, FormControl, Badge, ButtonGroup,
      Container,} from "react-bootstrap";
import { Badge as MuiBadge, Chip as MuiChip, Autocomplete as MuiAutocomplete,
  TextField as MuiTextField, createTheme,ThemeProvider, Button as MuiButton,
  Stack as MuiStack,Grid as MuiGrid,} from "@mui/material";
import Select from "react-select";
import axios from "axios";
import indianCities from "../cities.json";
import { refreshLocation } from "../redux/actions/refreshLocationAction";
import SmallCard from "../Components/SmallCard";
import danceStyles from "../danceStyles.json";
import CardSliderCard from "../Components/CardSliderCard";
import WorkshopCardSlider from "../Components/WorkshopCardSlider";
import OpenClassCardSlider from "../Components/OpenClassCardSlider";
import CourseCardSlider from "../Components/CourseCardSlider";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { COLLECTIONS } from "../constants";
import { collection,doc, query as firebaseQuery, getDoc, getDocs,where,
} from "firebase/firestore";
import { db } from "../config";

const FILTER_LOCATION_KEY = "filterLocation";
const FILTER_SEARCH_TYPE_KEY = "filterSearchType";
const FILTER_DISTANCES_KEY = "filterDistances";
const FILTER_DANCE_FORMS_KEY = "filterDanceForms";
const FILTER_USER_GEO_LOC = "browserGeoLoc";

const distances = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const searchTypes = [
  { name: "studio", label: "Studio", collection: COLLECTIONS.STUDIO },
  { name: "workshop", label: "Workshop", collection: COLLECTIONS.WORKSHOPS },
  {
    name: "openClass",
    label: "Open Class",
    collection: COLLECTIONS.OPEN_CLASSES,
  },
  { name: "course", label: "Course", collection: COLLECTIONS.COURSES },
];

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedDistances, setSelectedDistances] = useState("");
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterValue, setShowFilterValue] = useState("distances");
  const [activeFilters, setActiveFilters] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDanceForms, setSelectedDanceForms] = useState([]);
  const [selectedSearchType, setSelectedSearchType] = useState("studio");
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

    const storedDanceForm = localStorage.getItem(FILTER_DANCE_FORMS_KEY);
    if (storedDanceForm) count += JSON.parse(storedDanceForm).length;
    return count;
  };

  const handleSearch = () => {
    const storedSelectedSearchType =
      localStorage.getItem(FILTER_SEARCH_TYPE_KEY) ||
      selectedSearchType ||
      "studio";

    if (storedSelectedSearchType === "studio") {
      // Perform the search and update the results
      if (query == null) {
        setQuery("");
      }
      let apiEndpoint = `https://nrityaserver-2b241e0a97e5.herokuapp.com/api/search/?query=${query}`;

      if (localStorage.getItem(FILTER_LOCATION_KEY)) {
        apiEndpoint += `&city=${encodeURIComponent(
          localStorage.getItem(FILTER_LOCATION_KEY)
        )}`;
      }

      if (localStorage.getItem(FILTER_DANCE_FORMS_KEY)) {
        apiEndpoint += `&danceStyle=${encodeURIComponent(
          localStorage.getItem(FILTER_DANCE_FORMS_KEY)
        )}`;
      }
      var geoLocation = getGeoLocationFromLocalStorage();

      if (
        selectedDistances &&
        geoLocation &&
        localStorage.getItem(FILTER_DISTANCES_KEY)
      ) {
        apiEndpoint += `&distance=${encodeURIComponent(
          localStorage.getItem(FILTER_DISTANCES_KEY)
        )}&user_lat=${encodeURIComponent(
          geoLocation.latitude
        )}&user_lon=${encodeURIComponent(geoLocation.longitude)}`;
      }
      fetch(apiEndpoint)
        .then((response) => response.json())
        .then((data) => {
          const formattedData = Array.isArray(data) ? data : Object.values(data);
          setResults(formattedData);
        })
        .catch((error) =>
          console.error("Error fetching search results:", error)
        );
    } else {
      const selectedDanceFormsString = localStorage.getItem(
        FILTER_DANCE_FORMS_KEY
      );
      const city = localStorage.getItem(FILTER_LOCATION_KEY);
      let danceFormsList = [];
      if (selectedDanceFormsString)
        danceFormsList = JSON.parse(selectedDanceFormsString);
      let q = collection(
        db,
        searchTypes.find((type) => type.name === storedSelectedSearchType)
          .collection
      );

      q = firebaseQuery(q, where("active", "==", true));

      if (danceFormsList.length)
        q = firebaseQuery(
          q,
          where("danceStyles", "array-contains-any", danceFormsList)
        );
      if (city) q = firebaseQuery(q, where("city", "==", city));

      getDocs(q).then((querySnapshot) => {
        const docsPromise = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })).map(async (document) => {
          const docRef = doc(db, COLLECTIONS.STUDIO, document?.StudioId);
          const docSnap = await getDoc(docRef);
          return { ...document, studioDetails: docSnap.data() };
        });

        Promise.all(docsPromise).then((docs => {
          setSearchData((prev) => ({
            ...prev,
            [storedSelectedSearchType]: docs,
          }));
        }))
      });
    }
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
        setSuggestions(response.data);
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
                        label="Search"
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
                    style={{ flex: 1 }}
                  />
                </MuiStack>
              </ThemeProvider>
            </MuiGrid>
          </MuiGrid>
          <br></br>
          <Row className="align-items-center">
            <Col xs="auto" style={{ marginTop: "0.5rem" }}>
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

            {selectedSearchType && (
              <Col xs="auto" style={{ marginTop: "0.5rem" }}>
                <MuiBadge color="warning" pill>
                  <MuiChip
                    color="warning"
                    label={
                      searchTypes.find(
                        (searchType) => searchType.name === selectedSearchType
                      ).label
                    }
                    variant={isDarkModeOn ? "outlined" : "contained"}
                    onDelete={handleRemoveSearchType}
                  />
                </MuiBadge>
              </Col>
            )}

            {/* Filter Badges */}
            {selectedDistances && (
              <Col xs="auto" style={{ marginTop: "0.5rem" }}>
                <MuiBadge color="success" pill>
                  <MuiChip
                    color="success"
                    label={`Distance: ${selectedDistances} km`}
                    variant={isDarkModeOn ? "outlined" : "contained"}
                    onDelete={handleRemoveDistance}
                  />
                </MuiBadge>
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
                      color="info"
                      label={`Dance Form: ${danceForm}`}
                      variant={isDarkModeOn ? "outlined" : "contained"}
                      onDelete={() => handleRemoveDanceForm(danceForm)}
                    />
                  </MuiBadge>
                ))}
              </Col>
            )}

            {(selectedDanceForms.length || selectedDistances) && (
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
                  />
                </MuiBadge>
              </Col>
            )}
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
              <hr style={{ margin: "5px 0" }}></hr>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                <li
                  style={{ cursor: "pointer", margin: "5px 0" }}
                  onClick={() => (
                    setShowFilterValue("searchTypes"), setShowFilters(true)
                  )}
                >
                  Search Types
                </li>

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
              {showFilters && showFilterValue === "searchTypes" && (
                <Form.Group controlId="filterSearchTypes">
                  <Form.Label>Types:</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedSearchType}
                    onChange={handleSearchTypeChange}
                  >
                    {searchTypes.map((searchType) => (
                      <option key={searchType.name} value={searchType.name}>
                        {searchType.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}

              {showFilters && showFilterValue === "distances" && (
                <Form.Group controlId="filterDistances">
                  <Form.Label>Distances:</Form.Label>
                  <Form.Control
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
                  {/* <Form.Control as="select" value={selectedDanceForm} onChange={(e) => setSelectedDanceForm(e.target.value)}>
                      <option value="">Select Dance Form</option>
                      {danceForms.map((danceForm) => (
                        <option key={danceForm} value={danceForm}>
                          {danceForm}
                        </option>
                      ))}
                    </Form.Control> */}
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
        <WorkshopCardSlider dataList={searchData.workshop} />
      )}
      {selectedSearchType === "openClass" && (
        <OpenClassCardSlider dataList={searchData.openClass} />
      )}
      {selectedSearchType === "course" && (
        <CourseCardSlider dataList={searchData.course} />
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
