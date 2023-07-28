import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import Dance1 from "../Components/DanceImg/Dance1.jpg";
import Dance2 from "../Components/DanceImg/Dance2.jpg";
import Dance3 from "../Components/DanceImg/Dance3.jpg";
import Dance4 from "../Components/DanceImg/Dance4.jpg";
import Dance5 from "../Components/DanceImg/Dance5.jpg";

const danceImages = [Dance3, Dance4, Dance5, Dance1, Dance2];
const overlayCards = [
  { title: "Group Style", text: "A synchronized dance performed by a group of dancers." },
  { title: "Desi Style", text: "A traditional and cultural dance style with rich cultural elements." },
  { title: "Stage Performance", text: "An energetic and captivating dance performed on stage." },
  { title: "Couple Style", text: "A romantic and coordinated dance performed by a dance couple." },
  { title: "Bar Style", text: "A trendy and upbeat dance style commonly seen in bars and clubs." },
];


function LandingPage() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayCard, setOverlayCard] = useState({ title: "", text: "" });

  const handleCarouselSelect = (selectedIndex) => {
    setShowOverlay(true);
    setOverlayCard(overlayCards[selectedIndex]);
  };

  const overlayStyle = {
    position: "absolute",
    top: "20%",
    left: "30%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    zIndex: 1,
    background: "rgba(255, 255, 255, 0.7)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    padding: "2px",
  };

  const titleStyle = {
    fontSize: "32px",
    color: "white",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    padding: "2px",
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.8)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
  };


  return (
    <div className="landing-page">
      <Container className="my-5">
        <Row>
          <Col>
            <Carousel onSelect={handleCarouselSelect}>
              {danceImages.map((image, index) => (
                <Carousel.Item key={index}>
                  <div style={overlayStyle}>
                    <h1 style={titleStyle}>{overlayCards[index].title}</h1>
                    <p className="carousel-text">{overlayCards[index].text}</p>
                  </div>
                  <img src={image} alt={`Carousel Item ${index + 1}`} style={{ height: "400px", width: "100%" }} />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
        <br />
        <br />
        <Row>
          <Col>
            <Card className="h-100" style={cardStyle}>
              <Card.Body>
                <Card.Title className="text-primary">
                  <h1>Search for studios near you!</h1>
                </Card.Title>
                <Card.Text className="text-secondary">
                  Welcome to Nritya!
                  <br />
                  <br />
                  Are you looking for a fun and convenient way to learn new dance moves and build your dance community?
                  <br />
                  <br />
                  Team Nritya
                </Card.Text>
              </Card.Body>
              <Button variant="primary" href="#/search/studios">
                Search!
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;
