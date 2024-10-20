import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {auth , provider}  from './../config.js';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from '../config';
import { doc, getDoc,setDoc } from "firebase/firestore";
import { COLLECTIONS } from "./../constants.js";
import {  Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux'; 
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector'; 
import { Button, Container } from '@mui/material';
import { setCreatorMode } from '../utils/firebaseUtils.js';
import { postData } from '../utils/common.js';



function LoginPage({onLogin,setIsLoggedIn}) {
  
  const [loginFailed, setLoginFailed] = useState(false);
  const isDarkModeOn = useSelector(selectDarkModeStatus); // Use useSelector to access isDarkModeOn

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
          const dbPayload = {
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
          }
          const notifyEmails = user.email
          const metadata = {
            "user_id":user.uid
          }
          const response = await postData(dbPayload, COLLECTIONS.USER, notifyEmails, metadata) ;
          if (response.ok) {
            console.log("User added successfully");
          }else{
            console.error(response);
          }
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
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
        console.log("Access token",accessToken)
        console.log("Id token",idToken)
        const user = result.user;
        console.log("Post login :",user);
        console.log("UserId",user.uid);
        console.log("Result ", result)
        if (result) {
          let token = await auth.currentUser?.getIdToken();
          console.log("token", token);
          localStorage.setItem("authToken", token);
        }
        onLogin({"UserId":user.uid,"email":user.email,"isPremium":user.isPremium,"displayName":user.displayName,"WorkshopCreated":user.WorkshopCreated,"WorkshopEnrolled":user.WorkshopEnrolled,"CreatorMode":false,"photoURL":user.photoURL},user);
        setIsLoggedIn(true);
        await addUserIfMissing(user);
        await setCreatorMode(user.uid);
        navigate(`/`);
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Invalid username or password');
        setLoginFailed(true);
      }
    };
    
      
    return (
      <Container fluid className='custom-container-main'>
          <Row>
            <Col xs={12} md={12}>
              <div>
              <form
                className='custom-login-form'
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent form submission
                  signin(); // Call your signin function on form submission
                  //alert("Form Submitted")
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '15px 0'
                }}
              >
                <Button
                  type="submit" // Add a type to the button to trigger form submission
                  style={{
                    backgroundColor: "#D9D9D9",
                    color: '#000',
                    borderRadius: '6px',
                    textTransform: 'none',
                    border: '1px solid #777',
                    padding: '8px 16px'
                  }}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google Icon"
                    style={{ marginRight: '10px', height: '20px' }}
                  />
                  Sign In with Google
                </Button>
              </form>
              </div>
            </Col>
          </Row>
      </Container>
    );
}

export default LoginPage;
