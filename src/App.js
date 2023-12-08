import { HashRouter, Route, Routes } from 'react-router-dom';
import {Container} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import LoginPage from './Screens/LoginPage';
import UserPage from './Screens/UserPage';
import LandingPage from './Screens/LandingPage'
import Header from './Components/Header';
import Footer from './Components/Footer';
import  Kyc  from './Components/Kyc';
import StudioFullPage from './Screens/StudioFullPage';
import SearchPage from './Screens/SearchPage';
import CreatorPlans from './Screens/CreatorPlans';
import Order from './Screens/Order';
import Cart from './Screens/Cart';
import Transactions from './Components/Transactions';
import AdminPage from './Screens/AdminPage';
import Trail from './Components/Trail';
import { connect } from 'react-redux';
import { toggleDarkMode } from './redux/actions/darkModeAction'; 
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from './redux/selectors/darkModeSelector'; 

function App() {
  const isDarkModeOn = useSelector(selectDarkModeStatus); // Use useSelector to access isDarkModeOn
  const dispatch = useDispatch(); 
  console.log(isDarkModeOn,"From header")

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [userID, setUserID] = useState(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  useEffect(() => {
    // Check if the URL contains 'n-admin'
    const isNAdminRoute = window.location.pathname.includes('/n-admin');
    // You can add more routes to exclude from header and footer if needed
    setAdminLoggedIn((isNAdminRoute || JSON.parse(localStorage.getItem('adminLogin'))))
    console.log("Admin n",adminLoggedIn)
  }, [adminLoggedIn]);

  const handleLogin = (UserInfo,userInfoFull) => {
    setUsername(UserInfo.displayName);
    setIsLoggedIn(true);
    setUserID(UserInfo.localId)
    localStorage.setItem('username',username);
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('userInfo',JSON.stringify(UserInfo));
    localStorage.setItem('userInfoFull',JSON.stringify(userInfoFull));
    console.log("User Info Full local", JSON.parse(localStorage.getItem('userInfoFull')))
  };
  
  const handleLogout = () => {
    setUsername("");
    setIsLoggedIn(false);
    // Remove user data from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userInfoFull');
    localStorage.removeItem('posts');
    localStorage.removeItem('adminLogin');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('StudioCreated');
  };
 
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode()); // Dispatch the action using useDispatch
  };


  console.log("hi:",process.env.REACT_APP_TRY)
  return (
    <HashRouter  >
    
      <Header username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>
      <div style={{backgroundColor: isDarkModeOn ? 'black' : 'white'}} hidden>
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


      
      <main className='py-1' style={{backgroundColor: isDarkModeOn ? 'black' : 'white'}}>
        <Container>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path='/profile' element={<UserPage onLogout={handleLogout} username={username} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />}/>
            <Route path='/kyc' element={<Kyc/>}/>
            <Route path='/studio/:studioId' element={<StudioFullPage/>}/>
            <Route path='/st' element={<StudioFullPage/>}/>
            <Route path='/search/:entity' element={<SearchPage/>}/>
            <Route path='/cplans' element={<CreatorPlans/>}/>
            <Route path='/orders' element={<Order/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/transactions' element={<Transactions/>}/>
            <Route path='/n-admin' element={<AdminPage/>}/>
            <Route path='/n-trail' element={<Trail/>}/>
          </Routes>
        </Container>
      </main>
     
      <Footer />
      
    </HashRouter>
  );
}

export default App;
