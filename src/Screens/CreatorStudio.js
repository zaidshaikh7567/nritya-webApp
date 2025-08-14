import React from 'react';
import { Row, Col  } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { db } from '../config';
import { doc, getDoc,collection,where,getDocs,query } from "firebase/firestore";
import { COLLECTIONS } from '../constants';
import StudioAdd from '../Components/StudioAdd';
import StudioUpdate from '../Components/StudioUpdate';
import { useSelector } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { useAuth } from '../context/AuthContext';
import CardSliderCard from '../Components/CardSliderCard';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';



function CreatorStudio() {
  const [studio, setStudio] = useState([]);
  const [studioId, setStudioId] = useState([]);
  const isDarkModeOn = useSelector(selectDarkModeStatus); // Use useSelector to access isDarkModeOn
  const [instructors, setInstructors] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [premiumTill, setPremiumTill] = useState(-1);
  const { currentUser } = useAuth();
  const [value, setValue] = React.useState('1');
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  useEffect(() => {
    console.log("Creator Studio getCreatorMode")
    const getCreatorMode = async (event) => {
      if (!currentUser) {
        console.log('No current user, skipping creator mode fetch');
        return;
      }
      
      try{
      const userRef = doc(db, "User", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        console.log("User there",userSnap.data(),userSnap.data().CreatorMode,JSON.parse(localStorage.getItem('userInfoFull')));
        if(userSnap.data() != null){
          
          setIsCreator(userSnap.data().CreatorMode)
          setPremiumTill(userSnap.data().isPremium)
          console.log("Premium Till",premiumTill,userSnap.data())
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
  }, [currentUser?.uid]); // Only run when currentUser.uid changes

    // Fetch instructors for the current user
  useEffect(() => {
    console.log("Creator Studio fetchInstructors")
  const fetchInstructors = async () => {
    let userId = null;
    if (
      JSON.parse(localStorage.getItem('userInfo')) &&
      JSON.parse(localStorage.getItem('userInfo')).UserId
    ) {
      userId = JSON.parse(localStorage.getItem('userInfo')).UserId;
    }
    if (!userId) {
      console.log('User not found');
      navigate('/');
      return;
    }

    const instructorRef = collection(db, COLLECTIONS.INSTRUCTORS);
    const q = query(instructorRef, where('createdBy', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const instructorsList = [];
    querySnapshot.forEach((doc) => {
      instructorsList.push({
        id: doc.id,
        name: doc.data().name,      
      });
    });
    console.log("Hiii", instructorsList)
    setInstructors(instructorsList);
  };

  fetchInstructors();
  }, []);

 
  useEffect(() => {
    console.log("Creator Studio getStudioCreated")
    const getStudioCreated = async ()=>{
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        console.log('User info not found');
        navigate('/');
        return;
      }

      let parsedUserInfo;
      try {
        parsedUserInfo = JSON.parse(userInfo);
      } catch (error) {
        console.log('Error parsing user info:', error);
        navigate('/');
        return;
      }

      if (!parsedUserInfo.UserId) {
        console.log('User ID not found in user info');
        navigate('/');
        return;
      }

      const q = query(collection(db, COLLECTIONS.STUDIO), where("UserId", "==", parsedUserInfo.UserId));
      console.log("Hiiii", parsedUserInfo.UserId)
      const querySnapshot = await getDocs(q);
      console.log("Studios : ",querySnapshot)
      const studiosOfUser = querySnapshot.docs.filter(doc => doc.data().studioName).map(doc => 
        { const data = doc.data();
          return {
            id: doc.id, // Include the document ID in the data
            ...data
          };
      });
      localStorage.setItem("StudioCreated", JSON.stringify(studiosOfUser));
      setStudio(studiosOfUser);
      setStudioId(studiosOfUser.map((studio) => (String(studio.studioName) + " : " + String(studio.id))));
      console.log("Studios fetched:", studiosOfUser);
      console.log("Studio IDs set:", studiosOfUser.map((studio) => (String(studio.studioName) + " : " + String(studio.id))));
    };
      
      getStudioCreated();
    },[]);
 
  // Remove this useEffect as it's redundant and causes circular dependency
  // The first useEffect already handles setting both studio and studioId states

  console.log("studio :",studio)
  return (
    <div>
      <br></br>
      {isCreator?(
        
       <>
       <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList style={{color: isDarkModeOn ? 'white' : 'black'}} onChange={handleChange} aria-label="lab API tabs example">
            <Tab style={{color: isDarkModeOn ? 'white' : 'black'}} label="Add Studio" value="1" />
            <Tab style={{color: isDarkModeOn ? 'white' : 'black'}} label="Update Studio" value="2" />
          
          </TabList>
        </Box>
        <TabPanel value="1">

        <StudioAdd instructors={instructors} />
        </TabPanel>
        <TabPanel value="2">
        <>
        {studio.length > 0 && studioId.length > 0 && (
          <StudioUpdate
            studio={studio}
            setStudio={setStudio}
            instructors={instructors}
            studioId={studioId}
            setStudioId={setStudioId}
          />
        )}
        </>
    
        </TabPanel>
        
      </TabContext>
    </Box>
      </>
      ):""}
 
      <h3 style={{color: isDarkModeOn ? 'white' : 'black'}}>Your Studios:</h3>
       <ul>
      <Row xs={1} md={3} lg={4} className="g-4">
        {studio.length > 0 ? (
          studio.map((studio, index) => (
            <Col key={index}>
              <a href={`#/studio/${studio.studioId}`} style={{ textDecoration: "none" }}>
                <CardSliderCard studio={studio}/>
              </a>
          </Col>
          ))
        ) : (
          <p style={{color: isDarkModeOn ? 'white' : 'black'}}>No studio yet!</p>
        )}
      </Row>
      <br/>
      </ul>
    </div>
  )
}
export default CreatorStudio