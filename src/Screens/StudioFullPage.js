import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel, Container, Row, Col, Card, Spinner,Button,ButtonGroup,Badge,Image } from 'react-bootstrap';
import { db,storage } from '../config';
import { getStorage, ref,listAll, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc, getDocs, collection , updateDoc} from "firebase/firestore";
import { STATUSES, COLLECTIONS } from "./../constants.js";
import Table from 'react-bootstrap/Table';
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
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


// Function to decode a Unicode (UTF-8) encoded string back to the original text
const decodeUnicode = (unicodeString) => {
  const utf8Encoded = unicodeString.split('').map((c) => c.charCodeAt(0));
  const textDecoder = new TextDecoder();
  return textDecoder.decode(new Uint8Array(utf8Encoded));
};

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
  const [studioDescription, setStudioDescription] = useState(null);
  const [studioTableData, setStudioTableData] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  

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



  useEffect(() => {
    const fetchData = async () => {
      if(JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).UserId){
        const UserId = JSON.parse(localStorage.getItem('userInfo')).UserId
        updateRecentlyWatchedInFirebase(UserId,studioId);
      }
      const studioRef = doc(db, COLLECTIONS.STUDIO, studioId);
      const studioSnap = await getDoc(studioRef);
      if (studioSnap) {
        if (studioSnap.data() != null) {
          const data = studioSnap.data();
          setStudioData(data);
          console.log(studioData);
    
          const storageRef = ref(storage, `StudioImages/${studioId}`);
          const result = await listAll(storageRef);

          const urlPromises = result.items.map((imageRef) => getDownloadURL(imageRef));

          const imageUrls = await Promise.all(urlPromises);
          setCarouselImages(imageUrls);
          setIsLoadingImages(false);
        
        }

      }
    };

    fetchData();
   
  }, []);

  return (
  <Container fluid style={{backgroundColor: isDarkModeOn?'black':'white' ,color: isDarkModeOn?'white':'color' }}>
      <Row>
      <Col lg={8}  >
      <Row>
        <Col lg={7} md={7}>
          <h4 style={{ color: isDarkModeOn ? 'white' : '' }}>{studioData ? studioData.studioName : ""}</h4>
        </Col>
        <Col lg={3} md={3}>
          {studioData && studioData.avgRating ? <StarRating rating={studioData.avgRating} viewMode={true} /> : ""}
        </Col>
        <Col lg={2} md={2} >
          {studioData && studioData.geolocation && studioData.geolocation.lat && studioData.geolocation.lng ? (
            <a
              href={`https://www.google.com/maps?q=${studioData.geolocation.lat},${studioData.geolocation.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              
            >
              <PinMarker  lat={studioData.geolocation.lat} lng={studioData.geolocation.lng} text={studioData.city} isDarkModeOn={isDarkModeOn} />
            </a>
          ) : (
            <div style={{ color: 'blue', fontSize: '2rem' }}>{studioData && studioData.city ? studioData.city : ""}</div>
          )}
        </Col>
      </Row>
      <Row>
      <Col xs={12}>
        <div style={{ display: 'flex', justifyContent: 'left' }}>
        {isDarkModeOn ? (
          <>
            <FaYoutube className='genericHoverEffect' style={{ color: '#fff', fontSize: '24px', marginRight: '10px' }} />
            <FaFacebook className='genericHoverEffect' style={{ color: '#fff', fontSize: '24px', marginRight: '10px' }} />
            <FaInstagram className='genericHoverEffect' style={{ color: '#fff', fontSize: '24px', marginRight: '10px' }} />
            <FaTwitter className='genericHoverEffect' style={{ color: '#fff', fontSize: '24px' }} />
          </>
        ) : (
          <>
            <FaYoutube className='genericHoverEffect' style={{ color: '#ff0000', fontSize: '24px', marginRight: '10px' }} />
            <FaFacebook className='genericHoverEffect' style={{ color: '#00aced', fontSize: '24px', marginRight: '10px' }} />
            <FaInstagram className='genericHoverEffect' style={{ color: '#bc2a8d', fontSize: '24px', marginRight: '10px' }} />
            <FaTwitter className='genericHoverEffect' style={{ color: '#00aced', fontSize: '24px' }} />
          </>
        )}
      </div>
          <br></br>
        </Col>
      </Row>
      <Row>
      {studioData&&studioData.aboutStudio? <NrityaCard data={studioData.aboutStudio} title={"About Studio"}/>:""} 
      </Row>
        
      </Col>
      <Col lg={4} xs={12} >
      {studioData&&studioData.aboutFounder? <NrityaCard data={studioData.aboutFounder} aboutFounder={true} founderEmail={studioData.creatorEmail} founderWhatsAppNumber={studioData.whatsappNumber} title={"About fOUNDER"}/>:""} 
      </Col>
    </Row>
      
      <br></br>
      <Row>
        <Col>
          <h3 style={{color: isDarkModeOn?'white':'black' }} >Dance Forms</h3>
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
      <Row hidden>
        <Col>
          {isLoadingImages ? (
            <Row>
              {[100, 101, 102].map((index) => (
                <Col key={index} lg={6} md={12} sm={12}>
                  <Skeleton variant="rectangular" animation="wave" width={275} height={340} />
                </Col>
              ))}
            </Row>
          ) : (                
            <Carousel>
              {carouselImages &&
                carouselImages.map((image, index) => (
                  <Carousel.Item key={index}>
                    <div className="d-flex justify-content-between">
                    {[index, index + 1, index + 2].map((cardIndex) => {
                      const circularIndex = cardIndex % carouselImages.length;
                      const card = carouselImages[circularIndex];
                      return (
                        <div key={`${index}-${cardIndex}-${Math.floor(cardIndex / carouselImages.length)}`} md={2} style={{ maxWidth: '20rem', margin: '10px' }}>
                        <Card style={{ width: '100%', height: '100%' }}>
                          <Card.Img src={image} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                        </Card>
                      </div>  
                      );
                    })}
                    </div>
                  </Carousel.Item>
                ))}
            </Carousel>       
          )}
        </Col>
      </Row>
      
      <Row>
      {carouselImages.length? <CardSlider dataList={carouselImages} imgOnly={true}/>:""}
      </Row>
      
      <br></br>
      <Row>
        <Col>
        <h4 style={{color: isDarkModeOn?'white':'black' }} >Class Schedule</h4>
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
              <Skeleton variant="rectangular" animation="wave"  width={275} height={340} />
              <Skeleton variant="rectangular" animation="wave"  width={275} height={340} />
              <Skeleton variant="rectangular" animation="wave"  width={275} height={340} />
              </Row>
              
            </>
          )}
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col lg={6}>
        {studioData&&studioData.addAmenities? <NrityaCard data={studioData.addAmenities} title={"AMENTIES"}/>:""}
       
        </Col>
    
        <Col lg={6}>
        {studioData&&studioData.enrollmentProcess? <NrityaCard data={studioData.enrollmentProcess} title={"ENROLLMENT PROCESS"}/>:""} 
        </Col>
      </Row>
      <br></br>
      <Row>
      <Col md={2} lg={2} className="d-flex flex-column">
      <p className={isDarkModeOn ? "dark-mode-simple-text-big mb-2" : "simple-text-big mb-2"}>
              Visit Us at:
            </p>
        
            {studioData && studioData.buildingName ? (
              <p className={isDarkModeOn ? "dark-mode-simple-text mb-1" : "simple-text mb-1"}>
                {studioData.buildingName},
              </p>
            ) : null}
            {studioData && studioData.street ? (
              <p className={isDarkModeOn ? "dark-mode-simple-text mb-1" : "simple-text mb-1"}>
                {studioData.street},
              </p>
            ) : null}
            {studioData && studioData.landmark ? (
              <p className={isDarkModeOn ? "dark-mode-simple-text mb-1" : "simple-text mb-1"}>
                {studioData.landmark},
              </p>
            ) : null}
            {studioData && studioData.city ? (
              <p className={isDarkModeOn ? "dark-mode-simple-text mb-1" : "simple-text mb-1"}>
                {studioData.city}
              </p>
            ) : null}
          
      </Col>

        <Col md={10} lg={10}>
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
  <Badge pill bg={isDarkModeOn ? 'dark' : 'light'} style={{ position: 'relative', border: '0.1rem solid #ccc',fontSize: '1rem', }} text={ isDarkModeOn?'white':'black'}>
     <FaMapMarker/>{text}
  </Badge>
);
export default StudioFullPage;
