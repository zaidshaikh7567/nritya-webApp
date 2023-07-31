import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {auth , provider}  from './../config.js';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from '../config';
import { doc, getDoc,setDoc } from "firebase/firestore";
import { STATUSES,COLLECTIONS } from "./../constants.js";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

function LoginPage({onLogin,setIsLoggedIn}) {
  
  const [loginFailed, setLoginFailed] = useState(false);

  const navigate = useNavigate();

    const addUserIfMissing = async (user) => {
      try {
        const userRef = doc(db, COLLECTIONS.USER, user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          console.log("User there");
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
          await setDoc(doc(db, COLLECTIONS.USER, user.uid), {
            Name: user.displayName,
            Email: user.email,
            DoB: null, // You may want to add user's date of birth here
            UserId: user.uid,
            WorkshopCreated: [],
            WorkshopEnrolled: [],
            Cart: [],
            CreatorMode: false,
            KycIdList:{},
            StudioCreated:[],
            premiumTill: false,
            TransactionIDs:[],
            recentlyWatched:{0:"",1:"",2:"",3:"",4:""},
          });
          console.log("User added successfully");
        }

        const userRef2 = doc(db, COLLECTIONS.USER, user.uid);
        const userSnap2 = await getDoc(userRef2);
        localStorage.setItem('userDetails',JSON.stringify({"UserId":user.uid,"email":user.email,"isPremium":userSnap2.data().isPremium,"displayName":userSnap2.data().displayName,"WorkshopCreated":userSnap2.data().WorkshopCreated,"WorkshopEnrolled":userSnap2.data().WorkshopEnrolled}));
       

        
      } catch (error) {
        console.error("Error adding user: ", error);
      }
    };

    const signin = async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log("Post login :",user);
        console.log("UserId",user.uid);
        onLogin({"UserId":user.uid,"email":user.email,"isPremium":user.isPremium,"displayName":user.displayName,"WorkshopCreated":user.WorkshopCreated,"WorkshopEnrolled":user.WorkshopEnrolled},user);
        setIsLoggedIn(true);
        await addUserIfMissing(user);

        navigate(`/profile`);
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Invalid username or password');
        setLoginFailed(true);
      }
    };
    
      
    return (
      <Container>
      <Row className="justify-content-center">
        <Col xs={6}>
          <div style={{ marginTop: '200px' }} className="justify-content-center">
          <Button
              variant="info"
              onClick={signin}
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                boxShadow: 'none',
                borderRadius: '0',
                display: 'flex',
                alignItems: 'center',
                textTransform: 'none',
              }}
              
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Icon"
                style={{ marginRight: '10px', height: '20px' }}
              />
              Sign In with Google
            </Button>

          </div>
        </Col>
      </Row>
    </Container>

    );
}

export default LoginPage;
