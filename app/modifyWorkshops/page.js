'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Tooltip, Stack, Skeleton, CardMedia, Chip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClientHeader from '../components/ClientHeader';
import ClientFooter from '../components/ClientFooter';
import WorkshopForm from './WorkshopForm';

// Utility function to get user email from localStorage
const getUserEmail = () => {
  if (typeof window !== 'undefined') {
    const userInfoFull = JSON.parse(localStorage.getItem('userInfoFull'));
    if (userInfoFull) {
      return userInfoFull.email;
    }
  }
  return null;
};

// Utility function to format date
const formatDateToReadable = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Utility function to check draft status
const getDraftStatus = (creationTimeString) => {
  if (!creationTimeString) return { isDraftActive: false };
  
  const creationTime = new Date(creationTimeString);
  const currentTime = new Date();
  const timeDifference = currentTime - creationTime;
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  
  return {
    isDraftActive: hoursDifference <= 24,
    hoursRemaining: Math.max(0, 24 - hoursDifference)
  };
};

// Workshop Card Component
const WorkshopCardForOwner = ({ workshop, isDarkModeOn, onEdit, onDelete }) => {
  const [imageUrl, setImageUrl] = useState("https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg");

  return (
    <Card sx={{ background: isDarkModeOn ? '#333' : '#fafafa' }}>
      <img
        src={imageUrl}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
        alt={workshop.name}
      />
      <CardContent>
        <Typography variant="h6" style={{ textTransform: 'none' }}>{workshop.name}</Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {workshop.dance_styles?.split(",").map((form, i) => (
            <Chip key={i} label={form.trim()} size="small" />
          ))}
        </Stack>

        <Typography variant="body2" mt={1}>{workshop.city} | {formatDateToReadable(workshop.start_date)}</Typography>
        <Typography variant="h6" mt={1}>₹{workshop.min_price || 'N/A'}</Typography>
        <hr />
        
        {workshop.creation_time && (
          <Typography variant="caption" color="text.secondary">
            Created: {formatDateToReadable(workshop.creation_time)}
          </Typography>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Tooltip title={getDraftStatus(workshop.creation_time).isDraftActive ? "Edit workshop" : "Draft time expired"}>
            <span>
              <Button
                variant="outlined"
                onClick={() => onEdit(workshop)}
                disabled={!getDraftStatus(workshop.creation_time).isDraftActive}
              >
                Edit
              </Button>
            </span>
          </Tooltip>

          <Tooltip title={getDraftStatus(workshop.creation_time).isDraftActive ? "Delete workshop" : "Draft time expired"}>
            <span>
              <Button
                variant="outlined"
                color="error"
                onClick={() => onDelete(workshop)}
                disabled={!getDraftStatus(workshop.creation_time).isDraftActive}
              >
                Delete
              </Button>
            </span>
          </Tooltip>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button 
            variant="outlined" 
            color="info" 
            onClick={() => window.open(`/workshop/${workshop?.workshop_id}`, '_blank')}
          >
            Full Page
          </Button>
          <Button
            variant="outlined"
            color="info"
            onClick={() => window.open(`/workshopRevenue/${workshop?.workshop_id}`, '_blank')}
          >
            Revenue
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const WorkshopCrud = () => {
  const [isDarkModeOn, setIsDarkModeOn] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const userEmail = getUserEmail();
      if (!userEmail) {
        alert('Please login to view your workshops');
        return;
      }

      // TODO: Replace with actual API endpoint
      const response = await fetch(`https://nrityaserver-2b241e0a97e5.herokuapp.com/crud/get_workshops_by_creator/${userEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkshops(data.workshops || []);
        console.log('Workshops fetched:', data.workshops);
      } else {
        console.error('Failed to fetch workshops');
        setWorkshops([]);
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
      setWorkshops([]);
    } finally {
      setLoading(false);
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
    if (!confirm(`Are you sure you want to delete "${workshop.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`https://nrityaserver-2b241e0a97e5.herokuapp.com/crud/delete_workshop/${workshop.workshop_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response);

      if (response.ok) {
        console.log("Workshop deleted successfully");
        fetchWorkshops(); // Refresh the list
      } else {
        alert('Failed to delete workshop.');
      }
    } catch (error) {
      console.error("Error deleting workshop", error);
      alert('Failed to delete workshop.');
    }
  };

  if (showForm) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
          <WorkshopForm 
            existingWorkshop={selectedWorkshop} 
            onClose={handleCloseForm}
          />
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" style={{ color: isDarkModeOn ? 'white' : 'black' }} mb={3}>
            Manage Your Workshops
          </Typography>
          
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

            {/* Existing Workshops */}
            {workshops.map((workshop) => (
              <Grid item xs={12} sm={6} md={4} key={workshop.workshop_id}>
                <WorkshopCardForOwner
                  key={workshop.workshop_id}
                  workshop={workshop}
                  isDarkModeOn={isDarkModeOn}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}

            {/* Loading Skeletons */}
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
            ))}

            {/* Empty State */}
            {!loading && workshops.length === 0 && (
              <Grid item xs={12}>
                <Card sx={{ background: isDarkModeOn ? '#333' : '#fafafa', textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No workshops found. Create your first workshop!
                  </Typography>
                </Card>
              </Grid>
            )}
          </Grid>
        </Box>
      </main>
      <ClientFooter />
    </div>
  );
};

export default WorkshopCrud; 