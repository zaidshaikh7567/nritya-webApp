import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel, Container, Row, Col, Card, Spinner,Button,ButtonGroup,Badge,Image, Form } from 'react-bootstrap';
import { db,storage } from '../config';
import { getStorage, ref,listAll, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc, getDocs, collection , updateDoc} from "firebase/firestore";
import { STATUSES, COLLECTIONS, AMENITIES_ICONS } from "./../constants.js";
import Table from 'react-bootstrap/Table';
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaDirections } from 'react-icons/fa';
import './Carousel.css';
import MapReadOnly from '../Components/MapReadOnly';
import { FaClock, FaMoneyBill, FaMapMarker, FaPhone, FaWhatsapp  } from 'react-icons/fa';
import Ratings from '../Components/Ratings';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import StarRating from '../Components/StarRating';
import Skeleton from '@mui/material/Skeleton';
import '../Components/NrityaCard.css'
import NrityaCard from '../Components/NrityaCard.js';
import TableView from './TableView.js';
import '../Common.css'
import CircularCarousel from '../Components/CircularCarousel.js';
import CardSlider from '../Components/CardSlider.js';
import {Card as MuiCard} from '@mui/joy/Card';
import CardCover from '@mui/joy/CardCover';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { Paper, List, ListItem, Chip, Grid } from '@mui/material';
import { FaShare } from 'react-icons/fa';
import axios from 'axios';




// Function to decode a Unicode (UTF-8) encoded string back to the original text
const decodeUnicode = (unicodeString) => {
  const utf8Encoded = unicodeString.split('').map((c) => c.charCodeAt(0));
  const textDecoder = new TextDecoder();
  return textDecoder.decode(new Uint8Array(utf8Encoded));
};

function convertToHtmlEntities(text) {
  return text.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
      return '&#' + i.charCodeAt(0) + ';';
  });
}

const gradientStyles = [
  { background: 'linear-gradient(to bottom right, #FFD700, #FFA500)', color: 'black' },
  { background: 'linear-gradient(to bottom right, #00BFFF, #1E90FF)', color: 'black' },
  { background: 'linear-gradient(to bottom right, #32CD32, #008000)', color: 'white' },
  { background: 'linear-gradient(to bottom right, #FFA500, #FF4500)', color: 'black' },
  { background: 'linear-gradient(to bottom right, #DC143C, #8B0000)', color: 'white' },
  { background: 'linear-gradient(to bottom right, #000000, #2F4F4F)', color: 'white' },
];


function StudioFullPage() {
  const { studioId } = useParams();
  console.log("From StudioFullPage", studioId);
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const containerRef = useRef(null);
  const [studioData, setStudioData] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);


