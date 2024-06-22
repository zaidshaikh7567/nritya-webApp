import { useState, useEffect } from 'react';
import { Card, Button, Row, Col , Form,Accordion,Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll,deleteObject } from 'firebase/storage';
import Creator from '../Components/Creator';
import NonCreator from '../Components/NonCreator';
import ImageUpload from '../Components/ImageUpload';
import { storage } from '../config'; // Import Firebase Storage
import { STORAGES, COLLECTIONS } from '../constants';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { useAuth } from '../context/AuthContext';
import { deleteAllImagesInFolder, uploadOneImageAndGetURL } from '../utils/firebaseUtils';
import MyBookings from '../Components/MyBookings';
import './UserPage.css';
import CreatorDashboard from './CreatorDashboard';

function getCurrentUnixTimestamp() {
  return Math.floor(Date.now());
}

function UserPage() {

  const [isCreator, setIsCreator] = useState(false);
  const [premiumTill, setPremiumTill] = useState(-1);
  const [profilePictureUrl,setProfilePictureUrl] = useState(null);
  const isDarkModeOn = useSelector(selectDarkModeStatus); // Use useSelector to access isDarkModeOn
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const cardData = [
    ['Transactions', 'All', '#/transactions'],
    ['My Bookings', 'All', '#/myBookings'],
    ['Kyc', 'All', '#/kyc'],
    ['Instructors', 'Creator', '#/modifyInstructors'],
    ['Studios', 'Creator', '#/modifyStudios'],
    ['Creator DashBoard', 'Creator', '#/creatorDashboard']
  ];
  
  
  // Sort the array by the card name
  cardData.sort((a, b) => a[0].localeCompare(b[0]));
  
  //console.log("UserPage")
  /*
  if(currentUser && currentUser.displayName ){
    navigate('#/login');
  }
  */
   /*
// Fix

  useEffect(() => {
    if (currentUser && currentUser.displayName) {
      navigate('#/login');
    }
  }, [currentUser, navigate]);
   
   
   */


  useEffect(() => {
    console.log()
    const userId= currentUser.uid;
    console.log(userId)
  
    if (userId) {
      const storagePath = `${STORAGES.USERIMAGE}/${userId}`;
      const folderRef = ref(storage, storagePath);
  
      try {
        listAll(folderRef)
          .then((result) => {
            if (result.items.length > 0) {
              const firstFileRef = result.items[0];
              getDownloadURL(firstFileRef)
                .then((url) => {
                  setProfilePictureUrl(url);
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
  }, []);

  useEffect(() => {
    console.log("UserPage getCreatorMode")
    const getCreatorMode = async () => {
      try{
      const userRef = doc(db, COLLECTIONS.USER, currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        //console.log("User there",userSnap.data(),userSnap.data().CreatorMode,JSON.parse(localStorage.getItem('userInfoFull')));
        if(userSnap.data() != null){
          
          setIsCreator(userSnap.data().CreatorMode)
          setPremiumTill(userSnap.data().isPremium)
          //console.log("Premium Till",premiumTill)
        }else{
          console.log("userSnap.data() null")
        }
      } else {
        console.log("User not found but workshop created... error");
      }
      }catch(error){
        console.log(" error");
      }
    }
  
    getCreatorMode();
  }, [isCreator]); // Run once on mount

  //console.log("hi",currentUser)


  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0]; // Get the selected file
  
    if (file) {
      try {
        // Delete old files in the storage folder
        console.log("currentUser ",currentUser)
        const userId = currentUser.uid
        await deleteAllImagesInFolder(STORAGES.USERIMAGE,userId)
  
        const imageUrl= await uploadOneImageAndGetURL(STORAGES.USERIMAGE, file, userId);

        setProfilePictureUrl(imageUrl);
  
      } catch (error) {
        console.error('Error handling profile picture:', error);
      }
    }
  };


  const cardStyle = {
    background: isDarkModeOn ? 'black' : 'white',
    color: isDarkModeOn ? 'white' : 'black',
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    cursor: 'pointer' ,
  };

  return (
    <div >
      <div className='upc'>
        <div className='upc-inner'>
          <div className='profile-down'>
            <img src={profilePictureUrl?profilePictureUrl: 'https://vignette.wikia.nocookie.net/naruto/images/4/42/Naruto_Part_III.png/revision/latest/scale-to-width-down/300?cb=20180117103539/'} alt='Profile Pic'></img>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <label htmlFor="profilePictureInput" style={{ cursor: 'pointer', color: 'white', fontSize: '1.2rem', marginTop: '5px' }}>
                    +
                    <input
                      type="file"
                      id="profilePictureInput"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                </div>
            
                {isCreator ? (
                    <>
                    <div className='profile-description' style={{ fontSize: '1.2rem', color: '#E4A11B', textAlign: "center" }}><a href="#/kyc" style={{ textDecoration: 'none', fontWeight: 'normal', color: 'goldenrod' }} rel="noreferrer">Creator</a> </div>
                    <div className='profile-description' style={{ fontSize: '1.2rem', color: '#E4A11B', textAlign: "center" }}> {getCurrentUnixTimestamp() > parseInt(premiumTill) ?
                                                    ( <Button variant="outline-warning" className="me-2 rounded-pill" size="sm" href="#/cplans" >Subscribe</Button>) 
                                                    : ( <a href="#/cplans" style={{ textDecoration: 'none', fontWeight: 'normal', color: 'goldenrod' }} rel="noreferrer">Premium</a>
                                                    )} </div >
                    </>
                  ) : (
                    <div className='profile-description' ><Button variant="outline-warning" className="me-2 rounded-pill" size="sm" style={{ fontSize: '0.8rem' }} href="#/kyc">Apply for Creator</Button> </div >
                  )}
                  <div className='profile-description' >  {currentUser.email}</div >
                  <div className='profile-description'>
                    Account Created: {formatDateTime(currentUser.metadata.creationTime)}
                  </div>
                  <div className='profile-description'>
                    Last Login: {formatDateTime(currentUser.metadata.lastSignInTime)}
                  </div>

          </div>
        </div>
      </div>
      <div class="card-container" hidden>
          <Card  
              key="dark1"
              text={isDarkModeOn ? 'white' : 'black'}
              style={{ width: '100%',backgroundColor: isDarkModeOn ? '#333333' : '' }}
            
              >
            <Card.Header >Profile</Card.Header>
                <Row>
                <Col xs={12} md={4}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",backgroundColor: "#050A30", }}>
                  <div style={{width: '20rem',height: '20rem', borderRadius: '50%', overflow: 'hidden', border: '1px solid #00ed64', marginBottom: "2px" }}>
                    <Image style={{ width: '100%', height: '100%'}} src={ profilePictureUrl?profilePictureUrl: 'https://vignette.wikia.nocookie.net/naruto/images/4/42/Naruto_Part_III.png/revision/latest/scale-to-width-down/300?cb=20180117103539/' }/>
                  </div>
                  <label htmlFor="profilePictureInput" style={{ cursor: 'pointer', color: 'white', fontSize: '1.2rem', marginTop: '5px' }}>
                    +
                    <input
                      type="file"
                      id="profilePictureInput"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                </div>
                </Col>
                <Col xs={12} md={8} >
                <div >
                <Card.Title style={{ fontSize: '1.5rem', textAlign: "center",color: isDarkModeOn ? 'white' : 'black' ,marginBottom: "5px",marginTop: "5px" }}>{currentUser.displayName}</Card.Title>
                  {isCreator ? (
                    <>
                    <Card.Text style={{ fontSize: '1.2rem', color: '#E4A11B', textAlign: "center" }}>Creator </Card.Text>
                    <Card.Text style={{ fontSize: '1.2rem', color: '#E4A11B', textAlign: "center" }}> {getCurrentUnixTimestamp() > parseInt(premiumTill) ?
                                                    ( <Button variant="outline-warning" className="me-2 rounded-pill" size="sm" href="#/cplans" >Subscribe</Button>) 
                                                    : ( <a href="#/cplans" style={{ textDecoration: 'none', fontWeight: 'normal', color: 'goldenrod' }} rel="noreferrer">Premium</a>
                                                    )} </Card.Text>
                    </>
                  ) : (
                    <Card.Text style={{ fontSize: '0.8rem', textAlign: "center" }}><Button variant="outline-warning" className="me-2 rounded-pill" size="sm" style={{ fontSize: '0.8rem' }} href="#/kyc">Apply for Creator</Button> </Card.Text>
                  )}
                  <Card.Text style={{ fontSize: '0.8rem' ,textAlign: "center"}}>  {currentUser.email}</Card.Text>
                  <Card.Text style={{ fontSize: '0.8rem' ,textAlign: "center"}}>Account Created : {formatDateTime(currentUser.metadata.creationTime).toLocaleString()}</Card.Text>
                  <Card.Text style={{ fontSize: '0.8rem' ,textAlign: "center"}}>Last Login At : {formatDateTime(currentUser.metadata.lastSignInTime).toLocaleString()}</Card.Text>
              
                </div>
                </Col>
                </Row>
          </Card>
      </div>
      <br/>
      <Row>
      {cardData.map(([name, type, link]) => {
        if (type === 'Creator' && !isCreator) return null;

        return (
          <Col
            key={name}
            xs={12}
            sm={6}
            md={6}
            lg={3}
            xl={3}
            className="mb-4"
          >
            <a href={link} >
              <Card style={cardStyle}>
                <Card.Body>
                  <Card.Title>{name}</Card.Title>
                </Card.Body>
              </Card>
            </a>
          </Col>
        );
      })}
    </Row>
    </div>
  );
}

export default UserPage

const formatDateTime = (timestamp) => {
  const options = {
    timeZone: 'Asia/Kolkata', // Set the time zone to IST
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  return new Date(timestamp).toLocaleString('en-IN', options);
};

