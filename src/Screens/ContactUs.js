import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';

const ContactUs = () => {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [containerStyle, setContainerStyle] = useState({});
  const [headingStyle, setHeadingStyle] = useState({});
  const [textStyle, setTextStyle] = useState({});
  const [formControl, setFormControl] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });


  useEffect(() => {
    setContainerStyle({
      backgroundColor: isDarkModeOn ? '#202020' : 'white',
      color: isDarkModeOn ? 'white' : 'black'
    });
    setHeadingStyle({
      backgroundColor: isDarkModeOn ? '#202020' : 'white',
      color: "#00aeef"
    });
    setTextStyle({
      color: isDarkModeOn ? 'white' : 'black'
    });
    setFormControl({
      backgroundColor: isDarkModeOn ? '#202020' : 'white',
      color: isDarkModeOn ? 'white' : 'black',
      border: `1px solid ${isDarkModeOn ? 'white' : 'black'}`, // Add border style
      borderRadius: '5px' // Add border radius
    });
  }, [isDarkModeOn]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    const recipient = 'nritya@nritya.co.in';
    const subject = 'New Contact Form Submission';
    const body = `Name: ${formData.name}

    Message:
    ${formData.message}`;
  
    const mailToUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailToUrl;

  };

  

  return (
    <section>
      <div>
        <Container style={containerStyle}>
          <h2 style={headingStyle}>Contact Us</h2>
          <p style={textStyle}>
            You may contact us via email, phone or post.
          </p>
        </Container>
      </div>

      <Container style={containerStyle}>
        <Row>
          <Col>
            <div>
              <div>
                <FontAwesomeIcon icon={faHome} />
                <div>
                  <h4 style={headingStyle}>Address</h4>
                  <p style={textStyle}>116/969, Roshan Nagar, Near Ujageshwar Mandir,<br/> Rawatpur, Kanpur Nagar, Rawatpur Gaon, <br/> Uttar Pradesh, India, <br/> 208019</p>
                </div>
              </div>

              <div>
                <FontAwesomeIcon icon={faPhone} />
                <div>
                  <h4 style={headingStyle}>Phone</h4>
                  <p style={textStyle}>6392074436</p>
                </div>
              </div>

              <div>
                <FontAwesomeIcon icon={faEnvelope} />
                <div>
                  <h4 style={headingStyle}>Email</h4>
                  <p style={textStyle}>nritya@nritya.co.in</p>
                </div>
              </div>
            </div>
          </Col>
          <Col>
          <div>
          <Form style={containerStyle} onSubmit={handleSendEmail}>
            <h2 style={headingStyle}>Send Message</h2>
            <Form.Group controlId="fullname">
              <Form.Label style={textStyle}>Name</Form.Label>
              <Form.Control 
                required 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name" 
                style={formControl} 
              />
            </Form.Group>
            
            <Form.Group controlId="message">
              <Form.Label style={textStyle}>Message</Form.Label>
              <Form.Control 
                required 
                as="textarea" 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Type your Message..." 
                rows={4} 
                style={formControl} 
              />
            </Form.Group>
            <Button type="submit" rounded className="me-2 rounded-pill" style={{ textTransform: 'none', backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white' }}>
              Send
            </Button>
          </Form>
        </div>

          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ContactUs;
