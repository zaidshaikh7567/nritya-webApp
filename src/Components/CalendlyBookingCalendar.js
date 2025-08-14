import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  TextField, 
  Switch, 
  FormControlLabel, 
  Chip, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  Checkbox,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Radio,
  RadioGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Rating
} from '@mui/material';
import { 
  CalendarToday, 
  AccessTime, 
  AttachMoney, 
  Settings, 
  Add, 
  Edit, 
  Delete,
  CheckCircle,
  Cancel,
  Schedule,
  NavigateBefore,
  NavigateNext,
  Today,
  Event,
  Star,
  Info,
  ExpandMore,
  Person,
  LocationOn,
  Phone,
  Email,
  Share,
  Link as LinkIcon,
  QrCode,
  CopyAll,
  Visibility,
  VisibilityOff,
  BookOnline,
  Payment,
  ConfirmationNumber,
  Analytics,
  Notifications,
  AutoAwesome,
  TrendingUp,
  Group,
  Security
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectDarkModeStatus } from '../redux/selectors/darkModeSelector';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Mock data for demonstration
const mockStudioData = {
  studioId: 'STU001',
  studioName: 'Dance Studio Pro',
  address: '123 Dance Street, Mumbai',
  basePrice: 1500,
  currency: 'INR',
  amenities: ['Mirrors', 'Sound System', 'Air Conditioning', 'Parking'],
  description: 'Professional dance studio with state-of-the-art facilities',
  images: ['/assets/images/studio1.jpg', '/assets/images/studio2.jpg'],
  rating: 4.8,
  totalBookings: 156
};

const timeSlots = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const bookingTypes = [
  { id: 'hourly', name: 'Hourly Rental', duration: 60, price: 1500 },
  { id: 'halfday', name: 'Half Day (4 hours)', duration: 240, price: 5000 },
  { id: 'fullday', name: 'Full Day (8 hours)', duration: 480, price: 9000 },
  { id: 'weekly', name: 'Weekly Package', duration: 3360, price: 50000 }
];

