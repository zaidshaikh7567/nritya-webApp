import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Form, Accordion, Table, Toast } from 'react-bootstrap';
import { db } from '../config';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { COLLECTIONS } from '../constants';
import AlertPopup from './AlertPopup';
import ImageUpload from './ImageUpload';
import { STORAGES } from '../constants';
import MapsInput from './MapsInput';

function isMapOfMaps(data) {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return false; // Not an object (map)
  }

  for (const key in data) {
    if (typeof data[key] !== 'object' || data[key] === null || Array.isArray(data[key])) {
      return false; // Value is not an object (map)
    }
  }

  return true; // It's a map of maps
}

const encodeToUnicode = (text) => {
  const textEncoder = new TextEncoder();
  const utf8Encoded = textEncoder.encode(text);
  return String.fromCharCode(...utf8Encoded);
};

// Function to decode a Unicode (UTF-8) encoded string back to the original text
const decodeUnicode = (unicodeString) => {
  const utf8Encoded = unicodeString.split('').map((c) => c.charCodeAt(0));
  const textDecoder = new TextDecoder();
  return textDecoder.decode(new Uint8Array(utf8Encoded));
};

function StudioUpdate({ studio, setStudio, studioId, setStudioId }) {
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [selectedStudioId, setSelectedStudioId] = useState(null);
  const [tableData, setTableData] = useState({
    0:{
      className: '',
      danceForms: '',
      days: '',
      time: '',
      instructors: '',
      status: ''
    }
});
  const [showUpdateSuccessAlert, setShowUpdateSuccessAlert] = useState(false);
  const [showUpdateErrorAlert, setShowUpdateErrorAlert] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    // Fetch the list of studios created by the user from localStorage
    const studiosOfUser = JSON.parse(localStorage.getItem('StudioCreated')) || [];
    setStudio(studiosOfUser);

    // Create the list of studio IDs with the format "studioName: studioId"
    const studioIdList = studiosOfUser.map((studio) => `${studio.studioName} : ${studio.id}`);
    setStudioId(studioIdList);

    console.log("studio:", studio);
    console.log("studioId", studioId);
  }, []);

  useEffect(() => {
    // Fetch data for the selected studio when studioId changes
    if (selectedStudio) {
      console.log("Studio id changes",selectedStudio)
    }
  }, [selectedStudio]);

  const handleSelectStudio = async (event) => {
    event.preventDefault();
    const selected = event.target.value;
    const selectedId = selected.split(":").pop().trim();
    console.log("&**&(*", selected, selectedId);
    setSelectedStudioId(selectedId);
    setSelectedLocation(selectedStudio && selectedStudio.geolocation ? selectedStudio.geolocation : null);
    try {
      const studioDoc = await getDoc(doc(db, COLLECTIONS.STUDIO, selectedId));
      if (studioDoc.exists) {
        setSelectedStudio(studioDoc.data());
        if (studioDoc.data().tableData) {
          setTableData(studioDoc.data().tableData);
          console.log("We got...",tableData,Array.isArray(tableData),isMapOfMaps(tableData))
        } else {
          setTableData({
            0:{
              className: '',
              danceForms: '',
              days: '',
              time: '',
              instructors: '',
              status: ''
            }
        });
        }
      } else {
        setSelectedStudio(null); // No matching studio found
      }
    } catch (error) {
      console.error("Error fetching studio data:", error, selectedId);
    }
  };

  const handleUpdateStudio = async (event) => {
    event.preventDefault();
    const nameIdLocal = event.target.nameId.value;
    const indexOfColon = nameIdLocal.lastIndexOf(":");
    const studioId = nameIdLocal.substring(indexOfColon + 1).trim();
    console.log(studioId)

    if (!studioId) {
      console.log("Invalid or empty studio id")
      return;
    }

    const studioName = event.target.studioName.value;
    const price = event.target.price.value;
    const danceStyles = event.target.danceStyles.value;
    const address = event.target.address.value;
    const timing = event.target.timing.value;
    const instructors = event.target.instructors.value;
    const status = event.target.status.value;
    const contactNumber = event.target.contactNumber.value;
    const description = encodeToUnicode(event.target.description.value);
    const geolocation = selectedLocation;

    try {
      // Update the studio document with the new values
      console.log(description,geolocation)
      const studioRef = doc(db, COLLECTIONS.STUDIO, studioId);
      await updateDoc(studioRef, {
        studioName,
        price,
        danceStyles,
        address,
        timing,
        instructors,
        status,
        contactNumber,
        description,
        tableData, // Save the tableData along with other fields
        geolocation
      });

      console.log("Studio updated successfully");
      setShowUpdateSuccessAlert(true);
      setShowUpdateErrorAlert(false);
    } catch (error) {
      console.error("Error updating studio: ", error);
      setShowUpdateSuccessAlert(false);
      setShowUpdateErrorAlert(true);
    }
    // Reset input fields to their initial values when a new studio is selected
    document.getElementById("updateStudioForm").reset();
  };

  const handleAddColumn = () => {
    setTableData((prevData) => {
      const newData = prevData.map((row) => ({
        ...row,
        [Object.keys(row).length]: ''
      }));
      return newData;
    });
  };

  const handleAddRow = () => {
    setTableData((prevData) => {
      const newRowKey = Object.keys(prevData).length; // Use the current number of rows as the new row key
      return { ...prevData, [newRowKey]: { ...tableData[0] } };
    });
  };

  const handleRemoveRow = (index) => {
    setTableData((prevData) => {
      const newData = { ...prevData };
      delete newData[index];
      return newData;
    });
  };

  const handleTableChange = (index, field, value) => {
    setTableData((prevData) => {
      return {
        ...prevData,
        [index]: {
          ...prevData[index],
          [field]: value
        }
      };
    });
  };

  return (
    <div>
      <br></br>
      <Accordion defaultActiveKey="1">
        <Accordion.Item eventKey="1">
          <Accordion.Header>Update studio</Accordion.Header>
          <Accordion.Body>
            <Form id="updateStudioForm" onSubmit={handleUpdateStudio}>
              <Form.Group controlId="formBasicUpdate">
                <Form.Label>Id</Form.Label>
                <Form.Control as="select" name="nameId" onChange={handleSelectStudio}>
                  <option value="">Select a studio...</option>
                  {studioId && studioId.length > 0 ? (
                    studioId.map((studioItem) => (
                      <option key={studioItem} value={studioItem}>
                        {studioItem}
                      </option>
                    ))
                  ) : (
                    <option value="">No studio yet!</option>
                  )}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formBasicUpdate">
                <Form.Label>Studio Name</Form.Label>
                <Form.Control
                  type="textarea"
                  rows={1}
                  placeholder="Enter studio name"
                  name="studioName"
                  defaultValue={selectedStudio ? selectedStudio.studioName : ''}
                />
              </Form.Group>

              <Form.Group controlId="formBasicUpdate">
                <Form.Label>Price Starts from</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  placeholder="Enter price"
                  name="price"
                  defaultValue={selectedStudio ? selectedStudio.price : ''}
                />
              </Form.Group>

              <Form.Group controlId="formBasicUpdate">
                <Form.Label>Dance Styles</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  placeholder="Enter names of dance forms separated by commas like salsa, foreign, couple"
                  name="danceStyles"
                  defaultValue={selectedStudio ? selectedStudio.danceStyles : ''}
                />
              </Form.Group>
              <Form.Group controlId="formBasicUpdate">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                placeholder="Enter address"
                name="address"
                defaultValue={selectedStudio ? selectedStudio.address : ''}
              />
            </Form.Group>

            <Form.Group controlId="formBasicBody">
                <Form.Label>Save exact Address</Form.Label>
                <MapsInput selectedLocation={selectedStudio && selectedStudio.geolocation ? selectedStudio.geolocation : selectedLocation}
                            setSelectedLocation={setSelectedLocation} />
            </Form.Group>
          
            <Form.Group controlId="formBasicUpdate">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                placeholder="Enter contact number for calling and WhatsApp"
                pattern="[0-9+]+"
                required
                name="contactNumber"
                defaultValue={selectedStudio ? selectedStudio.contactNumber : ''}
              />
            </Form.Group>
          
            <Form.Group controlId="formBasicUpdate">
              <Form.Label>Timing</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                placeholder="Enter Studio time eg 6 am to 1 pm"
                name="timing"
                defaultValue={selectedStudio ? selectedStudio.timing : ''}
              />
            </Form.Group>
          
            <Form.Group controlId="formBasicUpdate">
              <Form.Label>Instructors</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                placeholder="Enter names of instructors separated by commas like John, Stephen"
                name="instructors"
                defaultValue={selectedStudio ? selectedStudio.instructors : ''}
              />
            </Form.Group>
          
            <Form.Group controlId="formBasicUpdate">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                defaultValue={selectedStudio ? selectedStudio.status : 'active'}
              >
                <option value="active">Open</option>
                <option value="inactive">Closed</option>
              </Form.Control>
            </Form.Group>
          
            <Form.Group controlId="formBasicUpdate">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter body"
                name="description"
                defaultValue={selectedStudio ? decodeUnicode(selectedStudio.description) : ''}
              />
            </Form.Group>
              <br></br>
            <span>Time Table Of dance classes</span>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Dance Forms</th>
                  <th>Days</th>
                  <th>Time</th>
                  <th>Instructors</th>
                  <th>Status</th>
                  <th>
                    
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(tableData).map((rowKey, index) => (
                  <tr key={rowKey}
                  >
                    <td>
                      <Form.Control
                        type="text"
                        value={tableData[rowKey].className}
                        onChange={(e) => handleTableChange(rowKey, 'className', e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={tableData[rowKey].danceForms}
                        onChange={(e) => handleTableChange(rowKey, 'danceForms', e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={tableData[rowKey].days}
                        onChange={(e) => handleTableChange(rowKey, 'days', e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={tableData[rowKey].time}
                        onChange={(e) => handleTableChange(rowKey, 'time', e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={tableData[rowKey].instructors}
                        onChange={(e) => handleTableChange(rowKey, 'instructors', e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={tableData[rowKey].status}
                        onChange={(e) => handleTableChange(rowKey, 'status', e.target.value)}
                      />
                    </td>
                    <td>
                      {index === 0 ? (
                        <Button variant="primary" onClick={handleAddRow}>
                          Add Row
                        </Button>
                      ) : (
                        <Button variant="danger" onClick={() => handleRemoveRow(rowKey)}>
                          Remove Row
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </Table>

              <br></br>

              <Button variant="primary" type="submit">
                Update Studio
              </Button>
            </Form>
            {studioId && studioId.length > 0 && selectedStudioId && (
              <>
                <div>
                  <span>Images</span>
                  <ImageUpload entityId={selectedStudioId} storageFolder={STORAGES.STUDIOIMAGES} />
                </div>
                <br />
                <div>
                  <span>Studio Icon</span>
                  <ImageUpload entityId={selectedStudioId} storageFolder={STORAGES.STUDIOICON} maxImageCount={1} />
                </div>
                <br />
              </>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
      

     
      {showUpdateSuccessAlert && (
        <AlertPopup
          type="info"
          message="Studio Updated successfully"
          timeOfDisplay={3000}
          fontSize="10px"
          fontWeight="bold"
        />
      )}
      {showUpdateErrorAlert && (
        <AlertPopup
          type="warning"
          message="Studio Update failed"
          timeOfDisplay={3000}
          fontSize="10px"
          fontWeight="bold"
        />
      )}
    </div>
  );
}

export default StudioUpdate;
