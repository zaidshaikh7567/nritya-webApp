import React from "react";
import { makeStyles } from "@material-ui/core";
import loginBoxLogo from '../../src/Components/DanceImg/Nritya_Login_logo.png';
import loginText from '../../src/Components/DanceImg/Lets_dance.png';
import LoginPage from "../Screens/LoginPage";


const useStyles = makeStyles(() => ({
    loginBoxMain: {
        width: 'auto',
        backgroundColor: '#000',
        padding: '15px',
    },
    loginLogo: {
        height: '130px',
        width: '130px',
        margin: '0 auto'
    },
    loginText: {
        width: '67%',
        minHeight: '75px',
        margin: '0 auto'
    }


}));

const LoginModalForm = ({ handleClose }) => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.loginBoxMain}>
                <div className={classes.loginLogo}>
                    <img src={loginBoxLogo} alt="login-box-logo"/>
                </div>
                <div className={classes.loginText}>
                    <img src={loginText} alt="login-text-img"/>
                </div>
                <LoginPage/>
            </div>
        </>
    )
}
export default LoginModalForm;