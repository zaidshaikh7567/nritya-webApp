import React,{useState} from "react";
import { styled } from '@mui/system';
import loginBoxLogo from '../../src/Components/DanceImg/Nritya_Login_logo.png';
import loginText from '../../src/Components/DanceImg/Lets_dance.png';
import LoginPage from "../Screens/LoginPage";

// Styled components using `styled`
const LoginBoxMain = styled('div')(({ theme }) => ({
    width: 'auto',
    backgroundColor: '#000',
    padding: '15px',
}));

const LoginLogo = styled('div')(({ theme }) => ({
    height: '130px',
    width: '130px',
    margin: '0 auto',
}));

const LoginText = styled('div')(({ theme }) => ({
    width: '67%',
    minHeight: '75px',
    margin: '0 auto',
}));

const LoginModalForm = ({isLoggedIn, setIsLoggedIn}) => {
    
      const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
      const [userID, setUserID] = useState(() => {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo).localId : '';
      });
    
      const handleLogin = (UserInfo, userInfoFull) => {
        setUsername(UserInfo.displayName);
        setIsLoggedIn(true);
        setUserID(UserInfo.localId);
        localStorage.setItem('username', UserInfo.displayName);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userInfo', JSON.stringify(UserInfo));
        localStorage.setItem('userInfoFull', JSON.stringify(userInfoFull));
        console.log("User Info Full local", JSON.parse(localStorage.getItem('userInfoFull')));
      };
    
    return (
        <LoginBoxMain>
            <LoginLogo>
                <img src={loginBoxLogo} alt="login-box-logo" />
            </LoginLogo>
            <LoginText>
                <img src={loginText} alt="login-text-img" />
            </LoginText>
            <LoginPage onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} />
        </LoginBoxMain>
    );
}

export default LoginModalForm;
