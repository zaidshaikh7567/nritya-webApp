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

// Mock data - in real app this would come from API
const mockTicketData = {
  "booking_id": "1234",
  "user_id": "user-id",
  "user_email": "abc@gmail.com",
  "workshop_id": "a8097cf1-cc6e-40c0-8a5f-0d3e252f9bf8",
  "workshop_name": "Workshop by Rocks",
  "address": {
    "building": "4th floor,SBC Buildng",
    "street": "beside ABC1 shop, ABC street",
    "landmark": "NEw Tower",
    "city": "Patna",
    "latitude": "18.9",
    "longitude": "23.4"
  },
  "booking_items": [
    {
      "variant_id": "dd852042-8e07-4f68-a0cf-a504332fc808",
      "subvariant_id": "de551aa1-030a-46fc-bb6d-11a4c90fe104",
      "variant_description": "DAY 1 | Tanish x Jhanavi | Bollywood",
      "subvariant_description": "Couple(Early Bird)",
      "date": "2025-07-30",
      "time": "09:00",
      "quantity": 1,
      "price_per_ticket": 1999,
      "subtotal": 1999
    },
    {
      "variant_id": "56a67ae9-bc64-4c95-b4df-91ff24280a6f",
      "subvariant_id": "a371c89c-aaeb-4e03-aae8-a891e747ed38",
      "variant_description": "DAY 2 | Tanish x Jhanavi | Bollypop",
      "subvariant_description": "Single",
      "date": "2025-07-31",
      "time": "19:15",
      "quantity": 1,
      "price_per_ticket": 1299,
      "subtotal": 1299
    },
    {
      "variant_id": "7ce6b7cc-ad00-4d27-9b88-bc0ed34e8e7c",
      "subvariant_id": "bf94ea14-af53-4338-af09-ecfdcf5a7e3b",
      "variant_description": "DAY 1 | Tanish x Jhanavi | Salsa",
      "subvariant_description": "Single",
      "date": "2025-07-30",
      "time": "19:15",
      "quantity": 1,
      "price_per_ticket": 1999,
      "subtotal": 1999
    },
    {
      "variant_id": "dd852042-8e07-4f68-a0cf-a504332fc808",
      "subvariant_id": "1d1eddab-35ac-4a8c-aafd-6fd1b0d0d309",
      "variant_description": "DAY 1 | Tanish x Jhanavi | Bollywood",
      "subvariant_description": "Single",
      "date": "2025-07-30",
      "time": "09:00",
      "quantity": 2,
      "price_per_ticket": 1499,
      "subtotal": 2998
    },
    {
      "variant_id": "7ce6b7cc-ad00-4d27-9b88-bc0ed34e8e7c",
      "subvariant_id": "2663eb74-8b93-4123-8faf-13bd0a1ba551",
      "variant_description": "DAY 1 | Tanish x Jhanavi | Salsa",
      "subvariant_description": "Couple",
      "date": "2025-07-30",
      "time": "19:15",
      "quantity": 2,
      "price_per_ticket": 2999,
      "subtotal": 5998
    }
  ],
  "booking_summary": {
    "subtotal": 14293,
    "booking_fee": 429,
    "cgst": 0,
    "sgst": 0,
    "total": 14722
  }
};

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
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Mock API function - replace with actual API call
async function fetchTicketData(ticketId) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockTicketData;
}

export default async function TicketPage({ params }) {
  const { ticketId } = params;
  
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
                             Ticket Type
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