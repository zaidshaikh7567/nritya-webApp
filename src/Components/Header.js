import React, { useEffect, useState, lazy, Suspense } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import { useMediaQuery } from 'react-responsive';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { selectRefreshLocation } from '../redux/selectors/refreshLocationSelector';
import indianCities from '../cities.json';
import { toggleDarkMode } from '../redux/actions/darkModeAction';
import { useAuth } from '../context/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getBrowserLocation } from '../utils/location';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import Skeleton from '@mui/material/Skeleton';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SearchIcon from '@mui/icons-material/Search';
import './Header.css';
import { Apartment, PlaceTwoTone } from '@mui/icons-material';
import logoBig from '../assets/images/logo_large.png';
import logoMobile from '../assets/images/logo_small.jpg';

const SideMenu = lazy(() => import('./SideMenu'));
const LoginModalDailog = lazy(() => import('./LoginModalDailog'));
const FILTER_LOCATION_KEY = 'filterLocation';

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
  const router = useRouter();
  const { currentUser, showSignInModal, setShowSignInModal } = useAuth();
  const dispatch = useDispatch();
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const reduxLocation = useSelector(selectRefreshLocation);
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
    if (reduxLocation) {
      setSelectedLocation(reduxLocation);
    }
  }, [reduxLocation]);

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
    padding: 0
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
    router.push('/search/' + searchText);
  };

  const handleLocationChange = (event, location) => {
    if (!location) return;

    setSelectedLocation(location);

    setShowLocationDropdown(false);
    window.location.reload();
  };

  const locationOptions = indianCities.cities;

  const getLocation = async (event) => {
    const city = await getBrowserLocation();
    setSelectedLocation(city);
    window.location.reload();
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
    localStorage.clear();
    setShowSignInModal(true);
  }

  //function handle to close the form
  const handleClose = () => {
    setShowSignInModal(false);
  }

  return (
    <Navbar style={styleObj} expand="lg" collapseOnSelect>
      <Container fluid>
        <div className="d-flex location-dropdown-container align-items-center">

          {showLocationDropdown && (
            <Dropdown.Menu
              show={showLocationDropdown}
              className={`dropdown-menu ${isDarkModeOn ? 'dark' : ''}`}

              style={{
                marginTop: '0.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                // marginLeft: '144px',
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
                  classes={{ option: 'city-btn-hover-purple-bg' }}
                />
              </ThemeProvider>

            </Dropdown.Menu>
          )}

          {isMobile ? (
            <Navbar.Brand onClick={() => router.push('/')} style={{ textTransform: 'none', cursor: 'pointer' }}>
              <Image style={{ width: "4rem", height: "4rem" }}
                src={logoMobile}
                alt="Logo"
                roundedCircle={true}
              />
            </Navbar.Brand>
          ) : (
            <Navbar.Brand onClick={() => router.push('/')} style={{ textTransform: 'none', cursor: 'pointer' }}>
              <Image style={{
                width: "100%", height: "4rem", maxWidth: "200px",
                margin: 0,
                padding: 0,
                objectFit: "contain"
              }}
                src={logoBig}
                alt="Logo"
              />
            </Navbar.Brand>
          )}
          <Button
            variant="outlined"
            className="btn-hover-purple-bg me-2 rounded-3"
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            style={{
              cursor: 'pointer', textTransform: 'none', color: 'white', borderColor: 'white',
              height: '3rem', borderWidth: '2px', width: '12rem'
            }}
            startIcon={<PlaceTwoTone />}>
            {selectedLocation}
          </Button>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav"> <MenuOutlinedIcon style={{ color: "white" }} /> </Navbar.Toggle>

        <Navbar.Collapse id="navbarScroll" className="justify-content-center">


          <Nav className="ms-auto justify-content-lg-end align-items-center flex-grow-1">
            <div className="position-relative location-dropdown-container my-2">

              <Nav className="ms-auto justify-content-lg-end align-items-center flex-grow-1">
                <FormControlLabel
                  hidden={true}
                  control={<MaterialUISwitch sx={{ m: 1 }} checked={isDarkModeOn ? true : false} />}
                  onClick={handleToggleDarkMode}
                />
                {currentUser ? (
                  <>
                    <Button startIcon={<SearchIcon />} variant="outlined" className="search-box me-2 my-2 rounded-3 d-none d-lg-flex" onClick={() => router.push('/search/studios')} style={{ textTransform: 'none', borderColor: 'white', backgroundColor: 'white', color: 'black', borderWidth: '2px', height: '3rem', width: '12rem', justifyContent: 'left' }}>
                      Search
                    </Button>
                    <Button startIcon={<Apartment />} variant="outlined" className="btn-hover-purple-bg me-2 my-2 rounded-3" onClick={() => router.push('/modifyStudios')} style={{ textTransform: 'none', borderColor: 'white', color: 'white', borderWidth: '2px', height: '3rem', width: '12rem' }}>List Studios</Button>
                  </>
                ) : (
                  <>
                    <Button startIcon={<SearchIcon />} variant="outlined" className="search-box me-2 my-2 rounded-3 d-none d-lg-flex" onClick={() => router.push('/search/studios')} style={{ textTransform: 'none', borderColor: 'white', backgroundColor: 'white', color: 'black', borderWidth: '2px', height: '3rem', width: '12rem', textAlign: 'left', justifyContent: 'left' }}>
                      Search
                    </Button>
                    <Button startIcon={<Apartment />} variant="outlined" className="btn-hover-purple-bg me-2 my-2 rounded-3" onClick={() => router.push('/modifyStudios')} style={{ textTransform: 'none', borderColor: 'white', color: 'white', borderWidth: '2px', height: '3rem', width: '12rem' }}> List Studios</Button>
                  </>
                )}
              </Nav>
            </div>
            {currentUser ? (
              <>
                {
                  photoURL ? (
                    <Button
                      onClick={openProfileOffcanvas}
                      className='my-3'
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
                        borderColor: 'yellow',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none', // Remove default border if needed
                        boxShadow: 'none', // Remove default shadow if needed
                      }}
                    />

                  ) :
                    (
                      <Button onClick={openProfileOffcanvas} className="rounded-pill my-3"
                        variant="outlined"
                        style={{
                          fontSize: '0.9rem',
                          color: 'white', borderRadius: '50%', borderColor: "white",
                          width: '3rem', height: '3rem', display: 'flex',
                          alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginRight: '0.5rem',
                          borderWidth: '2px',
                          borderColor: 'white',
                        }}>
                        {getUserNameInitials()}
                      </Button>

                    )
                }
                <Suspense fallback={<Skeleton variant="rectangular" animation="wave"
                  style={{
                    width: '20rem', height: '100vh', left: 0, top: 0, zIndex: 1000, backgroundColor: isDarkModeOn ? '#333' : '#f0f0f0',
                  }}
                />}>
                  <SideMenu showProfileOffcanvas={showProfileOffcanvas} closeProfileOffcanvas={closeProfileOffcanvas} />
                </Suspense>
              </>

            ) : (
              <Button variant="outlined" className='btn-hover-purple-bg my-2 rounded-3' onClick={handleOpen} style={{ textTransform: 'none', color: 'white', borderColor: "white", height: '3rem', width: '12rem', borderWidth: '2px' }}>Sign In</Button>
            )}
            <Suspense fallback={<div>Loading...</div>}>
              <LoginModalDailog open={showSignInModal} handleClose={handleClose} />
            </Suspense>
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default Header;
