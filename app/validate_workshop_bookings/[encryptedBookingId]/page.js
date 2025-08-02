import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  CheckCircle, 
  Cancel, 
  Person, 
  Email,
  CalendarToday,
  AccessTime,
  LocationOn
} from '@mui/icons-material';
import { BASEURL_PROD } from '../../../src/constants';
import ClientHeader from '../../components/ClientHeader';
import ClientFooter from '../../components/ClientFooter';

// SSR function to fetch validation data
async function validateWorkshopBooking(encryptedBookingId) {
  const BASEURL_LOCAL = BASEURL_PROD //'http://0.0.0.0:8000/'
  try {
    const response = await fetch(`${BASEURL_LOCAL}payments/validate_workshop_bookings/${encryptedBookingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validating workshop booking:', error);
    return {
      success: false,
      message: 'Failed to validate booking'
    };
  }
}

export default async function ValidateWorkshopBookingPage({ params }) {
  const { encryptedBookingId } = params;
  
  // Validate the booking
  const validationResult = await validateWorkshopBooking(encryptedBookingId);

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
        <Box sx={{ 
          minHeight: '100vh', 
          bgcolor: '#f5f5f5',
          py: 4,
          px: 2
        }}>
          <Box sx={{ 
            maxWidth: 600, 
            mx: 'auto',
            bgcolor: 'white',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: 3
          }}>
            
            {/* Header */}
            <Box sx={{ 
              bgcolor: validationResult.success ? '#4caf50' : '#f44336',
              color: 'white',
              p: 3,
              textAlign: 'center'
            }}>
              {validationResult.success ? (
                <>
                  <CheckCircle sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textTransform:'none' }}>
                    ✅ Valid Entry
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Workshop booking validated successfully
                  </Typography>
                </>
              ) : (
                <>
                  <Cancel sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    ❌ Invalid Entry
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {validationResult.message || 'Unable to validate booking'}
                  </Typography>
                </>
              )}
            </Box>

            {/* Content */}
            <CardContent sx={{ p: 3 }}>
              {validationResult.success ? (
                <>
                  {/* Booking Details */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      mb: 2,
                      color: '#735EAB',
                      textTransform:'none'
                    }}>
                      📋 Booking Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Person sx={{ mr: 1, color: '#666' }} />
                      <Typography variant="body1">
                        <strong>Name:</strong> {validationResult.buyer_name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ mr: 1, color: '#666' }} />
                      <Typography variant="body1">
                        <strong>Email:</strong> {validationResult.buyer_email}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ mr: 1, color: '#666' }} />
                      <Typography variant="body1">
                        <strong>Booked on:</strong> {formatDate(validationResult.created_at)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ mr: 1, color: '#666' }} />
                      <Typography variant="body1">
                        <strong>Booking ID:</strong> {validationResult.booking_id}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Workshop Events */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      mb: 2,
                      color: '#735EAB',
                      textTransform:'none'
                    }}>
                      🎫 Workshop Events
                    </Typography>
                    
                    {validationResult.items?.map((item, index) => (
                      <Card key={index} sx={{ 
                        mb: 2, 
                        border: '1px solid #e0e0e0',
                        borderRadius: 2
                      }}>
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 'bold',
                            mb: 1,
                            color: '#735EAB',
                            textTransform:'none'
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
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              Quantity: {item.quantity}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#735EAB' }}>
                              ₹{item.price_per_ticket} per ticket
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>

                  {/* Success Message */}
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      ✅ Entry Approved
                    </Typography>
                    <Typography variant="body2">
                      This is a valid workshop booking. Please allow entry as per ticket details.
                    </Typography>
                  </Alert>
                </>
              ) : (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    ❌ Entry Denied
                  </Typography>
                  <Typography variant="body2">
                    {validationResult.message || 'This QR code is invalid or has expired.'}
                  </Typography>
                </Alert>
              )}

              {/* Footer */}
              <Box sx={{ 
                mt: 3, 
                pt: 2, 
                borderTop: '1px solid #e0e0e0',
                textAlign: 'center'
              }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Generated by Nritya
                </Typography>
                <Typography variant="caption" sx={{ color: '#999' }}>
                  {new Date().toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Box>
        </Box>
      </main>
      <ClientFooter/>
    </div>
  );
} 