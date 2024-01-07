import React from 'react';
import { Card, Button, Row, Col , Form,Accordion,Table,Toast } from 'react-bootstrap';
 
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StudioCard from './StudioCard';
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection,where,getDocs,query } from "firebase/firestore";
import { COLLECTIONS } from '../constants';
import StudioAdd from './StudioAdd';
import StudioUpdate from './StudioUpdate';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { useAuth } from '../context/AuthContext';
import Instructors from './Instructors';
import NrityaCard from './NrityaCard';
import { queryDocumentsCount } from '../utils/firebaseUtils';


function CreatorDashboard(){
  const [instructorsCount, setInstructorsCount] = useState(0);
  const [studiosCount, setStudiosCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    const getCount = async (event) => {
      const count = await queryDocumentsCount(COLLECTIONS.INSTRUCTORS, 'createdBy', '==', currentUser.uid);
      setInstructorsCount(count)
    }
    getCount()
  },[instructorsCount]);

  useEffect(() => {
    const getCount = async (event) => {
      const count = await queryDocumentsCount(COLLECTIONS.STUDIO, "UserId", '==', currentUser.uid);
      setStudiosCount(count)
    }
    getCount()
  },[studiosCount]);
  return(
    <div>
      <Row>
        <Col>
          <NrityaCard title={"Total Studios"} data={studiosCount} bubble={true}></NrityaCard>
        </Col>
        <Col>
          <NrityaCard title={"Total Instructors"} data={instructorsCount} bubble={true}></NrityaCard>
        </Col>
      </Row>
      <Row>
      <Col>
        <a href="#/modifyStudios" rel="noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
          <NrityaCard
            title={"Add/Update Studios"}
            data={'+'}
            bubble={true}
          ></NrityaCard>
        </a>
      </Col>
      <Col>
        <a href="#/modifyInstructors" rel="noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
          <NrityaCard
            title={"Add/Update Instructors"}
            data={'+'}
            bubble={true}
          ></NrityaCard>
        </a>
      </Col>
      </Row>
      </div>
  );

}
export default CreatorDashboard