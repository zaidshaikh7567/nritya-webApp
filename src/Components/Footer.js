import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { faMusic } from "@fortawesome/free-solid-svg-icons"; // Import specific icons from Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
  const adCardStyle = {
    // Adjust ad card styles as needed
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    background: "#f8f8f8", // Custom background color
  };

  return (
    <div>
      <Container>
        <Row>
          <Col className="text-center">
            <Card style={adCardStyle}>
              <Card.Body>
                <FontAwesomeIcon icon={faMusic} size="3x" />
                <h3>List your dance studio/workshops</h3>
                <p>
                  Showcase your dance studio or workshops to a wide audience of dance enthusiasts. Get started today and
                  reach out to your potential customers!
                </p>
                <Button variant="primary" href="#/profile">List Now</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <footer style={{ backgroundColor: '#2c1160',  height: 1}}>
        <Row>
          <Col className ='text-center py-1 ' style={{  color: '#e78f4c' ,fontFamily:'Times-Roman',fontSize:12}}> 
            &copy;N 2023
          </Col>
        </Row>
      </footer>
    </div>
  )
}

export default Footer;
