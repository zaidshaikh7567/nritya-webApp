import React from 'react';
import NrityaSVG from '../Components/NrityaSVG';
import { Grid } from '@mui/material';

const NotFoundPage = () => {
    return (
      <div style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', alignContent: 'center', marginLeft:"5%" }}>
        
            <NrityaSVG text={'Wrong URL 404!'} x={"2"} y={"10"} fontSize={"10px"}/>
            
         
      </div>
    );
  };
  
  export default NotFoundPage;
  
