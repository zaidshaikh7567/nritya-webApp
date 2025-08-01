import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  Divider,
  Chip,
  Avatar,
  IconButton,
  Button
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
  ArrowBack
} from '@mui/icons-material';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';
import TicketClient from './TicketClient';
import TicketPDF from './TicketPDF';
import { BASEURL_PROD } from '../../../src/constants';

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
        payment_method: booking.payment_method,
        razorpay_payment_id: booking.razorpay_payment_id,
        created_at: booking.created_at,
        workshop_details: workshopDetails
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
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8f9fa',
      py: 4
    }} data-ticket-page>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>

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
                      <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'none' }}>
                        Venue Details
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
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#735EAB' }}>
                      {sortedTicketData.address.city}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ 
                      textAlign: 'center',
                      p: 2,
                      bgcolor: '#735EAB',
                      color: 'white',
                      borderRadius: 2,
                      height: 'fit-content'
                    }}>
                      <QrCode sx={{ fontSize: 80, mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Scan QR Code
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Present at venue for entry
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Booking Items */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color: '#735EAB',
                  textTransform: 'none',
                }}>
                  Bookings
                </Typography>
                
                {sortedTicketData.booking_items.map((item, index) => (
                  <Card key={index} sx={{ 
                    mb: 2, 
                    p: 3,
                    border: '1px solid #e9ecef',
                    '&:hover': {
                      borderColor: '#735EAB',
                      boxShadow: '0 4px 12px rgba(115, 94, 171, 0.15)'
                    }
                  }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={8}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold',
                          mb: 1,
                          textTransform: 'none'
                        }}>
                          {item.variant_description}
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          color: '#735EAB',
                          fontWeight: 'bold',
                          mb: 2
                        }}>
                          {item.subvariant_description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarToday sx={{ color: '#735EAB', fontSize: 16 }} />
                            <Typography variant="body2">
                              {formatDate(item.date)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime sx={{ color: '#735EAB', fontSize: 16 }} />
                            <Typography variant="body2">
                              {convertTo12HourFormat(item.time)}
                            </Typography>
                          </Box>
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
              
              {/* Action Buttons */}
              <Card sx={{ 
                p: 3,
                borderRadius: 3,
                border: '1px solid #e9ecef'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color: '#735EAB',
                  textTransform: 'none'
                }}>
                  Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TicketPDF ticketData={sortedTicketData} />
                  
                  <Button
                    variant="outlined"
                    startIcon={<Share />}
                    fullWidth
                    sx={{
                      borderColor: '#735EAB',
                      textTransform: 'none',
                      color: '#735EAB',
                      '&:hover': {
                        borderColor: '#5a4a8a',
                        bgcolor: 'rgba(115, 94, 171, 0.1)'
                      }
                    }}
                  >
                    Share Ticket
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    fullWidth
                    sx={{
                      borderColor: '#735EAB',
                      textTransform: 'none',
                      color: '#735EAB',
                      '&:hover': {
                        borderColor: '#5a4a8a',
                        bgcolor: 'rgba(115, 94, 171, 0.1)'
                      }
                    }}
                  >
                    Back to Bookings
                  </Button>
                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* Footer Info */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            Need help? Contact us at support@nritya.com
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            © 2024 Nritya. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
} 