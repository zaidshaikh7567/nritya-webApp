import { useState, useEffect } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { useSelector, useDispatch } from 'react-redux';
import logo from './../logo.png';
import './SideMenu.css';

function SideMenu({ showProfileOffcanvas, closeProfileOffcanvas }) {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const { currentUser } = useAuth();
  // const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      /*
      const clearCart = () => {
        dispatch(clearCartAction());
      };
      clearCart()
      */
      // The user is now logged out. You can also add additional cleanup or redirect logic if needed.
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  const regularMenuItems = [
    { action: () => window.location.hash = '#/profile', name: 'Profile' },
    { action: () => window.location.hash = '#/transactions', name: 'Transactions' },
    { action: () => window.location.hash = '#/creatorDashboard', name: 'Dashboard' },
    { action: () => window.location.hash = '#/myBookings', name: 'Bookings' },
    { action: handleLogout, name: 'Sign Out' },
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
            {regularMenuItems.map(({ action, name }, index) => (
              <li key={index}>
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
