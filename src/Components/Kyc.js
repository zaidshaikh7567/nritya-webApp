import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import {useEffect } from 'react';
import TrackingDetails from './TrackingDetails';
import { STATUSES,COLLECTIONS } from "./../constants.js";

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
          status:STATUSES.SUBMITTED,
        });
        console.log("Workshop added successfully");
        
        const userRef = doc(db, COLLECTIONS.USER, JSON.parse(localStorage.getItem('userInfo')).UserId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          console.log("User there",userSnap.data());
          if(userSnap.data() != null){
            await updateDoc(userRef,{
      
              KycIdList: {...userSnap.data().KycIdList,[docRef.id]:STATUSES.SUBMITTED}
            });
            console.log("Workshop added back successfully");
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
        console.log("kyc1")
        console.log(docSnap.data().KycIdList)
        setKycList(docSnap.data().KycIdList);
        console.log("kyc list : ",kycList)
      } else {
        console.log("kyc2")
        setKycList([]);
      }
    }

    getKycList();
  }, []);

  const orderStatus ="dispatched"

  return (
    <div>
      <h1>Kyc Form</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicFirstName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter  name"
            name="name"
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicLastName">
          <Form.Label>AADHAR UID/Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter aadhar number"
            name="uid"
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email"
            name="age"
            
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            name="address"
            
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicCity">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            name="city"
            
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicState">
          <Form.Label>State</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter state"
            name="state"
            
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Button variant="info" href='/profile'>
          Profile
        </Button>
      </Form>
        <br/>
        <br/>

        {kycList && Object.keys(kycList).length > 0 &&
          <div>
            <h2>Kyc Application(s)</h2>
            {Object.entries(kycList).map(([kycId, kycStatus]) => (
              <div key={kycId}>
                <TrackingDetails  status={kycStatus} kycId={kycId}/>
              </div>
            ))}
            
          </div>
        }

    </div>
  );
}

export default Kyc;
