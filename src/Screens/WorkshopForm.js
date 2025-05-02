import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, IconButton, Grid, MenuItem } from '@mui/material';
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { Add, Delete } from '@mui/icons-material';
import axios from 'axios';
import { getUserEmail } from '../utils/common';
import { useSelector } from 'react-redux';
import danceStyles from '../danceStyles.json';

const WorkshopForm = () => {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [workshop, setWorkshop] = useState({
    name: '',
    dance_styles: '',
    start_date: '',
    end_date: '',
    terms_conditions: '',
    description: '',
    creator_email: getUserEmail(),
    building: '',
    street: '',
    city: '',
    geolocation: '',
  });

  const SKIP_LIST = [
    'creator_email',
    'status',
    'created_at',
    'updated_at',
    'owner_email',]


  const ADDRESS_KEYS = ["building", "street", "city", "state", "pincode"];

  const [variants, setVariants] = useState([]);

  const handleWorkshopChange = (e) => {
    setWorkshop({ ...workshop, [e.target.name]: e.target.value });
  };

  const handleDanceStylesChange = (e) => {
    // Join the selected styles with commas
    setWorkshop({
      ...workshop,
      dance_styles: e.target.value.join(', '),
    });
  };

  const handleAddVariant = () => {
    // Check if variants array is empty
    if (variants.length === 0) {
      setVariants([
        {
          variant_id: "NEW_1",
          date: '',
          time: '',
          description: '',
          subvariants: [],
        },
      ]);
      return;
    }
  
    // Get the last variant
    const lastVariant = variants[variants.length - 1];
  
    // Check if any of the required fields are empty
    if (!lastVariant.date || !lastVariant.time || !lastVariant.description) {
      alert("Please fill all fields of the previous variant before adding a new one.");
      return;
    }
  
    // Add a new variant if previous is filled
    setVariants([
      ...variants,
      {
        variant_id: `NEW_${variants.length + 1}`,
        date: '',
        time: '',
        description: '',
        subvariants: [],
      },
    ]);
  };
  

  const handleRemoveVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const handleVariantChange = (index, e) => {
    const updated = [...variants];
    updated[index][e.target.name] = e.target.value;
    setVariants(updated);
  };

  const handleAddSubvariant = (vIndex) => {
    const updated = [...variants];
    updated[vIndex].subvariants.push({
      subvariant_id: "NEW_SV1",
      price: '',
      capacity: '',
      description: '',
    });
    setVariants(updated);
  };

  const handleRemoveSubvariant = (vIndex, svIndex) => {
    const updated = [...variants];
    updated[vIndex].subvariants.splice(svIndex, 1);
    setVariants(updated);
  };

  const handleSubvariantChange = (vIndex, svIndex, e) => {
    const updated = [...variants];
    updated[vIndex].subvariants[svIndex][e.target.name] = e.target.value;
    setVariants(updated);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        workshop,
        variants,
      };
      const res = await axios.put(`/api/workshops/UPDATE_WORKSHOP_ID_HERE/`, payload);
      alert(res.data.message);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: '100%', margin: 'auto' }}>
      <Typography style={{color: isDarkModeOn ? 'white' : 'black', textTransform: 'none'}} variant="h4" mb={2}>Workshop Add</Typography>
      <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
  <Typography style={{ color: isDarkModeOn ? 'white' : 'black', textTransform: 'none' }} variant="h6" mb={2}>
    Workshop Details
  </Typography>
  <Grid container spacing={2}>
    {Object.entries(workshop).map(([key, value], index) => {
      const isFirstAddressField = key === ADDRESS_KEYS[0];

      return !SKIP_LIST.includes(key) && (
        <React.Fragment key={key}>
          {isFirstAddressField && (
            <Grid item xs={12}>
              <hr style={{ margin: '16px 0' }} />
              <h5>Address Details</h5>
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            {key === 'dance_styles' ? (

              <TextField
                select
                fullWidth
                label="Dance Styles"
                name={key}
                value={value ? value.split(', ') : []} // Convert the comma-separated string to an array
                onChange={handleDanceStylesChange}
                SelectProps={{ multiple: true }}
              >
                {danceStyles.danceStyles && danceStyles.danceStyles.map((style) => (
                  <MenuItem key={style} value={style}>
                    {style}
                  </MenuItem>
                ))}
              </TextField>
        
            ) : (
              <TextField
                fullWidth
                label={key.replace(/_/g, ' ')}
                name={key}
                type={key === "start_date" || key === "end_date" ? "date" : "text"}
                value={value}
                onChange={handleWorkshopChange}
                InputLabelProps={
                  key === "start_date" || key === "end_date"
                    ? { shrink: true }
                    : undefined
                }
              />
            )}
          </Grid>
        </React.Fragment>
      );
    })}
  </Grid>
</Paper>


      {variants.map((variant, vIndex) => (
        <Paper sx={{ p: 3, mb: 3 }} key={variant.variant_id}>
          <Typography style={{color: isDarkModeOn ? 'white' : 'black', textTransform: 'none'}} variant="h6">Event {vIndex + 1} : {variant?.description}</Typography>
          <Grid container spacing={2} mt={1}>
            {['date', 'time', 'description'].map((field) => (
                <Grid item xs={12} sm={4} key={field}>
                <TextField
                    fullWidth
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    type={
                    field === 'date' ? 'date' :
                    field === 'time' ? 'time' :
                    'text'
                    }
                    value={variant[field]}
                    onChange={(e) => handleVariantChange(vIndex, e)}
                    InputLabelProps={
                    field === 'date' || field === 'time'
                        ? { shrink: true }
                        : undefined
                    }
                    placeholder={
                    field === 'description'
                        ? 'Describe this variant'
                        : undefined
                    }
                />
                </Grid>
            ))}
            </Grid>


          <Box mt={2}>
            <Typography style={{color: isDarkModeOn ? 'white' : 'black', textTransform: 'none'}} variant="subtitle1">Price Tiering</Typography>
            {variant.subvariants.map((sub, svIndex) => (
              <Grid container spacing={2} mt={1} key={sub.subvariant_id}>
                    {['price', 'capacity', 'description'].map((field) => (
                    <Grid item xs={12} sm={4} key={field}>
                        <TextField
                        fullWidth
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        type={field === 'price' || field === 'capacity' ? 'number' : 'text'}
                        inputProps={
                            field === 'price' || field === 'capacity'
                            ? { min: 1 }
                            : undefined
                        }
                        value={sub[field]}
                        onChange={(e) => handleSubvariantChange(vIndex, svIndex, e)}
                        placeholder={
                            field === 'price'
                            ? 'Enter price in INR'
                            : field === 'capacity'
                            ? 'Enter maximum capacity'
                            : 'Describe this subvariant'
                        }
                        />
                    </Grid>
                    ))}

                <Grid item xs={12} sm={1}>
                  <IconButton onClick={() => handleRemoveSubvariant(vIndex, svIndex)}><Delete /></IconButton>
                </Grid>
              </Grid>
            ))}

            <Button startIcon={<Add />} onClick={() => handleAddSubvariant(vIndex)} sx={{ mt: 1 }}>Add Price Tiering</Button>
          </Box>

          <Button color="error" startIcon={<Delete />} onClick={() => handleRemoveVariant(vIndex)} sx={{ mt: 2 }}>
            Remove Event
          </Button>
        </Paper>
      ))}
        
      <Button variant="outlined" startIcon={<Add />} onClick={handleAddVariant} sx={{ mb: 3 }}>
        Add Event
      </Button>
      <br/>
      <Button variant="contained" color="primary" onClick={handleSubmit}>Submit Workshop</Button>
    </Box>
  );
};

export default WorkshopForm;
