import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import '../Components/NrityaCard.css'



function NrityaCard({data,title,bubble=false}) {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
    const nrityaCardClass = `mb-2 ${isDarkModeOn ? 'nritya-card nritya-card-dark' : 'nritya-card nritya-card-light'}`;
    const nrityaBubbleClass = `mb-2 ${isDarkModeOn ? 'circular-bubble-dark' : 'circular-bubble '}`;

    function CircularBubble({ number }) {
      return (
        <div className={nrityaBubbleClass}>
          {number}
        </div>
      );
    }

    const bubbles = [];
  for (let i = 1; i <= data; i++) {
    bubbles.push(<CircularBubble key={i} number={i} isEven={i % 2 === 0} />);
  }


    return(
        <Card className={nrityaCardClass}  style={{display: 'flex',alignItems: 'center',justifyContent: 'center',}} >   
        <Card.Title style={{ position: 'relative', padding: '0.1rem' }} >
          
          {bubble? <Card.Text>{title}</Card.Text>:<h4 style={{color: isDarkModeOn?'white':'black' }}>{title}</h4>}
        </Card.Title>
        <Card.Body style={{ padding: '1rem' }}>
        {bubble?<CircularBubble number={data} />:data}
        
        
        </Card.Body>
        </Card>

    );

}
export default NrityaCard