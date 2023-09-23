import React from 'react'
import { Card, Button, Row, Col , Form,Accordion,Table,Toast } from 'react-bootstrap';
import { useState, useEffect, useMemo } from 'react';
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection,where,getDocs,query } from "firebase/firestore";
import { COLLECTIONS } from '../constants';
import StudioTable from './StudioTable';
import ImageUpload from './ImageUpload';
import { STORAGES } from '../constants';
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import MapsInput from './MapsInput';

function StudioAdd() {
    const [newStudioId, setNewStudioId] = useState("")
    const [tableData, setTableData] = useState(
      { className: '', danceForms: '', days: '', time: '', instructors: '', status: '' },
    );
    const [showToast, setShowToast] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
      
      const handleAddStudio = async (event) => {
        event.preventDefault();
        const title = event.target.studioName.value;
        if (!title) {
          return;
        }
        console.log(JSON.parse(localStorage.getItem('userInfo')))
        const creatorRef = doc(db, "User", JSON.parse(localStorage.getItem('userInfo')).UserId);
        let isPremium=true
        console.log()
            
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
              tableData: tableData,
              geolocation : selectedLocation,
              enrolledId:[],
              reviews:[],
              author: JSON.parse(localStorage.getItem('userInfo')).displayName,
              UserId: JSON.parse(localStorage.getItem('userInfo')).UserId,
              description:  event.target.description.value,
              isPremium: isPremium,
            });
            console.log("Studio added successfully");
            setNewStudioId(studioRef.id)
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
                <Form.Label>Save exact Address</Form.Label>
                <MapsInput selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}></MapsInput>
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
            <ImageUpload entityId={newStudioId} storageFolder={STORAGES.STUDIOIMAGES} ></ImageUpload>
          <br></br>
          <span>Studio Icon</span>
            <ImageUpload entityId={newStudioId} storageFolder={STORAGES.STUDIOICON} maxImageCount={1}></ImageUpload>
          <br></br>
 
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <br></br>
      
    </div>
  )
}

export default StudioAdd
