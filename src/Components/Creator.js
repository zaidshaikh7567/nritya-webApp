import React, { useState } from 'react';
import { ButtonGroup, Button,Tab,Tabs } from 'react-bootstrap';
import CreatorStudio from './CreatorStudio';
import CreatorWorkshop from './CreatorWorkshop';
import { Transaction } from 'firebase/firestore';
import Transactions from './Transactions';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import Instructors from './Instructors';

function Creator() {
    const [key, setKey] = useState('home');
    const isDarkModeOn = useSelector(selectDarkModeStatus); // Use useSelector to access isDarkModeOn

  return (
    
    <>
    <Tabs
      defaultActiveKey="transactions"
      id="justify-tab-example"
      className="mb-3"
      variant='pills'
      style={{ 
        backgroundColor: isDarkModeOn ? '#333333' : '', 
      }}
      justify 
    > 
      <Tab eventKey="studio"  title={<span style={{  color: isDarkModeOn ? '#892CDC' : '' }}>Studio</span>} >
         <CreatorStudio />
      </Tab>
      <Tab eventKey="instructors" title={<span style={{ color: isDarkModeOn ? '#892CDC' : '' }}>Instructor</span>} >
          <Instructors />
      </Tab>
    </Tabs>
    </>
  )
}

export default Creator
