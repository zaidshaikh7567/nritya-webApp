import React from 'react';
import { Card, Button, Row, Col , Form,Accordion,Table,Toast } from 'react-bootstrap';
 
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StudioCard from '../Components/StudioCard';
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection,where,getDocs,query } from "firebase/firestore";
import { COLLECTIONS } from '../constants';
import StudioAdd from '../Components/StudioAdd';
import StudioUpdate from '../Components/StudioUpdate';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { useAuth } from '../context/AuthContext';
import Instructors from './CreatorInstructor';
import NrityaCard from '../Components/NrityaCard';
import { queryDocumentsCount } from '../utils/firebaseUtils';


function CreatorDashboard(){
  const [instructorsCount, setInstructorsCount] = useState(0);
  const [studiosCount, setStudiosCount] = useState(0);
  const [workshopsCount, setWorkshopsCount] = useState(0);
  const [openClassesCount, setOpenClassesCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const isDarkModeOn = useSelector(selectDarkModeStatus);
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

  useEffect(() => {
    const getCount = async (event) => {
      const count = await queryDocumentsCount(COLLECTIONS.WORKSHOPS, "UserId", '==', currentUser.uid);
      setWorkshopsCount(count);
    }
    getCount()
  },[workshopsCount]);

  useEffect(() => {
    const getCount = async (event) => {
      const count = await queryDocumentsCount(COLLECTIONS.OPEN_CLASSES, "UserId", '==', currentUser.uid);
      setOpenClassesCount(count);
    }
    getCount()
  },[openClassesCount]);

  useEffect(() => {
    const getCount = async (event) => {
      const count = await queryDocumentsCount(COLLECTIONS.COURSES, "UserId", '==', currentUser.uid);
      setCoursesCount(count);
    }
    getCount()
  },[coursesCount]);

  return(
    <div style={{minHeight:"75vh"}}>
      <h1 style={{color: isDarkModeOn?"white":"black", textTransform:'capitalize'}}>Dashboard</h1>
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

      <Row>
        <Col>
          <NrityaCard title={"Total Workshops"} data={workshopsCount} bubble={true}></NrityaCard>
        </Col>
        <Col>
          <NrityaCard title={"Total Open Classes"} data={openClassesCount} bubble={true}></NrityaCard>
        </Col>
      </Row>
      <Row>
      <Col>
        <a href="#/modifyWorkshops" rel="noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
          <NrityaCard
            title={"Add/Update Workshops"}
            data={'+'}
            bubble={true}
          ></NrityaCard>
        </a>
      </Col>
      <Col>
        <a href="#/modifyOpenClasses" rel="noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
          <NrityaCard
            title={"Add/Update Open Classes"}
            data={'+'}
            bubble={true}
          ></NrityaCard>
        </a>
      </Col>
      </Row>

      <Row>
        <Col>
          <NrityaCard title={"Total Courses"} data={coursesCount} bubble={true}></NrityaCard>
        </Col>
        <Col></Col>
      </Row>
      <Row>
      <Col>
        <a href="#/modifyCourses" rel="noreferrer" target="_blank" style={{ textDecoration: 'none' }}>
          <NrityaCard
            title={"Add/Update Courses"}
            data={'+'}
            bubble={true}
          ></NrityaCard>
        </a>
      </Col>
      <Col></Col>
      </Row>
      </div>
  );

}
export default CreatorDashboard