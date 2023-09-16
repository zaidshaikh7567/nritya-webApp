import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { adminLoginFn, adminLogoutFn } from '../reduxStore/adminLoginSlice';
import { STATUSES, COLLECTIONS } from '../constants';
import { db } from '../config';
import { collection, query, where, getDocs, doc, getDoc,updateDoc, setDoc } from 'firebase/firestore';
import { Card, Button, Form, Accordion } from 'react-bootstrap';
import { Nav, Container, Row, Col } from 'react-bootstrap';


function KycApproval() {

  const [pendingKyc, setPendingKyc] = useState({});
  const [reviewedKyc, setReviewedKyc] = useState({});


  useEffect(() => {
    const getPendingKyc = async () => {
      const q = query(collection(db, COLLECTIONS.USER_KYC), where('status', 'not-in', [STATUSES.VERIFIED, STATUSES.REJECTED]));
      const querySnapshot = await getDocs(q);
      const map = {};
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data(), '#', doc);
        map[doc.id] = JSON.stringify(doc.data());
      });
      setPendingKyc(map);
    };

    const getReviewedKyc = async () => {
      const q = query(collection(db, COLLECTIONS.USER_KYC), where('status', 'in', [STATUSES.VERIFIED]));
      const querySnapshot = await getDocs(q);
      const map = {};
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data(), '#', doc);
        map[doc.id] = JSON.stringify(doc.data());
      });
      setReviewedKyc(map);
    };

    getPendingKyc()
    getReviewedKyc()
  
  }, []);

  const handleAdminAction = async (event,kycID) => {
    event.preventDefault();
      const docRef = doc(db, COLLECTIONS.USER_KYC, kycID); //KycDoc
      
      console.log("admin action:",kycID,docRef.UserId);

      try {
        await updateDoc(docRef, {
          status: event.target.status.value,
        });
        
          console.log("Update completed");
          if(event.target.status.value === STATUSES.VERIFIED){
            // USER_KYC doc -> User Id -> User -> Creator Mode ON and KycList id:status update
            const kycSnap = await getDoc(docRef);
            if (kycSnap.exists()) {
              console.log("Doc there",kycSnap.data().UserId);
              const userRef = doc(db, COLLECTIONS.USER,kycSnap.data().UserId)
              await updateDoc(userRef,{
                  CreatorMode:true
              });
            } else {
              console.log("Error in updating")
            }
          }
        
      } catch (error) {
        console.error("Update error:", error);
      }

      // Parse the JSON string into an object before updating
      const updatedPendingKyc = { ...pendingKyc };
      const kycData = JSON.parse(updatedPendingKyc[kycID]);
      kycData.status = event.target.status.value;
      updatedPendingKyc[kycID] = JSON.stringify(kycData);
    
  };


  return (
    <div>
         <br/>
         <h1>Pending Reviews</h1>
         <br/>
         {
          Object.keys(pendingKyc).length === 0?(<h5>No Pending Reviews</h5>):(
            
            <>
            {
                Object.entries(pendingKyc).map(([kycId,Data],index) => {

                  const gradientStyle =
                        index % 6 === 0
                          ? yellowGradient
                          : index % 6 === 1
                          ? blueGradient
                          : index % 6 === 2
                          ? greenGradient
                          : index % 6 === 3
                          ? orangeGradient
                          : index % 6 === 4
                          ? blackGradient
                          : crimsonRedGradient;
                    return (
                    <Accordion key={kycId}>
                    <Accordion.Item eventKey={kycId}>
                        <Accordion.Header style={gradientStyle}>
                        KYC : {kycId}
                        </Accordion.Header> 
                        <Accordion.Body >
                            <p>Name : {JSON.parse(Data).name} </p>
                            <p>Age : {JSON.parse(Data).age} </p>
                            <p>City : {JSON.parse(Data).city} </p>
                            <p>State: {JSON.parse(Data).state}</p>
                            <p>UID: {JSON.parse(Data).uid}</p>
                            <p>Status: {JSON.parse(Data).status}</p>
                            <Card >
                            <Form onSubmit={(event) => handleAdminAction(event, kycId)}>
                                <Form.Group controlId="formBasicStatus">
                                    <Form.Label>Action</Form.Label>
                                    <Form.Control as="select" name="status">
                                    <option value={STATUSES.SUBMITTED}>{STATUSES.SUBMITTED}</option>
                                    <option value={STATUSES.VERIFIED}>{STATUSES.VERIFIED}</option>
                                    <option value={STATUSES.UNDER_REVIEW}>{STATUSES.UNDER_REVIEW} </option>
                                    <option value={STATUSES.REVIEWED}>{STATUSES.REVIEWED}</option>
                                    <option value={STATUSES.REJECTED}>{STATUSES.REJECTED}</option>
                                    </Form.Control>
                                </Form.Group>
    
                                <Button className="sm" variant="primary" type="submit">
                                    Action
                                </Button>
                            </Form>
                        </Card>
                        </Accordion.Body>
                        
                    </Accordion.Item>
                    </Accordion>
                    )
                })
            }
            </>
          )}
        <br/>
        <br/>
        {
          Object.keys(reviewedKyc).length === 0?(<h5>No Pending Reviews</h5>):(
            <>
                <h5>Reviewed Reviews</h5>
                  {
                      Object.entries(reviewedKyc).map(([kycId,Data]) => {
                          return (
                          <Accordion key={kycId}>
                          <Accordion.Item eventKey={kycId}>
                              <Accordion.Header >
                              KYC : {kycId}
                              </Accordion.Header> 
                              <Accordion.Body>
                                  <p>Name : {JSON.parse(Data).name} </p>
                                  <p>Age : {JSON.parse(Data).age} </p>
                                  <p>City : {JSON.parse(Data).city} </p>
                                  <p>State: {JSON.parse(Data).state}</p>
                                  <p>UID: {JSON.parse(Data).uid}</p>
                                  <p>Status: {JSON.parse(Data).status}</p>
                                  <Card>
                                  <Form onSubmit={(event) => handleAdminAction(event, kycId)}>
                                      <Form.Group controlId="formBasicStatus">
                                          <Form.Label>Action</Form.Label>
                                          <Form.Control as="select" name="status">
                                          <option value={STATUSES.SUBMITTED}>{STATUSES.SUBMITTED}</option>
                                          <option value={STATUSES.VERIFIED}>{STATUSES.VERIFIED}</option>
                                          <option value={STATUSES.UNDER_REVIEW}>{STATUSES.UNDER_REVIEW} </option>
                                          <option value={STATUSES.REVIEWED}>{STATUSES.REVIEWED}</option>
                                          <option value={STATUSES.REJECTED}>{STATUSES.REJECTED}</option>
                                          </Form.Control>
                                      </Form.Group>
          
                                      <Button className="sm" variant="primary" type="submit">
                                          Action
                                      </Button>
                                  </Form>
                              </Card>
                              </Accordion.Body>
                              
                          </Accordion.Item>
                          </Accordion>
                          )
                      })
                  }
           
            </>
          )}
         
      
    </div>
  )
}

export default KycApproval




const cardStyle = {
  borderRadius: '10px',
  margin: '20px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  animation: 'glowingAnimation 2s infinite',
};

const yellowGradient = {
  background: 'linear-gradient(to bottom right, #FFD700, #FFA500)',
  color: 'black',
};

const blueGradient = {
  background: 'linear-gradient(to bottom right, #00BFFF, #1E90FF)',
  color: 'black',
};

const greenGradient = {
  background: 'linear-gradient(to bottom right, #32CD32, #008000)',
  color: 'white',
};

const orangeGradient = {
  background: 'linear-gradient(to bottom right, #FFA500, #FF4500)',
  color: 'black',
};

const blackGradient = {
  background: 'linear-gradient(to bottom right, #000000, #2F4F4F)',
  color: 'white',
};

const crimsonRedGradient = {
  background: 'linear-gradient(to bottom right, #DC143C, #8B0000)',
  color: 'white',
};
