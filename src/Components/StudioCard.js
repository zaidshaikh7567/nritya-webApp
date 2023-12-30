import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, ButtonGroup } from 'react-bootstrap';
import RenderRating from './RenderRating';
import { useNavigate } from 'react-router-dom';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../config';
import { STORAGES } from '../constants';
import { FaClock, FaMoneyBill, FaMapMarker } from 'react-icons/fa';
import StarRating from './StarRating';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import './StudioCard.css'

function StudioCard({studioName,studioAddress,studioTiming,studioPrice,studioInstructors,studioDanceStyles,
                    studioContactNumber,studioId,averageRating,forceSmallView,}) {

  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const navigate = useNavigate();
  const [studioIconUrl, setStudioIconUrl] = useState(null);
  console.log(averageRating,studioName)
  useEffect(() => {
    // Fetch and set the studio icon URL using studioId
    if (studioId) {
      const storagePath = `${STORAGES.STUDIOICON}/${studioId}`;
      const folderRef = ref(storage, storagePath);

      try {
        listAll(folderRef)
          .then((result) => {
            if (result.items.length > 0) {
              const firstFileRef = result.items[0];
              getDownloadURL(firstFileRef)
                .then((url) => {
                  setStudioIconUrl(url);
                })
                .catch((error) => {
                  console.error('Error fetching studio icon:', error);
                });
            } else {
              console.log('No files found in the folder.');
            }
          })
          .catch((error) => {
            console.error('Error listing files in the folder:', error);
          });
      } catch (error) {
        console.error('Error fetching studio icon:', error);
      }
    }
  }, [studioId]);

  const shouldShowSmallScreenView = () => {
    return forceSmallView === 1;
  };
  
  // 2f4f4f 333333
  // Content for small screens  
  const smallScreenContent = (
    <Card className={`cardContainer ${isDarkModeOn ? 'darkMode' : ''}`}>
      <Card.Img
        variant="top"
        src={studioIconUrl ? studioIconUrl : "https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"}
        className="cardImg"
      />
      <Card.Body>
        <Card.Text className="cardText">{studioName}</Card.Text>
        {studioDanceStyles && studioDanceStyles.split(",").slice(0, 3).map((form, index) => (
          <Badge
            key={index}
            bg={index % 2 === 0 ? "danger" : "warning"}
            className="badge me-2 rounded-pill"
          >
            {form.trim()}
          </Badge>
        ))}
        <StarRating rating={averageRating} viewMode={true} />
        <div className="starRatingContainer">
          <FaMapMarker size={14} className="mapMarkerIcon me-2" />
          <Card.Text>{studioAddress}</Card.Text>
        </div>
      </Card.Body>
    </Card>


  );

  // Content for larger screens
  const autoMode = (
    <Card style={{ backgroundColor: isDarkModeOn ? '#333333' : 'white'}} key="dark1" text={isDarkModeOn ? 'white' : 'dark'}>
    <div>
    
      {/* Display image on top for smaller screens */}
      <div className="d-block d-md-none">
        <div style={{ borderRadius: '5%', overflow: 'hidden', border: '1px solid #64FFDA', marginBottom: "10px", height: "250px", width: "100%" }}>
          <img
            className="d-block w-100"
            src={studioIconUrl ? studioIconUrl : "https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"}
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            alt="pic"
          />
        </div>
      </div>

      <Card.Body>
        {/* Display rest of the content below the image for smaller screens */}
        <div className="d-block d-md-none">
          <Card.Title style={{ fontSize: '1.5rem', textAlign: "left", marginBottom: "10px" }}>{studioName}</Card.Title>
          <Card.Subtitle style={{ fontSize: '0.8rem', textAlign: "left", marginBottom: "10px", textTransform: "none", wordBreak: 'break-word' }}>{studioId}</Card.Subtitle>
          <Card.Subtitle style={{ fontSize: '0.9rem', textAlign: "left", marginBottom: "10px", textTransform: "none", wordBreak: 'break-word' }}>4.2 <RenderRating rating="4.2" /> 350(ratings)</Card.Subtitle>
          <Card.Text style={{ fontSize: '1.0rem', color: '#E4A11B', textAlign: "left", wordBreak: 'break-word' }}>Instructor: {studioInstructors}</Card.Text>
          <Card.Text style={{ fontSize: '1.0rem', textAlign: "left" }}>{studioAddress}</Card.Text>
          <Card.Text style={{ fontSize: '1.0rem', textAlign: "left" }}>Timing: {studioTiming}</Card.Text>
          <Card.Text style={{ fontSize: '1.0rem', textAlign: "left" }}>Price: {studioPrice}</Card.Text>

          {console.log(studioDanceStyles)}
          {studioDanceStyles && studioDanceStyles.split(",").map((form, index) => (
            <Badge
              key={index}
              bg={index % 2 === 0 ? "danger" : "info"} // Alternate badge colors
              className="me-2 rounded-pill"
              style={{ marginBottom: "10px", fontSize: '0.8rem' }}
            >
              {form.trim()}
            </Badge>
          ))}

          {/* Buttons in one line */}
          <div className="d-flex justify-content-center">
            <ButtonGroup>
              <Button variant="outline-info" className="me-2 rounded-pill" size="sm" style={{ fontSize: '0.6rem' }}>
                <a href={"tel:" + studioContactNumber} style={{ textDecoration: 'none', color: 'inherit' }}>
                  Call
                </a>
              </Button>
              <Button variant="outline-info" className="me-2 rounded-pill" size="sm" style={{ fontSize: '0.6rem' }}>
                <a href={"https://wa.me/" + studioContactNumber} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  WhatsApp
                </a>
              </Button>
            </ButtonGroup>
          </div>
        </div>

        <div style={{ backgroundColor: "#000000", display: "grid", gridTemplateColumns: "1fr 2fr" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "10px" }}>
            {/* Hide image for larger screens */}
            <div className="d-none d-md-block">
              <div style={{ overflow: 'hidden', marginBottom: "10px", height: "100%", width: "100%" }}>
                <img
                  className="d-block w-100"
                  src={studioIconUrl ? studioIconUrl : "https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg"}
                  style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                  alt="pic"
                />
              </div>
            </div>
            <a href={"#/studio/" + studioId}>
            <Button variant="outline-warning" className="me-2 rounded-pill mb-2 d-flex justify-content-center align-items-center" size="sm" style={{ fontSize: '1.4rem' }}>Explore</Button>
            </a>
            {/* Buttons for larger screens */}
            <div className="d-none d-md-flex justify-content-center">
              <ButtonGroup>
                <Button variant="outline-info" className="me-2 rounded-pill" size="sm" style={{ fontSize: '0.6rem' }}>
                  <a href={"tel:" + studioContactNumber} style={{ textDecoration: 'none', color: 'inherit' }}>
                    Call
                  </a>
                </Button>
                <Button variant="outline-info" className="me-2 rounded-pill" size="sm" style={{ fontSize: '0.6rem' }}>
                  <a href={"https://wa.me/" + studioContactNumber} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    WhatsApp
                  </a>
                </Button>
              </ButtonGroup>
            </div>
          </div>
          {/* Display rest of the content on the right for larger screens */}
          <div className="d-none d-md-block" style={{ padding: "20px" }}>
            <Card.Title style={{ fontSize: '1.5rem', textAlign: "left", marginBottom: "10px" }}>{studioName}</Card.Title>
            <Card.Subtitle style={{ fontSize: '0.8rem', textAlign: "left", marginBottom: "10px", textTransform: "none", wordBreak: 'break-word' }}>{studioId}</Card.Subtitle>
            <Card.Subtitle style={{ fontSize: '0.9rem', textAlign: "left", marginBottom: "10px", textTransform: "none", wordBreak: 'break-word' }}>4.2 <RenderRating rating="4.2" /> 350(ratings)</Card.Subtitle>
            <Card.Text style={{ fontSize: '1.0rem', color: '#E4A11B', textAlign: "left", wordBreak: 'break-word' }}>Instructor: {studioInstructors}</Card.Text>
            <Card.Text style={{ fontSize: '1.0rem', textAlign: "left" }}>{studioAddress}</Card.Text>
            
            {console.log(studioDanceStyles)}
            {studioDanceStyles && studioDanceStyles.split(",").map((form, index) => (
              <Badge
                key={index}
                bg={index % 2 === 0 ? "danger" : "info"} // Alternate badge colors
                className="me-2 rounded-pill"
                style={{ marginBottom: "10px", fontSize: '0.8rem' }}
              >
                {form.trim()}
              </Badge>
            ))}

            <br />
          </div>
        </div>
      </Card.Body>
    </div>
    </Card>
  );

  return (
    <div>
    {shouldShowSmallScreenView() ? smallScreenContent : autoMode}

    </div>
  );
}

export default StudioCard;
