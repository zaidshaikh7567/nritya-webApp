import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Stack } from 'react-bootstrap';
import { db } from '../config';
import { doc, getDoc, getDocs, collection, updateDoc, where, query } from "firebase/firestore";
import { COLLECTIONS, AMENITIES_ICONS } from "./../constants.js";
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaDirections } from 'react-icons/fa';
import './Carousel.css';
import MapReadOnly from '../Components/MapReadOnly';
import { FaMapMarker, FaWhatsapp } from 'react-icons/fa';
import Ratings from '../Components/Ratings';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import StarRating from '../Components/StarRating';
import Skeleton from '@mui/material/Skeleton';
import '../Components/NrityaCard.css'
import NrityaCard from '../Components/NrityaCard.js';
import TableView from './TableView.js';
import '../Common.css'
import CardSlider from '../Components/CardSlider.js';
import WorkshopCardSlider from '../Components/WorkshopCardSlider.js';
import OpenClassCardSlider from '../Components/OpenClassCardSlider.js';
import CourseCardSlider from '../Components/CourseCardSlider.js';
import Typography from '@mui/joy/Typography';
import { Chip, Grid } from '@mui/material';
import axios from 'axios';
import { FaPhoneAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

function StudioFullPage() {
  const { studioId } = useParams();
  console.log("From StudioFullPage", studioId);
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const containerRef = useRef(null);
  const [studioData, setStudioData] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [announcementImages, setAnnouncementImages] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [openClasses, setOpenClasses] = useState([]);
  const [courses, setCourses] = useState([]);


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


  const BASEURL_STUDIO = "https://nrityaserver-2b241e0a97e5.herokuapp.com/api/studio/"
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).UserId) {
          const UserId = JSON.parse(localStorage.getItem('userInfo')).UserId
          updateRecentlyWatchedInFirebase(UserId, studioId);
        }
        const responseText = await axios.get(`${BASEURL_STUDIO}${studioId}/text/`);
        const dataText = responseText.data;
        setStudioData(dataText);
        const responseImages = await axios.get(`${BASEURL_STUDIO}${studioId}/images/`);
        const dataImages = responseImages.data;
        if (dataImages && dataImages.StudioImages) {
          setCarouselImages(dataImages.StudioImages)
        }
        if (dataImages && dataImages.StudioAnnouncements) {
          setAnnouncementImages(dataImages.StudioAnnouncements)
        }
        console.log(studioData);
      } catch (error) {
        console.error(error);
      }

    };

    fetchData();
  }, []);

  const whatsappMessage = encodeURIComponent("Hey, I found your Studio on nritya.co.in. I'm interested");

  useEffect(() => {
    const getWorkshopsOfStudio = async () => {
      const q = query(
        collection(db, COLLECTIONS.WORKSHOPS),
        where(
          "StudioId",
          "==",
          studioId
        ),
        where("active", "==", true)
      );

      const querySnapshot = await getDocs(q);
      const workshopsOfStudio = querySnapshot.docs
        .filter((doc) => doc.data().workshopName)
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        });
      setWorkshops(workshopsOfStudio);
    };

    getWorkshopsOfStudio();
  }, []);

  useEffect(() => {
    const getOpenClassesOfStudio = async () => {
      const q = query(
        collection(db, COLLECTIONS.OPEN_CLASSES),
        where(
          "StudioId",
          "==",
          studioId
        ),
        where("active", "==", true)
      );

      const querySnapshot = await getDocs(q);
      const openClassesOfStudio = querySnapshot.docs
        .filter((doc) => doc.data().openClassName)
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        });
      setOpenClasses(openClassesOfStudio);
    };

    getOpenClassesOfStudio();
  }, []);

  useEffect(() => {
    const getCoursesOfStudio = async () => {
      const q = query(
        collection(db, COLLECTIONS.COURSES),
        where(
          "StudioId",
          "==",
          studioId
        ),
        where("active", "==", true)
      );

      const querySnapshot = await getDocs(q);
      const coursesOfStudio = querySnapshot.docs
        .filter((doc) => doc.data().name)
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        });
      setCourses(coursesOfStudio);
    };

    getCoursesOfStudio();
  }, []);

  return (
    <Container fluid style={{ backgroundColor: isDarkModeOn ? '#202020' : 'white', color: isDarkModeOn ? 'white' : 'color' }}>
      <Helmet>
        <title>{studioData ? studioData.studioName : "Dance Studio"}</title>
        <meta name="description" content={`Learn ${studioData ? studioData.danceStyles : ''}`} />
      </Helmet>
      <Row>
        <Col lg={8} className='d-flex'>
          <div className='contentWrapper-main'>
            <div className='headerArea'>
              <div className='title-m'>
                <Typography variant="h1" component="h1" style={{ color: isDarkModeOn ? 'white' : 'black', fontSize: '24px' }}>
                  {studioData ? studioData.studioName : ""}
                </Typography>
              </div>
              <div className='userRating'>{studioData && studioData.avgRating ? <StarRating rating={studioData.avgRating} viewMode={true} /> : ""}</div>
            </div>

            <div className='socialRatings'>
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
                      <FaInstagram className='genericHoverEffect' style={{ color: isDarkModeOn ? '#fff' : '#000', fontSize: '24px', marginRight: '0px' }} />
                    </a>
                  )}
                  {studioData.twitter && (
                    <a href={studioData.twitter} target="_blank" rel="noopener noreferrer">
                      <FaTwitter className='genericHoverEffect' style={{ color: isDarkModeOn ? '#fff' : '#000', fontSize: '24px' }} />
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className='textWrapper' style={{ paddingBottom: '0.5rem' }}>
              {studioData && studioData.aboutStudio ?
                <NrityaCard data={studioData.aboutStudio} type={'aboutStudio'} /> : ""}
            </div>
          </div>

        </Col>
        <Col lg={4} xs={12} className='d-flex'>
          {studioData && studioData.aboutFounder ?
            <NrityaCard data={studioData.aboutFounder} type={'aboutFounder'} title={studioData.founderName ? studioData.founderName : "No name"} subtitle={"Founder"} /> : ""}
        </Col>
        <Col lg={4} xs={12} className='d-flex'>
          <div className='socialConnectFeature'>
            <Stack direction="horizontal" gap={1}>
              {studioData && studioData.whatsappNumber && (
                <Button className='custom-btn-wa' size="md" style={{ color: "white" }}>
                  <a
                    href={`https://wa.me/91${studioData.whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: isDarkModeOn ? 'transparent' : 'transparent', color: "white" }}
                  >
                    Text Studio <FaWhatsapp style={{ 'marginLeft': '2px' }} />
                  </a>
                </Button>
              )}
              {studioData && studioData.mobileNumber && (
                <Button className='custom-btn' size="md">
                  <a
                    href={`tel:${studioData.mobileNumber}`}
                    rel="noopener noreferrer"
                    style={{ backgroundColor: isDarkModeOn ? 'transparent' : 'transparent', color: 'white' }}
                  >
                    Call Studio <FaPhoneAlt style={{ 'marginLeft': '2px' }} />
                  </a>
                </Button>
              )}

            </Stack>
          </div>
        </Col>
      </Row>

      <br></br>
      <Row>
        <Col>
          <Typography variant="h1" component="h2" style={{ color: isDarkModeOn ? 'white' : 'black', fontSize: '20px', textTransform: 'capitalize' }}>
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
        {carouselImages.length ?
          <CardSlider dataList={carouselImages} imgOnly={true} />
          :
          <>
            <Row>
              <Skeleton variant="rectangular" animation="wave" sx={{ paddingRight: "0.5rem" }} width={"240"} height={300} />
              <Skeleton variant="rectangular" animation="wave" sx={{ paddingRight: "0.5rem" }} width={"240"} height={300} />
            </Row>
          </>
        }
      </Row>

      <br></br>
      <Row>
        <Col>
          <Typography variant="h1" component="h2" style={{ color: isDarkModeOn ? 'white' : 'black', fontSize: '20px', textTransform: 'capitalize' }}>
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
                <Skeleton variant="rectangular" animation="wave" width={"100%"} height={340} />
              </Row>

            </>
          )}
        </Col>
      </Row>
      <br></br>
      <Row>
        <Row>
          {announcementImages.length > 0 && (
            <>
              <Typography variant="h1" component="h2" style={{ color: isDarkModeOn ? 'white' : 'black', fontSize: '20px', textTransform: 'capitalize' }}>
                Announcements
              </Typography>
            </>)}
          {announcementImages.length > 0 && (
            <>
              <CardSlider dataList={announcementImages} imgOnly={true} />
            </>)
          }
        </Row>
        <Typography variant="h1" component="h2" style={{ color: isDarkModeOn ? 'white' : 'black', color: isDarkModeOn ? 'white' : 'black', fontSize: '20px', textTransform: 'capitalize' }}>
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

                  style={{ marginRight: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}

                  sx={{
                    backgroundColor: isDarkModeOn ? 'black' : "",
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
              <Typography variant="h1" component="h2" style={{ color: isDarkModeOn ? 'white' : 'black', fontSize: '20px', textTransform: 'capitalize' }}>
                Enrollment Process
              </Typography>
              <Typography variant="body1" style={{ color: isDarkModeOn ? "white" : "black" }} whiteSpace="pre-wrap">
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
          <Typography variant="h1" component="h2" style={{ color: isDarkModeOn ? 'white' : 'black', fontSize: '20px' }}>
            <Grid container alignItems="center" spacing={1}>
              {studioData && studioData.geolocation && (
                <Grid item>
                  <a
                    href={`https://www.google.com/maps?q=${studioData.geolocation.lat},${studioData.geolocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaDirections style={{ color: isDarkModeOn ? 'white' : 'black' }} />
                  </a>
                </Grid>
              )}
              <Grid item style={{ textTransform: 'capitalize' }}>
                Visit Us at:
              </Grid>
            </Grid>
          </Typography>
          <br></br>
          <Grid container alignItems="center" spacing={1}>
            {studioData && (

              <Typography style={{ color: isDarkModeOn ? 'white' : 'black', fontSize: '20px' }}>
                {`${studioData.buildingName ? studioData.buildingName + (studioData.buildingName.slice(-1) !== ',' ? ', ' : '') : ''}${studioData.street ? studioData.street + (studioData.street.slice(-1) !== ',' ? ', ' : '') : ''}${studioData.landmark ? studioData.landmark + (studioData.landmark.slice(-1) !== ',' ? ', ' : '') : ''}${studioData.city ? studioData.city : ''}`}
              </Typography>

            )}

          </Grid>
        </Col>


        <Col md={9} lg={9}>
          {studioData && studioData.geolocation && studioData.geolocation.lat && studioData.geolocation.lng ? (<MapReadOnly selectedLocationParam={studioData.geolocation}></MapReadOnly>) : ""}
        </Col>
      </Row>

      <br />

      {workshops.length > 0 && (
        <>
          <br></br>
          <Row>
            <Col xs={12}>
              <h3 style={{ color: isDarkModeOn ? "white" : "black" }}>Studio Workshops</h3>
              <WorkshopCardSlider dataList={workshops} />
            </Col>
          </Row>
        </>
      )}

      {openClasses.length > 0 && (
        <>
          <br></br>
          <Row>
            <Col xs={12}>
              <h3 style={{ color: isDarkModeOn ? "white" : "black" }}>Studio Open Classes</h3>
              <OpenClassCardSlider dataList={openClasses} />
            </Col>
          </Row>
        </>
      )}

      {courses.length > 0 && (
        <>
          <br></br>
          <Row>
            <Col xs={12}>
              <h3 style={{ color: isDarkModeOn ? "white" : "black" }}>Studio Courses</h3>
              <CourseCardSlider dataList={courses} />

            </Col>
          </Row>
        </>
      )}

      <br></br>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Ratings userID={JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).UserId : null} studioID={studioId}></Ratings>
        </Col>
      </Row>
      <br></br>
    </Container>
  )
};

const PinMarker = ({ text, isDarkModeOn }) => (
  <Badge pill bg={isDarkModeOn ? 'red' : 'blue'} style={{ position: 'relative', border: '0.1rem solid #ccc', fontSize: '1rem', }} text={isDarkModeOn ? 'white' : 'black'}>
    <FaMapMarker />{text}
  </Badge>
);
export default StudioFullPage;
