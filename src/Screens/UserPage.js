import { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Button as MUIButton } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { STORAGES, COLLECTIONS } from '../constants';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { useAuth } from '../context/AuthContext';
import { deleteAllImagesInFolder, readDocument, saveDocument, uploadOneImageAndGetURL } from '../utils/firebaseUtils';
import './UserPage.css';
import Kyc from '../Components/Kyc';
import {Card as MUICard,CardMedia,CardHeader,Avatar, CardContent, Typography, Tooltip} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditProfileModal from '../Components/EditProfileModal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import {
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import CardSlider from "../Components/CardSlider";
import { db } from "../config";

function getCurrentUnixTimestamp() {
  return Math.floor(Date.now());
}

function UserPage() {

  const [isCreator, setIsCreator] = useState(false);
  const [userProfileInfo,setUserProfileInfo] = useState(
    {
      Name: '',
      Age: '',
      DanceStyles: '',
      Gender: '',
      Bio: '',
    }
  );
  const isDarkModeOn = useSelector(selectDarkModeStatus); // Use useSelector to access isDarkModeOn
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  console.log("currentUser",currentUser)
  const cardData = [
    ['Transactions', 'All', '#/transactions'],
    ['My Bookings', 'All', '#/myBookings'],
    ['Instructors', 'Creator', '#/modifyInstructors'],
    ['Studios', 'Creator', '#/modifyStudios'],
    ['DashBoard', 'Creator', '#/creatorDashboard']
  ];
  const [open, setOpen] = useState(false);
  const [recentlyWatchedStudios, setRecentlyWatchedStudios] = useState([]);


  const fetchRecentlyWatchedStudios = async (userId) => {
    try {
      const userRef = doc(db, COLLECTIONS.USER, userId);
      const userDoc = await getDoc(userRef);
      const recentlyWatchedMap = userDoc.exists()
        ? userDoc.data().recentlyWatched
        : {};

      const studioIds = Object.values(recentlyWatchedMap);
      //console.log("got",studioIds)
      const studioDataPromises = studioIds.map(async (studioId) => {
        //console.log(studioId)
        if (!studioId) {
          console.warn("Invalid studioId:", studioId);
          return null;
        }
        console.log("studioId", studioId);
        const studioRef = doc(db, COLLECTIONS.STUDIO, studioId);
        const studioDoc = await getDoc(studioRef);
        if (studioDoc.exists()) {
          //console.log(studioDoc.data())
          return { id: studioId, ...studioDoc.data() };
        } else {
          console.warn(`Studio document not found for ID: ${studioId}`);
          return null;
        }
      });

      const studioData = await Promise.all(studioDataPromises);
      const validStudioData = studioData.filter((studio) => studio !== null);

      setRecentlyWatchedStudios(validStudioData);
    } catch (error) {
      console.error("Error fetching recently watched studios:", error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async (updatedProfile) => {
    console.log('Profile updated:', updatedProfile);
    const data = await saveDocument(COLLECTIONS.USER, currentUser.uid,updatedProfile)
    if(data){
      alert("Data Updated")
    }
  };
  
  
  // Sort the array by the card name
  cardData.sort((a, b) => a[0].localeCompare(b[0]));
 
  useEffect(() => {
  
    if (currentUser && currentUser.uid) {
      
        fetchRecentlyWatchedStudios(currentUser.uid);
      
    }
    const getCreatorMode = async () => {
      try{
      const userData = await readDocument(COLLECTIONS.USER, currentUser.uid);
      if (userData) {
          setUserProfileInfo(
            {
              Name: userData.Name || '',
              Age: userData.Age || '',
              DanceStyles: userData.DanceStyles || '',
              Gender: userData.Gender || '',
              Bio: userData.Bio || '',
              PhoneNumber : userData.PhoneNumber || '',
              isPhoneNumberVerified : userData.isPhoneNumberVerified || false,
            }
          )
          setIsCreator(userData.CreatorMode)
      } else {
        console.log("User not found but workshop created... error");
      }
      }catch(error){
        console.log(" error");
      }
    }
  
    getCreatorMode();
  }, [isCreator]); // Run once on mount

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
      <MUICard sx={{ maxWidth: 400,background: isDarkModeOn ? 'black' : 'white',color: isDarkModeOn ? 'white' : 'black'}}>
        <CardHeader
          avatar={
            <Avatar
              alt={"Picture"}
              src={currentUser.photoURL}
              sx={{ width: 40, height: 40 }}
            />
          }
          title={
            <Typography variant="h6" component="div" sx={{ display: 'flex',color: isDarkModeOn ? 'white' : 'black', alignItems: 'center' }}>
              {currentUser.displayName}
              {isCreator && (
                 <Tooltip title="You are a verified user." arrow>
                 <CheckCircleIcon sx={{ color: 'green', marginLeft: 0.5, fontSize: 20 }} />
               </Tooltip>
              )}
            </Typography>
          }
          subheader={
            <>
              <Typography variant="body2" component="div" sx={{ color: isDarkModeOn ? 'white' : 'black' }}>
                {[currentUser.email, userProfileInfo.Age]
                  .filter(Boolean)
                  .join(' || ')}
              </Typography>
              {userProfileInfo.DanceStyles && (
                <Typography variant="body2" component="div" sx={{ mt: 1, color: isDarkModeOn ? 'white' : 'black' }}>
                  {userProfileInfo.DanceStyles}
                </Typography>
              )}
              {userProfileInfo.Bio && (
                <Typography variant="body2" component="div" sx={{ mt: 1, color: isDarkModeOn ? 'white' : 'black' }}>
                  {userProfileInfo.Bio}
                </Typography>
              )}
            </>
          }
      
          
          subheaderTypographyProps={{
            sx: {
              color: isDarkModeOn ? 'gray' : 'darkgray'
            }
          }}
        />
        <MUIButton sx={{ ml: 2 }} variant="outlined" onClick={handleOpen}>
          Edit Profile
        </MUIButton>
        <EditProfileModal open={open} onClose={handleClose} userProfileInfo={userProfileInfo} setUserProfileInfo={setUserProfileInfo} />
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
    <Row>
          {recentlyWatchedStudios.length > 0 && (
            <h4 style={{ color: isDarkModeOn ? "white" : "black" }}>
              {" "}
              <FontAwesomeIcon icon={faClock} size="1x" /> Recently Viewed
            </h4>
          )}
          {recentlyWatchedStudios.length > 0 ? (
            <CardSlider dataList={recentlyWatchedStudios} imgOnly={false} />
          ) : (
            ""
          )}
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

