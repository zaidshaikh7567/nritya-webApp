import React from 'react'
import  { useState, useEffect } from 'react';
import { db } from '../config';
import { collection, query, where, getDocs, doc, getDoc,updateDoc, setDoc } from 'firebase/firestore';
import { Card, Button, Form, Accordion } from 'react-bootstrap';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import { adminLoginFn, adminLogoutFn } from '../reduxStore/adminLoginSlice';
import { STATUSES, COLLECTIONS } from '../constants';


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


function OverView() {
  const [pendingKyc, setPendingKyc] = useState({});
  const [reviewedKyc, setReviewedKyc] = useState({});
  const [usersList, setUsersList] = useState([]);
  const [transactionsList, setTransactionsList] = useState([]);
  const [studiosList, setStudiosList] = useState([]);


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


    const getUsersList = async () => {
      const q = query(collection(db, COLLECTIONS.USER));
      const querySnapshot = await getDocs(q);
      const map = {};
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data(), '#', doc);
        map[doc.id] = JSON.stringify(doc.data());
      });
      setUsersList(map);
    };

    const getTransactionsList = async () => {
      const q = query(collection(db, COLLECTIONS.USER));
      const querySnapshot = await getDocs(q);
      const map = {};
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data(), '#', doc);
        map[doc.id] = JSON.stringify(doc.data());
      });
      setTransactionsList(map);
    };

    const getStudiosList = async () => {
      const q = query(collection(db, COLLECTIONS.USER));
      const querySnapshot = await getDocs(q);
      const map = {};
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data(), '#', doc);
        map[doc.id] = JSON.stringify(doc.data());
      });
      setStudiosList(map);
    };

   
      getPendingKyc();
      getReviewedKyc();
      getUsersList();
      getTransactionsList();
      getStudiosList();
    
  }, []);
  console.log(transactionsList)
  
  return (
  <div>
    <Container>
      <h1>Overview</h1>

      <Row>
        <Col sm={6} md={4}>
          <Card style={{ ...cardStyle, ...blackGradient }}>  
            <Card.Body>
              <Card.Title>Pending KYC</Card.Title>
              <Card.Text>Number of instances: {Object.keys(pendingKyc).length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} md={4}>
          <Card style={{ ...cardStyle, ...orangeGradient }}>
            <Card.Body>
              <Card.Title>Reviewed KYC</Card.Title>
              <Card.Text>Number of instances: {Object.keys(reviewedKyc).length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} md={4}>
          <Card style={{ ...cardStyle, ...greenGradient }}>
               <Card.Body>
              <Card.Title>Users</Card.Title>
              <Card.Text>Number of instances: {Object.keys(usersList).length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} md={4}>
          <Card style={{ ...cardStyle, ...blueGradient }}> 
            <Card.Body>
              <Card.Title>Transactions</Card.Title>
              <Card.Text>Number of instances: {Object.keys(transactionsList).length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} md={4}>
          <Card style={{ ...cardStyle, ...yellowGradient }}>
            <Card.Body>
              <Card.Title>Studios</Card.Title>
              <Card.Text>Number of instances: {Object.keys(studiosList).length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
  )
}

export default OverView
