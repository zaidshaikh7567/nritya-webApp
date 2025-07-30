import { Box, Typography, Grid, Button, Chip, Divider, LinearProgress ,ExpandMoreIcon,AccordionSummary, Paper, Accordion,AccordionDetails} from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import RoomIcon from '@mui/icons-material/Room';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ClientHeader from '../../components/ClientHeader';
import ClientFooter from '../../components/ClientFooter';
import ContactUsWidget from '../../components/ContactUsWidget';
import { formatDateString } from '../../../src/utils/common';
import { convertTo12HourFormat } from '../../../src/utils/timeUtils';
import { CHIP_LEVELS_DESIGN } from '../../../src/constants';

const BASEURL_PROD = "https://nrityaserver-2b241e0a97e5.herokuapp.com/";

const findMinTime = (data, targetDate) => {
  let minTime = Infinity; 

  for (const variant of data.variants) {
    const variantStartDate = variant.date;

    if (variantStartDate === targetDate) {
      const variantTime = variant.time;
      if (variantTime < minTime || minTime === Infinity) {
        minTime = variantTime;
      }
    }
  }

  return minTime;
};

async function fetchWorkshopData(workshopId) {
  try {
    const url = `${BASEURL_PROD}crud/get_workshop_by_id/${workshopId}`
    console.log("AY_URL :",url)
    const response = await fetch(url, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching workshop data:', error);
    return null;
  }
}

export default async function WorkshopPage({ params }) {
  const { workshopId } = params;
  console.log("Workshop ID: ",workshopId)
  const workshopData = await fetchWorkshopData(workshopId);

  if (!workshopData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ClientHeader />
        <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Workshop Not Found
            </Typography>
            <Typography variant="body1">
              The workshop you&apos;re looking for doesn&apos;t exist or has been removed.
            </Typography>
          </Box>
        </main>
        <ClientFooter />
        <ContactUsWidget />
      </div>
    );
  }

  // Extract workshop details
  const workshop = {
    name: workshopData.name || 'Workshop',
    dance_styles: workshopData.dance_styles || 'Dance',
    building: workshopData.building || 'Venue',
    street: workshopData.street || '',
    city: workshopData.city || 'City',
    description: workshopData.description || 'No description available.',
    terms_conditions: workshopData.terms_conditions || 'Terms and conditions apply.',
    geolocation: workshopData.geolocation || '',
    start_date: workshopData.start_date || 'TBD',
    end_date: workshopData.end_date || workshopData.start_date || 'TBD',
    min_price: workshopData.min_price || 0,
    iconUrl: 'https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg',
    variants: workshopData.variants || [],
    level: 'All Levels',
    active: true
  };

  // Find minimum time for display
  const startTime = workshop.variants.length > 0 ? findMinTime(workshopData, workshop.start_date) : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
        <Box
          sx={{
            padding: "0rem",
            color: "black",
          }}
        >
          <Grid container spacing={2} marginBottom={2}>
            <Grid item xs={12} lg={8} sx={{ display: "flex", flexDirection: "column" }}>
              <img
                src={workshop.iconUrl}
                alt={workshop.name || "Entity Image"}
                style={{ width: "100%", height: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
              />
            </Grid>
            <Grid item xs={12} lg={4} sx={{ display: "flex", flexDirection: "column" }}> 
              <Box
                sx={{
                  bgcolor: "",
                  boxShadow: '3',
                  p: 3,
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                {/* Entity Info */}
                <Box>
                  <Typography variant="h4" style={{ color: 'black', textTransform: 'none', textDecoration: 'none' }}>
                    {workshop.name || "Workshop Name"}
                  </Typography>
                  <br />

                  <Box>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <CalendarMonthOutlinedIcon sx={{ color: '#735eab' }} />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1" style={{ color: 'black', textTransform: 'none', textDecoration: 'none' }}>
                          {workshop.start_date && formatDateString(workshop.start_date)} - {workshop.end_date && formatDateString(workshop.end_date)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid style={{paddingTop:'0.5rem'}} container spacing={2} alignItems="center">
                      <Grid item>
                        <AccessTimeOutlinedIcon style={{ color: '#735eab' }} />
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle1" style={{ color: 'black', textTransform: 'none' }}>
                          {startTime ? convertTo12HourFormat(startTime) + " onwards" : ""} 
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid style={{paddingTop:'0.5rem'}} container spacing={2} alignItems="center">
                      <Grid item>
                        <RoomIcon sx={{ color: '#735eab' }} />
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" sx={{ color: 'black' }}>
                        {`${workshop.street ? workshop.street + ', ' : ''}${workshop.city || 'Address'}`}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid style={{paddingTop:'0.5rem'}} container spacing={2} alignItems="center">
                      <Grid item>
                        <CurrencyRupeeIcon sx={{ color: '#735eab' }} />
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" style={{ color: 'black' }}>
                          {workshop.min_price ? `${workshop.min_price} onwards` : 'Free'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                {/* Booking Section */}
                <Box
                  sx={{
                    mt: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    color: 'black'
                  }}
                >
                  {/* Book Now Button */}
                  <Button
                    variant="contained"
                    href={`/workshop/${workshopId}/events`}
                    sx={{
                      textTransform: "none",
                      fontSize: 16,
                      padding: "8px 16px",
                      backgroundColor: "#735EAB",
                      color: "white",
                      fontWeight: 'bold',
                      "&:hover": {
                        backgroundColor: "#96ab5e",
                      },
                    }}
                  >
                    Book @₹{workshop.min_price} onwards
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} lg={8}>
              <Grid container spacing={1}>
                {/* Row 1: About */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2 }}>
                    <Typography
                      variant="h4"
                      style={{ 
                        color: 'black', 
                        textTransform: 'none', 
                        borderBottom: '4px solid #735eab',
                        display: 'inline-block',
                      }}
                    >
                      About
                    </Typography>
                  </Box>
                </Grid>

                {/* Row 2: Dance Styles */}
                <Grid item xs={12}>
                  {workshop.dance_styles && workshop.dance_styles.length > 0 && (
                    <>
                      {workshop.dance_styles.split(",").map((style, index) => (
                        <Chip
                          key={index}
                          label={style.trim()}
                          sx={{
                            bgcolor: index % 2 === 0 ? '#44367d' : index % 2 === 1 ? '#96ab5e' : '#64b5f6',
                            color: 'white',
                            marginRight: '0.5rem',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            "&:hover": {
                              transform: 'translate(0.3rem, -0.1rem)'
                            }
                          }}
                        />
                      ))}
                    </>
                  )}
                </Grid>

                {/* Row 3: Level */}
                <Grid item xs={12}>
                  <Chip
                    sx={{
                      marginLeft: "10px",
                      marginBottom: "10px",
                      fontSize: "0.8rem",
                      bgcolor: CHIP_LEVELS_DESIGN[workshop.level || "All"]?.backgroundColor,
                      color: CHIP_LEVELS_DESIGN[workshop.level || "All"]?.color,
                      fontWeight: 'bold', 
                    }}
                    label={workshop.level || "All"}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider
                    sx={{
                      "&.MuiDivider-root": {
                        "&::before": {
                          border: `thin solid #735eaf`,
                        },
                        "&::after": {
                          border: `thin solid #735eaf`,
                        },
                      },
                    }}
                  >
                    Description
                  </Divider>
                </Grid>

                {/* Row 4: Description */}
                <Grid item xs={12}>
                  <div
                    style={{ color: 'black' }}
                    className="description-box"
                    dangerouslySetInnerHTML={{ __html: workshop.description || "Workshop Description" }}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <Grid item>
                <Box
                  sx={{
                    bgcolor: "",
                    boxShadow: '3',
                    p: 2,
                    borderRadius: '8px',
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Grid item>
                      <RoomIcon sx={{ color: '#735eab' }} />
                    </Grid>
                    <Typography
                      variant="h5"
                      style={{ color: 'black', textTransform: 'none' }}
                    >
                      Venue
                    </Typography>
                  </Box>
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      sx={{ color: 'black', marginTop: 1 }}
                    >
                      {`${workshop.building || ''}${workshop.building ? ', ' : ''}${workshop.street || ''}${workshop.street ? ', ' : ''}${workshop.city || 'Address'}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ paddingTop: '2rem' }}>
                    {workshop.geolocation && (
                      <Button
                        variant="contained"
                        href={`https://www.google.com/maps/dir/?api=1&destination=${workshop.geolocation}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textTransform: "none",
                          fontSize: 16,
                          padding: "8px 16px",
                          backgroundColor: "#735EAB",
                          color: "white !important",
                          fontWeight: "bold",
                          width: "100%",
                          "&:hover": {
                            backgroundColor: "#96ab5e",
                          },
                        }}
                        endIcon={
                          <RoomIcon sx={{ color: 'white', fontSize: 20 }} />
                        }
                      >
                        Get Directions
                      </Button>
                    )}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </main>
      <ClientFooter />
      <ContactUsWidget />
    </div>
  );
} 