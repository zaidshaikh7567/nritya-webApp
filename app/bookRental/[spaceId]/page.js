'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from 'next/dynamic';
import { Skeleton } from '@mui/material';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Grid, 
  Container,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Alert,
  Rating,
  Divider
} from "@mui/material";
import {  
  ArrowBack, 
  LocationOn,
  AttachMoney, 
  CheckCircle,
} from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import StudioRentalImagesCarousel from './StudioRentalImagesCarousel';
import { format, addDays, startOfDay } from "date-fns";
import { BASEURL_PROD } from '../../../src/constants';
const INT_CHARGE = 0.03;
// Dynamic imports for client components
const ClientHeader = dynamic(() => import('../../components/ClientHeader'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      width: '100%', 
      height: '7vh', 
      backgroundColor: "black", 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000 
    }}>
      <Skeleton variant="rectangular" animation="wave" sx={{ height: '100%' }} />
    </div>
  )
});

const ClientFooter = dynamic(() => import('../../components/ClientFooter'), {
  ssr: false
});

function timeRangeFromUtcString(utcTimeStr) {
  // Extract hours from string — first two characters before colon
  // utcTimeStr => 17:00:00+00:00
  let [hourStr] = utcTimeStr.split(':');
  let hour = parseInt(hourStr, 10);

  // Convert to AM/PM
  const toAMPM = (h) => {
    const ampm = h >= 12 ? 'pm ' : 'am ';
    h = h % 12 || 12;
    return `${h}${ampm}`;
  };

  // End hour = +1 hour (24-hour wraparound)
  const endHour = (hour + 1) % 24;

  return `${toAMPM(hour)}-${toAMPM(endHour)}`;
}

