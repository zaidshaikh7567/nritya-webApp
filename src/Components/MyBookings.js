import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { db } from '../config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Modal, Button, Row, Col, Column,Card } from 'react-bootstrap';
import Ticket from './Ticket';
import QRCode from 'react-qr-code';

function MyBookings() {
  console.log("Bookings")
  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const query_ref = query(collection(db,'FreeTrialBookings'), where('user_id', '==', userId));
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
      setBookings(bookingDataArray);
    };

    fetchData();
  }, [userId]);

  const handleOpenModal = (bookingData) => {
    setSelectedBooking(bookingData);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  

  return (
    <div style={{ backgroundColor: isDarkModeOn ? "black" : "white" }}>
      {bookings.length === 0 ? (

        <div>
           <h2 style={{color: isDarkModeOn ? "white" : "black"}}>My Bookings</h2>
          <p style={{color: isDarkModeOn ? "white" : "black" }}>No bookings till now.</p>
        </div>
      ) : (
        <div>
          <h2 style={{color: isDarkModeOn ? "white" : "black"}}>My Bookings</h2>

          {
            bookings.map((bookingData) => (
              <div key={bookingData.bookingId}>
                <Card
                  style={{
                    backgroundColor: isDarkModeOn ? "black" : "white",
                    color: isDarkModeOn ? "white" : "black",
                    borderBlockColor: isDarkModeOn ? "white" : "black",
                  }}
                >
                  <Row className="row-3 text-center">
                    <Col md={2} className="d-none d-md-block">
                    <div style={{
                        background: "#E60023",
                        color: "white",
                        
                        alignItems: "center", // corrected syntax
                        width: "10rem", // corrected syntax
                        height: "100%",
                      }}>
    
    
                      <p style={{ fontSize: 'small' }}>
                        Booked On
                        <br />
                        <span style={{ fontSize: '3rem' }}>
                          {new Date(bookingData.timestamp * 1000).getDate()}
                        </span>
                        <br/>
                        <span style={{ fontSize: 'small' }}>
                          {new Date(bookingData.timestamp * 1000).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </p>
                      </div>
                    </Col>
    
                    <Col md={4} className="text-center">
                      <p>{bookingData.name_class}</p>
                      <p>{bookingData.name_studio}</p>
                      <p>{bookingData.studio_address}</p>
                    </Col>
                    <Col md={2} className="text-center">
                      <div style={{ justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  paddingTop: "1rem"
              }}>
                        <QRCode value={'https://google.com'} size={100} />
                      </div>
                    </Col>
                    <Col md={4}>
                      <p>{bookingData.name_learner}</p>
                      <p>Admit One for Once</p>
                      <Button
                        variant="warning"
                        onClick={() => handleOpenModal(bookingData)}
                      >
                        Expand
                      </Button>
                      
                    </Col>
                  </Row>
    
                </Card>
                <br></br>
              </div>
            ))
          }

        </div>
        
      )}


      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ticket Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <Ticket
              studioName={selectedBooking.name_studio}
              className={selectedBooking.name_class}
              address={selectedBooking.studio_address}
              timing={selectedBooking.studio_timing}
              days={selectedBooking.studio_days}
              customerName={selectedBooking.name_learner}
              timestamp={selectedBooking.timestamp}
              bookingId={selectedBooking.id}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyBookings;
