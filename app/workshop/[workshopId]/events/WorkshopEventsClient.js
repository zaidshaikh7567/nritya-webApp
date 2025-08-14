'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Card, 
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaClock, FaRegCalendarAlt } from 'react-icons/fa';
import { Badge } from 'react-bootstrap';
import { BASEURL_PROD1 } from '../../../../src/constants';
const INT_FEE = 0.03;
const BASEURL_PROD = "http://0.0.0.0:8000/"
const convertTo12HourFormat = (timeString) => {
  if (!timeString) return '';
  try {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch (error) {
    return timeString; // Return original if parsing fails
  }
};

export default function WorkshopEventsClient({ workshopData, workshopId }) {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [daysMap, setDaysMap] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [pendingBookingPayload, setPendingBookingPayload] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      setUserInfo(JSON.parse(userInfoString));
    }
    localStorage.removeItem("redirectUrl");
  }, []);

  useEffect(() => {
    if (!workshopData?.variants) {
      setDaysMap(new Map());
      return;
    }
    
    const dayMap = new Map();
    
    // Sort variants by date and time first
    const sortedVariants = workshopData.variants.sort((a, b) => {
      // First sort by date
      const dateComparison = new Date(a.date) - new Date(b.date);
      if (dateComparison !== 0) return dateComparison;
      
      // If dates are same, sort by time
      return a.time.localeCompare(b.time);
    });

    sortedVariants.forEach(variant => {
      const date = variant.date;
      if (!dayMap.has(date)) {
        dayMap.set(date, {
          date: date,
          startTime: variant.time,
          variants: []
        });
      }
      dayMap.get(date).variants.push(variant);
    });
    
    // Sort by date in ascending order
    const sortedDaysMap = new Map([...dayMap.entries()].sort(([a], [b]) => new Date(a) - new Date(b)));
    setDaysMap(sortedDaysMap);
    
    // Set selectedDay to the first available date
    if (sortedDaysMap.size > 0 && !selectedDay) {
      const firstDate = Array.from(sortedDaysMap.keys())[0];
      setSelectedDay(firstDate);
    }
  }, [workshopData, selectedDay]);

  const handleQuantityChange = (variantId, subvariantId, value) => {
    setQuantities(prev => ({
      ...prev,
      [`${variantId}__${subvariantId}`]: parseInt(value) || 0  // Use double underscore to avoid conflicts with hyphens
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (bookingPayload) => {
    try {
      setLoading(true);
      console.log('Initiating payment for booking payload:', bookingPayload);
      // Load Razorpay script
      await loadRazorpayScript();
      
      // Create payment order
      const response = await fetch(`${BASEURL_PROD}payments/workshop_payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_data: bookingPayload
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const paymentData = await response.json();
      setPaymentData(paymentData);
      
      // Initialize Razorpay
      const options = {
        key: paymentData.merchantId,
        amount: paymentData.amount * 100, // Convert to paise
        currency: paymentData.currency,
        name: paymentData.name,
        description: paymentData.description,
        order_id: paymentData.orderId,
        prefill: paymentData.prefill,
        handler: function (response) {
          handlePaymentSuccess(response, bookingPayload);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.log('Payment initiation error:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response, bookingPayload) => {
    try {
      setLoading(true);
      
      // Verify payment
      const verifyResponse = await fetch(`${BASEURL_PROD}payments/workshop_payment_verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response: response,
          booking_data: bookingPayload
        })
      });

      const verifyData = await verifyResponse.json();
      
      if (verifyResponse.ok) {
        alert('Payment successful! Your workshop booking has been confirmed.');
        // Redirect to booking confirmation page or dashboard
        router.push('/myBookings');
      } else {
        alert(`Payment verification failed: ${verifyData.message}`);
      }
      
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment verification failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    // Get user info from localStorage
    let userInfo = null;
    try {
      const userInfoString = localStorage.getItem("userInfo");
      if (userInfoString) {
        userInfo = JSON.parse(userInfoString);
      } else {
        localStorage.setItem("redirectUrl", window.location.pathname);
        router.push('/login');
        return;
      }
    } catch (error) {
      console.error('Error parsing user info from localStorage:', error);
    }

    // Calculate total and proceed with booking
    const selectedItems = Object.entries(quantities)
      .filter(([key, quantity]) => quantity > 0)
      .map(([key, quantity]) => {
        const [variantId, subvariantId] = key.split('__');  // Split by double underscore
        console.log('Processing key:', key, 'variantId:', variantId, 'subvariantId:', subvariantId);
        
        // Debug: Log all variants to see what we have
        console.log('All variants:', workshopData?.variants);
        console.log('Looking for variant_id:', variantId);
        
        const variant = workshopData?.variants?.find(v => {
          console.log('Checking variant:', v.variant_id, 'against:', variantId, 'match:', v.variant_id === variantId);
          return v.variant_id === variantId;
        });
        console.log('Found variant:', variant);
        
        if (variant) {
          console.log('Variant subvariants:', variant.subvariants);
          console.log('Looking for subvariant_id:', subvariantId);
          
          const subvariant = variant.subvariants?.find(s => {
            console.log('Checking subvariant:', s.subvariant_id, 'against:', subvariantId, 'match:', s.subvariant_id === subvariantId);
            return s.subvariant_id === subvariantId;
          });
          console.log('Found subvariant:', subvariant);
          
          const result = {
            variant_id: variantId,
            subvariant_id: subvariantId,
            variant_description: variant?.description || '',
            subvariant_description: subvariant?.description || '',
            date: variant?.date || '',
            time: variant?.time || '',
            quantity: quantity,
            price_per_ticket: subvariant?.price || 0,
            subtotal: (subvariant?.price || 0) * quantity
          };
          
          console.log('Created item:', result);
          return result;
        } else {
          console.log('Variant not found!');
          return null;
        }
      }).filter(item => item !== null);

    console.log('Selected items after mapping:', selectedItems);

    if (selectedItems.length === 0) {
      alert('Please select at least one ticket option.');
      return;
    }

    // Calculate total amount
    const subtotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Calculate additional fees
    const booking_fee = Math.round(subtotal * INT_FEE);
    const total = subtotal + booking_fee;

    // Check if phone number is missing and show popup
    const currentPhone = userInfo?.phoneNumber || "";
    if (!currentPhone.trim()) {
      // Create booking payload and store it for later use
      const bookingPayload = {
        workshop_id: workshopId,
        workshop_name: workshopData?.name || 'Unknown Workshop',
        workshop_description: workshopData?.description || '',
        user_id: userInfo?.UserId || null,
        buyer_name: userInfo?.displayName || "Guest User",
        buyer_email: userInfo?.email || "",
        buyer_phone: "", // Will be updated after phone input
        items: selectedItems,
        summary: {
          subtotal: subtotal,
          booking_fee: booking_fee,
          cgst: 0,
          sgst: 0,
          total: total
        }
      };
      
      setPendingBookingPayload(bookingPayload);
      setPhoneDialogOpen(true);
      return;
    }

    // Create detailed booking payload with existing phone
    const bookingPayload = {
      workshop_id: workshopId,
      workshop_name: workshopData?.name || 'Unknown Workshop',
      workshop_description: workshopData?.description || '',
      user_id: userInfo?.UserId || null,
      buyer_name: userInfo?.displayName || "Guest User",
      buyer_email: userInfo?.email || "",
      buyer_phone: currentPhone,
      items: selectedItems,
      summary: {
        subtotal: subtotal,
        booking_fee: booking_fee,
        cgst: 0,
        sgst: 0,
        total: total
      }
    };

    // Log the complete booking information
    console.log('=== WORKSHOP BOOKING DETAILS ===');
    console.log('Booking Payload:');
    console.log(JSON.stringify(bookingPayload, null, 2));
    console.log('');
    
    console.log('=== PRICE BREAKDOWN ===');
    console.log(`Subtotal: ₹${subtotal}`);
    console.log(`Booking Fee (${INT_FEE * 100}%): ₹${booking_fee}`);
    console.log(`Total: ₹${total}`);
    console.log('=== END BOOKING DETAILS ===');

    // Initiate payment
    await initiatePayment(bookingPayload);
  };

  const handlePhoneSubmit = async () => {
    // Validate phone number
    const cleanPhone = phoneNumber.replace(/\s+/g, '').trim();
    if (!cleanPhone || cleanPhone === '+91' || cleanPhone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    // Update the pending booking payload with the phone number
    const updatedPayload = {
      ...pendingBookingPayload,
      buyer_phone: cleanPhone
    };

    // Log the complete booking information
    console.log('=== WORKSHOP BOOKING DETAILS (with phone) ===');
    console.log('Booking Payload:');
    console.log(JSON.stringify(updatedPayload, null, 2));
    console.log('');
    
    console.log('=== PRICE BREAKDOWN ===');
    console.log(`Subtotal: ₹${updatedPayload.summary.subtotal}`);
    console.log(`Booking Fee (${INT_FEE * 100}%): ₹${updatedPayload.summary.booking_fee}`);
    console.log(`Total: ₹${updatedPayload.summary.total}`);
    console.log('=== END BOOKING DETAILS ===');

    // Close dialog and initiate payment
    setPhoneDialogOpen(false);
    setPendingBookingPayload(null);
    
    // Initiate payment with updated payload
    await initiatePayment(updatedPayload);
  };

  const handlePhoneCancel = () => {
    setPhoneDialogOpen(false);
    setPhoneNumber('+91');
    setPendingBookingPayload(null);
  };

  return (
    <Box sx={{ p: 4, margin: '0 auto', width: '100%' }}>
      
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 2, backgroundColor: '#735EAB', color: 'white', borderRadius: '50%' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'semibold', textTransform:'none' }}>
          Select Events
        </Typography>
      </Box>

      {/* Event Overview */}
      <Card sx={{ mb: 3, p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: '#735EAB', 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  mr: 2
                }}
              >
                  <Typography variant="h6" sx={{ textTransform:'none', color:'white' }}>
                     {selectedDay ? `${new Date(selectedDay).getDate()} ${new Date(selectedDay).toLocaleDateString('en-US', { month: 'short' })}` : 'Select Date'}
                   </Typography>
              </Box>
              <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <FaCalendarAlt />
                <Typography variant="body1" sx={{ color: '#666' }}>
                 {selectedDay
                     ? new Date(selectedDay).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                         day: 'numeric',
                     })
                     : new Date(workshopData.start_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                         day: 'numeric',
                     })}
                  </Typography>
            </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform:'none' }}>
                  {workshopData.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1 }}>
                  <FaClock />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {selectedDay && daysMap.get(selectedDay)?.variants ? 
                      daysMap.get(selectedDay).variants.map(variant => 
                        convertTo12HourFormat(variant.time)
                      ).join(', ') 
                      : ""}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                 {Array.from(daysMap.keys()).map((date, i) => (
                   <Button
                     key={date}
                     variant={selectedDay === date ? "contained" : "outlined"}
                     sx={{
                       minWidth: 'auto',
                       px: 2,
                       py: 1,
                       bgcolor: selectedDay === date ? '#735EAB' : 'transparent',
                       color: selectedDay === date ? 'white' : '#735EAB',
                       borderColor: '#735EAB',
                       '&:hover': {
                         bgcolor: selectedDay === date ? '#735EAB' : 'rgba(115, 94, 171, 0.1)'
                       }
                     }}
                     onClick={() => setSelectedDay(date)}
                   >
                     {new Date(date).getDate()} {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                   </Button>
                 ))}
               </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Event Days */}
      {workshopData.variants?.map((variant, dayIndex) => (
            <Card 
              key={variant.variant_id} 
              sx={{ 
                mb: 2, 
                p: 3,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateX(-1px)',
                  boxShadow: '0 8px 8px rgba(0,0,0,0.15)',
                  borderColor: '#735EAB',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold',  textTransform:'none' }}>
                    {variant.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                   <Badge
                      bg="success"
                      style={{
                        backgroundColor: '#63AC0B',
                        color: 'white',
                        fontSize: '14px',
                        padding: '8px 16px',
                        borderRadius: '2px'
                      }}
                    >
                      Ticket Options
                   </Badge>
                  </Box>
                </Grid>
                                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0 }}>
                    <FaClock color='#735EAB'/>
                    <Typography variant="p" sx={{ textTransform:'none' }}>
                      {convertTo12HourFormat(variant.time)}
                    </Typography>
                    <FaRegCalendarAlt color='#735EAB'/>
                    <Typography variant="p" sx={{ textTransform:'none' }}>
                       {variant.date}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <hr/>
              <Grid container spacing={2} alignItems="center">
                {variant.subvariants?.map((subvariant) => (
                  <Grid item xs={12} sm={6} key={subvariant.subvariant_id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" sx={{ flex: 1 }}>
                        {subvariant.description} <span style={{ color: '#6F4CC2', fontWeight: 'bold' }}>₹{subvariant.price}</span>
                      </Typography>
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Select Quantity</InputLabel>
                        <Select
                          value={quantities[`${variant.variant_id}__${subvariant.subvariant_id}`] || 0}
                          onChange={(e) => handleQuantityChange(
                            variant.variant_id, 
                            subvariant.subvariant_id, 
                            e.target.value
                          )}
                          label="Select Quantity"
                        >
                          {Array.from({ length: 11 }, (_, i) => (
                            <MenuItem key={i} value={i}>
                              {i}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>
          ))}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={loading}
          sx={{
            bgcolor: '#735EAB',
            color: 'white',
            '&:hover': {
              bgcolor: '#5a4a8a'
            }
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
              Processing...
            </>
          ) : (
              userInfo? ("Book Tickets") : ("Login to Book Tickets")
          )}
        </Button>
      </Box>

      {/* Price Display */}
      {(() => {
        const selectedItems = Object.entries(quantities)
          .filter(([key, quantity]) => quantity > 0)
          .map(([key, quantity]) => {
            const [variantId, subvariantId] = key.split('__');
            const variant = workshopData?.variants?.find(v => v.variant_id === variantId);
            const subvariant = variant?.subvariants?.find(s => s.subvariant_id === subvariantId);
            return {
              quantity,
              price: subvariant?.price || 0,
              variantDescription: variant?.description || '',
              subvariantDescription: subvariant?.description || '',
              date: variant?.date || '',
              time: variant?.time || ''
            };
          });

        const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const booking_fee = Math.round(subtotal * INT_FEE);
        const total = subtotal + booking_fee;

        if (total > 0) {
          return (
            <Box sx={{ mt: 3, p: 3, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#735EAB' }}>
                Price Summary
              </Typography>
              
              {/* Itemized Breakdown */}
              {selectedItems.map((item, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    {item.variantDescription}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                    {item.subvariantDescription}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {item.date} at {convertTo12HourFormat(item.time)}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              {/* Fee Breakdown */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal:</Typography>
                <Typography variant="body1">₹{subtotal}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Booking Fee ({INT_FEE * 100}%):</Typography>
                <Typography variant="body1">₹{booking_fee}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#735EAB' }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#735EAB' }}>
                  ₹{total}
                </Typography>
              </Box>
            </Box>
          );
        }
        return null;
      })()}

      {/* Phone Number Dialog */}
      <Dialog open={phoneDialogOpen} onClose={handlePhoneCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          Phone Number Required
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please enter your phone number to complete the booking:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+91 9876543210"
            helperText="Include country code (e.g., +91 for India)"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePhoneCancel} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handlePhoneSubmit} 
            variant="contained" 
            sx={{ 
              backgroundColor: '#735EAB',
              '&:hover': {
                backgroundColor: '#5a4a8a'
              }
            }}
          >
            Continue to Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 