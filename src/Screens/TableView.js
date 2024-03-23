import React, { useState } from 'react';
import './TableView.css';
import { Button, Table, Modal, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import axios from 'axios';
import { BASEURL_PROD } from '../constants';
import logo from './../logo.png';

const TableView = ({ studioData, studioId }) => {
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.uid : null;
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVariant, setModalVariant] = useState('success'); // or 'danger' for error
  const [loading, setLoading] = useState(false);

  const bookFreeTrial = (classIndex) => {
    const endpoint_url = BASEURL_PROD + "bookings/freeTrial/";
    if (!userId) {
      alert("Please Login");
      return;
    }
    setShowModal(true);
    setLoading(true);

    axios.post(endpoint_url, {
      studioId: studioId,
      classIndex: classIndex,
      userId: userId,
    })
    .then(response => {
      console.log(response.data);
      setLoading(false);
      if (response.data.nSuccessCode === 201) {
        setModalMessage("Booked Successfully. Booking Id: " + response.data["Booking Id"]);
      } else if (response.data.nSuccessCode === 202) {
        setModalMessage("You have booked before. Booking Id: " + response.data["Booking Id"]);
      }
    })
    .catch(error => {
      setLoading(false);
      setModalVariant('danger');
      setModalMessage('Error occurred while booking. Please try again later.');
      console.error('Error in bookFreeTrial:', error);
    });

    setTimeout(() => {
      setShowModal(false);
    }, 20000); // 20 seconds timeout
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
        <Modal.Body>
        <>
            <div style={{ textAlign: "center" }}>
              <img
                src={logo}
                alt="Nritya Icon"
                style={{ width: "4rem", borderRadius: "50%" }}
              />
            <hr></hr>
            {loading ? (
            <>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
              <p>Booking in progress...</p>
            </>
          ) : (
            <>
            <div style={{ textAlign: "center" }}>
              <p>{modalMessage}</p>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            </div>
          </>
          )}

              </div>
          </>
          
        </Modal.Body>
      </Modal>

      <Table bordered className={`custom-table ${isDarkModeOn ? 'dark-mode' : ''}`}>
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Dance Forms</th>
            <th>Days</th>
            <th>Time</th>
            <th>Instructors</th>
            <th>Book Free Trial</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(studioData.tableData).map((key, index) => {
            const classItem = studioData.tableData[key];
            return (
              <tr key={index}>
                <td>{classItem.className}</td>
                <td>{classItem.danceForms}</td>
                <td>{classItem.days}</td>
                <td>{classItem.time}</td>
                <td>{classItem.instructors}</td>
                <td>
                  <Button style={{ backgroundColor: isDarkModeOn ? "#892CDC" : "#000" }} onClick={() => bookFreeTrial(index)}>Book Free Trial</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

export default TableView;
