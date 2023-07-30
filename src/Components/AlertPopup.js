import React, { useState, useEffect } from 'react';
import { Alert, Container } from 'react-bootstrap';

const AlertPopup = ({
  type = 'info',
  message = 'Default message',
  timeOfDisplay = 5000,
  fontSize = '16px',
  fontWeight = 'normal',
  fontStyle = 'normal',
}) => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, timeOfDisplay);

    return () => {
      clearTimeout(timer);
    };
  }, [timeOfDisplay]);

  return (
    <Container>
      {showAlert && (
        <Alert
          variant={type}
          style={{
            fontSize,
            fontWeight,
            fontStyle,
            textAlign: 'center',
            marginTop: '10px',
            marginBottom: '0',
          }}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default AlertPopup;