export default function BookStudio({ params }) {
  const { spaceId } = params;
  const searchParams = useSearchParams();
  
  // Get user info from localStorage
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [allTimeSlots, setAllTimeSlots] = useState([]);
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Details, 3: Payment
  const [bookingData, setBookingData] = useState({
    clientName:  '',
    clientEmail:  '',
    clientPhone: '',
    notes: ''
  });

  // Studio data state
  const [studio, setStudio] = useState({
    id: spaceId,
    name: "Loading...",
    type: "Studio",
    location: "Loading...",
    basePrice: 0,
    rating: 4.9,
    reviews: 124,
    image: "/placeholder.svg",
    amenities: ["Professional Equipment", "Mixing Console", "Isolation Booth", "WiFi", "Parking", "Coffee"],
    description: "Loading studio description...",
    rules: ["No smoking", "Maximum 8 people", "Clean up after use"],
    cancellation: "Free cancellation up to 24 hours before booking"
  });

  const [loading, setLoading] = useState(true);
  const [studioAvailability, setStudioAvailability] = useState([]);
  
  // Studio images state
  const [studioImages, setStudioImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Booking state
  const [bookingStatus, setBookingStatus] = useState('pending');
  const [bookingResult, setBookingResult] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.body.appendChild(script);
    });
  };

  // Initiate payment
  const initiatePayment = async (bookingPayload) => {
    try {
      setBookingStatus('processing');
      console.log('Initiating payment for studio rental:', bookingPayload);
      
      // Load Razorpay script
      await loadRazorpayScript();
      
      // Create payment order
      //const BASEURL_PROD = "http://0.0.0.0:8000/";
      const response = await fetch(`${BASEURL_PROD}payments/studio_rental_payment`, {
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
            setBookingStatus('pending');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.log('Payment initiation error:', error);
      alert('Failed to initiate payment. Please try again.');
      setBookingStatus('pending');
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async (response, bookingPayload) => {
    try {
      setBookingStatus('processing');
      
      // Verify payment
      //const BASEURL_PROD = "http://0.0.0.0:8000/";
      const verifyResponse = await fetch(`${BASEURL_PROD}payments/studio_rental_payment_verify`, {
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
        setBookingStatus('success');
        setBookingResult(verifyData);
        console.log('Studio rental booking successful:', verifyData);
        alert('Payment successful! Your studio rental booking has been confirmed.');
      } else {
        setBookingStatus('error');
        setBookingResult(verifyData);
        console.error('Payment verification failed:', verifyData);
        alert(`Payment verification failed: ${verifyData.message}`);
      }
      
    } catch (error) {
      setBookingStatus('error');
      setBookingResult({ error: error.message });
      console.error('Payment verification error:', error);
      alert('Payment verification failed. Please contact support.');
    }
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    try {
      setBookingStatus('processing');
      
      // Get user info from localStorage
      const userInfoFull = JSON.parse(localStorage.getItem('userInfoFull') || 'null');
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
      
      if (!userInfo && !userInfoFull) {
        alert('Please login to book studio rental');
        setBookingStatus('pending');
        return;
      }
      
      // Calculate total amount
      const subtotal = selectedTimeSlots.reduce((total, slotId) => {
        const slotData = allTimeSlots.find(s => s.id === slotId);
        return total + (slotData?.price || 0);
      }, 0);
      
      const booking_fee = Math.round(subtotal * 0.03); // 3% booking fee
      const total = subtotal + booking_fee;
      
      // Prepare booking payload
      const bookingPayload = {
        studio_id: spaceId,
        studio_name: studio.name,
        user_id: userInfo?.uid || userInfoFull?.uid || 'anonymous',
        buyer_name: bookingData.clientName || userInfo?.displayName || userInfoFull?.displayName || 'Guest User',
        buyer_email: bookingData.clientEmail || userInfo?.email || userInfoFull?.email || '',
        buyer_phone: bookingData.clientPhone || userInfo?.phoneNumber || userInfoFull?.phoneNumber || '',
        slot_ids: selectedTimeSlots,
        notes: bookingData.notes,
        summary: {
          subtotal: subtotal,
          booking_fee: booking_fee,
          total: total
        }
      };
      
      console.log('Creating studio rental booking with payload:', bookingPayload);
      
      // Initiate payment
      await initiatePayment(bookingPayload);
      
    } catch (error) {
      setBookingStatus('error');
      setBookingResult({ error: error.message });
      console.error('Error creating booking:', error);
    }
  };

  // Auto-confirm booking when step 3 is reached
  useEffect(() => {
    if (step === 3 && bookingStatus === 'pending') {
      handleConfirmBooking();
    }
  }, [step]);

  // Fetch studio data and availability
  useEffect(() => {
    const fetchStudioData = async () => {
      try {
        setLoading(true);
        
        // Fetch studio text data
        //const BASEURL_PROD = "http://0.0.0.0:8000/";
        const studioResponse = await fetch(`${BASEURL_PROD}api/studio/${spaceId}/text/`);
        console.log(studioResponse)
        if (studioResponse.ok) {
          const studioData = await studioResponse.json();
          console.log('Fetched studio data:', studioData);
          
          setStudio({
            id: spaceId,
            name: studioData.studioName || "Studio",
            type: studioData.danceStyles || "Studio",
            location: studioData.city || "Location",
            basePrice: 150, // Default price
            rating: 4.9,
            reviews: 124,
            image: "/placeholder.svg",
            amenities: studioData.addAmenities ? studioData.addAmenities.split(',').map(item => item.trim()) : ["Professional Equipment", "Mixing Console", "Isolation Booth", "WiFi", "Parking", "Coffee"],
            description: studioData.aboutStudio || "Professional studio with state-of-the-art equipment.",
            rules: ["No smoking", "Maximum 8 people", "Clean up after use"],
            cancellation: "No cancellation after booking"
          });
        }

        // Fetch studio availability
        const availabilityResponse = await fetch(`${BASEURL_PROD}crud/studio-availability/${spaceId}/`);
        
        if (availabilityResponse.ok) {
          const availabilityData = await availabilityResponse.json();
          console.log('Fetched availability data:', availabilityData);
          
          if (availabilityData.success && availabilityData.data) {
            setStudioAvailability(availabilityData.data);

            const slots = availabilityData.data.map(slot => {
              const [day, time] = slot.start_time.split('T')
              //const slotStartTime = new Date(slot.start_time);
              const hour =  time//slotStartTime.getHours();
              const date = day//format(slotStartTime, 'yyyy-MM-dd');
              const timeSlot = timeRangeFromUtcString(hour)//`${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`;
              
              return {
                id: slot.id,
                time: timeSlot,
                date: date,
                available: slot.is_available,
                unavailable: !slot.is_available,
                booked: false,
                price: parseFloat(slot.price_per_hr),
                displayTime: timeSlot//`${hour === 12 ? 12 : hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'} - ${hour + 1 === 12 ? 12 : (hour + 1) > 12 ? (hour + 1) - 12 : hour + 1}:00 ${hour + 1 >= 12 ? 'PM' : 'AM'}`
              };
            });
            setAllTimeSlots(slots);
            
            // Calculate minimum price from availability data
            const prices = availabilityData.data.map(slot => parseFloat(slot.price_per_hr));
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
            
            // Update studio with calculated base price
            setStudio(prevStudio => ({
              ...prevStudio,
              basePrice: minPrice
            }));
          }
        }

        // Fetch studio images
        const imagesResponse = await fetch(`${BASEURL_PROD}imagesCrud/studioSpaceRental/${spaceId}/`);
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          console.log('Fetched studio images:', imagesData);
          
          if (imagesData.image_urls && imagesData.image_urls.length > 0) {
            setStudioImages(imagesData.image_urls);
          }
        }
      } catch (error) {
        console.error('Error fetching studio data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (spaceId) {
      fetchStudioData();
    }
  }, [spaceId]);

  // Update time slots when date changes
  useEffect(() => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    console.log("AR_ studioAvailability", studioAvailability)
    // Filter availability data for the selected date
    const dateSlots = studioAvailability.filter(slot => {
      console.log("AR_ before", slot)
      const [date, time] = slot.start_time.split('T')
      const slotStartTime = time//new Date(slot.start_time);
      const slotDate = date//format(slotStartTime, 'yyyy-MM-dd');
      return slotDate === dateKey;
    });

    // Convert API data to time slots format
    const slots = dateSlots.map(slot => {
      const [day, time] = slot.start_time.split('T')
      //const slotStartTime = new Date(slot.start_time);
      const hour =  time//slotStartTime.getHours();
      const date = day//format(slotStartTime, 'yyyy-MM-dd');
      console.log("AR_ hello", date, hour, slot)
      const timeSlot = timeRangeFromUtcString(hour)//`${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`;
      
      return {
        id: slot.id,
        time: timeSlot,
        date: date,
        available: slot.is_available,
        unavailable: !slot.is_available,
        booked: false,
        price: parseFloat(slot.price_per_hr),
        displayTime: timeSlot//`${hour === 12 ? 12 : hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'} - ${hour + 1 === 12 ? 12 : (hour + 1) > 12 ? (hour + 1) - 12 : hour + 1}:00 ${hour + 1 >= 12 ? 'PM' : 'AM'}`
      };
    });

    console.log('AR_ API time slots for date:', dateKey, slots);
    setTimeSlots(slots);
  }, [selectedDate, studioAvailability]);

  useEffect(() => {
    const userInfoFull = JSON.parse(localStorage.getItem('userInfoFull') || 'null');
    if (userInfoFull) {
      setBookingData({
        clientName: userInfoFull.displayName,
        clientEmail: userInfoFull.email,
        clientPhone: '',
        notes: ''
      });
    }
  }, []);

  const subTotalPrice = selectedTimeSlots.reduce((total, id) => {
    const slotData = allTimeSlots.find(s => s.id === id);
    return total + (slotData?.price || 0);
  }, 0);

  const totalPrice = subTotalPrice*(1+INT_CHARGE);

  const toggleTimeSlot = (timeSlot, slot) => {
    setSelectedTimeSlots(prev => 
      prev.includes(timeSlot) 
        ? prev.filter(s => s !== timeSlot)
        : [...prev, timeSlot].sort()
    );
    console.log("AR_ selectedTimeSlots", selectedTimeSlots, slot)
  };

  const isDateDisabled = (date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 15); // 3 months ahead
    return date < today || date > maxDate;
  };

  const steps = [
    {
      label: 'Select Date & Time',
      description: 'Choose your preferred date and time slots'
    },
    {
      label: 'Booking Details',
      description: 'Enter your contact information and preferences'
    },
    {
      label: 'Review & Confirm',
      description: 'Review your booking details and confirm'
    }
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ClientHeader />
        <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Skeleton variant="rectangular" height={60} />
                    <Skeleton variant="rectangular" height={400} />
                    <Skeleton variant="rectangular" height={300} />
                  </Box>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <Skeleton variant="rectangular" height={500} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </main>
        <ClientFooter />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
            {/* Studio Images Card */}
            {studioImages.length > 0 && (
              <StudioRentalImagesCarousel studioImages={studioImages} />
            )}
          <Container maxWidth="lg" sx={{ py: 4 }}>

            {/* Progress Indicator */}
            <Box sx={{ mb: 4 }}>
              <Stepper activeStep={step - 1} sx={{ justifyContent: 'center' }}>
                {steps.map((stepItem, index) => (
                  <Step key={stepItem.label}>
                    <StepLabel>{stepItem.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <Grid container spacing={4}>
              {/* Main Booking Content */}
              <Grid item xs={12} lg={8}>
                {step === 1 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Box>
                      <Typography variant="h5" sx={{ mb: 1, color: 'text.primary', textTransform:'none' }}>
                        Select Date & Time
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', textTransform:'none' }}>
                        Choose your preferred date and time slots
                      </Typography>
                    </Box>

                    {/* Date Selection */}
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 , textTransform:'none'}}>
                          Select Date
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                          Available dates for the next 3 months
                        </Typography>
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(7, 1fr)', 
                          gap: 1,
                          maxWidth: 400
                        }}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateCalendar
                              value={selectedDate}
                              onChange={(newValue) => setSelectedDate(newValue)}
                              disablePast
                              shouldDisableDate={isDateDisabled}
                            />
                          </LocalizationProvider>
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Time Slots */}
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, textTransform:'none' }}>
                          Available Time Slots - {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                          Select one or more consecutive hours
                        </Typography>
                        
                        {/* Color Legend */}
                        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2e7d32' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Available
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#9e9e9e' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Unavailable
                            </Typography>
                          </Box>
                        </Box>
                        <Grid container spacing={2}>
                          {timeSlots.map((slot) => (
                          
                            <Grid item xs={12} sm={6} md={4} key={slot.time}>
                              <Button
                                variant={selectedTimeSlots.includes(slot.time) ? "contained" : "outlined"}
                                //disabled={!slot.available}
                                onClick={() => toggleTimeSlot(slot.id, slot)}
                                sx={{ 
                                  width: '100%',
                                  height: 'auto',
                                  flexDirection: 'column',
                                  py: 2,
                                  position: 'relative',
                                  ...(slot.unavailable && {
                                    bgcolor: '#f5f5f5', // Light grey background
                                    color: '#9e9e9e', // Grey text
                                    border: '2px solid #9e9e9e',
                                    '&:hover': {
                                      bgcolor: '#eeeeee'
                                    }
                                  }),
                                  ...(slot.available && {
                                    bgcolor: '#e8f5e8', // Light green background
                                    color: '#2e7d32', // Green text
                                    border: '2px solid #2e7d32',
                                    '&:hover': {
                                      bgcolor: '#c8e6c9'
                                    }
                                  }),
                                  ...(selectedTimeSlots.includes(slot.id) && {
                                    bgcolor: '#1976d2', // Blue when selected
                                    color: 'white',
                                    border: '2px solid #1976d2',
                                    '&:hover': {
                                      bgcolor: '#1565c0'
                                    }
                                  })
                                }}
                              >
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {slot.displayTime}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                  ₹{slot.price}/hr
                                 
                                </Typography>
                                {/* Status indicator dot */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    ...(slot.unavailable && {
                                      bgcolor: '#9e9e9e' // Grey dot for unavailable
                                    }),
                                    ...(slot.available && {
                                      bgcolor: '#2e7d32' // Green dot for available
                                    }),
                                    ...(selectedTimeSlots.includes(slot.id) && {
                                      bgcolor: 'white' // White dot when selected
                                    })
                                  }}
                                />
                              </Button>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>

                    {selectedTimeSlots.length > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          variant="contained" 
                          size="large"
                          onClick={() => setStep(2)}
                          sx={{textTransform:'none'}}
                        >
                          Continue to Details
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}

                {step === 2 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Box>
                      <Typography variant="h4" sx={{ mb: 1, color: 'text.primary', textTransform:'none' }}>
                        Booking Details
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Review your booking and add any special requests
                      </Typography>
                    </Box>

                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, textTransform:'none' }}>
                          Your Booking Summary
                        </Typography>
                        {console.log("AR_ selectedTimeSlots", selectedTimeSlots)}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>Time Slots:</Typography>
                            <Typography variant="body1">{selectedTimeSlots.length} hour{selectedTimeSlots.length > 1 ? 's' : ''}</Typography>
                          </Box>
                          <Divider />
                          {selectedTimeSlots.map(slot_id => {
                            const slotData = allTimeSlots.find(s => s.id === slot_id);
                            //console.log("AR_ timeSlots",timeSlots)
                            return (
                              <Box key={slot_id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">{slotData?.displayTime+" on "+slotData?.date}</Typography>
           
                                <Typography variant="body2">₹{slotData?.price}</Typography>
                              </Box>
                            );
                          })}
                          <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="p">Subtotal Total:</Typography>
                              <Typography variant="p">₹{subTotalPrice}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="p">Internet Conv:</Typography>
                              <Typography variant="p">3%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', textTransform:'none' }}>
                              <Typography variant="h6" sx={{textTransform:'none'}}>Total:</Typography>
                              <Typography variant="h6">₹{totalPrice}</Typography>
                            </Box>
                        </Box>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, textTransform:"none" }}>
                          Contact Information
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Full Name"
                              value={bookingData.clientName}
                              onChange={(e) => setBookingData({ ...bookingData, clientName: e.target.value })}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Email"
                              type="email"
                              value={bookingData.clientEmail}
                              //onChange={(e) => setBookingData({ ...bookingData, clientEmail: e.target.value })}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                          <TextField
                              fullWidth
                              label="Phone Number"
                              type="tel"
                              inputProps={{
                                pattern: "[0-9]{10}", // 10-digit pattern
                                maxLength: 10
                              }}
                              required
                              value={bookingData.clientPhone}
                              onChange={(e) =>
                                setBookingData({ ...bookingData, clientPhone: e.target.value })
                              }
                            />

                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Special Requests or Notes"
                              multiline
                              rows={3}
                              value={bookingData.notes}
                              onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 3, textTransform:'none' }}>
                          Studio Rules & Policies
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium',textTransform:'none' }}>
                              Studio Rules:
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {studio.rules.map((rule, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {rule}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', textTransform:'none' }}>
                              Cancellation Policy:
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {studio.cancellation}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant="outlined" sx={{textTransform:'none'}} onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button 
                        variant="contained" 
                        size="large"
                        onClick={() => setStep(3)}
                        sx={{ flex: 1, textTransform:'none' }}
                      >
                        Continue to Payment
                      </Button>
                    </Box>
                  </Box>
                )}

                {step === 3 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Box>
                      <Typography variant="h4" sx={{ mb: 1, color: 'text.primary' }}>
                        Payment
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Complete your booking
                      </Typography>
                    </Box>

                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Payment Details
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                          This is a demo - no actual payment will be processed
                        </Typography>
                        
                        {/* Add booking confirmation logic */}
                        {bookingStatus === 'processing' && (
                          <Alert severity="info" sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              Processing Payment...
                            </Typography>
                            <Typography variant="body2">
                              Please complete the payment to confirm your studio rental booking.
                            </Typography>
                          </Alert>
                        )}
                        {bookingStatus === 'error' && (
                          <Alert severity="error" sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              Payment Failed
                            </Typography>
                            <Typography variant="body2">
                              {bookingResult?.error || bookingResult?.message || 'An error occurred while processing your payment. Please try again.'}
                            </Typography>
                          </Alert>
                        )}
                        {bookingStatus === 'success' && (
                          <Alert severity="success" sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              Booking Confirmed!
                            </Typography>
                            <Typography variant="body2">
                              Your studio rental booking has been successfully confirmed. Booking ID: {bookingResult?.booking_id}
                            </Typography>
                          </Alert>
                        )}
                        
                        <Box sx={{ 
                          bgcolor: 'grey.100', 
                          p: 3, 
                          borderRadius: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Studio:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{studio.name}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Date:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{format(selectedDate, 'MMM d, yyyy')}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Duration:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{selectedTimeSlots.length} hours</Typography>
                          </Box>
                          <Divider />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6">₹{subTotalPrice}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant="outlined" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Link href="/" style={{ textDecoration: 'none', flex: 1 }}>
                        <Button variant="contained" size="large" sx={{ width: '100%' }}>
                          Return to Home
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                )}
              </Grid>

              {/* Studio Info Sidebar */}
              <Grid item xs={12} lg={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Main Studio Card */}
                  <Card>
                    <Box sx={{ 
                      height: 200, 
                      bgcolor: 'grey.300', 
                      position: 'relative',
                      borderRadius: '4px 4px 0 0'
                    }}>
                      <Chip 
                        label={studio.type}
                        sx={{ 
                          position: 'absolute', 
                          top: 16, 
                          left: 16,
                          bgcolor: 'background.paper'
                        }}
                      />
                    </Box>
                    
                    <CardContent>
                      <Typography variant="h5" sx={{ mb: 1 }}>
                        {studio.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocationOn sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {studio.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <Rating value={studio.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {studio.rating} ({studio.reviews} reviews)
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                            About this studio
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {studio.description}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>
                            Amenities
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {studio.amenities.map((amenity, index) => (
                              <Chip 
                                key={index} 
                                label={amenity} 
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>

                        <Divider />
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AttachMoney sx={{ color: 'purple', fontSize: 24 }} />
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'purple', textTransform:'none' }}>
                              From ₹{studio.basePrice}/hour
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Prices may vary by time of day
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Container>
      </main>
      <ClientFooter />
    </div>
  );
}
