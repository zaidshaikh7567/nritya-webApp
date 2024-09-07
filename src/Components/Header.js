import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Nav, Navbar, Offcanvas, Dropdown, Image } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from './../logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { selectRefreshLocation } from '../redux/selectors/refreshLocationSelector';
import indianCities from '../cities.json';
import { toggleDarkMode } from '../redux/actions/darkModeAction';
import { useAuth } from '../context/AuthContext';
import SideMenu from './SideMenu';
import { TextField, Autocomplete, Chip } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { getBrowserLocation } from '../utils/location';
import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SearchIcon from '@mui/icons-material/Search';
import './Header.css';
import LoginModalDailog from './LoginModalDailog';
import { Apartment, PartyModeOutlined, Place, PlaceTwoTone } from '@mui/icons-material';
import logoBig from '../assets/images/logo_large.png';
import logoMobile from '../assets/images/logo_small.jpg';

const FILTER_LOCATION_KEY = 'filterLocation';
const FILTER_DANCE_FORMS_KEY = 'filterDanceForms';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

function Header() {
  const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem(FILTER_LOCATION_KEY) ? localStorage.getItem(FILTER_LOCATION_KEY) : 'New Delhi');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const adminLogin = useSelector((state) => state.adminLogin);
  const reduxLocation = useSelector(selectRefreshLocation);
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 480px)' });
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const photoURL = userInfo?.photoURL;

  //console.log("Redux loc", reduxLocation.city)

  const autocompleteTheme = createTheme({
    components: {
      MuiAutocomplete: {
        styleOverrides: {
          option: {
            '&:hover': {
              backgroundColor: '#fce4ec',
            },
          },
        },
      },
    },
    palette: {
      mode: isDarkModeOn ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    console.log("Redux Location changed:", reduxLocation.city);
    if (reduxLocation.city) {
      setSelectedLocation(reduxLocation.city);
    }
  }, [reduxLocation.city]);

  useEffect(() => {
    localStorage.setItem(FILTER_LOCATION_KEY, selectedLocation);
  }, [selectedLocation]);

  useEffect(() => {
    const storedLocation = localStorage.getItem(FILTER_LOCATION_KEY);
    if (storedLocation) {
      setSelectedLocation(storedLocation);
    }
  }, []);

  const styleObj = {
    fontSize: 10,
    textAlign: "center",
    background: 'black',
  }

  function getUserNameInitials() {
    const displayName = currentUser.displayName;
    const nameParts = displayName.split(" ");
    let buttonContent = nameParts[0].charAt(0);
    if (nameParts.length > 1) {
      buttonContent += nameParts[1].charAt(0);
    }
    if (buttonContent.length < 2 && nameParts[0].length > 1) {
      buttonContent += nameParts[0].charAt(1);
    }
    return buttonContent;
  }

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode()); // Dispatch the action using useDispatch
  };
  const [showProfileOffcanvas, setShowProfileOffcanvas] = useState(false);

  const openProfileOffcanvas = () => {
    setShowProfileOffcanvas(true);
  };

  const closeProfileOffcanvas = () => {
    setShowProfileOffcanvas(false);
  };

  const handleButtonClick = () => {
    navigate('#/search/' + searchText);
  };

  const handleLocationChange = (event, location) => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
  };

  const locationOptions = indianCities.cities;

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents default form behavior of submitting
    handleButtonClick();
  }

  const { entity } = useParams();

  const getLocation = (event) => {
    getBrowserLocation();
    setSelectedLocation(localStorage.getItem('filterLocation'))
  };

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

  //console.log("Hii-1", entity)

  const handleOpen = () => {
    setOpen(true)
    console.log("handle Open from header",open)
  }

  //function handle to close the form
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Navbar style={styleObj} expand="lg" collapseOnSelect>
      <Container fluid>
      {isMobile ? (
        <Navbar.Brand href="/nritya-webApp" style={{ textTransform: 'none' }}>
          <Image style={{ width: "4rem", height: "4rem" }}
            src={logoMobile}
            alt="Logo"
            roundedCircle={true}
          />
        </Navbar.Brand>
      ) : (
        <Navbar.Brand href="/nritya-webApp" style={{ textTransform: 'none' }}>
          <Image style={{ width: "100%", height: "4rem",maxWidth: "200px", 
          margin: 0,  
          padding: 0,  
          objectFit: "contain"  }}
            src={logoBig}
            alt="Logo"
          />
        </Navbar.Brand>
      )}
        
        <Navbar.Toggle aria-controls="basic-navbar-nav"> <MenuOutlinedIcon style={{ color: "white" }} /> </Navbar.Toggle>

        <Navbar.Collapse id="navbarScroll" className="justify-content-center">
          <Nav
            style={{ fontFamily: 'Times Roman', fontSize: 20, maxHeight: '90px' }}
            navbarScroll
          >
          </Nav>

          <Nav className="ms-auto justify-content-lg-end align-items-center flex-grow-1">
            <FormControlLabel
              control={<MaterialUISwitch sx={{ m: 1 }} checked={isDarkModeOn ? true : false} />}
              onClick={handleToggleDarkMode}
            />
            {currentUser ? (
              <>
                <Button startIcon={<SearchIcon />} variant="outlined" className="me-2 rounded-pill" href="#/search/studios" style={{ textTransform: 'none', borderColor: 'white', color: 'white', borderWidth: '2px',height: '3rem',  width: '12rem' }}>
                  Search
                </Button>
                <Button startIcon={<Apartment />} variant="outlined" className="me-2 rounded-pill" href="#/modifyStudios" style={{ textTransform: 'none', borderColor: 'white', color: 'white', borderWidth: '2px',height: '3rem',  width: '12rem' }}>List Studios</Button>
              </>
            ) : (
              <>
                <Button startIcon={<SearchIcon />} variant="outlined" className="me-2 rounded-pill" href="#/search/studios" style={{ textTransform: 'none', borderColor: 'white', color: 'white', borderWidth: '2px',height: '3rem',  width: '12rem' }}>
                  Search Studios
                </Button>
                <Button startIcon={<Apartment />} variant="outlined" className="me-2 rounded-pill" href="#/login" style={{ textTransform: 'none', borderColor: 'white', color: 'white', borderWidth: '2px',height: '3rem',  width: '12rem' }}> List Studios</Button>
              </>
            )}
            <div className="position-relative location-dropdown-container">
              <Button
                variant="outlined"
                className="me-2 rounded-pill"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                style={{cursor: 'pointer',textTransform: 'none', color: 'white', borderColor: 'white',
                  height: '3rem', borderWidth: '2px', width: '12rem'
                }}
                startIcon={<PlaceTwoTone />}
              >
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

                  <ThemeProvider theme={autocompleteTheme}>
                    <Autocomplete
                      disablePortal
                      id="locationSearch"
                      options={locationOptions}
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      sx={{ width: "auto", padding: '0' }}
                      renderInput={(params) => (
                        <>
                          <Chip label="🧭 Current City" sx={{
                            cursor: 'pointer',
                            width: "100%",
                            marginTop: '0px',
                            borderRadius: '0px',
                            marginBottom: '10px'
                          }} onClick={getLocation} />
                          <TextField
                            {...params}
                            label="Location"
                            placeholder="🔍Search..."
                          />
                        </>
                      )}
                    />
                  </ThemeProvider>

                </Dropdown.Menu>
              )}
            </div>
            {currentUser ? (
            <>
            {
              photoURL ? (
                <Button
                  onClick={openProfileOffcanvas}
                  style={{
                    borderRadius: '50%',
                    width: '3rem',
                    height: '3rem',
                    marginRight: '0.5rem',
                    padding: 0, // Ensure no padding around the image
                    minWidth: '3rem', // Ensure the button size is consistent
                    minHeight: '3rem', // Ensure the button size is consistent
                    borderWidth: '0.2px',
                    backgroundImage: `url(${photoURL})`,
                    backgroundSize: 'cover', // Cover the entire button area
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none', // Remove default border if needed
                    boxShadow: 'none', // Remove default shadow if needed
                  }}
                />

              ) :
              (
                <Button onClick={openProfileOffcanvas} className="rounded-pill"
                variant="outlined"
                style={{
                  fontSize: '0.9rem',
                  color: 'white', borderRadius: '50%', borderColor: "white",
                  width: '3rem', height: '3rem', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginRight: '0.5rem',
                  borderWidth: '2px',
                }}>
                {getUserNameInitials()}
              </Button>

              )
            }

              <SideMenu showProfileOffcanvas={showProfileOffcanvas} closeProfileOffcanvas={closeProfileOffcanvas} />
              </>
            
          ) : (
          
              <Button variant="outlined" className="rounded-pill" onClick={handleOpen} style={{ textTransform: 'none', color: 'white', borderColor: "white", height: '3rem',width:'12rem', borderWidth: '2px' }}>Sign In</Button>
          )}
           
            <LoginModalDailog open={open} handleClose={handleClose} />
          </Nav>
          

        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default Header;
