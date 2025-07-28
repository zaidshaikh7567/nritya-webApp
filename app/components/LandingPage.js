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
  
  // Convert object to array format
  const studios = Object.keys(studiosData).map(id => ({
    id,
    name: studiosData[id].studioName,
    location: studiosData[id].city,
    rating: studiosData[id].avgRating,
    images: studiosData[id].iconUrl ? [studiosData[id].iconUrl] : ['/assets/images/service-1.jpg'],
    danceForms: studiosData[id].danceStyles ? studiosData[id].danceStyles.split(',') : [],
    price: studiosData[id].minFee > 0 ? `₹${studiosData[id].minFee}/month` : 'Contact for pricing',
    street: studiosData[id].street,
    state: studiosData[id].state,
    status: studiosData[id].status,
    isPremium: studiosData[id].isPremium,
    freeTrialAvailable: studiosData[id].freeTrialAvailable
  }));
  
  const workshops = Object.keys(workshopsData).map(id => ({
    id,
    name: workshopsData[id].workshopName || 'Workshop',
    instructor: workshopsData[id].instructorName || 'Expert Instructor',
    duration: workshopsData[id].duration || '2 weeks',
    price: workshopsData[id].price ? `₹${workshopsData[id].price}` : '₹5000',
    images: workshopsData[id].iconUrl ? [workshopsData[id].iconUrl] : ['/assets/images/ticket-dance-image-1.png'],
    level: workshopsData[id].level || 'Beginner',
    description: workshopsData[id].description || ''
  }));

  const featuredStudios = studios.slice(0, 3);
  const featuredWorkshops = workshops.slice(0, 3);


  // Use danceImagesUrl from API or fallback images
  const carouselImages = danceImagesUrl.length > 0 ? danceImagesUrl : [];
  console.log(carouselImages);
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Dance Images Carousel */}
      {carouselImages.length > 0 && (
  
          <ImageCarousel images={carouselImages} />
  
      )}

      {/* Featured Studios */}
      {featuredStudios.length > 0 && (
        <div className="w-full px-4">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="h4" component="h3" sx={{ textTransform:'none' }}>
              Featured Studios
            </Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              sx={{ color: 'primary.main' }}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={3}>
            {featuredStudios.map((studio, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Link href={`/studio/${studio.id}`}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={studio.images?.[0] || '/assets/images/service-1.jpg'}
                    alt={studio.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ textTransform:'none' }} gutterBottom>
                      {studio.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 'small', mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {studio.location || 'New Delhi'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={studio.rating || 4.5} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {studio.rating || 4.5}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {studio.danceForms?.slice(0, 3).map((form, idx) => (
                        <Chip key={idx} label={form} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </div>
      )}

      {/* Featured Workshops */}
      {featuredWorkshops.length > 0 && (
        <div className="w-full px-2">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h3" sx={{ textTransform:'none' }}>
              Featured Workshops
            </Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              sx={{ color: 'primary.main' }}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={3}>
            {featuredWorkshops.map((workshop, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={workshop.images?.[0] || '/assets/images/ticket-dance-image-1.png'}
                    alt={workshop.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ textTransform:'none' }} gutterBottom>
                      {workshop.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      by {workshop.instructor || 'Expert Instructor'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={workshop.level || 'Beginner'} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      <Typography variant="body2" sx={{ ml: 'auto' }}>
                        ₹{workshop.price || '5000'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {workshop.duration || '2 weeks'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
            {/* Popular Dance Forms */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
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
      </Container>
    </Box>
  );
} 