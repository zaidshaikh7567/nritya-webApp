'use client'

import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button, Badge, Stack } from 'react-bootstrap';
import { db } from '../config';
import { doc, getDoc, getDocs, collection, updateDoc, where, query } from "firebase/firestore";
import { COLLECTIONS, AMENITIES_ICONS, STUDIO_ICON_DEFAULT } from "./../constants.js";
import { FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaDirections } from 'react-icons/fa';
import './Carousel.css';
import MapReadOnly from '../Components/MapReadOnly';
import { FaMapMarker, FaWhatsapp } from 'react-icons/fa';
import Ratings from '../Components/Ratings';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import Skeleton from '@mui/material/Skeleton';
import '../Components/NrityaCard.css'
import NrityaCard from '../Components/NrityaCard.js';
import TableView from './TableView.js';
import '../Common.css'
import CardSlider from '../Components/CardSlider.js';
import WorkshopCardSlider from '../Components/WorkshopCardSlider.js';
import OpenClassCardSlider from '../Components/OpenClassCardSlider.js';
import CourseCardSlider from '../Components/CourseCardSlider.js';
import { fetchStudioEntities } from '../utils/firebaseUtils.js';
import Typography from '@mui/joy/Typography';
import { Chip, Grid } from '@mui/material';
import axios from 'axios';
import { FaPhoneAlt } from 'react-icons/fa';
import PageMeta from '../Components/PageMeta.js';
import { BASEURL_PROD } from './../constants.js';
import nearby from '../assets/images/nearby.png';
import StudioTimingsTable from '../Components/StudioTimingsTable.jsx';
import { useLoader } from '../context/LoaderContext.js';

