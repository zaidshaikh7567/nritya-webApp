import React, { useState,useEffect,useRef  } from "react";
import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import Dance1 from "../Components/DanceImg/Dance1.jpg";
import Dance2 from "../Components/DanceImg/Dance2.jpg";
import Dance3 from "../Components/DanceImg/Dance3.jpg";
import Dance4 from "../Components/DanceImg/Dance4.jpg";
import Dance5 from "../Components/DanceImg/Dance5.jpg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection,where,getDocs,query,limit } from "firebase/firestore";
import { COLLECTIONS } from '../constants';
import StudioCard from "../Components/StudioCard";
import { faBolt, faMusic, faHiking, faTrophy, faGlassCheers,faClock } from "@fortawesome/free-solid-svg-icons"; // Import specific icons from Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StudioCardIcon from "../Components/StudioCardIcon";
import './LandingPage.css'
import MapsInput from "../Components/MapsInput";


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
  const rowRef = useRef(null);

  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollDistance = container.clientWidth; // Scroll by one screen width
  
      // Calculate the new scroll position and ensure it doesn't go beyond the content boundaries
      const newScrollLeft = Math.max(container.scrollLeft - scrollDistance, 0);
  
      // Set the new scroll position
      container.scrollLeft = newScrollLeft;
    }
  };
  
  const scrollRight = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollDistance = container.clientWidth; // Scroll by one screen width
  
      // Calculate the new scroll position and ensure it doesn't go beyond the content boundaries
      const newScrollLeft = Math.min(
        container.scrollLeft + scrollDistance,
        container.scrollWidth - container.clientWidth
      );
  
      // Set the new scroll position
      container.scrollLeft = newScrollLeft;
    }
  };
  
  

  const fetchRecentlyWatchedStudios = async (userId) => {
    try {
      const userRef = doc(db, COLLECTIONS.USER, userId);
      const userDoc = await getDoc(userRef);
      const recentlyWatchedMap = userDoc.exists() ? userDoc.data().recentlyWatched : {};
  
      // Get the studio IDs from the recentlyWatched map
      const studioIds = Object.values(recentlyWatchedMap);
      console.log("got",studioIds)
      // Fetch the studio data for each studio ID using Promise.all
      const studioDataPromises = studioIds.map(async (studioId) => {
        console.log(studioId)
        if (!studioId) {
          console.warn("Invalid studioId:", studioId);
          return null;
        }
        console.log("studioId", studioId);
        const studioRef = doc(db, COLLECTIONS.STUDIO, studioId);
        const studioDoc = await getDoc(studioRef);
        if (studioDoc.exists()) {
          console.log(studioDoc.data())
          return { id: studioId, ...studioDoc.data() };
        } else {
          console.warn(`Studio document not found for ID: ${studioId}`);
          return null;
        }
      });
  
      // Wait for all promises to resolve using Promise.all
      const studioData = await Promise.all(studioDataPromises);
  
      // Filter out any null values caused by invalid or missing studioId values
      const validStudioData = studioData.filter((studio) => studio !== null);
  
      // Update the state with the fetched studio data
      setRecentlyWatchedStudios(validStudioData);
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
      const q = query(studioRef, limit(15));
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

    const isSmallScreen = window.innerWidth <= 768;

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
    
        <Row>
          {recentlyWatchedStudios.length > 0 && <h2> <FontAwesomeIcon icon={faClock} size="1x" /> Recently Watched Studios</h2>}
          <div className="row-container">
          {recentlyWatchedStudios.map((studio, index) => (
            <div key={index} className="row-item" md={2}>
              <a href={`#/studio/${studio.id}`}>
              <StudioCard
                    studioName={studio.studioName}
                    studioAddress={studio.address}
                    studioPrice={studio.price}
                    studioTiming={studio.timing}
                    studioDanceStyles={studio.danceStyles}
                    studioId={studio.id}
                    forceSmallView={1}
                  />
              </a>
            </div>
          ))}
        </div>
        </Row>
     


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
          <Col style={{ display: 'none'}}>
          {exploreCards.length > 0 && <h2>Explore</h2>}
          <Carousel
          onSelect={handleCarouselSelect}
          style={{ height: "100%", overflow: "hidden" }}
          interval={5000} // Adjust interval as needed
          wrap={false} // Prevent wrapping when reaching the beginning or end
        >
          {exploreCards.map((exploreCard, index) => (
            <Carousel.Item key={index}>
              <div className="d-flex justify-content-between">
                {[index, index + 1, index + 2].map((cardIndex) => {
                  // Use modulo to loop through the cards in a circular fashion
                  const circularIndex = cardIndex % exploreCards.length;
                  const card = exploreCards[circularIndex];

                  return (
                    <div
                      key={circularIndex}
                      className="studio-card-container"
                      style={{ flex: "1", padding: "10px" }}
                    >
                      <StudioCard
                        studioName={card.studioName}
                        studioAddress={card.address}
                        studioInstructors={card.instructors}
                        studioPrice={card.price}
                        studioTiming={card.timing}
                        studioDanceStyles={card.danceStyles}
                        studioContactNumber={card.contactNumber}
                        studioId={card.id}
                        forceSmallView={1}
                      />
                    </div>
                  );
                })}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>



          </Col>
        </Row>
        <br></br>
        <Row style={{ display: 'none'}}>
          {exploreCards.length > 0 && <h2>Explore Studios</h2>}
          <div className="row-container">
            {exploreCards.map((studio, index) => (
              <div key={index} style={{ padding: '1px' }}>
                <a href={`#/studio/${studio.id}`}>
                  <StudioCard
                    studioName={studio.studioName}
                    studioAddress={studio.address}
                    studioPrice={studio.price}
                    studioTiming={studio.timing}
                    studioDanceStyles={studio.danceStyles}
                    studioId={studio.id}
                    forceSmallView={1}
                  />
                </a>
              </div>
            ))}
          </div>
        </Row>
        <br/>

        <Row>
      {isSmallScreen ? (
        // Code for small screens
        <>
          {exploreCards.length > 0 && <h2>Explore Studios</h2>}
          <div className="row-container">
            {exploreCards.map((studio, index) => (
              <div key={index}  md={2}>
                <a href={`#/studio/${studio.id}`}>
                  <StudioCard
                     studioName={studio.studioName}
                     studioAddress={studio.address}
                     studioPrice={studio.price}
                     studioTiming={studio.timing}
                     studioDanceStyles={studio.danceStyles}
                     studioId={studio.id}
                     forceSmallView={1}
                  />
                </a>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Code for larger screens
        <>
          {exploreCards.length > 0 && <h2>Studios you might like</h2>}
      <div style={{ display: 'flex', alignItems: 'center' , overflowX: 'hidden'}}>
        <button
          onClick={(e) => {
            e.preventDefault();
            scrollLeft();
          }}
          style={{ backgroundColor: '#F5F5DC', border: '2px', cursor: 'pointer',borderRadius:'50px' ,fontSize: '24px' }}
        >
          <FaChevronLeft />
        </button>
        <div
          ref={containerRef}
          className="row-container"
          style={{ overflowX: 'hidden', whiteSpace: 'nowrap', display: 'flex' }}
        >
          {exploreCards.map((studio, index) => (
            <div key={index} style={{ marginRight: '10px', padding: '1px' , textDecoration: 'none' }}>
              <a href={`#/studio/${studio.id}`}  style={{ textDecoration: 'none' }}>
                <StudioCard
                  studioName={studio.studioName}
                  studioAddress={studio.address}
                  studioPrice={studio.price}
                  studioTiming={studio.timing}
                  studioDanceStyles={studio.danceStyles}
                  studioId={studio.id}
                  forceSmallView={1}
                />
              </a>
            </div>
          ))}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            scrollRight();
          }}
          style={{ backgroundColor: '#F5F5DC', border: '2px', cursor: 'pointer',borderRadius:'50px' ,fontSize: '24px' }}
        >
          <FaChevronRight />
        </button>
      </div>
        </>
      )}
        
        </Row>
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
