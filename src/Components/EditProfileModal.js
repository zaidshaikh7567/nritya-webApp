import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EditProfileModal = ({ open, onClose, onSave,userProfileInfo, setUserProfileInfo }) => {

  const handleChange = (e) => {
    setUserProfileInfo({ ...userProfileInfo, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(userProfileInfo);
    onClose();
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
          label="Dance Styles"
          name="DanceStyles"
          value={userProfileInfo.DanceStyles}
          onChange={handleChange}
          margin="normal"
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
