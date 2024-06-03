import React from "react";
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

const LoginModalForm = ({ handleClose }) => {
    return (
        <LoginBoxMain>
            <LoginLogo>
                <img src={loginBoxLogo} alt="login-box-logo" />
            </LoginLogo>
            <LoginText>
                <img src={loginText} alt="login-text-img" />
            </LoginText>
            <LoginPage />
        </LoginBoxMain>
    );
}

export default LoginModalForm;
