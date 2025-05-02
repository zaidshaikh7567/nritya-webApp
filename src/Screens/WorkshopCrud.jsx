import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid,Tooltip, Stack, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'
import { Add } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { getUserEmail } from '../utils/common';
import WorkshopForm2 from './WorkshopForm2';
import { selectDarkModeStatus } from "../redux/selectors/darkModeSelector";
import { useSelector } from 'react-redux';
import { BASEURL_DEV, BASEURL_PROD } from '../constants';
import DraftTimeInfo from '../Components/DraftTimeInfo';
import { getDraftStatus } from '../utils/timeUtils';

const WorkshopCrud = () => {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true); 

  
  const fetchWorkshops = async () => {
    setLoading(true); 
    try {
      const res = await axios.get(`${BASEURL_PROD}crud/get_workshops_by_creator/${getUserEmail()}`);
      setWorkshops(res.data.workshops || []);
      console.log(res.data.workshops);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch workshops.');
    } finally {
      setLoading(false); // stop loading
    }

  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleEdit = (workshop) => {
    setSelectedWorkshop(workshop);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedWorkshop(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedWorkshop(null);
    setShowForm(false);
    fetchWorkshops();
  };
  const handleDelete = async (workshop) => {
    try {
      const response = await axios.delete(`${BASEURL_PROD}crud/delete_workshop/${workshop.workshop_id}`);
      console.log("Delete response", response.data);
      // Refresh the workshop list after deletion
      fetchWorkshops(); 
    } catch (error) {
      console.error("Error deleting workshop", error);
      alert('Failed to delete workshop.');
    }
  };
  

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" style={{ color: isDarkModeOn ? 'white' : 'black' }} mb={3}>
        Manage Your Workshops
      </Typography>
                    <>
                    <Grid container spacing={3}>
                    {/* Add New Workshop Card */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{ background: isDarkModeOn ? '#333' : '#fafafa' }}>
                        <CardContent
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
            }}
            >
            <IconButton
                color="primary"
                onClick={handleCreate}
                sx={{
                border: '2px dashed #ccc',
                borderRadius: '50%',
                width: 80,
                height: 80,
                }}
            >
                <AddIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <Typography variant="h6" mt={2} style={{ color: isDarkModeOn ? 'white' : 'black' }}>
                Add New Workshop
            </Typography>
            </CardContent>

            </Card>
          </Grid>
  
          {workshops.map((workshop) => (
            <Grid item xs={12} sm={6} md={4} key={workshop.id}>
              <Card sx={{ background: isDarkModeOn ? '#333' : '#fafafa' }}>
                <CardContent>
                  <Typography variant="h6">{workshop.name}</Typography>
                  <Typography variant="body2" mt={1}>{workshop.dance_styles}</Typography>
                  <Typography variant="body2" mt={1}>{workshop.city}</Typography>
                  <Typography variant="body2" mt={1}>From {workshop.start_date} to {workshop.end_date}</Typography>
                  <Typography variant="body2" mt={1}>{workshop.min_price} onwards</Typography>
                {
                    workshop.creation_time && (
                        <DraftTimeInfo creationTimeString={workshop.creation_time} />
                    )
                }

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Tooltip title={getDraftStatus(workshop.creation_time) ? "Edit workshop" : "Draft time expired"}>
                        <span>
                        <Button
                            variant="outlined"
                            onClick={() => handleEdit(workshop)}
                            disabled={!getDraftStatus(workshop.creation_time).isDraftActive}
                        >
                            Edit
                        </Button>
                        </span>
                    </Tooltip>

                    <Tooltip title={getDraftStatus(workshop.creation_time) ? "Delete workshop" : "Draft time expired"}>
                        <span>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDelete(workshop)}
                            disabled={!getDraftStatus(workshop.creation_time).isDraftActive}
                        >
                            Delete
                        </Button>
                        </span>
                    </Tooltip>
                    </Stack>

    
                </CardContent>
              </Card>
            </Grid>
          ))}
          {loading && Array.from(new Array(3)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ background: isDarkModeOn ? '#333' : '#fafafa' }}>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={30} />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          }
        </Grid>
        {showForm && (
        <WorkshopForm2 key={selectedWorkshop?.id || 'new'} existingWorkshop={selectedWorkshop} setShowForm={setShowForm} onClose={handleCloseForm} />
        ) }
      </>
      
    </Box>
  );
};

export default WorkshopCrud;
