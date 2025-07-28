import React, { useState } from 'react';
import './TableView.css';
import { Button, Table, Modal, Spinner, Card } from 'react-bootstrap';
import MUIButton from "@mui/material/Button";
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import axios from 'axios';
import { BASEURL_PROD } from '../constants';
import logo from './../logo.png';
import { Typography } from '@mui/material';
import { useSnackbar } from '../context/SnackbarContext';


function processInstructors(instructors) {
  if (Array.isArray(instructors)) {
      // If the input is an array of strings
      return instructors.map(item => item.split('-')[0]).join(',');
  } else if (typeof instructors === 'string') {
      // If the input is a single string
      return instructors.split('-')[0];
  } else {
      // If the input is neither a string nor an array, return as is or empty string
      return instructors || '';
  }
}


const TableView = ({ studioData, studioId }) => {
  const showSnackbar = useSnackbar();
  console.log("TableView",studioData,studioId)
  const { currentUser } = useAuth();
  const userId = currentUser ? currentUser.uid : null;
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const isSmallScreen =true;
  //useMediaQuery('(max-width:800px)');

  //console.log("Small Screen Check",isSmallScreen)
  console.log(studioData,BASEURL_PROD)

  const bookFreeTrial = (classIndex) => {
    //return showSnackbar("Booking hasn't started yet", "info");         

    const endpoint_url = BASEURL_PROD + "bookings/freeTrial/";
    if (!userId) {
      alert("Please Login");
      return;
    }
    setShowModal(true);
    setLoading(true);
    console.log("bookFreeTrial")
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
      setModalMessage('Error occurred while booking. Please try again later.');
      console.error('Error in bookFreeTrial:', error);
    });

    setTimeout(() => {
      setShowModal(false);
    }, 20000); // 20 seconds timeout
  };
  const commonCellStyle = {
    backgroundColor: isDarkModeOn ? "#444" : "white",
    color: isDarkModeOn ? "white" : "black",
    textAlign: "center",
  };

  const commonHeaderStyle = {
    textAlign: "center",
  };

  console.log("=======================", Object.values(studioData?.tableData || {}).map((classItem) => classItem?.classCategory));


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
        {
          isSmallScreen?(
            <div className='horizontal-scroll-wrapper-table' style={{backgroundColor: isDarkModeOn?'#202020':'white'}} >
              {Object.keys(studioData.tableData).map((key, index) => {
                const classItem = studioData.tableData[key];
                let instructors = "N/A"
              if(classItem.instructors){
                instructors = processInstructors(classItem.instructors);
              }
                return (
                  <Card key={index} style={{ minWidth: "500px",paddingLeft:"0.5rem",border:'none', backgroundColor: isDarkModeOn?'#202020':'white' }}>
                  <Table bordered className={`custom-table ${isDarkModeOn ? 'dark-mode' : ''}`} style={{borderRadius:"5px" }}>
                  <tbody>
                        {[
                          { label: 'Class Name', value: classItem.className || "" },
                          { label: 'Dance Forms', value: classItem.danceForms || "" },
                          { label: 'Days', value: classItem.days || "" },
                          { label: 'Time', value: classItem.time || "" },
                          { label: 'Instructors', value: instructors || "" },
                          { label: 'Level', value: classItem.level || "N/A" },
                          { label: 'Fee (₹)', value: classItem.fee || "N/A" },
                          { label: 'Categories', value: Array.isArray(classItem.classCategory) ? (classItem.classCategory?.[0] || "N/A"): (classItem.classCategory || "N/A")},
                          {
                            label: 'Book Free Trial',
                            value: (
                              <>
                              <MUIButton disabled={classItem.freeTrial === "false" || classItem.freeTrial === false || classItem.freeTrial === ""} onClick={() => {
                                      /* if (classItem?.freeTrial && classItem.freeTrial !== "false" && classItem.freeTrial !== "") { */
                                        bookFreeTrial(index);  // Only trigger booking if free trial is available
                                      /* } */
                                    }} sx={{ width: '90%', m: 1, color: "white", bgcolor: '#735EAB', "&:hover": { bgcolor: "#735EAB" }, "&:active": { bgcolor: "#735EAB" }, "&:disabled": { bgcolor: 'gray', color: 'white' } }} variant="text">{(classItem.freeTrial === "false" || classItem.freeTrial === false || classItem.freeTrial === "")
                                        ? "Free Trial Unavailable"
                                        : "BOOK"}</MUIButton>
                               </>
                            ),
                          },                                                   
                        ].map((item, i) => (
                          <tr key={i}>
                            <td style={{ color: "white",textAlign: 'center', backgroundColor: isDarkModeOn ? "#121212" : "black", padding: item.label === 'Book Free Trial' ? "25px 30px" : '15px 30px' }}>
                              {item.label}
                            </td>
                            <td
                              style={{
                                backgroundColor: isDarkModeOn ? "#444" : "#f0f0f0",
                                color: isDarkModeOn ? "white" : "black",
                                textAlign: 'center',
                                padding: item.label === 'Book Free Trial' ? 0 : '15px 30px',
                              }}
                            >
                              {item.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>


                  </Table>
                </Card>

                )
              })}
            </div>

          ):(
          <Table bordered className={`custom-table ${isDarkModeOn ? 'dark-mode' : ''}`}>
          <thead>
            <tr>
              <th style={commonHeaderStyle}>Class Name</th>
              <th style={commonHeaderStyle}>Dance Forms</th>
              <th style={commonHeaderStyle}>Days</th>
              <th style={commonHeaderStyle}>Time</th>
              <th style={commonHeaderStyle}>Instructors</th>
              <th style={commonHeaderStyle}>Level</th>
              <th style={commonHeaderStyle}>Fee (₹) </th>
              <th style={commonHeaderStyle}>Book Free Trial</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(studioData.tableData).map((key, index) => {
              const classItem = studioData.tableData[key];
              let instructors = "N/A"
              if(classItem.instructors){
                instructors = processInstructors(classItem.instructors);
              }
              return (
                <tr key={index}>
                  <td style={commonCellStyle}>{classItem.className ? classItem.className : ""}</td>
                  <td style={commonCellStyle}>{classItem.danceForms ? classItem.danceForms : ""}</td>
                  <td style={commonCellStyle}>{classItem.days ? classItem.days : ""}</td>
                  <td style={commonCellStyle}>{classItem.time ? classItem.time : ""}</td>
                  <td style={commonCellStyle}>{instructors}</td>
                  <td style={commonCellStyle}>{classItem.level ? classItem.level : "N/A"}</td>
                  <td style={commonCellStyle} >{classItem.fee ? classItem.fee : "N/A"}</td>
                  <td  className='custom-btn-cell' style={commonCellStyle}  onClick={() => bookFreeTrial(index)}>
                  <Button 
                      style={{
                        border: 'none',
                        borderColor: "none",
                        background: 'transparent',
                        padding:  "0",
                      }}
                      
                    >
                      <Typography sx={{color: isDarkModeOn ? 'white' : 'black'}} fontWeight="bold">
                        BOOK 
                      </Typography>

                    </Button>

                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>)
        }
      
    </>
  );
};

export default TableView;
