import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import '../Components/NrityaCard.css'

function NrityaCard({data,title}) {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
    const nrityaCardClass = `mb-2 ${isDarkModeOn ? 'nritya-card nritya-card-dark' : 'nritya-card nritya-card-light'}`;



    return(
        <Card className={nrityaCardClass}  style={{display: 'flex',alignItems: 'center',justifyContent: 'center',}} >   
        <Card.Title style={{ position: 'relative', padding: '0.1rem' }} >
          <h4 style={{color: isDarkModeOn?'white':'black' }}>{title}</h4>
        </Card.Title>
        <Card.Body style={{ padding: '1rem' }}>
        
        {data}
        
        </Card.Body>
        </Card>

    );

}
export default NrityaCard