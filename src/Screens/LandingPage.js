import React, { useState,useEffect } from "react";
import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import Dance1 from "../Components/DanceImg/Dance1.jpg";
import Dance2 from "../Components/DanceImg/Dance2.jpg";
import Dance3 from "../Components/DanceImg/Dance3.jpg";
import Dance4 from "../Components/DanceImg/Dance4.jpg";
import Dance5 from "../Components/DanceImg/Dance5.jpg";
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection,where,getDocs,query,limit } from "firebase/firestore";
import { COLLECTIONS } from '../constants';
import StudioCard from "../Components/StudioCard";

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
  const [exploreCards, setExploreCards] = useState([])

  const handleCarouselSelect = (selectedIndex) => {
    setShowOverlay(true);
    setOverlayCard(overlayCards[selectedIndex]);
  };

  const overlayStyle = {
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    zIndex: 1,
    background: "rgba(255, 255, 255, 0.7)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    padding: "2px",
    width: "80%", // Set a default width for the overlay
    maxWidth: "400px", // Set a maximum width for the overlay
  };

  const titleStyle = {
    fontSize: "24px",
    color: "white",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    padding: "2px",
  };

  // Adjust the styles for smaller screens using media queries
  // For example, on screens with a maximum width of 768px (sm), set a smaller font size
  // and adjust the top position of the overlay.
  // You can modify these values as needed to achieve the desired responsive behavior.
  // Note: Make sure to use values appropriate for your design and screen sizes.

  // For smaller screens (sm)
  const smallScreenMediaQuery = "@media (max-width: 768px)";
  const smallScreenOverlayStyle = {
    ...overlayStyle,
    top: "40%", // Adjust the top position for smaller screens
    width: "90%", // Adjust the width for smaller screens
  };

  // For extra-small screens (xs)
  const extraSmallScreenMediaQuery = "@media (max-width: 576px)";
  const extraSmallScreenOverlayStyle = {
    ...overlayStyle,
    top: "50%", // Adjust the top position for extra-small screens
    width: "100%", // Adjust the width for extra-small screens
  };

  // Apply the appropriate overlay styles based on the screen size
  const currentOverlayStyle =
    smallScreenMediaQuery in document.body.style
      ? smallScreenOverlayStyle
      : extraSmallScreenMediaQuery in document.body.style
      ? extraSmallScreenOverlayStyle
      : overlayStyle;

  // Adjust the font size for smaller screens using media queries
  const smallScreenTitleStyle = {
    ...titleStyle,
    fontSize: "24px", // Adjust the font size for smaller screens
  };

  // Adjust the font size for extra-small screens using media queries
  const extraSmallScreenTitleStyle = {
    ...titleStyle,
    fontSize: "10px", // Adjust the font size for extra-small screens
  };

  // Apply the appropriate title styles based on the screen size
  const currentTitleStyle =
    smallScreenMediaQuery in document.body.style
      ? smallScreenTitleStyle
      : extraSmallScreenMediaQuery in document.body.style
      ? extraSmallScreenTitleStyle
      : titleStyle;
  
  
      const subtitleStyle = {
        fontSize: "16px", // Default font size for the subtitle
        color: "white",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        padding: "2px",
      };
    
      // Adjust the font size for smaller screens using media queries
      const smallScreenSubtitleStyle = {
        ...subtitleStyle,
        fontSize: "10px", // Adjust the font size for smaller screens
        color: "cyan",
      };
    
      // Adjust the font size for extra-small screens using media queries
      const extraSmallScreenSubtitleStyle = {
        ...subtitleStyle,
        fontSize: "6px", // Adjust the font size for extra-small screens
        color: "cyan",
      };
    
      // Apply the appropriate subtitle styles based on the screen size
      const currentSubtitleStyle =
        smallScreenMediaQuery in document.body.style
          ? smallScreenSubtitleStyle
          : extraSmallScreenMediaQuery in document.body.style
          ? extraSmallScreenSubtitleStyle
          : subtitleStyle;

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.8)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
  };

  useEffect(() => {
    const getStudios = async () => {
      const studioRef = collection(db, COLLECTIONS.STUDIO);
      const q = query(studioRef, limit(5));
      const querySnapshot = await getDocs(q);
      const exploreStudioList = querySnapshot.docs.filter(doc => doc.data().studioName).map(doc => 
        { const data = doc.data();
          return {
            id: doc.id, // Include the document ID in the data
            ...data
          };
      });
      setExploreCards(exploreStudioList)
      console.log(exploreCards)
    }

    getStudios();
  }, []);

  return (
    <div className="landing-page">
      <Container className="my-5">
        <Row>
          <Col>
            <Carousel onSelect={handleCarouselSelect}>
              {danceImages.map((image, index) => (
                <Carousel.Item key={index}>
                  <div style={currentOverlayStyle}>
                    <h1 style={currentTitleStyle}>{overlayCards[index].title}</h1>
                    <p className="carousel-text"style={currentSubtitleStyle}>{overlayCards[index].text}</p>
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
        <br />
        <br />
        <Row>
          <Col>
          {exploreCards.length > 0 && <h2>Explore</h2>}
          <Carousel onSelect={handleCarouselSelect} style={{ height: "100%", overflow: "hidden" }}>
            { exploreCards.map((exploreCards, index) => (
            <Carousel.Item key={index}>
              {console.log("explore studio ",exploreCards,index)}
              <StudioCard studioName={exploreCards.studioName} studioAddress={exploreCards.address} studioInstructors={exploreCards.instructors} studioPrice={exploreCards.price} studioTiming={exploreCards.timing} studioDanceStyles={exploreCards.danceStyles} studioContactNumber={exploreCards.contactNumber} studioId={exploreCards.id}/>
            </Carousel.Item>
          ))}
          </Carousel>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;
