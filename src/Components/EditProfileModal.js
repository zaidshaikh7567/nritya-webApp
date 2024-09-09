import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Autocomplete } from '@mui/material';
import danceStyles from '../danceStyles.json';
import { COLLECTIONS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { saveDocument, handleSavePostOTPSuccess } from '../utils/firebaseUtils';
import axios from "axios";
import qs from 'qs';

const PROD_BASE_URL = "https://nrityaserver-2b241e0a97e5.herokuapp.com"
const LOCAL_BASE_URL = "http://127.0.0.1:8000"
const BASE_URL = PROD_BASE_URL

const EditProfileModal = ({ open, onClose, userProfileInfo, setUserProfileInfo }) => {
  const { currentUser } = useAuth();
  const danceStylesOptions = danceStyles.danceStyles;
  const [userDanceStyles, setUserDanceStyles] = useState([]);
  const [userPhoneNumber, setUserPhoneNumber] = useState();
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false); // To handle OTP modal
  const [otp, setOtp] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(userProfileInfo?.isPhoneNumberVerified || false);
  const [otpSent, setOtpSent] = useState(false);

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
      alert("Profile Updated");
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
        alert('OTP sent to your phone number.');
      } else {
        throw new Error('Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP, please try again.');
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
        alert('Phone number verified successfully.');
      } else {
        alert(response.message || 'Invalid OTP.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Error verifying OTP, please try again.');
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', mt: 5, maxWidth: 400, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Edit Profile
          </Typography>
          <TextField
            fullWidth
            label="Name"
            name="Name"
            value={userProfileInfo.Name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Age"
            name="Age"
            type="number"
            value={userProfileInfo.Age}
            onChange={handleChange}
            margin="normal"
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
                variant="standard"
                placeholder="Select Dance Styles"
                style={{ backgroundColor: 'white', color: 'black' }}
              />
            )}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
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
    </>
  );
};

export default EditProfileModal;
