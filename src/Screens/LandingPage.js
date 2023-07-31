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
import { faBolt, faMusic, faHiking, faTrophy, faGlassCheers,faClock } from "@fortawesome/free-solid-svg-icons"; // Import specific icons from Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StudioCardIcon from "../Components/StudioCardIcon";


// Define the array of dance forms with their names and corresponding icons
const danceForms = [
  { name: "Bollywood", icon: faMusic },
  { name: "Salsa", icon: faGlassCheers },
  { name: "Hip Hop", icon: faBolt },
  { name: "Party", icon: faTrophy },
  { name: "Ballroom", icon: faHiking },
  { name: "Bollywood", icon: faMusic },
  { name: "Salsa", icon: faGlassCheers },
  { name: "Hip Hop", icon: faBolt },
  // Add more dance forms as needed
];

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
  const [recentlyWatchedStudios, setRecentlyWatchedStudios] = useState([]);

  // Function to fetch recently watched studio data from Firebase
const fetchRecentlyWatchedStudios = async (userId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USER, userId);
    const userDoc = await getDoc(userRef);
    const recentlyWatchedMap = userDoc.exists() ? userDoc.data().recentlyWatched : {};

    // Get the studio IDs from the recentlyWatched map
    const studioIds = Object.values(recentlyWatchedMap);

    // Fetch the studio data for each studio ID
    const studioData = [];
    for (const studioId of studioIds) {
      const studioRef = doc(db, COLLECTIONS.STUDIO, studioId);
      const studioDoc = await getDoc(studioRef);
      if (studioDoc.exists()) {
        const studio = { id: studioId, ...studioDoc.data() };
        studioData.push(studio);
      }
    }

    setRecentlyWatchedStudios(studioData);
  } catch (error) {
    console.error("Error fetching recently watched studios:", error);
  }
};



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
      if (JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).UserId) {
        const userId = JSON.parse(localStorage.getItem('userInfo')).UserId;
        fetchRecentlyWatchedStudios(userId);
      }
    }

    getStudios();
  }, []);

    // Define a state variable to hold the dynamic image height
    const [imageHeight, setImageHeight] = useState(400);

    useEffect(() => {
      // Calculate the desired height based on the aspect ratio (16:9) and the available width
      const calculateImageHeight = () => {
        const screenWidth = window.innerWidth;
        // Define the aspect ratio (16:9)
        const aspectRatioWidth = 16;
        const aspectRatioHeight = 9;
        // Calculate the height based on the aspect ratio and available width
        const desiredHeight = (screenWidth * aspectRatioHeight) / aspectRatioWidth;
        setImageHeight(desiredHeight);
      };
  
      calculateImageHeight();
      // Add event listener to handle resizing
      window.addEventListener("resize", calculateImageHeight);
  
      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener("resize", calculateImageHeight);
      };
    }, []);

  return (
    <div className="landing-page">
      <Container className="my-5">
        <Row>
          <Col>
            <Carousel onSelect={handleCarouselSelect}>
              {danceImages.map((image, index) => (
                <Carousel.Item key={index}>
                {window.innerWidth > 768 && ( // Show the overlay only when the screen is larger than 768 pixels
                  <div style={currentOverlayStyle}>
                    <h1 style={currentTitleStyle}>{overlayCards[index].title}</h1>
                    <p className="carousel-text" style={currentSubtitleStyle}>
                      {overlayCards[index].text}
                    </p>
                  </div>
                )}
                <img src={image} alt={`Carousel Item ${index + 1}`} style={{ height: `${imageHeight}px`, width: "100%" }} />
              </Carousel.Item>
              
              ))}
            </Carousel>
          </Col>
        </Row>
        <br />
      

      <Col>
        {recentlyWatchedStudios.length > 0 && <h2> <FontAwesomeIcon icon={faClock} size="1x" /> Recently Watched Studios</h2>}
        <Row>
          {recentlyWatchedStudios.slice(0, 3).map((studio, index) => (
            <Col key={index} md={2}>

                <StudioCardIcon
                key={index}
                studioName={studio.studioName}
                studioAddress={studio.address}
                studioPrice={studio.price}
                studioTiming={studio.timing} 
              />
            </Col>
          ))}
        </Row>
      </Col>


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

          <Col>
            <Card className="h-100" style={cardStyle}>
              <Card.Body>
                <Card.Title className="text-primary">
                  <h1>Search for workshops near you!</h1>
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
              <Button variant="primary" href="#/search/workshop">
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
        <br></br>
        <h1>BROWSE BY GENRE</h1>
        <Row>
          {danceForms.map((danceForm, index) => (
            <Col key={index} sm={6} md={4} lg={3}>
              <Card style={cardStyle}>
                <Card.Body>
                  <FontAwesomeIcon icon={danceForm.icon} size="3x" />
                  <h3>{danceForm.name}</h3>
                </Card.Body>
              </Card>
              <br></br>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;
