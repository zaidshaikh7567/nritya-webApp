import React, { useEffect, useState } from 'react';
import { Card, Row, Container, Stack } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import '../Components/NrityaCard.css';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

function NrityaCard({data, title, type, studioContactNumber, studioWhatsAppNumber}) {

    const isDarkModeOn = useSelector(selectDarkModeStatus);
   //const nrityaCardClass = `mb-2 ${isDarkModeOn ? 'nritya-card nritya-card-dark' : 'nritya-card nritya-card-light'}`;
   const nrityaCardClass = `mb-2 ${
    isDarkModeOn ? 
    'nritya-card nritya-card-dark' : 
    (type === 'aboutFounder' ? 'nritya-card nritya-card-extra-dark' : 'nritya-card nritya-card-light')
  }`;
  
    const nrityaBubbleClass = `mb-2 ${isDarkModeOn ? 'circular-bubble-dark' : 'circular-bubble'}`;

    function CircularBubble({ number }) {
      return (
        <div className={nrityaBubbleClass}>
          {number}
        </div>
      );
    }

    return (
        <Card className={nrityaCardClass} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {type !== 'aboutStudio' && (
                <Card.Title style={{ position: 'relative', padding: '0.1rem', paddingTop: '0.5rem',fontSize:'20px' }}>
                    {title}
                </Card.Title>
            )}
            <Card.Body style={{ padding: '1rem' }}>
                {type === 'bubble' ? <CircularBubble number={data} /> : data}
                {/* {type === 'aboutStudio' && (
                    <Container>
                        <Row>
                            <br />
                            <Stack direction="horizontal" gap={3}>
                                <a href={`https://wa.me/${studioWhatsAppNumber}`} target="_blank" rel="noopener noreferrer"> 
                                    <FaWhatsapp style={{ color: 'green', fontSize: '24px', marginRight: '10px' }}  />
                                </a>
                                <a href={`tel:${studioContactNumber}`} rel="noopener noreferrer"> 
                                <FaPhoneAlt style={{ color: 'black', fontSize: '24px', marginRight: '10px' }} /> 
                            </a>
                            </Stack>
                        </Row>
                    </Container>
                )} */}
            </Card.Body>
        </Card>
    );
}

export default NrityaCard;
