import React, { useState } from 'react';
import { Form, Button, Container,Row,Col } from 'react-bootstrap';
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import {useEffect } from 'react';
import TrackingDetails from './TrackingDetails';
import { STATUSES,COLLECTIONS } from "./../constants.js";
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { Stepper, Step, StepLabel, StepContent } from '@mui/material';
import KycStepper from './KycStepper.js';

function Kyc() {
  const [formData, setFormData] = useState({
    name: '',
    uid: '',
    age: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [kycList, setKycList] = useState(null);
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const uuid = event.target.uid.value;
    if (!uuid) {
      return;
    }
    console.log("hi#")
    try {
        console.log(event.target.name.value,JSON.parse(localStorage.getItem('userInfo')).UserId)
        const docRef = await addDoc(collection(db, COLLECTIONS.USER_KYC), {
          name: event.target.name.value,
          uid: event.target.uid.value,
          author: JSON.parse(localStorage.getItem('userInfo')).displayName,
          age: event.target.age.value,
          address: event.target.address.value,
          UserId: JSON.parse(localStorage.getItem('userInfo')).UserId,
          city: event.target.city.value,
          state: event.target.state.value,
          phoneNumber : event.target.phoneNumber.value,
          status:STATUSES.SUBMITTED,
        });
        

        
        const userRef = doc(db, COLLECTIONS.USER, JSON.parse(localStorage.getItem('userInfo')).UserId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          console.log("User there",userSnap.data());
          if(userSnap.data() != null){
            await updateDoc(userRef,{
      
              KycIdList: {...userSnap.data().KycIdList,[docRef.id]:STATUSES.SUBMITTED}
            });
            console.log("Kyc added back successfully");
            alert("Kyc added successfully");
            event.target.reset();
          }else{
            console.log("userSnap.data() null")
          }
        } else {
          console.log("User not found but workshop created... error");
        }
      
    } catch (error) {
      console.error("Error adding workshop: ", error);
    }
  };

  useEffect(() => {
    const getKycList = async () => {
      const docRef = doc(db, COLLECTIONS.USER, JSON.parse(localStorage.getItem('userInfoFull')).uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setKycList(docSnap.data().KycIdList);
        console.log("kyc list from KycJs : ",kycList)
      } else {
        console.log("kyc2")
        setKycList([]);
      }
    }

    getKycList();
  }, []);

  const orderStatus ="dispatched"

  return (
    <div style={{ backgroundColor: isDarkModeOn ? 'black' : 'white', color: isDarkModeOn ? 'white' : 'black' }}>
      
      <Container style={{ margin: 'auto',border: isDarkModeOn ? '1px solid white' : '1px solid black', borderRadius: '5px', padding: '20px'  }}>

      <Form onSubmit={handleSubmit}>
        <h1 style={{ backgroundColor: isDarkModeOn ? 'black' : 'white', color: isDarkModeOn ? 'white' : 'black' }}>Kyc Form</h1>
        <div className="row">
          <div className="col-md-6 col-lg-4">
            <Form.Group controlId="formBasicFirstName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                onChange={handleChange}
                required
                style={{ backgroundColor: isDarkModeOn ? '#181818' : '#e5e5e5', color: isDarkModeOn ? 'white' : 'black' }}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 col-lg-4">
            <Form.Group controlId="formBasicLastName">
              <Form.Label>AADHAR UID/Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter aadhar number"
                name="uid"
                onChange={handleChange}
                required
                style={{ backgroundColor: isDarkModeOn ? '#181818' : '#e5e5e5', color: isDarkModeOn ? 'white' : 'black' }}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 col-lg-4">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter age"
                name="age"
                onChange={handleChange}
                required
                style={{ backgroundColor: isDarkModeOn ? '#181818' : '#e5e5e5', color: isDarkModeOn ? 'white' : 'black' }}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 col-lg-4">
            <Form.Group controlId="formBasicNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter active phone number"
                name="phoneNumber"
                onChange={handleChange}
                required
                style={{ backgroundColor: isDarkModeOn ? '#181818' : '#e5e5e5', color: isDarkModeOn ? 'white' : 'black' }}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 col-lg-4">
            <Form.Group controlId="formBasicAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                name="address"
                onChange={handleChange}
                required
                style={{ backgroundColor: isDarkModeOn ? '#181818' : '#e5e5e5', color: isDarkModeOn ? 'white' : 'black' }}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 col-lg-4">
            <Form.Group controlId="formBasicCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                name="city"
                onChange={handleChange}
                required
                style={{ backgroundColor: isDarkModeOn ? '#181818' : '#e5e5e5', color: isDarkModeOn ? 'white' : 'black' }}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 col-lg-4">
            <Form.Group controlId="formBasicState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter state"
                name="state"
                onChange={handleChange}
                required
                style={{ backgroundColor: isDarkModeOn ? '#181818' : '#e5e5e5', color: isDarkModeOn ? 'white' : 'black' }}
              />
            </Form.Group>
          </div>
        </div>
        <Button variant="success" type="submit">
          Submit
        </Button>
      </Form>

      </Container>
        <br/>

        {kycList && Object.keys(kycList).length > 0 &&
        <>
        <Row style={{alignItems:'center'}}>
        <h3 style={{ backgroundColor: isDarkModeOn ? 'black' : 'white', color: isDarkModeOn ? 'white' : 'black' }}>Kyc Application(s)</h3>
        </Row>
         
          <KycStepper kycList={kycList}/>
         
          </>
        }

    </div>
  );
}

export default Kyc;