// Function to update the recently watched studios in Firebase
const updateRecentlyWatchedInFirebase = async (userId, studioId) => {
  try {

    const userRef = doc(db, COLLECTIONS.USER, userId);
    const userDoc = await getDoc(userRef);
    const recentlyWatchedMap = userDoc.exists() ? userDoc.data().recentlyWatched : {};

    const isStudioWatched = Object.values(recentlyWatchedMap).includes(studioId);

    // If the studio ID is already present, remove its older occurrences and keep the new one at the 0th key
    if (isStudioWatched) {
      const updatedRecentlyWatched = {};
      let count = 1;
      console.log(recentlyWatchedMap)
      for (const key in recentlyWatchedMap) {
        if (recentlyWatchedMap[key] === studioId) {
          // Skip the older occurrence of the studio ID
          continue;
        }
        updatedRecentlyWatched[count] = recentlyWatchedMap[key];
        count++;
      }

      // Add the latest watched studio ID at the 0th key
      updatedRecentlyWatched[0] = studioId;

      // Save the updated "recentlyWatched" map back to Firebase
      await updateDoc(userRef, { recentlyWatched: updatedRecentlyWatched });
    } else {
      // If the studio ID is not already present, follow the same logic as before
      const updatedRecentlyWatched = { ...recentlyWatchedMap };
      // Shift the existing entries in the "recentlyWatched" map to create space for the latest watched studio ID
      for (let i = Object.keys(updatedRecentlyWatched).length - 1; i >= 0; i--) {
        if (i === 0) {
          delete updatedRecentlyWatched[i]; // Remove the last entry to keep the map size within 5
        } else {
          updatedRecentlyWatched[i] = updatedRecentlyWatched[i - 1];
        }
      }

      // Add the latest watched studio ID at the first index (key "0")
      updatedRecentlyWatched[0] = studioId;
      console.log(updatedRecentlyWatched)
      // Save the updated "recentlyWatched" map back to Firebase
      await updateDoc(userRef, { recentlyWatched: updatedRecentlyWatched });
    }
  } catch (error) {
    console.error("Error updating recently watched in Firebase:", error);
  }
};


  const BASEURL_STUDIO="https://nrityaserver-2b241e0a97e5.herokuapp.com/api/studio/"
  useEffect(() => {
    const fetchData = async () => {
      if(JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).UserId){
        const UserId = JSON.parse(localStorage.getItem('userInfo')).UserId
        updateRecentlyWatchedInFirebase(UserId,studioId);
      }
      const responseText = await axios.get(`${BASEURL_STUDIO}${studioId}/text/`);
      const dataText = responseText.data;
      setStudioData(dataText);
      const responseImages = await axios.get(`${BASEURL_STUDIO}${studioId}/images/`);
      const dataImages = responseImages.data;
      if(dataImages && dataImages.studioImages){
        setCarouselImages(dataImages.studioImages)
      }
      console.log(studioData);

    };

    fetchData();
   
  }, []);

  return (
  <Container fluid style={{backgroundColor: isDarkModeOn?'#202020':'white' ,color: isDarkModeOn?'white':'color' }}>
      <Row>
      <Col lg={8}  >
      <Row>
        <Col lg={9} md={9}>
        <Typography variant="h1" component="h1" style={{ color: isDarkModeOn ? 'white' : 'black',fontSize: '24px' }}>
        {studioData ? studioData.studioName : ""}
        </Typography>
        </Col>
        <Col lg={3} md={3}>
          {studioData && studioData.avgRating ? <StarRating rating={studioData.avgRating} viewMode={true} /> : ""}
        </Col>
      </Row>
      <Row>
      <Col xs={12}>
      {studioData && (studioData.facebook || studioData.youtube || studioData.instagram || studioData.twitter) && (
      <div style={{ display: 'flex', justifyContent: 'left' }}>
        {studioData.youtube && (
          <a href={studioData.youtube} target="_blank" rel="noopener noreferrer">
            <FaYoutube className='genericHoverEffect' style={{ color: isDarkModeOn ? '#fff' : '#000', fontSize: '24px', marginRight: '10px' }} />
          </a>
        )}
        {studioData.facebook && (
          <a href={studioData.facebook} target="_blank" rel="noopener noreferrer">
            <FaFacebook className='genericHoverEffect' style={{ color: isDarkModeOn ? '#fff' : '#000', fontSize: '24px', marginRight: '10px' }} />
          </a>
        )}
        {studioData.instagram && (
          <a href={studioData.instagram} target="_blank" rel="noopener noreferrer">
            <FaInstagram className='genericHoverEffect' style={{ color: isDarkModeOn ? '#fff' : '#000', fontSize: '24px', marginRight: '10px' }} />
          </a>
        )}
        {studioData.twitter && (
          <a href={studioData.twitter} target="_blank" rel="noopener noreferrer">
            <FaTwitter className='genericHoverEffect' style={{ color: isDarkModeOn ? '#fff' : '#000', fontSize: '24px' }} />
          </a>
        )}
      </div>
        )}
      </Col>

      </Row>
      <Row>
      {studioData&&studioData.aboutStudio?
      
      <NrityaCard data={studioData.aboutStudio} type={'aboutStudio'} studioContactNumber={studioData.mobileNumber} studioWhatsAppNumber={studioData.whatsappNumber}/>:""} 
      </Row>
        
      </Col>
      <Col lg={4} xs={12} >
      {studioData&&studioData.aboutFounder? <NrityaCard data={studioData.aboutFounder} type={'aboutFounder'}  title={"About fOUNDER"}/>:""} 
      </Col>
    </Row>
      
      <br></br>
      <Row>
        <Col>
        <Typography variant="h1" component="h2" style={{ color: isDarkModeOn ? 'white' : 'black',fontSize: '18px' }}>
          Dance Styles
        </Typography>
          {studioData && studioData.danceStyles ? (
            studioData.danceStyles.split(',').map((style, index) => (
        <Badge pill className='genericHoverEffect'
          key={index}
          bg={index % 4 === 0 ? 'danger' : index % 4 === 1 ? 'warning' : index % 4 === 2 ? 'success' : 'info'}
          style={{ marginRight: '1rem', fontSize: '0.8rem' }}
        >
          {style}
        </Badge>
      ))
    ) : (
      <div></div>
    )}

        </Col>
      </Row>
      <br></br>
      
      <Row>
      {carouselImages.length? 
      <CardSlider dataList={carouselImages} imgOnly={true}/>
      :
      <>
      <Row>
              <Skeleton variant="rectangular" animation="wave"  sx={{paddingRight:"0.5rem"}} width={"240"} height={300} />
              <Skeleton variant="rectangular" animation="wave"  sx={{paddingRight:"0.5rem"}} width={"240"} height={300} />
      </Row>
      </>
      }
      </Row>
      
      <br></br>
      <Row>
        <Col>
        <Typography variant="h1" component="h2" style={{ color: isDarkModeOn ? 'white' : 'black',fontSize: '18px' }}>
          Class Schedule
        </Typography>
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col>
        {studioData && studioData.tableData ? (
            <TableView studioData={studioData} studioId={studioId} />
          ) : (
            <>
              <Row>
              <Skeleton variant="rectangular" animation="wave"  width={"100%"} height={340} />
              </Row>
              
            </>
          )}
        </Col>
      </Row>
      <br></br>
      <Row>
      <Typography variant="h1" component="h2" style={{ color: isDarkModeOn ? 'white' : 'black',color: isDarkModeOn ? 'white' : 'black',fontSize: '18px' }}>
          Amenities
        </Typography>
        <Col lg={12}>
        
                {studioData &&
                          studioData.addAmenities &&
                          studioData.addAmenities.split(',').map((amenity, index) => {
                            const trimmedAmenity = amenity.trim();
                            let icon = AMENITIES_ICONS[trimmedAmenity];

              return (
               
                  <Chip key={index}
                    icon={icon && React.cloneElement(icon, { style: { color: isDarkModeOn ? 'white' : 'black' } })}
                    label={trimmedAmenity}
                    
                    style={{ marginRight: '1rem', marginBottom: '0.5rem' , alignItems:'center'}}
                    
                    sx={{ 
                      color: isDarkModeOn ? 'white' : 'black',
                      marginRight: '0.5rem', 
                      marginBottom: '0.5rem',
                      paddingRight: '0.5rem',
                      paddingLeft: '0.5rem',
                                       
                    }}
        
                  /> 
              );
            })}
        


        </Col>
      </Row>
      <br></br>
      <Row>
        <Col lg={12}>
        {studioData && studioData.enrollmentProcess && (
            <>
              <Typography variant="h1" component="h2"  style={{ color: isDarkModeOn ? 'white' : 'black',fontSize: '18px'  }}>
          Enrollment Process
        </Typography>
              <Typography  variant="body1" style={{ color: isDarkModeOn ? "white" : "black" }} whiteSpace="pre-wrap">
                {studioData.enrollmentProcess}
              </Typography>
            </>
          )}

        </Col>
      </Row>
      <br></br>
      <br></br>
      <Row>
      <Col md={3} lg={3} className="d-flex flex-column">
          <Typography variant="h1" component="h2" style={{ color: isDarkModeOn ? 'white' : 'black',fontSize: '18px'  }}>
            <Grid container alignItems="center" spacing={1}>
              {studioData && studioData.geolocation && (
                <Grid item>
                  <a
                    href={`https://www.google.com/maps?q=${studioData.geolocation.lat},${studioData.geolocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaDirections style={{ color: isDarkModeOn ? 'white' : 'black'}} />
                  </a>
                </Grid>
              )}
              <Grid item>
                Visit Us at:
              </Grid>
            </Grid>
          </Typography>
                <br></br>
          <Grid container alignItems="center" spacing={1}>
          {studioData && (
          
            <Typography style={{ color: isDarkModeOn ? 'white' : 'black',fontSize: '18px'  }}>
              {`${studioData.buildingName ? studioData.buildingName + (studioData.buildingName.slice(-1) !== ',' ? ', ' : '') : ''}${studioData.street ? studioData.street + (studioData.street.slice(-1) !== ',' ? ', ' : '') : ''}${studioData.landmark ? studioData.landmark + (studioData.landmark.slice(-1) !== ',' ? ', ' : '') : ''}${studioData.city ? studioData.city : ''}`}
            </Typography>
          
            )}

          </Grid>
        </Col>


        <Col md={9} lg={9}>
        {studioData && studioData.geolocation && studioData.geolocation.lat && studioData.geolocation.lng ? (<MapReadOnly selectedLocationParam={studioData.geolocation}></MapReadOnly>) :""}
        </Col>
      </Row>
      <br></br>
      <Row className="justify-content-center">
        <Col xs="auto">
        <Ratings userID={JSON.parse(localStorage.getItem('userInfo'))? JSON.parse(localStorage.getItem('userInfo')).UserId: null} studioID={studioId}></Ratings>
        </Col>
      </Row>
      <br></br>
    </Container>
  
  )
};

const PinMarker = ({ text, isDarkModeOn }) => (
  <Badge pill bg={isDarkModeOn ? 'red' : 'blue'} style={{ position: 'relative', border: '0.1rem solid #ccc',fontSize: '1rem', }} text={ isDarkModeOn?'white':'black'}>
     <FaMapMarker/>{text}
  </Badge>
);
export default StudioFullPage;
