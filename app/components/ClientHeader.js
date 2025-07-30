'use client'

import React, { useEffect, useState, lazy, Suspense } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';
import { useMediaQuery } from 'react-responsive';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../../src/redux/selectors/darkModeSelector';
import { selectRefreshLocation } from '../../src/redux/selectors/refreshLocationSelector';
import citiesData from '../../src/cities.json';
import { toggleDarkMode } from '../../src/redux/actions/darkModeAction';
// import { useAuth } from '../../src/context/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getBrowserLocation } from '../../src/utils/location';
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
import '../../src/Components/Header.css';
import { Apartment, PlaceTwoTone, Close } from '@mui/icons-material';

// Logo image paths for Next.js
const logoBig = '/assets/images/logo_large.png';
const logoMobile = '/assets/images/logo_small.jpg';

const SideMenu = lazy(() => import('../../src/Components/SideMenu'));
const LoginModalDailog = lazy(() => import('../../src/Components/LoginModalDailog'));
const LocationModal = lazy(() => import('./LocationModal'));
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

function ClientHeader() {
  const [selectedLocation, setSelectedLocation] = useState(localStorage.getItem(FILTER_LOCATION_KEY) ? localStorage.getItem(FILTER_LOCATION_KEY) : 'New Delhi');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showProfileOffcanvas, setShowProfileOffcanvas] = useState(false);
  const [searchText, setSearchText] = useState('');
  const router = useRouter();
  // const { currentUser, showSignInModal, setShowSignInModal } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);
  
  // Check if user is logged in from localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const currentUser = isLoggedIn ? userInfo : null;
  const dispatch = useDispatch();
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const reduxLocation = useSelector(selectRefreshLocation);
  const isMobile = useMediaQuery({ query: '(max-width: 480px)' });
  const photoURL = userInfo?.photoURL;
  
  // Debug logging
  console.log('ClientHeader - isLoggedIn:', isLoggedIn);
  console.log('ClientHeader - currentUser:', currentUser);
  console.log('ClientHeader - userInfo:', userInfo);
  console.log('ClientHeader - showProfileOffcanvas:', showProfileOffcanvas);
  console.log('ClientHeader - showSignInModal:', showSignInModal);

  const autocompleteTheme = createTheme({
    components: {
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: '8px',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
          },
        },
      },
    },
  });

  function getUserNameInitials() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    const name = userInfo.name || userInfo.displayName || '';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
  }

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const openProfileOffcanvas = () => {
    console.log('Profile button clicked, currentUser:', currentUser);
    setShowProfileOffcanvas(true);
  };

  const closeProfileOffcanvas = () => {
    setShowProfileOffcanvas(false);
  };

  const handleButtonClick = () => {
    console.log('Sign In button clicked, setting modal to true');
    setShowSignInModal(true);
  };

  const handleLocationChange = (event, location) => {
    if (location) {
      console.log('handleLocationChange called with location:', location);
      console.log('Current pathname:', window.location.pathname);
      
      setSelectedLocation(location);
      localStorage.setItem(FILTER_LOCATION_KEY, location);
      console.log('Location changed to:', location);
      
      // Update URL to reflect the new city
      const currentPath = window.location.pathname;
      console.log('Current path:', currentPath);
      
      // Always redirect to explore page with city parameter
      const targetUrl = `/explore/?city=${encodeURIComponent(location)}`;
      console.log('Redirecting to:', targetUrl);
      router.push(targetUrl);
      
      setShowLocationDropdown(false);
    }
  };

  const getLocation = async (event) => {
    try {
      const position = await getBrowserLocation();
      const { latitude, longitude } = position.coords;
      // Handle location logic
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  // Removed document click handler since we're using MUI Dialog for location modal

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      // Force re-render when localStorage changes
      window.dispatchEvent(new Event('storage'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Monitor showLocationDropdown state changes
  useEffect(() => {
    console.log('showLocationDropdown state changed to:', showLocationDropdown);
  }, [showLocationDropdown]);

  const handleOpen = () => {
    setShowSignInModal(true);
  };

  const handleClose = () => {
    setShowSignInModal(false);
  };

  return (
    <Navbar expand="lg" className="px-3 py-2" style={{ backgroundColor: "black", position: 'sticky', top: 0, zIndex: 1000 }}>
      <Container fluid>
        <div className="d-flex align-items-center">
          {isMobile ? (
            <Navbar.Brand onClick={() => {
              const storedCity = localStorage.getItem(FILTER_LOCATION_KEY) || 'New Delhi';
              router.push(`/explore/?city=${encodeURIComponent(storedCity)}`);
            }} style={{ textTransform: 'none', cursor: 'pointer' }}>
              <Image style={{ width: "4rem", height: "4rem" }}
                src={logoMobile}
                alt="Logo"
                roundedCircle={true}
              />
            </Navbar.Brand>
          ) : (
            <Navbar.Brand onClick={() => {
              const storedCity = localStorage.getItem(FILTER_LOCATION_KEY) || 'New Delhi';
              router.push(`/explore/?city=${encodeURIComponent(storedCity)}`);
            }} style={{ textTransform: 'none', cursor: 'pointer' }}>
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
          
                    {/* Location Button */}
          <Button
            variant="outlined"
            className="btn-hover-purple-bg me-2 rounded-3"
            onClick={() => {
              console.log('Location button clicked, opening location modal');
              console.log('Current showLocationDropdown state:', showLocationDropdown);
              setShowLocationDropdown(true);
              console.log('setShowLocationDropdown(true) called');
            }}
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
                        padding: 0,
                        minWidth: '3rem',
                        minHeight: '3rem',
                        borderWidth: '0.2px',
                        backgroundImage: `url(${photoURL})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        borderColor: 'yellow',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        boxShadow: 'none',
                      }}
                    />
                  ) : (
                    <Button onClick={openProfileOffcanvas} className="rounded-pill my-3"
                      variant="outlined"
                      style={{
                        borderColor: 'white',
                        color: 'white',
                        borderWidth: '2px',
                        width: '3rem',
                        height: '3rem',
                        minWidth: '3rem',
                        minHeight: '3rem',
                        padding: 0,
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                      {getUserNameInitials()}
                    </Button>
                  )
                }
              </>
            ) : (
              <Button onClick={handleButtonClick} className="rounded-pill my-3"
                variant="outlined"
                style={{
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: '2px',
                  width: '8rem',
                  height: '3rem',
                  textTransform: 'none'
                }}>
                Sign In
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      <Suspense fallback={<div>Loading...</div>}>
        {showSignInModal && <LoginModalDailog open={showSignInModal} handleClose={handleClose} />}
        {showProfileOffcanvas && (
          <div>
            <SideMenu showProfileOffcanvas={showProfileOffcanvas} closeProfileOffcanvas={closeProfileOffcanvas} />
          </div>
        )}
        {showLocationDropdown && (
          <LocationModal
            open={showLocationDropdown}
            onClose={() => setShowLocationDropdown(false)}
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
          />
        )}
      </Suspense>
    </Navbar>
  );
}

export default ClientHeader; 