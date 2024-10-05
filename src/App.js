import { HashRouter, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect,lazy, Suspense } from "react";
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from './redux/selectors/darkModeSelector';
import ProtectedRoute from './utils/ProtectedRoute';
import CreatorRoute from './utils/CreatorRoute';
import Box  from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import SnackbarProvider from './context/SnackbarContext';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

const Header = lazy(() => import('./Components/Header'));
const Footer = lazy(() => import('./Components/Footer'));
const LandingPage = lazy(() => import('./Screens/LandingPage'));
const LoginPage = lazy(() => import('./Screens/LoginPage'));
const StudioFullPage = lazy(() => import('./Screens/StudioFullPage'));
const SearchPage = lazy(() => import('./Screens/SearchPage'));
const UserPage = lazy(() => import('./Screens/UserPage'));
const Kyc = lazy(() => import('./Components/Kyc'));
const CreatorPlans = lazy(() => import('./Screens/CreatorPlans'));
const Order = lazy(() => import('./Screens/Order'));
const Cart = lazy(() => import('./Screens/Cart'));
const Transactions = lazy(() => import('./Components/Transactions'));
const Trail = lazy(() => import('./Components/Trail'));
const CreatorStudio = lazy(() => import('./Screens/CreatorStudio'));
const CreatorDashboard = lazy(() => import('./Screens/CreatorDashboard'));
const CreatorInstructor = lazy(() => import('./Screens/CreatorInstructor'));
const AboutUs = lazy(() => import('./Screens/About'));
const ContactUs = lazy(() => import('./Screens/ContactUs'));
const MyBookings = lazy(() => import('./Components/MyBookings'));
const JobHire = lazy(() => import('./Screens/JobHire'));
const NotFoundPage = lazy(() => import('./Screens/NotFoundPage'));
const CreatorWorkshop = lazy(() => import('./Screens/CreatorWorkshop'));
const CreatorOpenClass = lazy(() => import('./Screens/CreatorOpenClass'));
const CreatorCourse = lazy(() => import('./Screens/CreatorCourse'));
const NrityaPolicyPages = lazy(() => import('./Screens/NrityaPolicyPages'));
const NrityaStudioPolicyPages = lazy(() => import('./Screens/NrityaStudioPolicyPages'));



function App() {
  const isDarkModeOn = useSelector(selectDarkModeStatus); 

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    return storedIsLoggedIn === 'true';
  });
  const [username, setUsername] = useState(null);
  const [userID, setUserID] = useState(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  useEffect(() => {
    // Check if the URL contains 'n-admin'
    const isNAdminRoute = window.location.pathname.includes('/n-admin');
    // You can add more routes to exclude from header and footer if needed
    setAdminLoggedIn((isNAdminRoute || JSON.parse(localStorage.getItem('adminLogin'))))
    //console.log("Admin n",adminLoggedIn)
  }, [adminLoggedIn]);

  const handleLogin = async (UserInfo,userInfoFull) => {
    setUsername(UserInfo.displayName);
    setIsLoggedIn(true);
    setUserID(UserInfo.UserId) 

    localStorage.setItem('username',username);
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('userInfo',JSON.stringify(UserInfo));
    localStorage.setItem('userInfoFull',JSON.stringify(userInfoFull));
    //console.log("User Info Full local", JSON.parse(localStorage.getItem('userInfoFull')));
  };

  return (
    <HelmetProvider>
    <HashRouter  >
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Suspense fallback={
        <Box sx={{ width: '100%', height: '7vh', backgroundColor: "black", 
          position: 'sticky', top: 0, zIndex: 1000 
        }}
      >
        <Skeleton variant="rectangular" animation="wave" sx={{ height: '100%' }} />
      </Box>
      }>
        <Header />
      </Suspense>
        
        <main className='py-1 flex-grow-1' style={{backgroundColor: isDarkModeOn ? '#202020' : 'white',width: '100%'}} >
          <Container fluid>
            <SnackbarProvider>
              <Suspense fallback={<Skeleton variant="rectangular" animation="wave"/>}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} />} />
                  <Route path='/studio/:studioId' element={<StudioFullPage/>}/>
                  <Route path='/st' element={<StudioFullPage/>}/>
                  <Route path='/search/:entity' element={<SearchPage/>}/>
                  <Route path='/jobs' element={<JobHire/>}/>
                  <Route path='/npolicies/:selected' element={<NrityaPolicyPages/>}/>
                  <Route path='/npoliciesStudio/' element={<NrityaStudioPolicyPages/>}/>
                  <Route element={<ProtectedRoute/>}>
                    <Route path='/profile' element={<UserPage/>}/>
                    <Route path='/kyc' element={<Kyc/>}/>
                    <Route path='/cplans' element={<CreatorPlans/>}/>
                    <Route path='/orders' element={<Order/>}/>
                    <Route path='/cart' element={<Cart/>}/>
                    <Route path='/myBookings' element={<MyBookings/>}/>
                    <Route path='/transactions' element={<Transactions/>}/>
                    <Route element={<CreatorRoute/>}>
                      <Route path='/creatorDashboard' element={<CreatorDashboard/>}/>
                      <Route path='/modifyStudios' element={<CreatorStudio/>}/>
                      <Route path='/modifyWorkshops' element={<CreatorWorkshop/>}/>
                      <Route path='/modifyOpenClasses' element={<CreatorOpenClass/>}/>
                      <Route path='/modifyCourses' element={<CreatorCourse/>}/>
                      <Route path='/modifyInstructors' element={<CreatorInstructor/>}/>
                    </Route>
                  </Route>
                  <Route path='/n-trail' element={<Trail/>}/>
                  <Route path='/aboutus' element={<AboutUs/>}/>
                  <Route path='/contactus' element={<ContactUs/>}/>
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </SnackbarProvider>
          </Container>
        </main>

        <Suspense fallback={<Skeleton variant="rectangular" animation="wave"
            style={{
              width: '100%',
              height: '10vh',
              backgroundColor: "black",
            }}
          />}>
        <Footer />
      </Suspense>
      </Box>
    </HashRouter>
    </HelmetProvider>
  );
}

export default App;
