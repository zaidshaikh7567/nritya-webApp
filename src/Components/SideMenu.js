import { useState, useEffect } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { useSelector, useDispatch } from 'react-redux';
import logo from './../logo.png';
import './SideMenu.css';
import secureLocalStorage from 'react-secure-storage';

function SideMenu({ showProfileOffcanvas, closeProfileOffcanvas }) {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    console.log("Logging out")
    try {
      await auth.signOut();
    console.log("Clear Logging out")
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userInfoFull');
    localStorage.removeItem('posts');
    localStorage.removeItem('adminLogin');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('StudioCreated');
    localStorage.removeItem('username');
     
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  const regularMenuItems = [
    { action: () => window.location.hash = '#/profile', name: 'Profile', show: true },
    { action: () => window.location.hash = '#/transactions', name: 'Transactions',show:true },
    { action: () => window.location.hash = '#/creatorDashboard', name: 'Dashboard',show: secureLocalStorage.getItem('CreatorMode')  },
    { action: () => window.location.hash = '#/myBookings', name: 'Bookings',show:true },
    { action: handleLogout, name: 'Sign Out',show:true },
  ];

  const handleProfile = () => {
    // Implement your profile page navigation logic here
    window.open('#/profile', '_blank', 'noopener noreferrer');
  };

  return (
    <Offcanvas
      style={{
        width: '12rem',
        backgroundColor: isDarkModeOn ? 'black' : 'white',
        color: isDarkModeOn ? 'white' : 'black'
      }}
      show={showProfileOffcanvas}
      onHide={closeProfileOffcanvas}
    >
      <Offcanvas.Header closeButton>
        <img style={{ width: '6rem', height: '6rem', borderRadius: '50%' }} src={logo} alt="Logo" />
      </Offcanvas.Header>
      <Offcanvas.Body>
        <ul className="menu">
          <ul className="vertical-menu">
            {regularMenuItems.map(({ action, name,show }, index) => (
              <li key={index} hidden={!show}>
                <Button
                  variant="outline-warning"
                  className="rounded-pill menu-button"
                  onClick={action}
                >
                  {name}
                </Button>
              </li>
            ))}
          </ul>
        </ul>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default SideMenu;
