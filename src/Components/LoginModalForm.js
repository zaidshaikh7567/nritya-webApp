import React, { useState } from "react";
import { styled } from '@mui/system';
import LoginPage from "../Screens/LoginPage";
// Logo paths for Next.js
const loginBoxLogo = '/assets/images/Nritya_Login_logo.png';
const loginText = '/assets/images/Lets_dance.png';
//import loginBoxLogo from '../../src/Components/DanceImg/Nritya_Login_logo.png';
//import loginText from '../../src/Components/DanceImg/Lets_dance.png';


// Styled components using `styled`
const LoginBoxMain = styled('div')(({ theme }) => ({
    width: 'auto',
    backgroundColor: '#000',
    padding: '15px',
    minHeight: '100px', // Set a minimum height
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}));

const LoginLogo = styled('div')(({ theme }) => ({
    height: '130px',
    width: '130px',
    margin: '0 auto',
}));

const LoginText = styled('div')(({ theme }) => ({
    width: '67%', // Full width to contain text
    minHeight: '75px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center', // Center the content
    alignItems: 'center', // Center the content
}));

const LoginModalForm = ({ isLoggedIn, setIsLoggedIn }) => {
    const [userID, setUserID] = useState(() => {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo).localId : '';
    });

    const handleLogin = (UserInfo, userInfoFull) => {
        console.log("Login successful, setting isLoggedIn to true");
        setIsLoggedIn(true);
        setUserID(UserInfo.localId);
        //localStorage.setItem('userInfo', JSON.stringify(UserInfo));
        //localStorage.setItem('userInfoFull', JSON.stringify(userInfoFull));
        console.log("User Info Full local", JSON.parse(localStorage.getItem('userInfoFull')));
    };

    return (
        <LoginBoxMain>
            <LoginLogo>
                <img src={loginBoxLogo} alt="login-box-logo" style={{ width: '100%', height: 'auto' }} />
            </LoginLogo>
            <LoginText>
                <img src={loginText} alt="login-text-img" style={{ width: '100%', height: 'auto' }} />
            </LoginText>
            <LoginPage onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} />
        </LoginBoxMain>
    );
};

export default LoginModalForm;
