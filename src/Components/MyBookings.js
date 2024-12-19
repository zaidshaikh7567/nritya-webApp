import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { db } from '../config';
import { Row, Col, Card, Container } from 'react-bootstrap';
import { BASEURL_PROD, COLLECTIONS } from '../constants';
import { Tab, Tabs, Box, Typography } from '@mui/material';
import axios from 'axios';
import BookingLists from './BookingLists';
import BookingInformation from './BookingInformation';
import WorkshopInformation from './WorkshopInformation';
import WorkshopList from './WorkshopList';
import OpenClassList from './OpenClassList';
import OpenClassInformation from './OpenClassInformation';
import { useLoader } from '../context/LoaderContext';

function MyBookings() {
  const { currentUser } = useAuth();
  const { setIsLoading } = useLoader();
  const userId = currentUser.uid;
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [tabIndex, setTabIndex] = useState(0); // For tab selection
  const [currentClickTicket , setCurrentClickTicket] = useState(null);
  const [workshopClickTicket, setWorkshopClickTicket] = useState(null);
  const [openClassClickTicket, setOpenClassClickTicket] = useState(null);
  const handleTabChange = (event, newValue) => setTabIndex(newValue);
  const BASEURL = BASEURL_PROD;

  useEffect(() => {
    const endpoint_url2 = `${BASEURL}bookings/getUserBookings/${userId}`;
    console.log(endpoint_url2);

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(endpoint_url2); // or use fetch
        setUserBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    console.log("fetchBookings ran")
    fetchBookings();
  }, [userId]);

  //console.log("userBookings => ",userBookings);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const query_ref = query(collection(db,COLLECTIONS.FREE_TRIAL_BOOKINGS), where('user_id', '==', userId));
        const querySnapshot = await getDocs(query_ref);
      
        const bookingDataArray = [];
        querySnapshot.forEach((doc) => {
          console.log("Bookings....")
          const bookingData = doc.data();
          console.log(doc.id, ' => ', bookingData);
          bookingDataArray.push({ ...bookingData, 'id': doc.id });
        });
        bookingDataArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
        //bookingDataArray.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
        //console.log(bookingDataArray)
        setBookings(bookingDataArray);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  //console.log("userBookings",userBookings);

  const renderBookingCard = (bookingData, bookingType) => (
    <div key={bookingData.id}>

      <Container fluid>
        <Card
          style={{
            backgroundColor: isDarkModeOn ? "black" : "white",
            color: isDarkModeOn ? "white" : "black",
            borderBlockColor: isDarkModeOn ? "white" : "black",
          }}
          onClick={() => handleOpenModal(bookingData)}
        >
          <Row className="row-3 text-center">
            <Col md={2} className="text-center">
              <div style={{
                background: "#E60023",
                color: "white",
                width: "100%",
                height: "100%",
              }}>
                <p style={{ fontSize: 'small' }}>
                  Booked On<br />
                  <span style={{ fontSize: '3rem' }}>
                    {new Date(bookingData.timestamp * 1000).getDate()}
                  </span><br />
                  <span style={{ fontSize: 'small' }}>
                    {new Date(bookingData.timestamp * 1000).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                      timeZone: 'Asia/Kolkata',
                    })}
                  </span>
                </p>
              </div>
            </Col>
            <Col md={4} className="text-center">
              <p>{bookingData.name_class || bookingData.entity_type}</p>
              <p>{bookingData.name_studio || 'Studio'}</p>
              <p>{bookingData.studio_address || 'Address'}</p>
              <p>Admit {bookingData.persons_allowed} for Once</p>
              <p>Ticket ID: {bookingData.id}</p>
            </Col>

            <Col md={4}>
                <div style={{color: isDarkModeOn ? "#fff" : "#000" }}>
                  <h3 style={{ textAlign: "center", textTransform:"none" }}>Bill Details</h3>
                  <hr />
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: "8px 0" }}><strong>Price per person:</strong></td>
                        <td style={{ padding: "8px 0", textAlign: "right" }}>₹{parseInt(bookingData.price_per_person)}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "8px 0" }}><strong>Number of persons:</strong></td>
                        <td style={{ padding: "8px 0", textAlign: "right" }}>{parseInt(bookingData.persons_allowed)}</td>
                      </tr>
                      <tr>
                        <td colSpan="2" style={{ padding: "8px 0", textAlign: "center" }}>
                          <hr style={{ border: "none", borderTop: "1px dotted cyan", margin: "10px 0" }} />
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "8px 0" }}><strong>Total Price:</strong></td>
                        <td style={{ padding: "8px 0", textAlign: "right" }}>₹{parseInt(bookingData.price_per_person) * parseInt(bookingData.persons_allowed)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              <h5 style={{ color: bookingData.used ? 'green' : 'inherit' }}>
                {bookingData.used && 'Free class Availed'}
              </h5>
            </Col>
          </Row>
        </Card>
      </Container>
      <br />
      <p style={{ textDecoration: 'none' }}>
                          <a 
                            href={`https://nritya-official.github.io/nritya-webApp/#/studio/${bookingData.associated_studio_id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: isDarkModeOn? 'cyan':"black" }}
                          >
                            Check out the latest details?
                          </a>
                        </p>
    </div>
  );

  const bookingCategories = {
    Workshops: userBookings?.data?.Workshops
      ? Object.entries(userBookings.data.Workshops).map(([key, value]) => ({ ...value, id: key }))
      : [],
    OpenClasses: userBookings?.data?.OpenClasses
      ? Object.entries(userBookings.data.OpenClasses).map(([key, value]) => ({ ...value, id: key }))
      : [],
    Courses: userBookings?.data?.Courses
      ? Object.entries(userBookings.data.Courses).map(([key, value]) => ({ ...value, id: key }))
      : []
  };
  
  

  const handleOpenModal = (bookingData) => {
    console.log(selectedBooking)
    setSelectedBooking(bookingData);
    setShowModal(true);
  };

  // const handleCloseModal = () => {
  //   setShowModal(false);
  // };
  // const endpoint_url = BASEURL+"bookings/availFreeTrial/"

  // const handleCloseModal = () => {
  //   setShowModal(false);
  // };

  const endpoint_url = BASEURL_PROD+"bookings/availFreeTrial/"

  const colorstyles = {
    color: isDarkModeOn ? 'white' : 'black',
    textTransform:"none"
};

  return (
    <div style={{ backgroundColor: isDarkModeOn ? "#202020" : "white" }}>
      <h2 style={{ color: isDarkModeOn ? "white" : "black", textTransform:"none" }}>My Bookings</h2>
      <Box>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab style={colorstyles} label="Free Trial Bookings" />
          <Tab style={colorstyles} label="Workshops" />
          <Tab style={colorstyles} label="Open Classes" />
          <Tab style={colorstyles} label="Courses" />
        </Tabs>
        {tabIndex === 0 && (
          <Box p={3}>
              <div style={{ backgroundColor: isDarkModeOn ? "#202020" : "white" }}>
            {bookings.length === 0 ? (
              <div>
                <h2 style={{color: isDarkModeOn ? "white" : "black"}}>My Bookings</h2>
                <p style={{color: isDarkModeOn ? "white" : "black" }}>No bookings till now.</p>
              </div>
            ) : (
              <div>
                {
                  currentClickTicket ?
                  <BookingInformation currentClickTicket={currentClickTicket} setCurrentClickTicket={setCurrentClickTicket}/>
                   : <>
                  {bookings.map((bookingData) => (
                    <BookingLists key={bookingData.id} bookingData={bookingData} setCurrentClickTicket={setCurrentClickTicket}/>
                  ))}
                  </>
                }

              </div>
              
            )}

          </div>
          </Box> )
        }
        {tabIndex === 1 && (
        <Box p={3}>
          {/* {bookingCategories.Workshops.length > 0 ? (
            bookingCategories.Workshops.map((booking) =>(

                renderBookingCard(booking, 'Workshop')
              )
            )
          ) : (
            <Typography style={{ color: isDarkModeOn ? "white" : "black" }}>
              No Workshop bookings available.
            </Typography>
          )} */}
          {
            workshopClickTicket ? <WorkshopInformation workshopClickTicket={workshopClickTicket} setWorkshopClickTicket={setWorkshopClickTicket}/> 
            :<>
            {bookingCategories.Workshops.map((bookingData) => (
              <WorkshopList  key={bookingData.id} bookingData={bookingData} setWorkshopClickTicket={setWorkshopClickTicket}/>
            ))}
            </>   
          }
        </Box>
      )}

      {tabIndex === 2 && (
        <Box p={3}>
          {/* {bookingCategories.OpenClasses.length > 0 ? (
            bookingCategories.OpenClasses.map((booking) =>
              renderBookingCard(booking, 'OpenClass')
            )
          ) : (
            <Typography style={{ color: isDarkModeOn ? "white" : "black" }}>
              No Open Classes bookings available.
            </Typography>
          )} */}
          {
            openClassClickTicket? <OpenClassInformation openClassClickTicket={openClassClickTicket} setOpenClassClickTicket={setOpenClassClickTicket}/>:
            <>
            {bookingCategories.OpenClasses.map((bookingData) => (
              <OpenClassList key={bookingData.id} bookingData={bookingData} setOpenClassClickTicket={setOpenClassClickTicket}/>
            ))}
            </>    
          }
        </Box>
      )}

      {tabIndex === 3 && (
        <Box p={3}>
          {bookingCategories.Courses.length > 0 ? (
            bookingCategories.Courses.map((booking) =>
              renderBookingCard(booking, 'Course')
            )
          ) : (
            <Typography style={{ color: isDarkModeOn ? "white" : "black" }}>
              No Courses bookings available.
            </Typography>
          )}
        </Box>
      )}

      </Box>

  </div>
    
  );
}

export default MyBookings;
