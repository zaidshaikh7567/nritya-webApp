import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { db } from '../config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Modal, Button, Row, Column,Card } from 'react-bootstrap';
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

  const generateTicket = (bookingData) => {
    const ticketTemplate = document.getElementById('ticket-template');

    html2canvas(ticketTemplate).then((canvas) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
      pdf.save(`booking_ticket_${bookingData.bookingId}.pdf`);
    });
  };

  return (
    <div style={{ backgroundColor: isDarkModeOn ? "black" : "white" }}>
      {bookings.map((bookingData) => (
        <div key={bookingData.bookingId}>
          <Card className="row-3">
              <div className="col-3">
                <QRCode value={"https://google.com"} size={80} />
              </div>
              <div className="col-6">
                {/* Content for the second row */}
                <p><strong>Class Name:</strong> {bookingData.name_class}</p>
                <p><strong>Studio Name:</strong> {bookingData.name_studio}</p>
                <p><strong>Address:</strong> {bookingData.studio_address}</p>
              </div>
              <div className="col-3">
                {/* Content for the third row */}
                <Button variant="primary" onClick={() => handleOpenModal(bookingData)}>
                  Open Ticket
                </Button>
              </div>
            </Card>
        </div>
      ))}

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
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => generateTicket(selectedBooking)}>
            Generate Ticket
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyBookings;
