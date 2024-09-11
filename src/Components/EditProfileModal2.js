import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Autocomplete, Alert, Snackbar } from '@mui/material';
import danceStyles from '../danceStyles.json';
import { COLLECTIONS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { saveDocument, handleSavePostOTPSuccess } from '../utils/firebaseUtils';
import axios from "axios";
import qs from 'qs';
import { useSelector } from "react-redux";
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";

const PROD_BASE_URL = "https://nrityaserver-2b241e0a97e5.herokuapp.com"
const LOCAL_BASE_URL = "http://127.0.0.1:8000"
const BASE_URL = PROD_BASE_URL

const EditProfileModal = ({ open, onClose, userProfileInfo, setUserProfileInfo }) => {
  const { currentUser } = useAuth();
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const danceStylesOptions = danceStyles.danceStyles;
  const [userDanceStyles, setUserDanceStyles] = useState([]);
  const [userPhoneNumber, setUserPhoneNumber] = useState();
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false); // To handle OTP modal
  const [otp, setOtp] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(userProfileInfo?.isPhoneNumberVerified || false);
  const [otpSent, setOtpSent] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  useEffect(() => {
    if (userProfileInfo && userProfileInfo.DanceStyles && userProfileInfo.DanceStyles !== "") {
      setUserDanceStyles(userProfileInfo.DanceStyles);
    }
    if (userProfileInfo && userProfileInfo.PhoneNumber && userProfileInfo.setUserPhoneNumber !== "") {
      setUserPhoneNumber(userProfileInfo.PhoneNumber);
    }
  }, [userProfileInfo]);

  const handleChange = (e) => {
    setUserProfileInfo({ ...userProfileInfo, [e.target.name]: e.target.value });
  };

  const handleDanceStylesChange = (event, value) => {
    setUserDanceStyles(value);
  };


  const handleSave = async () => {
    userProfileInfo.DanceStyles = userDanceStyles;
    const data = await saveDocument(COLLECTIONS.USER, currentUser.uid, userProfileInfo);
    if (data) {
      setSnackbarMessage("Profile Updated");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const handleSavePostOTP = async () => {
    const docRef = handleSavePostOTPSuccess(COLLECTIONS.USER, currentUser.uid,userProfileInfo.PhoneNumber);
  };

  const handleVerifyPhoneNumber = async () => {
    try {
      //console.log(userProfileInfo.PhoneNumber);
  
      const response = await axios.post(
        `${BASE_URL}/djSms/request_otp/`,
        qs.stringify({
          phone_number: userProfileInfo.PhoneNumber, // use qs to stringify the data
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
  
      if (response.status === 200) {
        setOtpSent(true);
        setIsOTPModalOpen(true); // Open OTP modal
        setSnackbarMessage("OTP sent to your phone number.");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      } else {
        throw new Error('Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setSnackbarMessage('Error sending OTP, please try again.');
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  

  const handleOtpSubmit = async () => {
    //console.log(userProfileInfo.PhoneNumber,otp)
    try {
      const response = await axios.post(
        `${BASE_URL}/djSms/confirm_otp/`, 
        qs.stringify({
          "phone_number": userProfileInfo.PhoneNumber,
          "otp": otp,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      console.log(response)
      if (response && response.data && response.data.status === "success") {
        setIsPhoneVerified(true);
        setUserProfileInfo({ ...userProfileInfo, isPhoneNumberVerified: true });
        setIsOTPModalOpen(false);
        handleSavePostOTP()
        setSnackbarMessage('Phone number verified successfully.');
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(response.message || 'Invalid OTP.');
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setSnackbarMessage('Error verifying OTP, please try again.');
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  return (
    <>
      <Modal open={open} onClose={onClose} style={{ overflow: 'scroll' }} >
        <Box sx={{ p: 4, backgroundColor: 'white',backgroundColor: isDarkModeOn ? '#333333' : 'white', margin: 'auto', mt: 5, maxWidth: 400, borderRadius: 2 }} >
          <Typography variant="h6" gutterBottom style={{ backgroundColor: isDarkModeOn ? '#333333' : 'white', color: isDarkModeOn ? 'white' : 'black' }}>
            Edit Profile
          </Typography>
          <TextField
            fullWidth
            label="Name"
            name="Name"
            value={userProfileInfo.Name}
            onChange={handleChange}
            margin="normal"
            sx={{
              bgcolor: isDarkModeOn?"#202020":"white",
              "& .MuiInputBase-root": {
                color: isDarkModeOn?"white":"black",
                "& > fieldset": {
                  borderColor: isDarkModeOn?"rgb(171, 171, 171)":"black",
                },
                "&:hover fieldset": {
                  borderColor: isDarkModeOn ? 'cyan' : 'black',
                },
                "&.Mui-focused fieldset": {
                  borderColor: isDarkModeOn ? 'white' : 'black',
                },
                
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'white',
                },
              },
              "& .MuiInputLabel-outlined": {
                color: isDarkModeOn ? 'white' : 'black',
                fontWeight: "bold",
                "&.Mui-focused": {
                  color: isDarkModeOn ? 'white' : 'black',
                  fontWeight: "bold",
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Age"
            name="Age"
            type="number"
            value={userProfileInfo.Age}
            onChange={handleChange}
            margin="normal"
            sx={{
              bgcolor: isDarkModeOn?"#202020":"white",
              "& .MuiInputBase-root": {
                color: isDarkModeOn?"white":"black",
                "& > fieldset": {
                  borderColor: isDarkModeOn?"rgb(171, 171, 171)":"black",
                },
                "&:hover fieldset": {
                  borderColor: isDarkModeOn ? 'cyan' : 'black',
                },
                "&.Mui-focused fieldset": {
                  borderColor: isDarkModeOn ? 'white' : 'black',
                },
                
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'white',
                },
              },
              "& .MuiInputLabel-outlined": {
                color: isDarkModeOn ? 'white' : 'black',
                fontWeight: "bold",
                "&.Mui-focused": {
                  color: isDarkModeOn ? 'white' : 'black',
                  fontWeight: "bold",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="PhoneNumber"
            type="number"
            value={userProfileInfo.PhoneNumber}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              readOnly: isPhoneVerified || userProfileInfo.isPhoneNumberVerified, // If verified, make it read-only
            }}
            sx={{
              bgcolor: isDarkModeOn?"#202020":"white",
              "& .MuiInputBase-root": {
                color: isDarkModeOn?"white":"black",
                "& > fieldset": {
                  borderColor: isDarkModeOn?"rgb(171, 171, 171)":"black",
                },
                "&:hover fieldset": {
                  borderColor: isDarkModeOn ? 'cyan' : 'black',
                },
                "&.Mui-focused fieldset": {
                  borderColor: isDarkModeOn ? 'white' : 'black',
                },
                
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'white',
                },
              },
              "& .MuiInputLabel-outlined": {
                color: isDarkModeOn ? 'white' : 'black',
                fontWeight: "bold",
                "&.Mui-focused": {
                  color: isDarkModeOn ? 'white' : 'black',
                  fontWeight: "bold",
                },
              },
            }}
          />
          {isPhoneVerified || userProfileInfo.isPhoneNumberVerified? (
            <Typography color="green">Phone Number Verified</Typography>
          ) : (
            <Button variant="outlined" onClick={handleVerifyPhoneNumber}>
              {otpSent ? "Resend OTP" : "Verify Phone Number"}
            </Button>
          )}

          <Autocomplete
            
            multiple
            id="tags-standard"
            options={danceStylesOptions}
            value={userDanceStyles}
            onChange={handleDanceStylesChange}
            
            renderInput={(params) => (
              <TextField
                {...params}
                color= "success"
                variant="standard"
                placeholder="Select Dance Styles"
                sx={{
                  bgcolor: isDarkModeOn?"#202020":"white",
                  "& .MuiInputBase-root": {
                    color: isDarkModeOn?"white":"black",
                    "& > fieldset": {
                      borderColor: isDarkModeOn?"white":"black",
                    },
                    "&:hover fieldset": {
                      borderColor: isDarkModeOn ? 'cyan' : 'black',
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: isDarkModeOn ? 'white' : 'black',
                    },
                    
                    '& .MuiInput-underline:after': {
                      borderBottomColor: 'white',
                    },
                  },
                  "& .MuiInputLabel-outlined": {
                    color: isDarkModeOn ? 'white' : 'black',
                    fontWeight: "bold",
                    "&.Mui-focused": {
                      color: isDarkModeOn ? 'white' : 'black',
                      fontWeight: "bold",
                    },
                  },
                }}
              />
            )}
          />

          <FormControl fullWidth margin="normal"
            sx={{
              bgcolor: isDarkModeOn?"#202020":"white",
              "& .MuiInputBase-root": {
                color: isDarkModeOn?"white":"black",
                "& > fieldset": {
                  borderColor: isDarkModeOn?"rgb(171, 171, 171)":"black",
                },
                "&:hover fieldset": {
                  borderColor: isDarkModeOn ? 'cyan' : 'black',
                },
                "&.Mui-focused fieldset": {
                  borderColor: isDarkModeOn ? 'white' : 'black',
                },
                
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'white',
                },
              },
              "& .MuiInputLabel-outlined": {
                color: isDarkModeOn ? 'white' : 'black',
                fontWeight: "bold",
                "&.Mui-focused": {
                  color: isDarkModeOn ? 'white' : 'black',
                  fontWeight: "bold",
                },
              },
            }}>
            <InputLabel sx={{color: isDarkModeOn ? 'white' : 'black' }}>Gender</InputLabel>
            <Select
              name="Gender"
              value={userProfileInfo.Gender}
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Bio"
            name="Bio"
            value={userProfileInfo.Bio}
            onChange={handleChange}
            multiline
            rows={4}
            margin="normal"
            sx={{
              bgcolor: isDarkModeOn?"#202020":"white",
              "& .MuiInputBase-root": {
                color: isDarkModeOn?"white":"black",
                "& > fieldset": {
                  borderColor: isDarkModeOn?"rgb(171, 171, 171)":"black",
                },
                "&:hover fieldset": {
                  borderColor: isDarkModeOn ? 'cyan' : 'black',
                },
                "&.Mui-focused fieldset": {
                  borderColor: isDarkModeOn ? 'white' : 'black',
                },
                
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'white',
                },
              },
              "& .MuiInputLabel-outlined": {
                color: isDarkModeOn ? 'white' : 'black',
                fontWeight: "bold",
                "&.Mui-focused": {
                  color: isDarkModeOn ? 'white' : 'black',
                  fontWeight: "bold",
                },
              },
            }}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </Box>
        </Box>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal open={isOTPModalOpen} onClose={() => setIsOTPModalOpen(false)}>
        <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', mt: 5, maxWidth: 300, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Enter OTP
          </Typography>
          <TextField
            fullWidth
            label="4-Digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => setIsOTPModalOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleOtpSubmit}>Submit OTP</Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar open={snackbarOpen} autoHideDuration={600}  anchorOrigin={ {vertical:'top', horizontal:'center'} } onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditProfileModal;