function StudioFullPage({ studioId, initialData = null, isSSR = false }) {
  const { setIsLoading } = useLoader();
  console.log("From StudioFullPage", studioId, "isSSR:", isSSR, "hasInitialData:", !!initialData);
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  
  // Initialize state with SSR data if available
  const [studioData, setStudioData] = useState(initialData?.studioData || null);
  const [carouselImages, setCarouselImages] = useState(initialData?.carouselImages || []);
  const [announcementImages, setAnnouncementImages] = useState(initialData?.announcementImages || []);
  const [workshops, setWorkshops] = useState(initialData?.workshops || []);
  const [openClasses, setOpenClasses] = useState(initialData?.openClasses || []);
  const [courses, setCourses] = useState(initialData?.courses || []);
  const [carouselLoading, setCarouselLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  
  // Log SSR data if available
  useEffect(() => {
    if (isSSR && initialData) {
      console.log("[Client] Using SSR data:", {
        hasStudioData: !!initialData.studioData,
        carouselImagesCount: initialData.carouselImages?.length || 0,
        announcementImagesCount: initialData.announcementImages?.length || 0,
        workshopsCount: initialData.workshops?.length || 0,
        openClassesCount: initialData.openClasses?.length || 0,
        coursesCount: initialData.courses?.length || 0
      });
    }
  }, [isSSR, initialData]);

  const BASEURL_STUDIO = `${BASEURL_PROD}api/studio/`
  
  // Only fetch data on client side if not SSR or if initialData is not provided
  useEffect(() => {
    if (isSSR && initialData) {
      // Data already loaded from SSR, no need to fetch
      return;
    }
    
    console.log(BASEURL_STUDIO)
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (JSON.parse(localStorage.getItem('userInfo')) && JSON.parse(localStorage.getItem('userInfo')).UserId) {
          //const UserId = JSON.parse(localStorage.getItem('userInfo')).UserId
          console.log("Recently watched disabled")
          //updateRecentlyWatchedInFirebase(UserId, studioId);
        }
        setCarouselLoading(true);
        const responseText = await axios.get(`${BASEURL_STUDIO}${studioId}/text/`);
        const dataText = responseText.data;
        setStudioData(dataText);
        const responseImages = await axios.get(`${BASEURL_STUDIO}${studioId}/images/`);
        const dataImages = responseImages.data;
        if (dataImages && dataImages.StudioImages) {
          const responseImages = dataImages.StudioImages;
          const filteredImages = Array.isArray(responseImages) 
            ? responseImages.filter(image => typeof image === 'string' && !image.includes(`${studioId}/?Expire`))
            : [];
          setCarouselImages(filteredImages);
        }
        
        if (dataImages && dataImages.StudioAnnouncements) {
          setAnnouncementImages(dataImages.StudioAnnouncements)
        }
        console.log(studioData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        setCarouselLoading(false);
      }

    };

    fetchData();
  }, [isSSR, initialData]);

  const whatsappMessage = encodeURIComponent("Hey, I found your Studio on nritya.co.in. I'm interested");
  
  useEffect(() => {
    if (isSSR && initialData) {
      // Data already loaded from SSR, no need to fetch
      return;
    }
    
    setIsLoading(true);

    Promise.all([
      fetchStudioEntities(studioId, COLLECTIONS.OPEN_CLASSES, setOpenClasses),
      fetchStudioEntities(studioId, COLLECTIONS.WORKSHOPS, setWorkshops),
      fetchStudioEntities(studioId, COLLECTIONS.COURSES, setCourses),
    ]).finally(() => setIsLoading(false));
  }, [studioId, isSSR, initialData]);

  // Safely read localStorage on client to avoid SSR errors
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const info = JSON.parse(localStorage.getItem('userInfo'));
        if (info && info.UserId) {
          setUserId(info.UserId);
        }
      }
    } catch (e) {
      // ignore malformed localStorage
    }
  }, []);

  return (
    <Container fluid style={{ backgroundColor: isDarkModeOn ? '#202020' : 'white', color: isDarkModeOn ? 'white' : 'color' }}>
      <PageMeta
        title={studioData ? studioData.studioName : ""}
        description={`${studioData?.studioName}, ${studioData?.city}, ${studioData?.danceStyles}`}
        image={studioData?.iconUrl || STUDIO_ICON_DEFAULT}
      />
      <Row>
        <Col lg={8} className='d-flex'>
          <div className='contentWrapper-main'>
          
          <Row>
            <Col sm={11} xs={12}>
              <Typography
                variant="h2"
                component="h2"
                style={{
                  color: isDarkModeOn ? 'white' : 'black',
                  fontSize: '1.5rem',
                  textTransform: 'none',
                }}
              >
                {studioData ? studioData.studioName : ""}
              </Typography>
            </Col>
            <Col sm ={1} xs={12} className="d-flex align-items-center justify-content-end">
            {studioData && studioData.avgRating > 0 && studioData.ratedBy > 0 ? (
              <>
                <span style={{ color: 'goldenrod' }}>⭐{studioData.avgRating.toFixed(1)}</span>
                <span style={{ color: isDarkModeOn ? 'white' : 'black' }}> ({studioData.ratedBy})</span>
              </>
            ) : ""}

            </Col>
          </Row>
   

            <div className='socialRatings'>
              {studioData && (studioData.facebook || studioData.youtube || studioData.instagram || studioData.twitter) && (
                <>
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
              </>
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

        {!carouselLoading ?
        <>
      {carouselImages.length ?  <Row>
          <CardSlider dataList={carouselImages} imgOnly={true} />
      </Row> : null}
</>
          :
          
            <Row>
              <Skeleton variant="rectangular" animation="wave" sx={{ paddingRight: "0.5rem" }} width={"240"} height={300} />
              <Skeleton variant="rectangular" animation="wave" sx={{ paddingRight: "0.5rem" }} width={"240"} height={300} />
            </Row>
          
        }

      {studioData?.timings ? <Row>
        <StudioTimingsTable timings={studioData?.timings} />
      </Row> : null}

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
              <Grid item style={{ textTransform: 'capitalize' }}>
                Get Directions
              </Grid>
              {studioData && studioData.geolocation && (
                <Grid item>
                  <a
                    href={`https://www.google.com/maps?q=${studioData.geolocation.lat},${studioData.geolocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={nearby}
                      alt="Directions"
                      style={{ width: "24px", height: "24px", filter: isDarkModeOn ? 'none' : 'invert(1)' }}
                    />
                  </a>
                </Grid>
              )}
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
       { userId && (
          <Ratings userID={userId} studioID={studioId}></Ratings>
        )}
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
