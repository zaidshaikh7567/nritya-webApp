import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Nav, Navbar, Button, Modal, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faMapMarker } from '@fortawesome/free-solid-svg-icons'; // Import the cart icon

import { useNavigate } from 'react-router-dom';
import logo from './../logo.png';
import { adminLoginFn, adminLogoutFn } from '../reduxStore/adminLoginSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { selectRefreshLocation } from '../redux/selectors/refreshLocationSelector';
import { Typeahead } from 'react-bootstrap-typeahead';
import indianCities from '../cities.json';
import { toggleDarkMode } from '../redux/actions/darkModeAction'; 
const FILTER_LOCATION_KEY = 'filterLocation';
const FILTER_DANCE_FORMS_KEY = 'filterDanceForms';

function Header({ handleLogout, username, isLoggedIn, setUsername, setIsLoggedIn }) {
  const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem(FILTER_LOCATION_KEY) ? localStorage.getItem(FILTER_LOCATION_KEY): 'New Delhi');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const adminLogin = useSelector((state) => state.adminLogin);

  useEffect(() => {
    localStorage.setItem(FILTER_LOCATION_KEY, selectedLocation);

  }, [selectedLocation]);
  useEffect(() => {
    const storedLocation = localStorage.getItem(FILTER_LOCATION_KEY);
    if (storedLocation) {
      setSelectedLocation(storedLocation);
    }
  }, []);
  
  //console.log("Redux fetch first time", useSelector(selectRefreshLocation))
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const styleObj = {
    fontSize: 10,
    textAlign: "center",
    background: isDarkModeOn ? '#292929' : '#cccccc', // Gradient from black to white
    }
  
  
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode()); // Dispatch the action using useDispatch
  };
  const [showProfileModal, setShowProfileModal] = React.useState(false);

    // Function to open the profile modal
    const openProfileModal = () => {
      setShowProfileModal(true);
    };
  
    // Function to close the profile modal
    const closeProfileModal = () => {
      setShowProfileModal(false);
    };

  const handleButtonClick = () => {
    console.log("Button clicked from Header.js");
    navigate('#/search/'+searchText);
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
  };

  const locationOptions = indianCities.cities;

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents default form behavior of submitting
    handleButtonClick();
  }
  
  const { entity } = useParams();

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (event.target.closest('.location-dropdown-container') === null) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  console.log("Hii-1",entity)

  return (
    <Navbar style={styleObj} expand="lg" collapseOnSelect >
      <Container fluid>
        <Navbar.Brand href="/nritya-webApp" style={{textTransform: 'none'}}  >
          <img style={{ width: 60, height: 60}}
            src={logo}
            alt="Logo"       
         />        
        </Navbar.Brand>
        <div>
        <meta charset="UTF-8" />
          <h1 style={{ color: isDarkModeOn ? 'white' : 'black',fontSize:25 , textAlign: 'center', textIndent:'right',textTransform: 'none',  fontFamily:'Times Roman', paddingRight:80}}>{'            नृtya'}</h1>
        </div>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
         <Nav
            style={{ fontFamily:'Times Roman',fontSize:20, maxHeight: '90px' }}
            navbarScroll
          >
          </Nav>

          <Nav className="ms-auto" >
          <div style={{marginRight: '0.5rem'}}>
            <span
            onClick={handleToggleDarkMode}
            style={{
              fontSize: '1.5rem', // Set font size to 1.5rem
              backgroundColor: isDarkModeOn ? 'black' : 'yellow', // White for dark mode, yellow for light mode
              color: isDarkModeOn ? 'yellow' : 'white', // Yellow text for dark mode, white for light mode
              border: 'none', // Remove the button border
              borderRadius: '50%', // Make the element round
              width: '3rem', // Set a fixed width
              height: '3rem', // Set a fixed height
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer', // Change cursor to a pointer to indicate it's clickable
            }}
          >
            {isDarkModeOn ? '🌜' : '🌞'} {/* Moon for dark mode, Sun for light mode */}
            </span>
          </div>
          
          {JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).displayName ? (
             <> <Button   className="me-2 rounded-pill" href="#/cart" style={{ textTransform: 'none', backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white' }} disabled >
              <FontAwesomeIcon icon={faShoppingCart} />
              </Button>
              <Button   className="me-2 rounded-pill"  href="#/profile" style={{textTransform: 'none' , backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white'}}>List Studios</Button>
            </>
          ) : (
            <>
              <Button   className="me-2 rounded-pill" href="#/cart" style={{ textTransform: 'none', backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white' }} disabled >
              <FontAwesomeIcon icon={faShoppingCart} />
            </Button>
              <Button   className="me-2 rounded-pill" href="#/login" style={{textTransform: 'none', backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white'}}> List Studios</Button>
            </>
          )}
          <div className="position-relative location-dropdown-container">
          <Button
                className="me-2 rounded-pill"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                style={{
                  cursor: 'pointer',
                  textTransform: 'none', backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white'
                }}
              >
                <FontAwesomeIcon icon={faMapMarker} className="me-2" />
                {selectedLocation}
              </Button>

              {showLocationDropdown && (
                <Dropdown.Menu
                  show={showLocationDropdown}
                  style={{
                    marginTop: '0.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    backgroundColor: isDarkModeOn ? '#181818' : 'white',
                  }}
                >

                <Typeahead
                    id="locationSearch"
                    options={locationOptions}
                    placeholder="🔍Search..."
                    onChange={(selected) => handleLocationChange(selected[0])}
                    style={{
                      border: '1px solid ',
                      borderRadius: '8px',
                      backgroundColor: isDarkModeOn ? '#181818' : 'white',
                    }}
                  />
                </Dropdown.Menu>
              )}
          </div>
          </Nav>

         {JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).displayName ? (
            <Nav>
              <a onClick={openProfileModal}>
                <Navbar.Text style={{ color: isDarkModeOn ? 'white' : 'black',fontSize:'1.5 rem',fontFamily:'Times Roman'}}>{JSON.parse(localStorage.getItem('userInfo')).displayName}</Navbar.Text>
              </a>
              <Modal show={showProfileModal} onHide={closeProfileModal}>
              <Modal.Header closeButton>
                
                <Modal.Title>Action</Modal.Title> 

              </Modal.Header>
              <Modal.Body>
                 <Button variant="outline-warning" className=" rounded-pill"  href="#/profile">Profile</Button>
       
                <Button variant="outline-warning" className=" rounded-pill" onClick={handleLogout} href="/nritya-webApp">Sign Out</Button>
                <Button variant="outline-warning" className=" rounded-pill" href="#/orders">Orders</Button>
              </Modal.Body>
            </Modal>
              </Nav>
          ) : (
            <Nav>
              <Button variant="outline-warning" className=" rounded-pill" href="#/login" style={{textTransform: 'none', color: isDarkModeOn ? 'white' : 'black'}}>Sign In</Button>
            </Nav>
          )}

        </Navbar.Collapse>


      </Container>
    </Navbar>

    
  );
}

export default Header;