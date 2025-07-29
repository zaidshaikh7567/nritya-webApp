import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Rating,
  IconButton,
  useTheme,
  Skeleton,
  Link,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import ImageCarousel from './ImageCarousel';
import StudioCarousel from './StudioCarousel';
import WorkshopCarousel from './WorkshopCarousel';

// API endpoints from constants
//const BASEURL_PROD = "https://nrityaserver-2b241e0a97e5.herokuapp.com/" // Replace with your actual staging server URL
const COLLECTIONS = {
  STUDIO: "Studio",
  WORKSHOPS: "Workshops",
  OPEN_CLASSES: "OpenClasses",
  COURSES: "Courses",
};



// Dance forms data
const danceForms = [
  { name: "Bollywood", icon: "🎵" },
  { name: "Bharatnatyam", icon: "🕉️" },
  { name: "Odisi", icon: "🎭" },
  { name: "Kathak", icon: "⚡" },
  { name: "Salsa", icon: "💃" },
  { name: "Hip Hop", icon: "🎤" },
  { name: "Ballet", icon: "🩰" },
  { name: "Jazz", icon: "🎷" },
];

export default async function LandingPage({studioIdName, exploreEntity, danceImagesUrl}) {
  // Get studios and workshops data - convert objects to arrays
  const studiosData = exploreEntity[COLLECTIONS.STUDIO] || {};
  const workshopsData = exploreEntity[COLLECTIONS.WORKSHOPS] || {};
  
  // Convert object to array format for carousel components
  const studios = Object.keys(studiosData).map(id => ({
    id,
    studioName: studiosData[id].studioName,
    city: studiosData[id].city,
    avgRating: studiosData[id].avgRating,
    iconUrl: studiosData[id].iconUrl,
    danceStyles: studiosData[id].danceStyles,
    minFee: studiosData[id].minFee,
    street: studiosData[id].street,
    state: studiosData[id].state,
    status: studiosData[id].status,
    isPremium: studiosData[id].isPremium,
    freeTrialAvailable: studiosData[id].freeTrialAvailable
  }));
  
  const workshops = Object.keys(workshopsData).map(id => ({
    id,
    workshopName: workshopsData[id].workshopName,
    instructorName: workshopsData[id].instructorName,
    duration: workshopsData[id].duration,
    price: workshopsData[id].price,
    iconUrl: workshopsData[id].iconUrl,
    level: workshopsData[id].level,
    description: workshopsData[id].description,
    venue: workshopsData[id].venue,
    date: workshopsData[id].date,
    time: workshopsData[id].time,
    active: workshopsData[id].active,
    danceStyles: workshopsData[id].danceStyles,
    youtubeViedoLink: workshopsData[id].youtubeViedoLink,
    studioDetails: workshopsData[id].studioDetails
  }));

  console.log('API Studios Data:', studios);
  console.log('API Workshops Data:', workshops);


  // Use danceImagesUrl from API or fallback images
  const carouselImages = danceImagesUrl.length > 0 ? danceImagesUrl : [];
  console.log(carouselImages);
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Dance Images Carousel */}
      {carouselImages.length > 0 && (
  
          <ImageCarousel images={carouselImages} />
  
      )}

      {/* Featured Studios Carousel */}
      {studios.length > 0 && (
        <div className="w-full px-4 mt-4">
          <StudioCarousel studios={studios} title="Featured Studios" />
        </div>
      )}

      {/* Featured Workshops Carousel */}
      {workshops.length > 0 && (
        <div className="w-full px-4 mt-4">
          <WorkshopCarousel workshops={workshops} title="Featured Workshops" />
        </div>
      )}
            {/* Popular Dance Forms */}
      <div className="w-full px-4 mt-4 mb-1">
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Popular Dance Forms
        </Typography>
        <Grid container spacing={3}>
          {danceForms.map((dance, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {dance.icon}
                  </Typography>
                  <Typography variant="h6" component="h3">
                    {dance.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Box>
  );
} 