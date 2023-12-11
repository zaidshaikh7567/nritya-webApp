import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel, Container, Row, Col, Card, Spinner,Button,ButtonGroup,Badge,Image } from 'react-bootstrap';
import { db,storage } from '../config';
import { getStorage, ref,listAll, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc, getDocs, collection , updateDoc} from "firebase/firestore";
import { STATUSES, COLLECTIONS } from "./../constants.js";
import Table from 'react-bootstrap/Table';
import './Carousel.css';
import MapReadOnly from '../Components/MapReadOnly';
import { FaClock, FaMoneyBill, FaMapMarker, FaPhone, FaWhatsapp  } from 'react-icons/fa';
import Ratings from '../Components/Ratings';
import { useSelector, useDispatch } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import StarRating from '../Components/StarRating';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';



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

  const [studioData, setStudioData] = useState(null);
  const [studioDescription, setStudioDescription] = useState(null);
  const [studioTableData, setStudioTableData] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  const cardStyle = {
    borderRadius: '5px',
    margin: '2px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    animation: 'glowingAnimation 2s infinite',
    height: '100%',
    backgroundColor: isDarkModeOn ? '#333333' : 'white',
    
  };

// Function to update the recently watched studios in Firebase
const updateRecentlyWatchedInFirebase = async (userId, studioId) => {
  try {
    // Fetch the current "recentlyWatched" map from Firebase
    const userRef = doc(db, COLLECTIONS.USER, userId);
    const userDoc = await getDoc(userRef);
    const recentlyWatchedMap = userDoc.exists() ? userDoc.data().recentlyWatched : {};

    // Check if the studio ID is already present in the "recentlyWatched" map
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
//console.log("StudioData",studioData.geolocation)
  

  return (
  <Container fluid style={{backgroundColor: isDarkModeOn?'black':'white' ,color: isDarkModeOn?'white':'color' }}>
      {/* Row 1 */}
      <Row  >
  {/* Left-hand side column */}
  <Col xs={8}>
    {/* Row-a */}
    <Row>
        <Col xs={5}>
        <h5 style={{color: isDarkModeOn?'white':'' }}>{studioData ? studioData.studioName : ""}</h5>
        </Col>
        <Col xs={4}>
        {studioData && studioData.avgRating?  <StarRating rating={studioData.avgRating} viewMode={true} />:""}
        </Col>
        <Col>
        <>
        {studioData && studioData.geolocation && studioData.geolocation.lat && studioData.geolocation.lng  ? (
              <a
                href={`https://www.google.com/maps?q=${studioData.geolocation.lat},${studioData.geolocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PinMarker lat={studioData.geolocation.lat} lng={studioData.geolocation.lng} text={studioData.city} isDarkModeOn={isDarkModeOn} />
              </a>
            ) : (
              <div style={{ color: 'blue', fontSize: '16px' }} >{ (studioData && studioData.city)? studioData.city:""}</div>
            )}
          </>
        
        </Col>
      
    </Row>

    {/* Row-b */}
    <Row>
      <Col>
        <i className="fab fa-youtube"></i>
        <i className="fab fa-facebook"></i>
        <i className="fab fa-instagram"></i>
        <i className="fab fa-twitter"></i>
      </Col>
    </Row>

    {/* Row-c */}
    <Row>
      <Col>
        <p style={{color: isDarkModeOn?'white':'black',backgroundColor: isDarkModeOn?'black':'white'}}>{studioData ? studioData.aboutStudio : ""}</p>
      </Col>
    </Row>
  </Col>

  {/* Right-hand side column */}
  
  <Col >
  <Paper elevation={5} style={{color: isDarkModeOn?'white':'',backgroundColor: isDarkModeOn?'#36454F':'white',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px', // Adjust the minimum height as needed
    padding: '16px', // Add padding for better visual appearance
 }} >
    <Col>
    {/* Row-a */}
    <Row>
      <h5 style={{color: isDarkModeOn?'white':'' }} >Founder</h5>
    </Row>

    {/* Row-b */}
    <Row>
      <h6 style={{color: isDarkModeOn?'white':'' }} >{studioData ? studioData.founderName : ""}</h6>
    </Row>

    {/* Row-c */}
    <Row>
      <p style={{color: isDarkModeOn?'white':'black' }} >{studioData ? studioData.aboutFounder : ""}</p>
    </Row>
    </Col>
    </Paper>
  </Col>
</Row>
 <br></br>
      {/* Row 2 */}
      <Row>
        <Col>
          <h4 style={{color: isDarkModeOn?'white':'black' }} >Dance Forms</h4>
          {studioData && studioData.danceStyles ? (
            studioData.danceStyles.split(',').map((style, index) => (
        <Badge pill
          key={index}
          bg={index % 4 === 0 ? 'danger' : index % 4 === 1 ? 'warning' : index % 4 === 2 ? 'success' : 'info'}
          style={{ marginRight: '5px' }}
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
      {/* Row 3 */}
      <Row>
  <Col>
    {isLoadingImages ? (
      <Row>
        {[1, 2, 3].map((index) => (
          <Col key={index} lg={6} md={12} sm={12}>
            <Skeleton variant="rectangular" animation="wave" width={275} height={340} />
          </Col>
        ))}
      </Row>
    ) : (
      <Carousel>
        {carouselImages.map((image, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex justify-content-between">
              {[0, 1, 2].map((cardIndex) => {
                const circularIndex = (index * 3 + cardIndex) % carouselImages.length;
                const cardImage = carouselImages[circularIndex];
                const colProps = {
                  xl: 4,
                  lg: 6,
                  md: 12,
                  sm: 12,
                };

                return (
                  <Col key={circularIndex} {...colProps}>
                    <div style={{ position: 'relative', width: '100%', paddingTop: '75%' }}>
                      <Image style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} variant="top" src={cardImage} alt={`Carousel Slide ${index}`} />
                    </div>
                  </Col>
                );
              })}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    )}
  </Col>
</Row>


      {/* Row 4 (You can add content for Row 4 here) */}
      <Row>
        <Col>
          Instructor list
        </Col>
      </Row>
      <Row>
        <Col>
        {studioData && studioData.tableData ? (
            <Table bordered style={{ ...cardStyle, ...gradientStyles[5] }}>
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Dance Forms</th>
                  <th>Days</th>
                  <th>Time</th>
                  <th>Instructors</th>
                </tr>
              </thead>
              <tbody>
              {Object.keys(studioData.tableData).map((key, index) => {
                const classItem = studioData.tableData[key];
                return (
                  <tr key={index}>
                    <td>{classItem.className}</td>
                    <td>{classItem.danceForms}</td>
                    <td>{classItem.days}</td>
                    <td>{classItem.time}</td>
                    <td>{classItem.instructors}</td>
                  </tr>
                );
              })}

              </tbody>
            </Table>
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
        <Col>
        <Paper elevation={5} style={{color: isDarkModeOn?'white':'',backgroundColor: isDarkModeOn?'#36454F':'white',display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
 }} >
        <h4 style={{color: isDarkModeOn?'white':'black' }}>Amenities</h4>
        <br></br>
        {studioData&&studioData.addAmenities?studioData.addAmenities:""}
        </Paper>
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col>
        <Paper elevation={5} style={{color: isDarkModeOn?'white':'',backgroundColor: isDarkModeOn?'#36454F':'white',display: 'flex',
    alignItems: 'center',justifyContent: 'center',}} >   
        <Row>
          <h4 style={{color: isDarkModeOn?'white':'black' }}>Enrollment Process</h4>
        </Row>
        
        <Row>
        {studioData&&studioData.enrollmentProcess?studioData.enrollmentProcess:""}
        </Row>
        </Paper>
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


function StudioFullPage2() {
  const { studioId } = useParams();
  console.log("From StudioFullPage", studioId);
  const isDarkModeOn = useSelector(selectDarkModeStatus);

  const [studioData, setStudioData] = useState(null);
  const [studioDescription, setStudioDescription] = useState(null);
  const [studioTableData, setStudioTableData] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  const cardStyle = {
    borderRadius: '5px',
    margin: '2px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    animation: 'glowingAnimation 2s infinite',
    height: '100%',
    backgroundColor: isDarkModeOn ? '#333333' : 'white',
    
  };

// Function to update the recently watched studios in Firebase
const updateRecentlyWatchedInFirebase = async (userId, studioId) => {
  try {
    // Fetch the current "recentlyWatched" map from Firebase
    const userRef = doc(db, COLLECTIONS.USER, userId);
    const userDoc = await getDoc(userRef);
    const recentlyWatchedMap = userDoc.exists() ? userDoc.data().recentlyWatched : {};

    // Check if the studio ID is already present in the "recentlyWatched" map
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
console.log("StudioData",studioData)
  

  return (
    <div>
      
      {studioData && (
        <>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: isDarkModeOn ? 'white' : 'black' }}>{studioData.studioName}</h1>
          
          <Ratings userID={JSON.parse(localStorage.getItem('userInfo'))? JSON.parse(localStorage.getItem('userInfo')).UserId: null} studioID={studioId}></Ratings>
          {studioData.geolocation ? (
              <a
                href={`https://www.google.com/maps?q=${studioData.geolocation.lat},${studioData.geolocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PinMarker lat={studioData.geolocation.lat} lng={studioData.geolocation.lng} text={studioData.address} isDarkModeOn={isDarkModeOn} />
              </a>
            ) : (
              <div style={{ color: 'blue', fontSize: '16px' }} >{studioData.address}</div>
            )}
          </div>
          <ButtonGroup>
        <Button  className="me-2 rounded-pill" size="sm"  style={{ textTransform: 'none', backgroundColor: isDarkModeOn ? '#892CDC' : 'black', color:'white' }} >
          <a href={"tel:" + studioData.contactNumber} style={{ textDecoration: 'none', color: 'inherit' }}>
          <FaPhone style={{ transform: 'scaleX(-1)' }} />  Call
          </a>
        </Button>
        <Button className="me-2 rounded-pill" style={{ textTransform: 'none', backgroundColor: 'green', color:'white' }}>
          <a href={"https://wa.me/" + studioData.contactNumber} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <FaWhatsapp />  WhatsApp
          </a>
        </Button>
      </ButtonGroup>
        </>
      )}
      
      <p>  </p>
      <Container fluid>
        <Row>
        <Col >
        
            {isLoadingImages ? (
              <Spinner animation="border" />
            ) : (
              
              <Carousel className="custom-carousel" >
                {carouselImages.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img src={image} className="d-block w-100" alt={`Carousel Slide ${index}`} />
                  </Carousel.Item>
                ))}
              </Carousel>
             
            )}
             
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col md={8}>
            {studioData ? (
              <Card style={cardStyle} key="dark1" text={isDarkModeOn ? 'white' : 'dark'}>
                <Card.Body>
                  <Card.Title  style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>Description</Card.Title>
                  <Card.Text>
                  {  studioData.aboutStudio
                  /*
                     decodeUnicode(studioData.description).split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))
                    */
                  }
                  </Card.Text>
                </Card.Body>
              </Card>
            ) : (
              <Spinner animation="border" />
            )}
          </Col>
          <Col md={4}>
            {studioData ? (
              <Card style={cardStyle} text={isDarkModeOn ? 'white' : 'dark'}>
              <Card.Body>
                <Card.Title style={{  marginBottom: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  Class Details
                </Card.Title>
                <Card.Text>
                    Instructor Names: {studioData.instructors}
                     </Card.Text>
                <Card.Text>
                    <p>Price: {studioData.price}</p>
                    </Card.Text>
                <Card.Text>
                    <p>Status: {studioData.status}</p>
                    </Card.Text>
                <Card.Text>
                    <p>Dance Form: {studioData.danceStyles}</p>
                </Card.Text>
              </Card.Body>
            </Card>
            ) : (
              <Spinner animation="border" />
            )}
          </Col>
        </Row>
        <br></br>
        <Row>
        <Col>
          {studioData && studioData.tableData ? (
            <Table bordered style={{ ...cardStyle, ...gradientStyles[5] }}>
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Dance Forms</th>
                  <th>Days</th>
                  <th>Time</th>
                  <th>Instructors</th>
                </tr>
              </thead>
              <tbody>
              {Object.keys(studioData.tableData).map((key, index) => {
                const classItem = studioData.tableData[key];
                return (
                  <tr key={index}>
                    <td>{classItem.className}</td>
                    <td>{classItem.danceForms}</td>
                    <td>{classItem.days}</td>
                    <td>{classItem.time}</td>
                    <td>{classItem.instructors}</td>
                  </tr>
                );
              })}

              </tbody>
            </Table>
          ) : (
            <Spinner animation="border" />
          )}
        </Col>
      </Row>
      <br></br>
      {studioData && studioData.geolocation ? (
              
              <MapReadOnly selectedLocationParam={studioData.geolocation}></MapReadOnly>
            ) : (
              <br></br>
            )}
      </Container>      
    </div>
    
  );
}

const PinMarker = ({ text, isDarkModeOn }) => (
  <Badge pill bg={isDarkModeOn ? 'dark' : 'light'} style={{ position: 'relative', border: '1px solid #ccc' }} text={ isDarkModeOn?'white':'black'}>
     <FaMapMarker/>{text}
  </Badge>
);
export default StudioFullPage;
