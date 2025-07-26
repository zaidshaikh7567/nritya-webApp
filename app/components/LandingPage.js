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
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

// API endpoints from constants
const BASEURL_PROD = "https://nrityaserver-2b241e0a97e5.herokuapp.com/" // Replace with your actual staging server URL
const COLLECTIONS = {
  STUDIO: "Studio",
  WORKSHOPS: "Workshops",
  OPEN_CLASSES: "OpenClasses",
  COURSES: "Courses",
};

// Fallback data when API is not available
const fallbackStudios = [
  {
    name: "Rhythm Dance Academy",
    location: "New Delhi",
    rating: 4.8,
    images: ["/assets/images/service-1.jpg"],
    danceForms: ["Bollywood", "Hip Hop", "Jazz"],
    price: "₹2000/month"
  },
  {
    name: "Classical Arts Studio",
    location: "Mumbai",
    rating: 4.9,
    images: ["/assets/images/service-2.jpg"],
    danceForms: ["Bharatnatyam", "Kathak", "Odisi"],
    price: "₹3000/month"
  },
  {
    name: "Contemporary Dance Hub",
    location: "Bangalore",
    rating: 4.7,
    images: ["/assets/images/service-3.jpg"],
    danceForms: ["Contemporary", "Ballet", "Jazz"],
    price: "₹2500/month"
  }
];

const fallbackWorkshops = [
  {
    name: "Bollywood Dance Workshop",
    instructor: "Priya Sharma",
    duration: "2 weeks",
    price: "₹5000",
    images: ["/assets/images/ticket-dance-image-1.png"],
    level: "Beginner"
  },
  {
    name: "Kathak Intensive",
    instructor: "Rajesh Kumar",
    duration: "1 month",
    price: "₹8000",
    images: ["/assets/images/ticket-dance-image-2.png"],
    level: "Intermediate"
  },
  {
    name: "Hip Hop Masterclass",
    instructor: "Amit Singh",
    duration: "3 days",
    price: "₹3000",
    images: ["/assets/images/ticket-dance-image-3.png"],
    level: "Advanced"
  }
];

// Server-side data fetching function
async function fetchLandingPageData() {
  try {
    const filterLocation = "New Delhi"; // Default location
    const entities = [COLLECTIONS.STUDIO, COLLECTIONS.WORKSHOPS, COLLECTIONS.COURSES, COLLECTIONS.OPEN_CLASSES];
    
    // Fetch studio ID name mapping
    const studioIdNameResponse = await fetch(`${BASEURL_PROD}api/autocomplete/?&city=${filterLocation}`);
    if (!studioIdNameResponse.ok) {
      throw new Error('Failed to fetch studio data');
    }
    const studioIdName = await studioIdNameResponse.json();
    
    // Fetch explore entities data
    const exploreEntityPromises = entities.map(async (entity) => {
      const response = await fetch(`${BASEURL_PROD}api/search/?&city=${filterLocation}&entity=${entity}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${entity} data`);
      }
      const data = await response.json();
      return { [entity]: data };
    });
    
    const exploreEntityResults = await Promise.all(exploreEntityPromises);
    const exploreEntity = Object.assign({}, ...exploreEntityResults);
    
    // Fetch landing page images
    const imagesResponse = await fetch(`${BASEURL_PROD}api/landingPageImages/`);
    if (!imagesResponse.ok) {
      throw new Error('Failed to fetch images');
    }
    const imagesData = await imagesResponse.json();
    const danceImagesUrl = imagesData.signed_urls?.filter(image => 
      typeof image === 'string' && !image.includes("LandingPageImages/?Expire")
    ) || [];
    
    return {
      studioIdName,
      exploreEntity,
      danceImagesUrl,
    };
  } catch (error) {
    console.error('Error fetching landing page data:', error);
    // Return fallback data when API fails
    return {
      studioIdName: {},
      exploreEntity: {
        [COLLECTIONS.STUDIO]: fallbackStudios,
        [COLLECTIONS.WORKSHOPS]: fallbackWorkshops,
        [COLLECTIONS.COURSES]: [],
        [COLLECTIONS.OPEN_CLASSES]: [],
      },
      danceImagesUrl: [],
    };
  }
}

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

export default async function LandingPage() {
  // Fetch data server-side
  const { studioIdName, exploreEntity, danceImagesUrl } = await fetchLandingPageData();
  
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
  
  // Take first 3 studios and workshops for display
  const featuredStudios = studios.slice(0, 3);
  const featuredWorkshops = workshops.slice(0, 3);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Discover the beat in your city!
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          India's first dance tech platform connecting dance enthusiasts with top dance studios
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            size="large"
              startIcon={<SearchIcon />}
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
            Find Studios
          </Button>
          <Button 
            variant="outlined" 
            size="large"
              sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Explore Workshops
          </Button>
        </Box>
        </Container>
      </Box>

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

      {/* Featured Studios */}
      {featuredStudios.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2">
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
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={studio.images?.[0] || '/assets/images/service-1.jpg'}
                    alt={studio.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
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
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Featured Workshops */}
      {featuredWorkshops.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2">
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
                    <Typography variant="h6" component="h3" gutterBottom>
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
        </Container>
      )}

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Start Dancing?
        </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Join thousands of dancers discovering their passion
        </Typography>
        <Button 
          variant="contained" 
          size="large"
              startIcon={<SearchIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              Find Your Perfect Studio
        </Button>
      </Box>
    </Container>
      </Box>
    </Box>
  );
} 