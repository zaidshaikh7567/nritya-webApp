import { Offcanvas, Button } from 'react-bootstrap';
import { auth } from '../config';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { useSelector } from 'react-redux';
import logo from './../logo.png';
import './SideMenu.css';
import {useEffect} from "react";
import secureLocalStorage from 'react-secure-storage';
import { setCreatorMode } from '../utils/firebaseUtils';

function SideMenu({ showProfileOffcanvas, closeProfileOffcanvas }) {
  const isDarkModeOn = useSelector(selectDarkModeStatus);


  const handleLogout = async () => {
    console.log("Logging out SideMenu")
    try {
    await auth.signOut();
    localStorage.clear()
    secureLocalStorage.clear()
     
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  const trySetCreatorMode = () => {
    let attempts = 0;
    while (attempts < 2) {
      const creatorMode = secureLocalStorage.getItem('CreatorMode');
      console.log("creatorMode",creatorMode)
      if (creatorMode == null) {
        setCreatorMode();
        attempts += 1;
      } else {
        break;
      }
    }
  };

  useEffect(() => {
    trySetCreatorMode();
  }, []);

  const regularMenuItems = [
    { action: () => window.location.hash = '#/profile', name: 'Profile', show: true },
    { action: () => window.location.hash = '#/transactions', name: 'Transactions',show:true },
    { action: () => window.location.hash = '#/creatorDashboard', name: 'Dashboard',show: secureLocalStorage.getItem('CreatorMode')  },
    { action: () => window.location.hash = '#/myBookings', name: 'Bookings',show:true },
    { action: handleLogout, name: 'Sign Out',show:true },
  ];

  return (
    <Offcanvas
      style={{
        width: '20rem',
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
