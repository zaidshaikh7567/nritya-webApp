import React, { useState } from 'react';
import { ButtonGroup, Button,Tab,Tabs } from 'react-bootstrap';
import CreatorStudio from './CreatorStudio';
import CreatorWorkshop from './CreatorWorkshop';
import { Transaction } from 'firebase/firestore';
import Transactions from './Transactions';

function Creator() {
    const [key, setKey] = useState('home');

  return (
    
    <>
    

    <Tabs
      defaultActiveKey="studio"
      id="justify-tab-example"
      className="mb-3"
      justify
    >
      <Tab eventKey="studio" title="Studio">
         <CreatorStudio />
      </Tab>

      <Tab eventKey="transactions " title="Transactions">
         <Transactions />
      </Tab>
    </Tabs>
    </>
  )
}

export default Creator
