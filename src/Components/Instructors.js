import React, { useState, useEffect } from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import InstructorAdd from './InstructorAdd';
import InstructorUpdate from './InstructorUpdate';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import {doc,getDoc,updateDoc,collection,where,query,getDocs} from 'firebase/firestore';
import { COLLECTIONS } from '../constants';
import { db } from '../config';
import InstructorCard from './InstructorCard';
import { useAuth } from '../context/AuthContext';

function Instructors() {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
    const [instructors, setInstructors] = useState([]);
    const { currentUser } = useAuth();
      // Fetch instructors for the current user
    useEffect(() => {
    const fetchInstructors = async () => {
      let userId = (currentUser && currentUser.uid)?currentUser.uid:null;
      
      if (!userId) {
        console.log('User not found');
        alert('User not found');
        return;
      }

      const instructorRef = collection(db, COLLECTIONS.INSTRUCTORS);
      const q = query(instructorRef, where('createdBy', '==', userId));
      const querySnapshot = await getDocs(q);

      const instructorsList = [];
      querySnapshot.forEach((doc) => {
        instructorsList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setInstructors(instructorsList);
    };

    fetchInstructors();
  }, []);

  return (
    <div style={{ backgroundColor: isDarkModeOn ? 'black' : '', color: isDarkModeOn ? 'white' : 'black' }}>
        <Accordion defaultActiveKey="0" style={{ backgroundColor: isDarkModeOn ? '#181818' : '', color: isDarkModeOn ? 'white' : 'black' }}>
            {/* Add Instructor Accordion */}
            <Accordion.Item eventKey="0" style={{ backgroundColor: isDarkModeOn ? '#181818' : '', color: isDarkModeOn ? 'white' : 'black' }}>
                <Accordion.Header style={{ backgroundColor: isDarkModeOn ? '#181818' : '', color: isDarkModeOn ? 'white' : 'black' }}>
                    Add Instructor
                </Accordion.Header>
                <Accordion.Body>
                <InstructorAdd />
                </Accordion.Body>
            </Accordion.Item>

            {/* Update Instructor Accordion */}
            <Accordion.Item eventKey="1" style={{ backgroundColor: isDarkModeOn ? '#181818' : '', color: isDarkModeOn ? 'white' : 'black' }}>
                <Accordion.Header style={{ backgroundColor: isDarkModeOn ? '#181818' : '', color: isDarkModeOn ? 'white' : 'black' }}>
                Update Instructor
                </Accordion.Header>
                <Accordion.Body>
                <InstructorUpdate instructors={instructors} setInstructors={setInstructors} />
                </Accordion.Body>
            </Accordion.Item>
            </Accordion>
            <br></br>
            
            {instructors.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {instructors.map((instructor) => (
                    <InstructorCard key={instructor.id} instructor={instructor} />
                ))}
                </div>
            )}

    </div>
  );
}

export default Instructors
