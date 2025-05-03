import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, IconButton, Grid, MenuItem, LinearProgress } from '@mui/material';
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { Add, CloseOutlined, Delete } from '@mui/icons-material';
import axios from 'axios';
import { getUserEmail } from '../utils/common';
import { useSelector } from 'react-redux';
import danceStyles from '../danceStyles.json';
import { BASEURL_DEV, BASEURL_PROD } from '../constants';
import { Stack } from 'react-bootstrap';
import { STORAGES } from '../constants';
import ImageUpload from '../Components/ImageUpload';

const WorkshopForm2 = ({ key='new',existingWorkshop = null, setShowForm }) => {
    const isDarkModeOn = useSelector(selectDarkModeStatus);
    const [loading, setLoading] = useState(false);
    const defaultWorkshop = {
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
      };
  
    const [workshop, setWorkshop] = useState(
      existingWorkshop || defaultWorkshop
    );

    useEffect(() => {
        if (existingWorkshop && existingWorkshop.variants) {
          setVariants(existingWorkshop.variants);
          setWorkshop(existingWorkshop)
        }
        if (key === "new" && !existingWorkshop) {
          setWorkshop(defaultWorkshop) 
            setVariants([])
         }     
      }, [existingWorkshop]);
  
    const SKIP_LIST = [
        'creator_email',
        'status',
        'created_at',
        'updated_at',
        'owner_email',
    'min_price',
    'variants',
'workshop_id',
'creation_time',]
    
    
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
          setLoading(true);
          let res =""
          if (existingWorkshop) {
            const workshop_id = existingWorkshop.workshop_id;
            let payload = {
                ...workshop,
                variants,
              };
             res = await axios.put(`${BASEURL_PROD}crud/update_workshop/${workshop_id}`, payload);
          }else {
            let payload = {
                workshop,
                variants,
              };
             res = await axios.post(`${BASEURL_PROD}crud/create_workshop/`, payload);
          }
          alert(res.data.message);
        } catch (error) {
          console.error(error);
          alert(error.response?.data?.error || 'Something went wrong.');
        }finally {
          setLoading(false);
        }
      };
      console.log("Workshop Form", key);
    return (
      <Box sx={{ p: 4, maxWidth: '100%', margin: 'auto' }}>
            <Typography style={{color: isDarkModeOn ? 'white' : 'black', textTransform: 'none'}} variant="h5" mb={2}>Workshop Modify</Typography>
            
            <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
                
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <Typography
                    style={{ color: isDarkModeOn ? 'white' : 'black', textTransform: 'none' }}
                    variant="h6"
                >
                    Workshop Details
                </Typography>

                    <IconButton
                        aria-label="close"
                        onClick={() => setShowForm(false)}
                        sx={{
                        color: (theme) => theme.palette.grey[1000],
                        }}
                    >
                        <CloseOutlined />
                    </IconButton>
                </Stack>
                {
                  existingWorkshop && existingWorkshop.workshop_id &&(
                    <ImageUpload
                      key={existingWorkshop.workshop_id}
                      entityId={existingWorkshop.workshop_id}
                      title={"Workshop Image Icon"}
                      storageFolder={STORAGES.WORKSHOPICON}
                      maxImageCount={1}
                    />
                  )
                }
                <hr/>
                
                <Grid container spacing={2}>
            {Object.keys(defaultWorkshop).map((key, index) => {
                const value = workshop[key];
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
                        value={value ? value.split(', ') : []} // Convert comma-separated string to array
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
                        type={key === 'start_date' || key === 'end_date' ? 'date' : 'text'}
                        value={value}
                        onChange={handleWorkshopChange}
                        InputLabelProps={
                            key === 'start_date' || key === 'end_date'
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
            <Button variant="contained" color="primary" disabled={loading} onClick={handleSubmit}>{loading?"Submitting":"Submit"}</Button>
            {loading && <LinearProgress sx={{ mb: 2 }} />}
          </Box>
    );
  };
  
  export default WorkshopForm2;
  