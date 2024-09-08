import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Autocomplete } from '@mui/material';
import danceStyles from '../danceStyles.json';

import { COLLECTIONS } from '../constants';
import { useAuth } from '../context/AuthContext';
import {  saveDocument } from '../utils/firebaseUtils';

const EditProfileModal = ({ open, onClose,userProfileInfo, setUserProfileInfo }) => {
  const { currentUser } = useAuth();
  const danceStylesOptions = danceStyles.danceStyles;
  const [userDanceStyles, setUserDanceStyles] = useState([]);
  

  console.log(userProfileInfo)

  useEffect(() =>{
    if (userProfileInfo && userProfileInfo.DanceStyles && (userProfileInfo.DanceStyles !== "" )){
      setUserDanceStyles(userProfileInfo.DanceStyles)
    }
  },[userProfileInfo])
  const handleChange = (e) => {
    setUserProfileInfo({ ...userProfileInfo, [e.target.name]: e.target.value });
  };


  const handleDanceStylesChange = (event, value) => {
    setUserDanceStyles(value);
  };

  const handleSave = async () => {
    console.log('Profile updated:', userProfileInfo);

    userProfileInfo.DanceStyles = userDanceStyles
    const data = await saveDocument(COLLECTIONS.USER, currentUser.uid,userProfileInfo)
    if(data){
      alert("Data Updated")
    }
  };


  return (
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
        />

        <br/>
        <Autocomplete
            style={{ backgroundColor:  'black', color:  'white'  }}
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
                style={{ backgroundColor:  'white' , color: 'black'  }}
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
  );
};

export default EditProfileModal;
