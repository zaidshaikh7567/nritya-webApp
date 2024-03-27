import React, { useEffect, useState } from 'react';
import { Card,Row,Col,Container, Stack } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import '../Components/NrityaCard.css'
import { FaEnvelope, FaWhatsapp } from 'react-icons/fa';



function NrityaCard({data,title,bubble=false,aboutFounder=false,founderEmail,founderWhatsAppNumber}) {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
    const nrityaCardClass1 = `mb-2 ${isDarkModeOn ? 'nritya-card nritya-card-dark' : 'nritya-card nritya-card-light'}`;
    const nrityaCardClass = `mb-2 ${isDarkModeOn ? 'nritya-card nritya-card-dark' : (aboutFounder?'nritya-card nritya-card-extra-dark':'nritya-card nritya-card-light')}`;
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
        <Card.Title style={{ position: 'relative', padding: '0.1rem',paddingTop:'0.5rem' }} >
          
          {bubble? <Card.Text>{title}</Card.Text>:<h4 style={{color: isDarkModeOn?'white':(aboutFounder?'white':'black') , paddingTop:"2px"}}>{title}</h4>}
        </Card.Title>
        <Card.Body style={{ padding: '1rem' }}>
        {bubble?<CircularBubble number={data} />:data}

        <Container>
            {aboutFounder && (
              <Row>
                <br></br>
                <Stack direction="horizontal" gap={3}>
                  <a href={`https://wa.me/${founderWhatsAppNumber}`} target="_blank" rel="noopener noreferrer"> 
                  <FaWhatsapp style={{ color: 'green', fontSize: '24px', marginRight: '10px' }}  />
                  </a>

                  <a href={`mailto:${founderEmail}`} target="_blank" rel="noopener noreferrer"> 
                  <FaEnvelope style={{ color: 'white', fontSize: '24px', marginRight: '10px' }} /> 
                  </a>
                </Stack>
              </Row>
            )}
          </Container>
        
        
        </Card.Body>
        </Card>

    );

}
export default NrityaCard