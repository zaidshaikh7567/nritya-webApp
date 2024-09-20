import React from 'react';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';

const TimeRangePicker = ({ show, handleClose, handleSelect, defaultTime }) => {
  //console.log("TimeRangePicker",defaultTime)
  const startTime_i = defaultTime.split('-')[0].trim();
  const endTime_i = defaultTime.split('-')[1]?.trim();

  //console.log(startTime_i,endTime_i,defaultTime)

  const generateTimeOptions = () => {
    const options = [];
    let option_AM = [];
    let option_PM = [];
    for (let hours = 0; hours < 24; hours++) {
      for (let minutes = 0; minutes < 60; minutes += 15) {
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const timeString = `${formattedHours}:${formattedMinutes}`;
  
        if (hours < 12) {
          option_AM.push(`${timeString} AM`);
        } else {
          const formattedHours12 = (hours - 12).toString().padStart(2, '0');
          option_PM.push(`${formattedHours12}:${formattedMinutes} PM`);
        }
      }
    }

    for (let i = 0; i < option_AM.length || i < option_PM.length; i++) {
      if (i < option_AM.length) {
        options.push(option_AM[i]);
      }
      if (i < option_PM.length) {
        options.push(option_PM[i]);
      }
    }
    

  
    return options;
  };
  

  const renderTimeOptions = (defaultValue) => {
    console.log(defaultValue);
    const timeOptions = generateTimeOptions();
  
    return (
      <>
        <option value={defaultValue}>{defaultValue}</option>
        {timeOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </>
    );
  };
  
  

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Time</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
          <Form.Group >
          <Form.Label >
            Start Time
          </Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => handleSelect(e.target.value, null)}
              style={{height: 'auto', // Let it adjust to content
                lineHeight: '1.5em', // Mimics rows={1}
                padding: '8px'}}
            >
              {renderTimeOptions(startTime_i)}
            </Form.Control>
          </Form.Group>
          </Col>
          <Col>
          <Form.Group>
          <Form.Label >
            End Time
          </Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => handleSelect(null, e.target.value)}
              style={{height: 'auto', // Let it adjust to content
                lineHeight: '1.5em', // Mimics rows={1}
                padding: '8px'}}
            >
              {renderTimeOptions(endTime_i)}
            </Form.Control>
          </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TimeRangePicker;