function CalendlyBookingCalendar() {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [pricing, setPricing] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [studioId, setStudioId] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    type: 'hourly',
    date: new Date(),
    time: '',
    duration: 60,
    price: 1500,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    notes: ''
  });
  const [recurringPattern, setRecurringPattern] = useState({
    enabled: false,
    days: [],
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    price: 1500
  });

  const darkTheme = createTheme({
    palette: {
      mode: isDarkModeOn ? 'dark' : 'light',
      primary: {
        main: '#735EAB',
      },
      secondary: {
        main: '#FF6B6B',
      },
    },
  });

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowBookingDialog(true);
    setBookingData({ ...bookingData, date });
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setBookingData({ ...bookingData, time: timeSlot });
  };

  const handleAvailabilityToggle = (date, timeSlot) => {
    const dateKey = date.toISOString().split('T')[0];
    const newAvailability = { ...availability };
    
    if (!newAvailability[dateKey]) {
      newAvailability[dateKey] = {};
    }
    
    newAvailability[dateKey][timeSlot] = !newAvailability[dateKey][timeSlot];
    setAvailability(newAvailability);
  };

  const handlePricingChange = (date, timeSlot, price) => {
    const dateKey = date.toISOString().split('T')[0];
    const newPricing = { ...pricing };
    
    if (!newPricing[dateKey]) {
      newPricing[dateKey] = {};
    }
    
    newPricing[dateKey][timeSlot] = price;
    setPricing(newPricing);
  };

  const handleSaveSettings = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowSettings(false);
    }, 1000);
  };

  const isDateInCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isDateSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isDateAvailable = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return availability[dateKey] && Object.values(availability[dateKey]).some(slot => slot);
  };

  const isDateToday = (date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const getDatePrice = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    if (pricing[dateKey]) {
      const prices = Object.values(pricing[dateKey]).filter(price => price > 0);
      return prices.length > 0 ? Math.min(...prices) : null;
    }
    return null;
  };

  const getAvailableSlotsCount = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    if (availability[dateKey]) {
      return Object.values(availability[dateKey]).filter(slot => slot).length;
    }
    return 0;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRecurringDayChange = (day) => {
    const newDays = recurringPattern.days.includes(day)
      ? recurringPattern.days.filter(d => d !== day)
      : [...recurringPattern.days, day];
    setRecurringPattern({ ...recurringPattern, days: newDays });
  };

  const applyRecurringPattern = () => {
    const newAvailability = { ...availability };
    const newPricing = { ...pricing };
    
    // Apply pattern to all dates in current month
    calendarDays.forEach(date => {
      if (isDateInCurrentMonth(date)) {
        const dayName = daysOfWeek[date.getDay()];
        if (recurringPattern.days.includes(dayName)) {
          const dateKey = date.toISOString().split('T')[0];
          newAvailability[dateKey] = {
            [recurringPattern.startTime]: true,
            [recurringPattern.endTime]: true
          };
          newPricing[dateKey] = {
            [recurringPattern.startTime]: recurringPattern.price,
            [recurringPattern.endTime]: recurringPattern.price
          };
        }
      }
    });
    
    setAvailability(newAvailability);
    setPricing(newPricing);
  };

  const handleBookingTypeChange = (type) => {
    const selectedType = bookingTypes.find(t => t.id === type);
    setBookingData({
      ...bookingData,
      type,
      duration: selectedType.duration,
      price: selectedType.price
    });
  };

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleBookingSubmit = () => {
    setLoading(true);
    // Simulate booking submission
    setTimeout(() => {
      setLoading(false);
      setShowBookingDialog(false);
      setActiveStep(0);
      // Show success message
    }, 2000);
  };

  const steps = [
    {
      label: 'Select Date & Time',
      description: 'Choose your preferred date and time slot'
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
        <Typography variant="h4" sx={{ mb: 3, color: 'text.primary' }}>
          Studio Rental Booking Calendar
        </Typography>

        {/* Studio Overview Card */}
        <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
                    <Event />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ color: 'text.primary' }}>
                      {mockStudioData.studioName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {mockStudioData.address}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Rating value={mockStudioData.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {mockStudioData.rating} ({mockStudioData.totalBookings} bookings)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    startIcon={<Settings />}
                    onClick={() => setShowSettings(true)}
                    sx={{ mb: 1 }}
                    fullWidth
                  >
                    Calendar Settings
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Share />}
                    fullWidth
                  >
                    Share Calendar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <BookOnline sx={{ mr: 1 }} />
                  Available Days
                </Typography>
                <Typography variant="h4">
                  {Object.keys(availability).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime sx={{ mr: 1 }} />
                  Total Slots
                </Typography>
                <Typography variant="h4">
                  {Object.values(availability).reduce((total, day) => 
                    total + Object.values(day).filter(slot => slot).length, 0
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoney sx={{ mr: 1 }} />
                  Avg. Price
                </Typography>
                <Typography variant="h4">
                  ₹{mockStudioData.basePrice}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  This Month
                </Typography>
                <Typography variant="h4">
                  12
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Calendar Interface */}
        <Card sx={{ bgcolor: 'background.paper', mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ color: 'text.primary' }}>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={handlePreviousMonth} size="small">
                  <NavigateBefore />
                </IconButton>
                <IconButton onClick={handleToday} size="small">
                  <Today />
                </IconButton>
                <IconButton onClick={handleNextMonth} size="small">
                  <NavigateNext />
                </IconButton>
              </Box>
            </Box>

            {/* Calendar Grid */}
            <Grid container spacing={1}>
              {/* Day headers */}
              {daysOfWeek.map((day) => (
                <Grid item xs key={day}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      textAlign: 'center', 
                      fontWeight: 'bold',
                      color: 'text.secondary',
                      py: 1
                    }}
                  >
                    {day}
                  </Typography>
                </Grid>
              ))}

              {/* Calendar days */}
              {calendarDays.map((date, index) => (
                <Grid item xs key={index}>
                  <Card
                    sx={{
                      minHeight: 100,
                      cursor: 'pointer',
                      bgcolor: isDateSelected(date) ? 'primary.main' : 
                               isDateAvailable(date) ? 'success.light' : 'background.paper',
                      color: isDateSelected(date) ? 'white' : 'text.primary',
                      opacity: isDateInCurrentMonth(date) ? 1 : 0.3,
                      border: isDateToday(date) ? 2 : 1,
                      borderColor: isDateToday(date) ? 'primary.main' : 'divider',
                      '&:hover': {
                        bgcolor: isDateSelected(date) ? 'primary.dark' : 'action.hover',
                        transform: 'scale(1.02)',
                        transition: 'all 0.2s'
                      }
                    }}
                    onClick={() => handleDateClick(date)}
                  >
                    <CardContent sx={{ p: 1, textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                          {date.getDate()}
                        </Typography>
                        {isDateToday(date) && (
                          <Chip
                            size="small"
                            label="Today"
                            color="primary"
                            sx={{ fontSize: '0.6rem' }}
                          />
                        )}
                      </Box>
                      {isDateAvailable(date) && (
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            size="small"
                            label={`₹${getDatePrice(date) || mockStudioData.basePrice}`}
                            color="success"
                            sx={{ mb: 0.5 }}
                          />
                          <Typography variant="caption" display="block">
                            {getAvailableSlotsCount(date)} slots
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Booking Dialog */}
        <Dialog 
          open={showBookingDialog} 
          onClose={() => setShowBookingDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">
              Book Studio - {selectedDate.toLocaleDateString()}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 3 }}>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {step.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Select Booking Type & Time
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Booking Type
                      </Typography>
                      <RadioGroup
                        value={bookingData.type}
                        onChange={(e) => handleBookingTypeChange(e.target.value)}
                      >
                        {bookingTypes.map((type) => (
                          <FormControlLabel
                            key={type.id}
                            value={type.id}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="body1">{type.name}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  ₹{type.price} • {type.duration / 60} hour{type.duration / 60 > 1 ? 's' : ''}
                                </Typography>
                              </Box>
                            }
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Available Time Slots
                    </Typography>
                    <Grid container spacing={1}>
                      {timeSlots.map((timeSlot) => (
                        <Grid item xs={6} sm={4} md={3} key={timeSlot}>
                          <Card
                            sx={{
                              cursor: 'pointer',
                              bgcolor: availability[selectedDate.toISOString().split('T')[0]]?.[timeSlot] 
                                ? 'success.light' 
                                : 'background.paper',
                              border: selectedTimeSlot === timeSlot ? 2 : 1,
                              borderColor: selectedTimeSlot === timeSlot ? 'primary.main' : 'divider',
                              opacity: availability[selectedDate.toISOString().split('T')[0]]?.[timeSlot] ? 1 : 0.5,
                              '&:hover': {
                                transform: 'scale(1.05)',
                                transition: 'all 0.2s'
                              }
                            }}
                            onClick={() => handleTimeSlotSelect(timeSlot)}
                          >
                            <CardContent sx={{ p: 1, textAlign: 'center' }}>
                              <Typography variant="body2">
                                {timeSlot}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Contact Information
                </Typography>
                <Grid container spacing={2}>
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
                      onChange={(e) => setBookingData({ ...bookingData, clientEmail: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={bookingData.clientPhone}
                      onChange={(e) => setBookingData({ ...bookingData, clientPhone: e.target.value })}
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
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Review Your Booking
                </Typography>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Date & Time
                        </Typography>
                        <Typography variant="body1">
                          {selectedDate.toLocaleDateString()} at {bookingData.time}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Duration
                        </Typography>
                        <Typography variant="body1">
                          {bookingData.duration / 60} hour{bookingData.duration / 60 > 1 ? 's' : ''}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Total Price
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'primary.main' }}>
                          ₹{bookingData.price}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          Contact
                        </Typography>
                        <Typography variant="body1">
                          {bookingData.clientName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {bookingData.clientEmail}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Alert severity="info">
                  Your booking will be confirmed once payment is processed. You&apos;ll receive a confirmation email with all details.
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
            {activeStep > 0 && (
              <Button onClick={handleBackStep}>
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={handleNextStep}
                disabled={!bookingData.time || !bookingData.clientName || !bookingData.clientEmail}
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleBookingSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                Confirm Booking
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog 
          open={showSettings} 
          onClose={() => setShowSettings(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">
              Calendar Settings
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="General" />
              <Tab label="Availability" />
              <Tab label="Pricing" />
              <Tab label="Integrations" />
            </Tabs>

            {tabValue === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Studio Information
                  </Typography>
                  <TextField
                    fullWidth
                    label="Studio Name"
                    defaultValue={mockStudioData.studioName}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Base Price (₹)"
                    type="number"
                    defaultValue={mockStudioData.basePrice}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Currency"
                    defaultValue={mockStudioData.currency}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Booking Settings
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Auto-confirm bookings"
                    sx={{ mb: 2 }}
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Require advance payment"
                    sx={{ mb: 2 }}
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Allow same-day bookings"
                    sx={{ mb: 2 }}
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Send confirmation emails"
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recurring Availability Pattern
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={recurringPattern.enabled}
                          onChange={(e) => setRecurringPattern({ ...recurringPattern, enabled: e.target.checked })}
                        />
                      }
                      label="Enable recurring pattern"
                    />
                    {recurringPattern.enabled && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Select days:
                        </Typography>
                        <FormGroup row>
                          {daysOfWeek.map((day) => (
                            <FormControlLabel
                              key={day}
                              control={
                                <Checkbox
                                  checked={recurringPattern.days.includes(day)}
                                  onChange={() => handleRecurringDayChange(day)}
                                  size="small"
                                />
                              }
                              label={day}
                              sx={{ mr: 1 }}
                            />
                          ))}
                        </FormGroup>
                      </Box>
                    )}
                  </Grid>
                  {recurringPattern.enabled && (
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Start Time"
                            type="time"
                            value={recurringPattern.startTime}
                            onChange={(e) => setRecurringPattern({ ...recurringPattern, startTime: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="End Time"
                            type="time"
                            value={recurringPattern.endTime}
                            onChange={(e) => setRecurringPattern({ ...recurringPattern, endTime: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Price (₹)"
                            type="number"
                            value={recurringPattern.price}
                            onChange={(e) => setRecurringPattern({ ...recurringPattern, price: e.target.value })}
                            InputProps={{
                              startAdornment: <AttachMoney />
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            onClick={applyRecurringPattern}
                            fullWidth
                          >
                            Apply Pattern to Current Month
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Pricing Configuration
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Peak Hours Pricing
                    </Typography>
                    <TextField
                      fullWidth
                      label="Peak Hours (6 PM - 9 PM)"
                      type="number"
                      defaultValue={2000}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: <AttachMoney />
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Off-Peak Hours"
                      type="number"
                      defaultValue={1200}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: <AttachMoney />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Package Pricing
                    </Typography>
                    <TextField
                      fullWidth
                      label="Half Day (4 hours)"
                      type="number"
                      defaultValue={5000}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: <AttachMoney />
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Full Day (8 hours)"
                      type="number"
                      defaultValue={9000}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: <AttachMoney />
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Calendar Integrations
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Share Your Calendar
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Share your booking calendar with clients
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<LinkIcon />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Copy Link
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<QrCode />}
                        fullWidth
                      >
                        Generate QR Code
                      </Button>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        External Integrations
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Connect with external calendar services
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<CalendarToday />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Google Calendar
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CalendarToday />}
                        fullWidth
                      >
                        Outlook Calendar
                      </Button>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSaveSettings}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Save Settings
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default CalendlyBookingCalendar;

