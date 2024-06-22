import React, { useState, useEffect } from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import InstructorAdd from '../Components/InstructorAdd';
import InstructorUpdate from '../Components/InstructorUpdate';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import {doc,getDoc,updateDoc,collection,where,query,getDocs} from 'firebase/firestore';
import { COLLECTIONS } from '../constants';
import { db } from '../config';
import InstructorCard from '../Components/InstructorCard';
import { useAuth } from '../context/AuthContext';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';

function Instructors() {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
    const [instructors, setInstructors] = useState([]);
    const { currentUser } = useAuth();
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
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
    <div style={{ backgroundColor: isDarkModeOn ? '#202020' : '', color: isDarkModeOn ? 'white' : 'black' }}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList style={{color: isDarkModeOn ? 'white' : 'black'}} onChange={handleChange} aria-label="lab API tabs example">
            <Tab style={{color: isDarkModeOn ? 'white' : 'black'}} label="Add Instructor" value="1" />
            <Tab style={{color: isDarkModeOn ? 'white' : 'black'}} label="Update Instructor" value="2" />
          
          </TabList>
        </Box>
        <TabPanel value="1">

        <InstructorAdd />
        </TabPanel>
        <TabPanel value="2">
        <>
        <InstructorUpdate instructors={instructors} setInstructors={setInstructors} />
        </>
    
        </TabPanel>
        
      </TabContext>
    </Box>
        <Accordion hidden defaultActiveKey="0" style={{ backgroundColor: isDarkModeOn ? '#181818' : '', color: isDarkModeOn ? 'white' : 'black' }}>
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
