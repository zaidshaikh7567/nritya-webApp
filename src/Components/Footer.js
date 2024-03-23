import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { useNavigate } from 'react-router-dom';
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaLinkedin,FaEnvelope } from 'react-icons/fa';

function Footer() {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));


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
                <Button style={{ backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white' }} href={isLoggedIn ? '#/modifyStudios' : '#/login'}>List Now</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <footer style={{ backgroundColor: isDarkModeOn ? '#292929' : '#2c1160', padding: '10px 0', color: 'white' }}>
        <Container>
          <Row className="justify-content-between align-items-center">
            <Col xs="auto" className="text-center py-1">
              
              <a href="https://www.instagram.com/nritya.co.in/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', marginRight: '10px' }}>
                <FaInstagram className='genericHoverEffect' style={{ fontSize: '24px' }} />
              </a>
              
              <a href="https://in.linkedin.com/company/nritya" target="_blank" rel="noopener noreferrer" style={{ color: 'white', marginRight: '10px' }}>
                <FaLinkedin className='genericHoverEffect' style={{ fontSize: '24px' }} />
              </a>
              <a href="mailto:nritya.contact@gmail.com" style={{ color: 'white' }}>
                <FaEnvelope style={{ fontSize: '24px' }} />
              </a>

            </Col>
            <Col xs="auto" className="text-center py-1" style={{ fontFamily: 'Times-Roman', fontSize: 12 }}>
              &copy; Nritya@2023
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default Footer;
