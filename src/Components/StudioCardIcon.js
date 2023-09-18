import React from 'react';
import { Card, Badge } from 'react-bootstrap';

function StudioCardIcon({ studioName, studioAddress, studioPrice, studioTiming, studioDanceStyles }) {
  return (
    <Card style={{ width: '200px', height: '250px', marginBottom: '20px' }}>
      <Card.Img variant="top" src="https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"
               style={{ height: '200px', objectFit: 'cover' }} />
      <Card.Body>
        <Card.Text style={{ fontSize: '0.8rem', marginBottom: '1px' }}>{studioName}</Card.Text>
        {studioDanceStyles && studioDanceStyles.split(",").slice(0, 3).map((form, index) => (
          <Badge
            key={index}
            bg={index % 2 === 0 ? "danger" : "warning"} // Alternate badge colors
            className="me-2 rounded-pill"
            style={{ marginBottom: "1px", fontSize: '0.4rem' }}
          >
            {form.trim()}
          </Badge>
        ))}

        <Card.Text style={{ fontSize: '0.6rem', marginBottom: '2px' }}>
          {studioAddress}
        </Card.Text>
        <Card.Text style={{ fontSize: '0.6rem', marginBottom: '2px' }}>
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
