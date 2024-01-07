import React from 'react';
import { Card, Button, Row, Col , Form,Accordion,Table,Toast } from 'react-bootstrap';
 
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StudioCard from './StudioCard';
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection,where,getDocs,query } from "firebase/firestore";
import { COLLECTIONS } from '../constants';
import StudioAdd from './StudioAdd';
import StudioUpdate from './StudioUpdate';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { useAuth } from '../context/AuthContext';
import Instructors from './Instructors';
import NrityaCard from './NrityaCard';

function CreatorStudio() {
  const [studio, setStudio] = useState([]);
  const [studioId, setStudioId] = useState([]);
  const isDarkModeOn = useSelector(selectDarkModeStatus); // Use useSelector to access isDarkModeOn
  const [instructors, setInstructors] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [premiumTill, setPremiumTill] = useState(-1);
  const { currentUser } = useAuth();

  useEffect(() => {
    
    const getCreatorMode = async (event) => {
      try{
      const userRef = doc(db, "User", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        console.log("User there",userSnap.data(),userSnap.data().CreatorMode,JSON.parse(localStorage.getItem('userInfoFull')));
        if(userSnap.data() != null){
          
          setIsCreator(userSnap.data().CreatorMode)
          setPremiumTill(userSnap.data().isPremium)
          console.log("Premium Till",premiumTill)
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

    // Fetch instructors for the current user
  useEffect(() => {
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
      alert('User not found');
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

    setInstructors(instructorsList);
  };

  fetchInstructors();
  }, []);

 
  useEffect(() => {
    const getStudioCreated = async ()=>{
      const q = query(collection(db, COLLECTIONS.STUDIO), where("UserId", "==", JSON.parse(localStorage.getItem('userInfo')).UserId)    );
      console.log("Hiiii",JSON.parse(localStorage.getItem('userInfo')).UserId)
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
      setStudioId(studiosOfUser.map((studio) => (String(studio.studioName) + " :" + String(studio.id))));
      console.log(studio)
      console.log("studioId",studioId)
    };
      
      getStudioCreated();
    },[setStudio]);
 
  useEffect(() => {
    // Fetch the list of studios created by the user from localStorage
    const studiosOfUser = JSON.parse(localStorage.getItem('StudioCreated')) || [];
    setStudio(studiosOfUser);

    // Create the list of studio IDs with the format "studioName: studioId"
    const studioIdList = studiosOfUser.map((studio) => `${studio.studioName} : ${studio.id}`);
    setStudioId(studioIdList);

    console.log("studio:", studio);
    console.log("studioId", studioId);
  }, [setStudioId]);

  console.log("studio :",studio)
  return (
    <div>
      <Row>
        <Col>
          <NrityaCard title={"Total Studios"} data={studio.length?studio.length:0} bubble={true}></NrityaCard>
        </Col>
        <Col>
          <NrityaCard title={"Total Instructors"} data={instructors.length?instructors.length:0} bubble={true}></NrityaCard>
        </Col>
      </Row>
      <br></br>
      {isCreator?(
       <>
         <StudioAdd instructors={instructors} style={{color: isDarkModeOn ? 'white' : 'black'}} />
         <StudioUpdate studio={studio} setStudio={setStudio} instructors={instructors} studioId={studioId} setStudioId={setStudioId}/>
         <Instructors/>
      </>
      ):""}
 
      <h3 style={{color: isDarkModeOn ? 'white' : 'black'}}>Your Studios:</h3>
       <ul>
      <br/>
      <Row xs={1} md={2} lg={2} className="g-4">
        {studio.length > 0 ? (
          studio.map((studio, index) => (
            <Col key={index}>
              {console.log("creator studio ",studio)}
              <StudioCard studioName={studio.studioName} studioAddress={studio.address} studioInstructors={studio.instructors} studioPrice={studio.price} studioTiming={studio.timing} studioDanceStyles={studio.danceStyles} studioContactNumber={studio.contactNumber} studioId={studio.id}/>
            </Col>
          ))
        ) : (
          <p style={{color: isDarkModeOn ? 'white' : 'black'}}>No studio yet!</p>
        )}
      </Row>
      </ul>
    </div>
  )
}
export default CreatorStudio