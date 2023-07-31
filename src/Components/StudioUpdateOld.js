import React from 'react'
import { Card, Button, Row, Col , Form,Accordion,Table,Toast } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection,where,getDocs,query } from "firebase/firestore";
import { COLLECTIONS } from '../constants';
import AlertPopup from './AlertPopup';
import StudioTable from './StudioTable';

function StudioUpdate({studio, setStudio,studioId, setStudioId}) {
    const [selectedStudio, setSelectedStudio] = useState(null);
    const [tableData, setTableData] = useState(
      { className: '', danceForms: '', days: '', time: '', instructors: '', status: '' },
    );
    const [showUpdateSuccessAlert, setShowUpdateSuccessAlert] = useState(false);
    const [showUpdateErrorAlert, setShowUpdateErrorAlert] = useState(false);

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

    const handleSelectStudio = async (event) => {
        event.preventDefault()
        const selected = event.target.value;
        const selectedId = selected.split(":").pop().trim();
        console.log("&**&(*",selected,selectedId)
        // Perform the fetch from Firebase using the selectedId
        try {
          
          const studioDoc = await getDoc(doc(db, COLLECTIONS.STUDIO, selectedId));
          if (studioDoc.exists) {
            setSelectedStudio(studioDoc.data());
            if(selectedStudio.tableData){
              setTableData(selectedStudio.tableData);
            }
            console.log(selectedStudio)
          } else {
            setSelectedStudio(null); // No matching studio found
          }
        } catch (error) {
          console.error("Error fetching studio data:", error,selectedId);
        }
      };
     
      const handleUpdateStudio = async (event) => {
        console.log("update")
        event.preventDefault();
        console.log("update")
        // Extract the studio ID from the nameId value
          const nameIdLocal = event.target.nameId.value;
          const indexOfColon = nameIdLocal.lastIndexOf(":");
          const studioId = nameIdLocal.substring(indexOfColon + 1).trim(); // Get the selected studio ID
          console.log("studio id",studioId)
        if (!studioId) {
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
        const description = event.target.description.value;

        try {
          // Update the studio document with the new values
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
    
      // Move the tableData setting logic inside this useEffect
    useEffect(() => {
      if (selectedStudio && selectedStudio.tableData) {
        setTableData(selectedStudio.tableData);
      }
    }, [selectedStudio]);
    
    console.log("studio :",studio)

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
                defaultValue={selectedStudio ? selectedStudio.description : ''}
              />
            </Form.Group>
              <br></br>
              <span>Time Table Of dance classes</span>
              <StudioTable tableData={tableData} setTableData={setTableData}/>
              <br></br>
            
            <Button variant="primary" type="submit">
              Update Studio
            </Button>
          </Form>
           
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
  )
}

export default StudioUpdate
