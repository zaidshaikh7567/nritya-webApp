import React from 'react';
import { Card, Badge } from 'react-bootstrap';

function StudioCardIcon({ studioName, studioAddress, studioPrice, studioTiming }) {
  return (
    <Card style={{ width: '200px', height: '250px', marginBottom: '20px' }}>
      <Card.Img variant="top" src="https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"
               style={{ height: '150px', objectFit: 'cover' }} />
      <Card.Body>
        <Card.Text style={{ fontSize: '0.8rem', marginBottom: '5px' }}>{studioName}</Card.Text>
        <Card.Text style={{ fontSize: '0.6rem', marginBottom: '5px' }}>
          {studioAddress}
        </Card.Text>
        <Card.Text style={{ fontSize: '0.6rem', marginBottom: '5px' }}>
          Price: {studioPrice}
        </Card.Text>
        <Card.Text style={{ fontSize: '0.6rem' }}>
            Time: {studioTiming}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default StudioCardIcon;
