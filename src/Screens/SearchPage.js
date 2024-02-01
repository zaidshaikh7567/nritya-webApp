import React, { useState,useEffect } from 'react';
import StudioCard from "../Components/StudioCard";
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { Form, Button, Col, Row, Image, Modal, FormControl,Badge } from 'react-bootstrap';
import indianCities from '../cities.json';
import {refreshLocation} from '../redux/actions/refreshLocationAction';
import SmallCard from '../Components/SmallCard';

const FILTER_LOCATION_KEY = 'filterLocation';
const FILTER_DISTANCES_KEY = 'filterDistances';
const FILTER_DANCE_FORMS_KEY = 'filterDanceForms';
const danceForms = ['Ballet', 'Hip Hop', 'Salsa', 'Kathak'];
const distances = [2,5,10,20,50]

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedDistances, setSelectedDistances] = useState('');
  const [selectedDanceForm, setSelectedDanceForm] = useState('');
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  console.log("dark mode", isDarkModeOn)

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  }

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    // Perform the search and update the results
    let apiEndpoint = `https://nrityaserver-2b241e0a97e5.herokuapp.com/api/search/?query=${query}`;
    apiEndpoint = `http://127.0.0.1:8000/api/search/?query=${query}`;

    if (localStorage.getItem(FILTER_LOCATION_KEY)) {
      apiEndpoint += `&city=${encodeURIComponent(localStorage.getItem(FILTER_LOCATION_KEY))}`;
    }
  
    if (selectedDanceForm) {
      apiEndpoint += `&danceStyle=${encodeURIComponent(selectedDanceForm)}`;
    }
  
    
    const tryUrl1 = 'https://nrityaserver-2b241e0a97e5.herokuapp.com/api/get_all_data/'
    const tryUrl12 = `https://nrityaserver-2b241e0a97e5.herokuapp.com/api/search/?query=adarsh&city=Patna`
    //console.log("https://nrityaserver-2b241e0a97e5.herokuapp.com/api/search/?query=adarsh&city=Patna")
    //apiEndpoint = `http://127.0.0.1:8000/api/help/`;
    console.log(tryUrl12===apiEndpoint)
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Search results:', data); // Log the data received from the API
        setResults(data);
      })  
      .catch(error => console.error('Error fetching search results:', error));
  };

  const handleSaveFilters = () => {

    localStorage.setItem(FILTER_DISTANCES_KEY, selectedDistances);
    localStorage.setItem(FILTER_DANCE_FORMS_KEY, selectedDanceForm);
    console.log("Location change, redux operation")
    //dispatch(refreshLocation())
    setShowFilters(false);
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
    
  }, []);

  return (
    <div style={{ backgroundColor: isDarkModeOn ? 'black' : 'white', padding: '10px' }}>
      <header>
        <p1 style={{ color: isDarkModeOn ? 'white' : 'black' }}>Search </p1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormControl type="text" placeholder="Enter your search query" value={query} onChange={handleInputChange}
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
          <div
            onClick={toggleFilters}
            style={{ marginLeft: '10px', cursor: 'pointer', fontSize: '20px' }}
          >
            &#9776;
          </div>
        </div>
      </header>

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
                
                      

                {/* Add more selection lists for additional filters */}
              </Col>
            </Row>

            <Button variant="primary" onClick={handleSaveFilters}>
              Save
            </Button>
          </Modal.Body>
        </Modal>

        {/* Filters Badges */
        selectedDistances || selectedDanceForm? (
      <div style={{ marginTop: '10px' }}>
        {selectedDistances && (
          <Badge pill bg={isDarkModeOn?"warning":"dark"} style={{ marginRight: '5px' }}>
            Distance: {selectedDistances} km
          </Badge>
        )}
        {selectedDanceForm && (
          <Badge pill bg={isDarkModeOn?"danger":"info"} style={{ marginRight: '5px' }}>
            Dance Form: {selectedDanceForm}
          </Badge>
        )}
        {/* Add more badges for additional filters */}
        <hr></hr>
      </div>
        ):""}

      <div style={{ display: 'flex', flexWrap: 'wrap', padding: '10px' }}>
        {results.map((studio, index) => (
          <div key={index}
          className="studio-card-container"
          style={{ padding: "0.2rem" }} md={2}>
          <a href={`#/studio/${studio.studioId}`} style={{textDecoration: "none"}} >
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
        ))}
      </div>
    </div>
  );
};

export default SearchPage;




/*
const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'tRp4jvJoUy1YAjgXNyxTRbe1YQjsXaBg', // Be sure to use a Search API Key
    nodes: [
      {
        host: '2ojni54h1zxeg0dyp-1.a1.typesense.net', // where xxx is the ClusterID of your Typesense Cloud cluster
        port: '443',
        protocol: 'https',
      },
    ],
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  // So you can pass any parameters supported by the search endpoint below.
  // queryBy is required.
  additionalSearchParameters: {
    query_by: 'studioName,danceStyles,description',
  },
});

const searchClient = typesenseInstantsearchAdapter.searchClient;
const SearchPage = () => {
  
  const Hit = ({ hit }) => (
   
   <div>
      <StudioCard studioName={hit.studioName} studioDanceStyles={hit.danceStyles}/>
      <br></br>
      </div>

    
  );

  return (
    <>
    <InstantSearch searchClient={searchClient} indexName="companies">
      <SearchBox autoFocus />
      <Stats />
      <Hits hitComponent={Hit} />
    </InstantSearch>
    </>
  );
};

export default SearchPage;












/*
function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);
  const { entity } = useParams();

  const handleSearch = (event) => {
    event.preventDefault();
    const searchValue = event.target.elements.search.value.trim();

    if (searchValue) {
      searchStudios(searchValue)
        .then((results) => {
          setSearchResults(results);
          console.log("Results",results)
          setShowNoResults(results.length === 0);
        })
        .catch((error) => {
          console.error('Error searching studios:', error);
          setSearchResults([]);
          setShowNoResults(true);
        });
    }
  };

  // Function to search for strings across specified fields of studios in Firebase Firestore
  const searchStudios = async (searchQuery) => {
    try {
      // Perform search with Typesense InstantSearch
      const searchResponse = await searchClient.search(searchQuery);
      const results = searchResponse.hits.map((hit) => hit._highlightResult);
      return results;
    } catch (error) {
      console.error('Error searching studios:', error);
      return [];
    }
  };

  return (
    <div>
      <h1>Search {entity}</h1>

      <Form onSubmit={handleSearch}>
        <Form.Group>
          <div className="input-group rounded">
            <Form.Control type="text" name="search" className="rounded" placeholder="Enter your search query" />
            <div className="input-group-append">
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </div>
          </div>
        </Form.Group>
      </Form>

      {showNoResults && <Alert variant="info">No results found.</Alert>}
      {searchResults.length > 0 && (
        <div>
          <h2>Search Results for {entity}</h2>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                <Link to={`/studios/${result.id}`}>{result.studioName}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
*/