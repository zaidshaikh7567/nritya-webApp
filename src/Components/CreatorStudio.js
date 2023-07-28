import React from 'react';
import { Card, Button, Row, Col , Form,Accordion,Table } from 'react-bootstrap';
 
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StudioCard from './StudioCard';
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection,where,getDocs,query } from "firebase/firestore";
import { COLLECTIONS } from '../constants';
import StudioTable from './StudioTable';
import ImageUpload from './ImageUpload';
 
function CreatorStudio() {
  const [studio, setStudio] = useState([]);
  const [studioId, setStudioId] = useState([]);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [newStudioId, setNewStudioId] = useState("")
  const [tableData, setTableData] = useState([
    { className: '', danceForms: '', days: '', time: '', instructors: '', status: '' },
  ]);
 
 
  useEffect(() => {
    const getStudioCreated = async ()=>{
      const q = query(collection(db, COLLECTIONS.STUDIO), where("UserId", "==", localStorage.getItem('userInfo')).UserId    );
      const querySnapshot = await getDocs(q);
      console.log("Studios : ",querySnapshot)
      const studiosOfUser = querySnapshot.docs.filter(doc => doc.data().studioName).map(doc => 
        { const data = doc.data();
          return {
            id: doc.id, // Include the document ID in the data
            ...data
          };
      });
      localStorage.setItem("StudioCreated", JSON.stringify(studiosOfUser));
      setStudio(studiosOfUser);
      setStudioId(studiosOfUser.map((studio) => (String(studio.studioName) + " :" + String(studio.id))));
      console.log(studio)
      console.log("studioId",studioId)
    };
      
      getStudioCreated();
    },[setStudio]);
  
  const handleAddStudio = async (event) => {
    event.preventDefault();
    const title = event.target.studioName.value;
    if (!title) {
      return;
    }
    console.log(JSON.parse(localStorage.getItem('userInfo')))
    const creatorRef = doc(db, "User", JSON.parse(localStorage.getItem('userInfo')).UserId);
    let isPremium=true
    
        
    //body: event.target.body.value,
    try {
        
        const studioRef = await addDoc(collection(db, COLLECTIONS.STUDIO), {
          studioName: event.target.studioName.value,
          price: event.target.price.value,
          danceStyles: event.target.danceStyles.value,
          address: event.target.address.value,
          timing: event.target.timing.value,
          instructors: event.target.instructors.value,
          status: event.target.status.value,
          contactNumber: event.target.contactNumber.value,
 
          enrolledId:[],
          reviews:[],
          author: JSON.parse(localStorage.getItem('userInfo')).displayName,
          UserId: JSON.parse(localStorage.getItem('userInfo')).UserId,
          description:  event.target.description.value,
          isPremium: isPremium,
        });
        console.log("Studio added successfully");
        setNewStudioId(studioRef.id)
        try {
          const tableDataCollectionRef = collection(db, COLLECTIONS.STUDIO, studioRef.id, "TableData");
 
          // Iterate over the tableData array and add each map as a separate document in the subcollection
          for (const data of tableData) {
            await addDoc(tableDataCollectionRef, data);
          }
 
          console.log("Table data added successfully");
        } catch (error) {
          console.error('Error adding studio and table data:', error);
        }
        
        const userRef = doc(db, "User", JSON.parse(localStorage.getItem('userInfo')).UserId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          console.log("User there",userSnap.data());
          if(userSnap.data() != null){
            await updateDoc(userRef,{
              
              StudioCreated: [...userSnap.data().StudioCreated,studioRef.id]
            });
            console.log("Studio added back successfully");
          }else{
            console.log("userSnap.data() null")
          }
        } else {
          console.log("User not found but studio created... error");
        }
      
    } catch (error) {
      console.error("Error adding studio: ", error);
    }
 
  };
 
  const handleSelectStudio = async (event) => {
    const selected = event.target.value;
    const selectedId = selected.split(":").pop().trim();;
    // Perform the fetch from Firebase using the selectedId
    try {
      
      const studioDoc = await getDoc(doc(db, COLLECTIONS.STUDIO, selectedId));
      if (studioDoc.exists) {
        setSelectedStudio(studioDoc.data());
        console.log(selectedStudio)
      } else {
        setSelectedStudio(null); // No matching studio found
      }
    } catch (error) {
      console.error("Error fetching studio data:", error,selectedId);
    }
  };
 
  const handleUpdateStudio = (event) => {
    event.preventDefault();
    // Your update logic here
  };
 
  
 
  
  
 
  
  
  useEffect(() => {
      setStudio(JSON.parse(localStorage.getItem('userInfo')))
      
  }, []);
  console.log("studio :",studio)
  return (
    <div>
       <br></br>
      <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header >
          Add a new course or studio:
        </Accordion.Header> 
         
        <Accordion.Body>
            <Form onSubmit={handleAddStudio}>
              <Form.Group controlId="formBasicTitle">
                <Form.Label>Studio Name</Form.Label>
                <Form.Control type="textarea" rows={1} placeholder="Enter studio name" name="studioName" />
              </Form.Group>
 
              <Form.Group controlId="formBasicBody">
                <Form.Label>Price Starts from</Form.Label>
                <Form.Control as="textarea" rows={1} placeholder="Enter price" name="price" />
              </Form.Group>
              <Form.Group controlId="formBasicBody">
                <Form.Label>Dance Styles</Form.Label>
                <Form.Control as="textarea" rows={1} placeholder="Enter names of dance forms seperated by commas like salsa, foreign, couple" name="danceStyles" />
              </Form.Group>
 
              <Form.Group controlId="formBasicBody">
                <Form.Label>Address</Form.Label>
                <Form.Control as="textarea" rows={1} placeholder="Enter address" name="address" />
              </Form.Group>
              <Form.Group controlId="formBasicBody">
                <Form.Label>Contact Numer</Form.Label>
                <Form.Control as="textarea" rows={1} placeholder="Enter contact number for calling and whatsapp" pattern="[0-9+]+"
    required name="contactNumber" />
              </Form.Group>
              <Form.Group controlId="formBasicBody">
                <Form.Label>Timing</Form.Label>
                <Form.Control as="textarea" rows={1} placeholder="Enter Studio time eg 6 am to 1 pm" name="timing" />
              </Form.Group>
 
              <Form.Group controlId="formBasicBody">
                <Form.Label>Instructor(s)</Form.Label>
                <Form.Control as="textarea" rows={1} placeholder="Enter names of instructors seperated by commas like John , Stephen" name="instructors" />
              </Form.Group>
              
 
              <Form.Group controlId="formBasicStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" name="status">
                  <option value="active">Open</option>
                  <option value="inactive">Closed</option>
                </Form.Control>
              </Form.Group>
              <br></br>
              <Form.Group controlId="formBasicBody">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter body" name="description" />
              </Form.Group>
              <br></br>
              <span>Time Table Of dance classes</span>
              <StudioTable tableData={tableData} setTableData={setTableData}/>
              <br></br>
              
              <Button variant="primary" type="submit">
                Add Studio
              </Button>
            </Form>
            
            
            <>
            {
              newStudioId === ""?(""):(<p>New Studio Created with id {newStudioId}. Now u can upload images regarding them</p>)
            }
            </>
 
            <span>Images</span>
              <ImageUpload studioId={newStudioId}></ImageUpload>
            <br></br>
 
          </Accordion.Body>
          </Accordion.Item>
 
          <Accordion.Item eventKey="1">
          <Accordion.Header>Update studio</Accordion.Header>
          <Accordion.Body>
          <Form onSubmit={handleUpdateStudio}>
            <Form.Group controlId="formBasicTitle">
              <Form.Label>Id</Form.Label>
              <Form.Control as="select" name="id" onChange={handleSelectStudio}>
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
 
            <Form.Group controlId="formBasicTitle">
    <Form.Label>Studio Name</Form.Label>
    <Form.Control
      type="textarea"
      rows={1}
      placeholder="Enter studio name"
      name="studioName"
      defaultValue={selectedStudio ? selectedStudio.studioName : ''}
    />
  </Form.Group>
 
  <Form.Group controlId="formBasicBody">
    <Form.Label>Price Starts from</Form.Label>
    <Form.Control
      as="textarea"
      rows={1}
      placeholder="Enter price"
      name="price"
      defaultValue={selectedStudio ? selectedStudio.price : ''}
    />
  </Form.Group>
 
  <Form.Group controlId="formBasicBody">
    <Form.Label>Dance Styles</Form.Label>
    <Form.Control
      as="textarea"
      rows={1}
      placeholder="Enter names of dance forms separated by commas like salsa, foreign, couple"
      name="danceStyles"
      defaultValue={selectedStudio ? selectedStudio.danceStyles : ''}
    />
  </Form.Group>
 
  <Form.Group controlId="formBasicBody">
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
 
  <Form.Group controlId="formBasicBody">
    <Form.Label>Timing</Form.Label>
    <Form.Control
      as="textarea"
      rows={1}
      placeholder="Enter Studio time eg 6 am to 1 pm"
      name="timing"
      defaultValue={selectedStudio ? selectedStudio.timing : ''}
    />
  </Form.Group>
 
  <Form.Group controlId="formBasicBody">
    <Form.Label>Instructors</Form.Label>
    <Form.Control
      as="textarea"
      rows={1}
      placeholder="Enter names of instructors separated by commas like John, Stephen"
      name="instructors"
      defaultValue={selectedStudio ? selectedStudio.instructors : ''}
    />
  </Form.Group>
 
  <Form.Group controlId="formBasicStatus">
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
 
  <Form.Group controlId="formBasicBody">
    <Form.Label>Description</Form.Label>
    <Form.Control
      as="textarea"
      rows={3}
      placeholder="Enter body"
      name="description"
      defaultValue={selectedStudio ? selectedStudio.description : ''}
    />
  </Form.Group>
            
            <Button variant="primary" type="submit">
              Update Studio
            </Button>
          </Form>
           
          </Accordion.Body>
        </Accordion.Item>
 
      </Accordion>
      <br></br>
 
      <h3>Your Studios:</h3>
 
       <ul>
      
 
    <br/>
      <Row xs={1} md={2} lg={2} className="g-4">
        {studio.length > 0 ? (
          studio.map((studio, index) => (
            <Col key={index}>
              {console.log("creator studio ",studio)}
              <StudioCard studioName={studio.studioName} studioAddress={studio.address} studioInstructors={studio.instructors} studioPrice={studio.price} studioTiming={studio.timing} studioDanceStyles={studio.danceStyles} studioContactNumber={studio.contactNumber} studioId={studio.id}/>
            </Col>
          ))
        ) : (
          <p>No studio yet!</p>
        )}
      </Row>
 
      </ul>
 
 
      
    </div>
  )
}
 
export default CreatorStudio