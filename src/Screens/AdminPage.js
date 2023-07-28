import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { adminLoginFn, adminLogoutFn } from '../reduxStore/adminLoginSlice';
import { STATUSES, COLLECTIONS } from '../constants';
import { db } from '../config';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Card, Button, Form, Accordion } from 'react-bootstrap';
import { Nav, Container, Row, Col,Navbar } from 'react-bootstrap';
import { Await } from 'react-router-dom';
import KycApproval from '../AdminComponents/KycApproval';
import OverView from '../AdminComponents/OverView';
import Transaction from '../AdminComponents/Transaction';

function AdminPage() {

  const dispatch = useDispatch();
  const adminLogin = useSelector((state) => state.adminLogin.value);
  const [activeTab, setActiveTab] = useState('overview');

  const [pendingKyc, setPendingKyc] = useState({});
  const [reviewedKyc, setReviewedKyc] = useState({});
  const [usersList, setUsersList] = useState([]);
  const [transactionsList, setTransactionsList] = useState([]);
  const [studiosList, setStudiosList] = useState([]);

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    const docRef = doc(db, event.target.username.value, 'Passcode');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      if (event.target.password.value === docSnap.data().passcode) {
        console.log("Approved for admin login !")
        dispatch(adminLoginFn());
      } else {
        console.log('Wrong Password');
      }
    } else {
      console.log('No such user!');
    }
  };

  const handleAdminAction = async (event, kycID) => {
    event.preventDefault();
    const docRef = doc(db, COLLECTIONS.USER_KYC, kycID);
    console.log("admin action:", kycID, docRef.UserId);

    try {
      await updateDoc(docRef, {
        status: event.target.status.value,
      });

      console.log("Update completed");
      if (event.target.status.value === STATUSES.VERIFIED) {
        const kycSnap = await getDoc(docRef);
        if (kycSnap.exists()) {
          console.log("Doc there", kycSnap.data().UserId);
          const userRef = doc(db, COLLECTIONS.USER, kycSnap.data().UserId)
          await updateDoc(userRef, {
            CreatorMode: true
          });
        } else {
          console.log("Error in updating")
        }
      }
    } catch (error) {
      console.error("Update error:", error);
    }

    const updatedPendingKyc = { ...pendingKyc };
    updatedPendingKyc[kycID].status = event.target.status.value;
    setPendingKyc(updatedPendingKyc);
  };

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

    if (adminLogin) {
      getPendingKyc();
      getReviewedKyc();
      getUsersList();
      getTransactionsList();
      getStudiosList();
    }
  }, [adminLogin]);

  console.log('Kyc', pendingKyc);
  const reviews = ['Pending', 'Reviewed'];

  return (
    <div style={{ width: '100%', display: 'inline-block' }}>
      {adminLogin ? (
        <>
          <Navbar bg="light" variant="light">
            <Navbar.Brand>Admin Mode</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <a onClick={() => dispatch(adminLogoutFn())} href="/">
                  Exit
                </a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
          <br />
          <Container fluid>
            <Row>
              <Col sm={2} style={{ borderRadius: '10px', background: 'linear-gradient(to bottom right, #000000, #2F4F4F)', color: 'white' }}>
                <Nav className="flex-column">
                  <Nav.Link onClick={() => setActiveTab('overview')} style={{ color: 'white' }}>Overview</Nav.Link>
                  <hr></hr>
                  <Nav.Link onClick={() => setActiveTab('users')} style={{ color: 'white' }}>Users</Nav.Link>
                  <hr></hr>
                  <Nav.Link onClick={() => setActiveTab('transactions')} style={{ color: 'white' }}>Transactions</Nav.Link>
                  <hr></hr>
                  <Nav.Link onClick={() => setActiveTab('studios')} style={{ color: 'white' }}>Studios</Nav.Link>
                  <hr></hr>
                  <Nav.Link onClick={() => setActiveTab('kyc')} style={{ color: 'white' }}>Kyc</Nav.Link>
                  <hr></hr>
                </Nav>
              </Col>
              <Col sm={8}>
                <Container>
                  {activeTab === 'overview' && <OverView />}
                  {activeTab === 'users' && <p>Users Component</p>}
                  {activeTab === 'transactions' && <Transaction />}
                  {activeTab === 'studios' && <p>Studios Component</p>}
                  {activeTab === 'kyc' && <KycApproval />}
                </Container>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <Form onSubmit={handleAdminLogin}>
          <Form.Group controlId="formBasicTitle">
            <Form.Label>Username {adminLogin}</Form.Label>
            <Form.Control type="textarea" placeholder="Enter Username" name="username" required />
          </Form.Group>

          <Form.Group controlId="formBasicBody">
            <Form.Label>Password</Form.Label>
            <Form.Control as="textarea" rows={1} placeholder="Enter password" name="password" required />
          </Form.Group>

          <Button variant="primary" type="submit">
            Admin LoginPage
          </Button>
        </Form>
      )}
    </div>
  );
}

export default AdminPage;
