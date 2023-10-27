import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';

function Footer() {
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const adCardStyle = {
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    background: isDarkModeOn ? '#333333' : '#f8f8f8',
    color: isDarkModeOn ? 'white' : 'black', // Text color
    radius: '5%',
  };

  return (
    <div style={{ backgroundColor: isDarkModeOn ? 'black' : 'white' }}>
      <Container>
        <Row>
          <Col className="text-center">
            <Card style={adCardStyle} >
              <Card.Body>
                <FontAwesomeIcon icon={faMusic} size="3x" />
                <h3>List your dance studio/workshops</h3>
                <p>
                  Showcase your dance studio or workshops to a wide audience of dance enthusiasts. Get started today and
                  reach out to your potential customers!
                </p> 
                <Button style={{ backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white' }} href="#/profile">List Now</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <footer style={{ backgroundColor: isDarkModeOn ? 'black' : '#2c1160', height: 1 }}>
        <Row>
          <Col className="text-center py-1" style={{ color: 'white', fontFamily: 'Times-Roman', fontSize: 12 }}>
            &copy; Nritya@2023
          </Col>
        </Row>
      </footer>
      <br></br>
    </div>
  );
}

export default Footer;
