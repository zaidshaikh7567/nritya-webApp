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
import Kyc from '../Components/Kyc';
import {Card as MUICard,CardMedia,CardHeader,Avatar, CardContent, Typography, Tooltip} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


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
  console.log("currentUser",currentUser)
  const cardData = [
    ['Transactions', 'All', '#/transactions'],
    ['My Bookings', 'All', '#/myBookings'],
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
      <h1 style={{ color: isDarkModeOn ? 'white' : 'black', textTransform:'capitalize' }}>Profile</h1>
      <MUICard sx={{ maxWidth: 345,background: isDarkModeOn ? 'black' : 'white',color: isDarkModeOn ? 'white' : 'black'}}>
        <CardHeader
          avatar={
            <Avatar
              alt={"Picture"}
              src={currentUser.photoURL}
              sx={{ width: 40, height: 40 }}
            />
          }
          title={
            <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              {currentUser.displayName}
              {isCreator && (
                 <Tooltip title="You are a verified user." arrow>
                 <CheckCircleIcon sx={{ color: 'green', marginLeft: 0.5, fontSize: 20 }} />
               </Tooltip>
              )}
            </Typography>
          }
          subheader={currentUser.email}
          subheaderTypographyProps={{
            sx: {
              color: isDarkModeOn ? 'gray' : 'darkgray'
            }
          }}
        />
        <CardContent>
        <Typography variant="body2" color="text.secondary" style={{color: isDarkModeOn ? 'white' : 'black'}}>
          {isCreator ? "List your studios now!!" : "Welcome to the Nritya! \n Verify your profile to list your studio."}
        </Typography>
      </CardContent>
      </MUICard>
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
    <Kyc/>
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

