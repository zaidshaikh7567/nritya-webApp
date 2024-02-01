// TableView.js
import React from 'react';
import './TableView.css';
import { Button, Table } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import axios from 'axios';
import { BASEURL_PROD } from '../constants';


const TableView = ({ studioData, studioId }) => {
  const { currentUser } = useAuth();
  const userId = currentUser? currentUser.uid: null;
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  console.log(studioData,  currentUser)

  const bookFreeTrial = (classIndex) => {
    const endpoint_url = BASEURL_PROD+"bookings/freeTrial/"
    console.log(endpoint_url)
    if(!userId){
      alert("Please Login")
      return
    }
    axios.post(endpoint_url, {
      studioId: studioId,
      classIndex: classIndex,
      userId: userId,  // Make sure userId is defined
    })
    .then(response => {
      console.log(response.data);
      if (response.data.nSuccessCode === 201) {
          alert("Booked Successfully. Booking Id: " + response.data["Booking Id"]);
      }else if(response.data.nSuccessCode === 202){
        alert("You have booked before. Booking Id: " + response.data["Booking Id"]);
      }
    })
    .catch(error => {
      console.error('Error in bookFreeTrial2:', error);
    });
  };
  
  

  return (
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
              <td>{<Button style={{backgroundColor: isDarkModeOn?"#892CDC":"#000"}} onClick={() => bookFreeTrial(index)}>Book Free Trail</Button>}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default TableView;
