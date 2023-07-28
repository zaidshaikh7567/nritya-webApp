import { useState, useEffect } from 'react';
import { Card, Button, Row, Col , Form,Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db } from '../config';
import { doc, getDoc,setDoc,addDoc,updateDoc,collection } from "firebase/firestore";
import Creator from '../Components/Creator';
import NonCreator from '../Components/NonCreator';


function getCurrentUnixTimestamp() {
  return Math.floor(Date.now());
}

function UserPage({ onLogout, username, isLoggedIn, setUsername, setIsLoggedIn }) {

  const [isCreator, setIsCreator] = useState(false);
  const [premiumTill, setPremiumTill] = useState(-1);
  const navigate = useNavigate();
  if(!JSON.parse(localStorage.getItem('isLoggedIn'))){
    navigate('#/login');
  }
  useEffect(() => {
    
    const getCreatorMode = async (event) => {
      try{
      const userRef = doc(db, "User", JSON.parse(localStorage.getItem('userInfo')).UserId);
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

  console.log("hi",JSON.parse(localStorage.getItem('userInfoFull')))

  return (
    <div >
        

      <div class="card-container">
      <Card  
          key="dark1"
          text={'dark' === 'light' ? 'dark' : 'white'}
          style={{ width: '100%',backgroundColor: "#000000" }}
         
          >
        <Card.Header>Profile</Card.Header>

        
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr"}}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",backgroundColor: "#050A30", }}>
              <div style={{ borderRadius: '50%', overflow: 'hidden', border: '1px solid #00ed64', marginBottom: "2px" }}>
                <img
                  className="d-block w-100"
                  src='https://vignette.wikia.nocookie.net/naruto/images/4/42/Naruto_Part_III.png/revision/latest/scale-to-width-down/300?cb=20180117103539/' 
                  style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: '70%' }}
                  alt="pic"
                />
              </div>
            </div>
            <div style={{borderLeft: "1px solid #00ed64" }}>
            <Card.Title style={{ fontSize: '1.5rem', textAlign: "center",color:'#ffffff' ,marginBottom: "5px",marginTop: "5px" }}>{JSON.parse(localStorage.getItem('userInfoFull')).displayName}</Card.Title>
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
              <Card.Text style={{ fontSize: '0.8rem' ,textAlign: "center"}}>Email: {JSON.parse(localStorage.getItem('userInfoFull')).email}</Card.Text>
              <Card.Text style={{ fontSize: '0.8rem' ,textAlign: "center"}}>Account Created : {new Date(JSON.parse(localStorage.getItem('userInfoFull')).createdAt * 1).toLocaleString()}</Card.Text>
              <Card.Text style={{ fontSize: '0.8rem' ,textAlign: "center"}}>Last Login At : {new Date(JSON.parse(localStorage.getItem('userInfoFull')).lastLoginAt * 1).toLocaleString()}</Card.Text>
           
            </div>
          </div>
        

      </Card>
      </div>
      {isCreator ? <Creator/> : <NonCreator/>}
    </div>
  );
}

export default UserPage
