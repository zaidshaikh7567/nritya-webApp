import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Nav, Navbar, Button, Offcanvas, Dropdown } from 'react-bootstrap';
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
import { useAuth } from '../context/AuthContext';
import SideMenu from './SideMenu';
const FILTER_LOCATION_KEY = 'filterLocation';
const FILTER_DANCE_FORMS_KEY = 'filterDanceForms';

function Header({ handleLogout, username, isLoggedIn, setUsername, setIsLoggedIn }) {
  const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem(FILTER_LOCATION_KEY) ? localStorage.getItem(FILTER_LOCATION_KEY): 'New Delhi');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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
  
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const styleObj = {
    fontSize: 10,
    textAlign: "center",
    background: isDarkModeOn ? '#292929' : '#cccccc',
    }
    
    function getUserNameInitials() {
      const displayName = currentUser.displayName;
      const nameParts = displayName.split(" ");
      console.log("hii",nameParts)
      let buttonContent = nameParts[0].charAt(0);
      if (nameParts.length > 1) {
        buttonContent += nameParts[1].charAt(0);
      }
      return buttonContent;
    }
    
  
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode()); // Dispatch the action using useDispatch
  };
  const [showProfileOffcanvas, setShowProfileOffcanvas] = React.useState(false);

    // Function to open the profile Offcanvas
    const openProfileOffcanvas = () => {
      setShowProfileOffcanvas(true);
    };
  
    // Function to close the profile Offcanvas
    const closeProfileOffcanvas = () => {
      setShowProfileOffcanvas(false);
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
              fontSize: '1.5rem', 
              backgroundColor: isDarkModeOn ? 'black' : 'yellow',  
              color: isDarkModeOn ? 'yellow' : 'white',  
              border: 'none',   
              borderRadius: '50%',   
              width: '3rem',  
              height: '3rem',   
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',    
            }}
          >
            {isDarkModeOn ? '🌜' : '🌞'} {   }
            </span>
          </div>
          
          {currentUser ? (
             <> <Button   className="me-2 rounded-pill" href="#/cart" style={{ textTransform: 'none', backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white' }} >
              <FontAwesomeIcon icon={faShoppingCart} />
              </Button>
              <Button   className="me-2 rounded-pill"  href="#/modifyStudios" style={{textTransform: 'none' , backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white'}}>List Studios</Button>
            </>
          ) : (
            <>
              <Button   className="me-2 rounded-pill" href="#/cart" style={{ textTransform: 'none', backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white' }} >
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

         {currentUser ? (
            <Nav>
              <Button onClick={openProfileOffcanvas} variant="outline-warning" className=" rounded-pill"
                style={{fontSize: '1rem', backgroundColor: isDarkModeOn?'#892CDC' : 'black',  
                  color: isDarkModeOn ? 'white' : 'white', borderRadius: '50%',   
                  width: '3rem',  height: '3rem',   display: 'flex',
                  alignItems: 'center',justifyContent: 'center',cursor: 'pointer',  marginRight: '0.5rem'  
                }}>
                  {getUserNameInitials()} 
              </Button>
              
            <SideMenu showProfileOffcanvas={showProfileOffcanvas} closeProfileOffcanvas={closeProfileOffcanvas} />
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