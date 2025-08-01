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
  Checkbox
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
  Info
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
  amenities: ['Mirrors', 'Sound System', 'Air Conditioning', 'Parking']
};

const timeSlots = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function StudioRentalCalendar() {
  const isDarkModeOn = useSelector(selectDarkModeStatus);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [pricing, setPricing] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [studioId, setStudioId] = useState('');
  const [loading, setLoading] = useState(false);
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
    setShowTimeSlots(true);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
        <Typography variant="h4" sx={{ mb: 3, color: 'text.primary' }}>
          Studio Rental Management
        </Typography>

        {/* Studio ID Input */}
        <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Studio Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Studio ID"
                  value={studioId}
                  onChange={(e) => setStudioId(e.target.value)}
                  placeholder="Enter your studio ID"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  startIcon={<Settings />}
                  onClick={() => setShowSettings(true)}
                  sx={{ mt: 1 }}
                >
                  Studio Settings
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recurring Pattern Section */}
        <Card sx={{ mb: 3, bgcolor: 'background.paper' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
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
          </CardContent>
        </Card>

        {/* Main Calendar Interface */}
        <Card sx={{ bgcolor: 'background.paper' }}>
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

        {/* Time Slots Dialog */}
        <Dialog 
          open={showTimeSlots} 
          onClose={() => setShowTimeSlots(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">
              Manage Availability & Pricing - {selectedDate.toLocaleDateString()}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Time Slots" />
              <Tab label="Pricing" />
              <Tab label="Bulk Settings" />
            </Tabs>

            {tabValue === 0 && (
              <Grid container spacing={2}>
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
                        '&:hover': {
                          transform: 'scale(1.05)',
                          transition: 'all 0.2s'
                        }
                      }}
                      onClick={() => handleTimeSlotSelect(timeSlot)}
                    >
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2">
                          {timeSlot}
                        </Typography>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={availability[selectedDate.toISOString().split('T')[0]]?.[timeSlot] || false}
                              onChange={() => handleAvailabilityToggle(selectedDate, timeSlot)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          }
                          label="Available"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Set pricing for available time slots
                </Typography>
                <Grid container spacing={2}>
                  {timeSlots.map((timeSlot) => {
                    const isAvailable = availability[selectedDate.toISOString().split('T')[0]]?.[timeSlot];
                    return (
                      <Grid item xs={12} sm={6} md={4} key={timeSlot}>
                        <Card sx={{ p: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {timeSlot}
                          </Typography>
                          <TextField
                            fullWidth
                            label="Price (₹)"
                            type="number"
                            value={pricing[selectedDate.toISOString().split('T')[0]]?.[timeSlot] || ''}
                            onChange={(e) => handlePricingChange(selectedDate, timeSlot, e.target.value)}
                            disabled={!isAvailable}
                            InputProps={{
                              startAdornment: <AttachMoney />
                            }}
                          />
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Bulk settings for this date
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Quick Actions
                      </Typography>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 1 }}
                        onClick={() => {
                          const newAvailability = { ...availability };
                          const dateKey = selectedDate.toISOString().split('T')[0];
                          newAvailability[dateKey] = {};
                          timeSlots.forEach(slot => {
                            newAvailability[dateKey][slot] = true;
                          });
                          setAvailability(newAvailability);
                        }}
                      >
                        Make All Available
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 1 }}
                        onClick={() => {
                          const newAvailability = { ...availability };
                          const dateKey = selectedDate.toISOString().split('T')[0];
                          newAvailability[dateKey] = {};
                          timeSlots.forEach(slot => {
                            newAvailability[dateKey][slot] = false;
                          });
                          setAvailability(newAvailability);
                        }}
                      >
                        Make All Unavailable
                      </Button>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Bulk Pricing
                      </Typography>
                      <TextField
                        fullWidth
                        label="Set Price for All Available Slots"
                        type="number"
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: <AttachMoney />
                        }}
                      />
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                          // Implement bulk pricing logic
                        }}
                      >
                        Apply to All Available
                      </Button>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowTimeSlots(false)}>
              Close
            </Button>
            <Button variant="contained" onClick={() => setShowTimeSlots(false)}>
              Save Changes
            </Button>
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
              Studio Rental Settings
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  General Settings
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
                  Availability Settings
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
              </Grid>
            </Grid>
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

        {/* Summary Section */}
        <Card sx={{ mt: 3, bgcolor: 'background.paper' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Rental Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6">
                      Available Days
                    </Typography>
                    <Typography variant="h4">
                      {Object.keys(availability).length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6">
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
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6">
                      Avg. Price
                    </Typography>
                    <Typography variant="h4">
                      ₹{mockStudioData.basePrice}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default StudioRentalCalendar; 