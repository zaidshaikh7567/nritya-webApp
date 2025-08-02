import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  Divider,
  Chip,
  Avatar,
  IconButton,
  Button,
  Container,
  CardContent
} from '@mui/material';
import { 
  CalendarToday, 
  AccessTime, 
  LocationOn, 
  Person, 
  Email,
  Phone,
  QrCode,
  Print,
  Share,
  ArrowBack,
  Home
} from '@mui/icons-material';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';
import TicketClient from './TicketClient';
import TicketPDF from './TicketPDF';
import { BASEURL_PROD } from '../../../src/constants';
import ClientHeader from '../../components/ClientHeader';
import ClientFooter from '../../components/ClientFooter';
import QRCode from 'react-qr-code';

const convertTo12HourFormat = (timeString) => {
  if (!timeString) return '';
  try {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch (error) {
    return timeString;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Real API function to fetch ticket data
async function fetchTicketData(bookingId) {
  try {
    const response = await fetch(`${BASEURL_PROD}payments/workshop_bookings?booking_id=${bookingId}`);
    const data = await response.json();
    
    console.log("data", data);
    
    if (data.success && data.booking) {
      const booking = data.booking;
      
      // Fetch workshop details using workshop_id
      let workshopDetails = null;
      try {
        const workshopResponse = await fetch(`${BASEURL_PROD}crud/get_workshop_by_id/${booking.workshop_id}`);
        const workshopData = await workshopResponse.json();
        workshopDetails = workshopData;
        console.log("workshopDetails", workshopDetails);
      } catch (workshopError) {
        console.error('Error fetching workshop details:', workshopError);
      }
      
      // Transform the API data to match the expected format
      return {
        booking_id: booking.booking_id,
        user_id: booking.user_id,
        user_email: booking.buyer_email,
        workshop_id: booking.workshop_id,
        workshop_name: workshopDetails?.name || "Workshop Booking",
        address: {
          building: workshopDetails?.building || "Venue details to be added",
          street: workshopDetails?.street || "Address information",
          landmark: workshopDetails?.geolocation ? "Location available" : "Landmark",
          city: workshopDetails?.city || "City",
          latitude: workshopDetails?.geolocation?.split(',')[0] || "0",
          longitude: workshopDetails?.geolocation?.split(',')[1] || "0"
        },
        booking_items: booking.items || [],
        booking_summary: {
          subtotal: booking.subtotal,
          booking_fee: booking.booking_fee,
          cgst: 0,
          sgst: 0,
          total: booking.total_amount
        },
        buyer_name: booking.buyer_name,
        buyer_email: booking.buyer_email,
        buyer_phone: booking.buyer_phone,
      };
    } else {
      throw new Error('Booking not found');
    }
  } catch (error) {
    console.error('Error fetching ticket data:', error);
    throw error;
  }
}

export default async function TicketPage({ params }) {
  const { ticketId } = params;
  console.log("ticketId", ticketId);
  // Fetch ticket data
  const ticketData = await fetchTicketData(ticketId);
  const client_url  = "https://nritya-webapp-ssr-1-b3a1c0b4b8f2.herokuapp.com/"
  // Sort booking items by date and time
  const sortedBookingItems = [...ticketData.booking_items].sort((a, b) => {
    // First sort by date
    const dateComparison = new Date(a.date) - new Date(b.date);
    if (dateComparison !== 0) return dateComparison;
    
    // If dates are same, sort by time
    return a.time.localeCompare(b.time);
  });
  
  // Create new object with sorted items
  const sortedTicketData = {
    ...ticketData,
    booking_items: sortedBookingItems
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
        <Box sx={{ 
          flex: 1,
          bgcolor: '#f8f9fa',
          py: 4
        }} data-ticket-page>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              
              {/* Main Ticket Card */}
              <Grid item xs={12} lg={8}>
                <Card sx={{ 
                  p: 4, 
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(115, 94, 171, 0.1)',
                  border: '2px solid #735EAB',
                  position: 'relative',
                  overflow: 'visible'
                }}>
                  
                  {/* Decorative elements */}
                  <Box sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 60,
                    height: 60,
                    bgcolor: '#735EAB',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px'
                  }}>
                    🎭
                  </Box>

                  {/* Workshop Info */}
                  <Box sx={{ textAlign: 'center', mb: 4, pt: 2 }}>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 'bold', 
                      color: '#735EAB',
                      mb: 2,
                      textTransform: 'none'
                    }}>
                      {sortedTicketData.workshop_name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                      <Chip 
                        icon={<FaCalendarAlt color="white" />} 
                        label={`${sortedTicketData.booking_items.length} bookings`}
                        sx={{ bgcolor: '#735EAB', color: 'white' }}
                      />
                    </Box>
                  </Box>

                  {/* Location Info with QR Code */}
                  <Box sx={{ 
                    bgcolor: '#f8f9fa', 
                    p: 3, 
                    borderRadius: 2, 
                    mb: 4,
                    border: '1px solid #e9ecef'
                  }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LocationOn sx={{ color: '#735EAB', mr: 1 }} />
                          <Typography variant="h6" sx={{ 
                            fontWeight: 'bold',
                            color: '#735EAB'
                          }}>
                            📍 Venue Details
                          </Typography>
                        </Box>
                        
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {sortedTicketData.address.building}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {sortedTicketData.address.street}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          Near: {sortedTicketData.address.landmark}
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          fontWeight: 'bold',
                          color: '#735EAB'
                        }}>
                          {sortedTicketData.address.city}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ 
                            p: 2,
                            bgcolor: 'white',
                            borderRadius: 2,
                            display: 'inline-block'
                          }}>
                            <QRCode
                              value={`${client_url}/validate_workshop_bookings/${sortedTicketData?.booking_id || "workshop-booking"}`}
                              size={120}
                            />
                            <Typography variant="body2" sx={{ 
                              fontWeight: 'bold',
                              color: '#735EAB'
                            }}>
                              Scan for Entry
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Buyer Information */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold',
                      color: '#735EAB',
                      mb: 2
                    }}>
                      👤 Buyer Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Person sx={{ color: '#735EAB', mr: 1 }} />
                          <Typography variant="body1">
                            <strong>Name:</strong> {sortedTicketData.buyer_name}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Email sx={{ color: '#735EAB', mr: 1 }} />
                          <Typography variant="body1">
                            <strong>Email:</strong> {sortedTicketData.buyer_email}
                          </Typography>
                        </Box>
                      </Grid>
                      {sortedTicketData.buyer_phone && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Phone sx={{ color: '#735EAB', mr: 1 }} />
                            <Typography variant="body1">
                              <strong>Phone:</strong> {sortedTicketData.buyer_phone}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>

                  {/* Events List */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold',
                      color: '#735EAB',
                      mb: 3
                    }}>
                      🎫 Events
                    </Typography>
                    
                    {sortedTicketData.booking_items.map((item, index) => (
                      <Card key={index} sx={{ 
                        mb: 2, 
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: 2,
                          borderColor: '#735EAB'
                        }
                      }}>
                        <CardContent sx={{ p: 3 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={8}>
                              <Typography variant="subtitle1" sx={{ 
                                fontWeight: 'bold',
                                mb: 1,
                                color: '#735EAB'
                              }}>
                                {item.variant_description}
                              </Typography>
                              
                              <Chip 
                                label={item.subvariant_description}
                                size="small"
                                sx={{ 
                                  bgcolor: '#735EAB', 
                                  color: 'white',
                                  mb: 1
                                }}
                              />
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CalendarToday sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                                <Typography variant="body2">
                                  {formatDate(item.date)}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <AccessTime sx={{ fontSize: 16, mr: 1, color: '#666' }} />
                                <Typography variant="body2">
                                  {convertTo12HourFormat(item.time)}
                                </Typography>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} sm={4}>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                  Quantity: {item.quantity}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#735EAB', fontWeight: 'bold' }}>
                                  ₹{item.price_per_ticket} per ticket
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>

                  {/* Booking Summary Button */}
                  <Box sx={{ 
                    bgcolor: '#735EAB', 
                    color: 'white',
                    p: 3, 
                    borderRadius: 2,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      mb: 2
                    }}>
                      Booking Summary
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                      Click to view detailed pricing information
                    </Typography>
                    <TicketClient ticketData={sortedTicketData} />
                  </Box>
                </Card>
              </Grid>

              {/* Sidebar */}
              <Grid item xs={12} lg={4}>
                <Box sx={{ position: 'sticky', top: 20 }}>
                  
                  {/* QR Code Section */}
                  <Box sx={{ mb: 3 }}>
                    <Card sx={{ 
                      bgcolor: '#735EAB', 
                      color: 'white', 
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}>
                    </Card>
                  </Box>

                  {/* Client-side Action Component */}
                  <TicketPDF ticketData={sortedTicketData} />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </main>
      <ClientFooter/>
    </div>
  );
} 