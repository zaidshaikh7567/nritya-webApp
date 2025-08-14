'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  FormControlLabel, 
  Switch,
  Chip,
  Box,
  Grid,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Divider,
  Skeleton
} from '@mui/material';
import { 
  Camera, ArrowLeft, Clock, DollarSign, Plus, Trash2, 
  Copy, Save, Settings, Calendar as CalendarIcon
} from "lucide-react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { styled } from '@mui/material/styles';
const START_HOUR = 8;
const END_HOUR = 24;
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

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: theme.spacing(1),
}));

export default function ManageAvailability({ params }) {
  const { spaceId } = params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [defaultPrice, setDefaultPrice] = useState(999);
  const [eveningPremium, setEveningPremium] = useState(500);
  const [scheduleMode, setScheduleMode] = useState("single");
  const [studio, setStudio] = useState({
    id: spaceId,
    name: "Loading...",
    type: "Studio",
    city: "",
    userId: ""
  });
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isSingedIn, setIsSingedIn] = useState(false);
  const [studioExists, setStudioExists] = useState(false);
  const [userInfoFull, setUserInfoFull] = useState(null);

  const isDateDisabled = (date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 90); // 3 months ahead
    return date < today || date > maxDate;
  };

  // Generate default time slots for a day
  const generateDefaultSlots = () => {
    const slots = [];
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    
    for (let hour = START_HOUR; hour < END_HOUR; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
                      const startDateTime = `${selectedDateStr}T${startTime}:00`;
      const epoch = Math.floor(new Date(startDateTime).getTime() / 1000);
      const slotId = `${spaceId}_${epoch}`;
      
      slots.push({
        id: slotId,
        startTime: startTime,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        price: defaultPrice + (hour >= 18 ? eveningPremium : 0),
        available: false
      });
    }
    return slots;
  };

  const [daySchedules, setDaySchedules] = useState({
    [format(selectedDate, 'yyyy-MM-dd')]: {
      date: format(selectedDate, 'yyyy-MM-dd'),
      slots: generateDefaultSlots(),
      isActive: true
    }
  });
  const [deletedSlotIds, setDeletedSlotIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const currentSchedule = daySchedules[selectedDateKey] || {
    date: selectedDateKey,
    slots: generateDefaultSlots(),
    isActive: false
  };

  const updateSchedule = (dateKey, updates) => {
    setDaySchedules(prev => ({
      ...prev,
      [dateKey]: { ...prev[dateKey], ...updates }
    }));
  };

  const updateSlot = (slotId, updates) => {
    const updatedSlots = currentSchedule.slots.map(slot =>
      slot.id === slotId ? { ...slot, ...updates } : slot
    );
    updateSchedule(selectedDateKey, { ...currentSchedule, slots: updatedSlots });
    
    // If marking an existing slot as unavailable, add to deletedSlotIds
    if (updates.hasOwnProperty('available') && !updates.available) {
      // Check if it's an existing slot from database (numeric ID)
      if (slotId && !isNaN(parseInt(slotId)) && !slotId.includes('_')) {
        setDeletedSlotIds(prev => {
          const slotIdNum = parseInt(slotId);
          if (!prev.includes(slotIdNum)) {
            console.log(`Adding slot ${slotIdNum} to deletedSlotIds (marked unavailable)`);
            return [...prev, slotIdNum];
          }
          return prev;
        });
      }
    }
    
    // If marking a slot as available and it was in deletedSlotIds, remove it
    if (updates.hasOwnProperty('available') && updates.available) {
      if (slotId && !isNaN(parseInt(slotId)) && !slotId.includes('_')) {
        setDeletedSlotIds(prev => {
          const slotIdNum = parseInt(slotId);
          if (prev.includes(slotIdNum)) {
            console.log(`Removing slot ${slotIdNum} from deletedSlotIds (marked available)`);
            return prev.filter(id => id !== slotIdNum);
          }
          return prev;
        });
      }
    }
  };

  const addTimeSlot = () => {
    const lastSlot = currentSchedule.slots[currentSchedule.slots.length - 1];
    const lastEndHour = parseInt(lastSlot?.endTime.split(':')[0] || '21');
    
    if (lastEndHour < 23) {
      const startTime = `${lastEndHour.toString().padStart(2, '0')}:00`;
                      const startDateTime = `${selectedDateKey}T${startTime}:00`;
      const epoch = Math.floor(new Date(startDateTime).getTime() / 1000);
      const slotId = `${spaceId}_${epoch}`;
      
      const newSlot = {
        id: slotId,
        startTime: startTime,
        endTime: `${(lastEndHour + 1).toString().padStart(2, '0')}:00`,
        price: defaultPrice + (lastEndHour >= 18 ? eveningPremium : 0),
        available: true
      };
      
      updateSchedule(selectedDateKey, {
        ...currentSchedule,
        slots: [...currentSchedule.slots, newSlot]
      });
    }
  };

  const removeTimeSlot = (slotId) => {
    const updatedSlots = currentSchedule.slots.filter(slot => slot.id !== slotId);
    updateSchedule(selectedDateKey, { ...currentSchedule, slots: updatedSlots });
    
    // Add to deleted slots if it has a numeric ID (existing slot from database)
    // New slots will have format: spaceId_epoch, so we check if it's a pure number
    if (slotId && !isNaN(parseInt(slotId)) && !slotId.includes('_')) {
      setDeletedSlotIds(prev => [...prev, parseInt(slotId)]);
    }
  };

  const copyToNextDays = (days) => {
    const updates = {};
    
    for (let i = 1; i <= days; i++) {
      const nextDate = addDays(selectedDate, i);
      const nextDateKey = format(nextDate, 'yyyy-MM-dd');
      
      updates[nextDateKey] = {
        date: nextDateKey,
        slots: currentSchedule.slots.map(slot => ({ ...slot })),
        isActive: true
      };
    }
    
    setDaySchedules(prev => ({ ...prev, ...updates }));
  };

  const updateAllPrices = () => {
    const updatedSlots = currentSchedule.slots.map(slot => {
      const hour = parseInt(slot.startTime.split(':')[0]);
      return {
        ...slot,
        price: defaultPrice + (hour >= 18 ? eveningPremium : 0)
      };
    });
    
    updateSchedule(selectedDateKey, { ...currentSchedule, slots: updatedSlots });
  };

  const isDateActive = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return daySchedules[dateKey]?.isActive || false;
  };

  // Load availability for a specific date range
  const loadAvailabilityForDateRange = async (startDate, endDate) => {
    if (!spaceId || !studioExists || !isOwner) return;
    
    try {
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      
      console.log(`Loading availability for date range: ${startDateStr} to ${endDateStr}`);
      const BASEURL_PROD = "http://0.0.0.0:8000/";
      const response = await fetch(
        `${BASEURL_PROD}api/crud/studio-availability/${spaceId}/date-range/?start_date=${startDateStr}&end_date=${endDateStr}`
      );
      
      if (response.ok) {
        const result = await response.json();
        console.log('Loaded availability for date range:', result);
        
        if (result.success && result.data.length > 0) {
          // Group slots by date
          const groupedSlots = {};
          
          result.data.forEach(slot => {
            const startDate = new Date(slot.start_time);
            const dateKey = format(startDate, 'yyyy-MM-dd');
            
            if (!groupedSlots[dateKey]) {
              groupedSlots[dateKey] = {
                isActive: true,
                slots: []
              };
            }
            
            // Convert API slot to frontend format
            const frontendSlot = {
              id: slot.id.toString(),
              startTime: format(startDate, 'HH:mm'),
              endTime: format(new Date(slot.end_time), 'HH:mm'),
              price: parseFloat(slot.price_per_hr),
              available: slot.is_available
            };
            
            groupedSlots[dateKey].slots.push(frontendSlot);
          });
          
          // Update daySchedules with new data
          setDaySchedules(prev => ({
            ...prev,
            ...groupedSlots
          }));
        }
      }
    } catch (error) {
      console.error('Error loading availability for date range:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      
      // Generate payload for all active dates
      const payload = {
        slots: [],
        delete_ids: deletedSlotIds
      };

      // Process all day schedules
      Object.entries(daySchedules).forEach(([dateKey, schedule]) => {
        if (schedule.isActive) {
          // Convert time slots to the required format
                      schedule.slots.forEach(slot => {
              if (slot.available) {
                // Only send newly created slots (those with generated IDs containing '_')
                if (slot.id && slot.id.includes('_')) {
                  const startDateTime = `${dateKey}T${slot.startTime}:00`;
                  const endDateTime = `${dateKey}T${slot.endTime}:00`;
                  
                  const slotPayload = {
                    id: null, // Always null for new slots
                    studio_id: spaceId,
                    city: studio.city || "",
                    start_time: startDateTime,
                    end_time: endDateTime,
                    price_per_hr: slot.price.toString()
                  };
                  
                  payload.slots.push(slotPayload);
                }
                // Skip existing slots (those with numeric IDs) - they remain unchanged
              } else {
                // If slot is unavailable and has a numeric ID (from database), add to delete_ids
                if (slot.id && !isNaN(parseInt(slot.id)) && !slot.id.includes('_')) {
                  const slotId = parseInt(slot.id);
                  if (!payload.delete_ids.includes(slotId)) {
                    payload.delete_ids.push(slotId);
                  }
                }
              }
            });
        }
      });

      console.log('Save payload:', payload);
      console.log('Payload summary:', {
        totalSlots: payload.slots.length,
        deletedIds: payload.delete_ids.length,
        activeDates: Object.keys(daySchedules).filter(key => daySchedules[key].isActive).length
      });
      console.log('Deleted slot IDs:', payload.delete_ids);
      console.log('Current deletedSlotIds state:', deletedSlotIds);
      
      // Send payload to Django API
      const BASEURL_PROD = "http://0.0.0.0:8000/";
      const response = await fetch(`${BASEURL_PROD}crud/studio-availability/save/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Availability saved successfully:', result);
        setDeletedSlotIds([]); // Clear deleted slots after successful save
        
        // Show success message (you can add a toast notification here)
        alert(`Successfully saved! Created: ${result.created}, Updated: ${result.updated}, Deleted: ${result.deleted}`);
      } else {
        const errorData = await response.json();
        console.error('Failed to save availability:', errorData);
        alert(`Error saving availability: ${errorData.error || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('Error saving changes:', error);
      //alert(`Error saving changes: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Fetch studio data and check ownership
  useEffect(() => {
    const fetchStudioData = async () => {
      try {
        setLoading(true);
        
        // Get user info from localStorage
        const storedUserInfo = localStorage.getItem('userInfoFull');
        let currentUserInfo = null;
        
        if (storedUserInfo) {
          try {
            currentUserInfo = JSON.parse(storedUserInfo);
            setUserInfoFull(currentUserInfo);
            setIsSingedIn(true);
            console.log('Current user info:', currentUserInfo);
          } catch (error) {
            setIsSingedIn(false);
            console.error('Login again', error);
          }
        } else {
          setIsSingedIn(false);
          console.error('Login required');
        }
        
        const BASEURL_PROD = "http://0.0.0.0:8000/";
        const BASEURL_STUDIO = `${BASEURL_PROD}api/studio/`;
        
        const response = await fetch(`${BASEURL_STUDIO}${spaceId}/text/`);
        
        if (response.ok) {
          const studioData = await response.json();
          console.log('Fetched studio data:', studioData);
          
          // Check if current user owns this studio
          const studioUserId = studioData?.UserId || "";
          const currentUserId = currentUserInfo?.uid || "";
          const ownershipMatch = studioUserId === currentUserId;
          console.log(studioUserId,currentUserId)
          console.log('Ownership check:', {
            studioUserId,
            currentUserId,
            ownershipMatch
          });
          
          setIsOwner(ownershipMatch);
          setStudioExists(true);
          
          setStudio({
            id: spaceId,
            name: studioData.studioName || "Studio",
            type: studioData.danceStyles || "Dance styles",
            city: studioData.city || "",
            userId: studioUserId
          });
        } else {
          console.error('Failed to fetch studio data:', response.status);
          setStudioExists(false);
          setStudio({
            id: spaceId,
            name: "Studio Not Found",
            type: "Studio",
            city: "",
            userId: ""
          });
        }
      } catch (error) {
        console.error('Error fetching studio data:', error);
        setStudio({
          id: spaceId,
          name: "Error Loading Studio",
          type: "Studio",
          city: "",
          userId: ""
        });
      } finally {
        setLoading(false);
      }
    };

    if (spaceId) {
      fetchStudioData();
    }
  }, [spaceId]);

  // Load existing availability data
  useEffect(() => {
    const loadExistingAvailability = async () => {
      if (!spaceId || !studioExists || !isOwner) return;
      
      try {
        setLoadingAvailability(true);
        console.log('Loading existing availability for studio:', spaceId);
        const BASEURL_PROD = "http://0.0.0.0:8000/";
        const response = await fetch(`${BASEURL_PROD}crud/studio-availability/${spaceId}/`);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Loaded existing availability:', result);
          
          if (result.success && result.data.length > 0) {
            // Group slots by date
            const groupedSlots = {};
            // First, group existing slots by date
            result.data.forEach(slot => {
              // Extract time directly from string to avoid timezone conversion
              const startTimeStr = slot.start_time.split('T')[1].split('+')[0]; // "11:00:00"
              const endTimeStr = slot.end_time.split('T')[1].split('+')[0]; // "12:00:00"
              
              // Convert to HH:mm format
              const startTime = startTimeStr.substring(0, 5); // "11:00"
              const endTime = endTimeStr.substring(0, 5); // "12:00"
              
              // Get date from string
              const dateStr = slot.start_time.split('T')[0]; // "2025-08-11"
              const dateKey = dateStr;
              
              console.log("AR_ slot.start_time", slot.start_time, "extracted time:", startTime, "date:", dateKey);
              
              if (!groupedSlots[dateKey]) {
                groupedSlots[dateKey] = {
                  isActive: true,
                  slots: []
                };
              }
              
              // Convert API slot to frontend format
              const frontendSlot = {
                id: slot.id.toString(),
                startTime: startTime,
                endTime: endTime,
                price: parseFloat(slot.price_per_hr),
                available: slot.is_available
              };
              console.log("AR_ frontendSlot", frontendSlot)
              groupedSlots[dateKey].slots.push(frontendSlot);
            });
            // Now, for each date with slots, fill in missing time slots as unavailable
            Object.keys(groupedSlots).forEach(dateKey => {
              const existingSlots = groupedSlots[dateKey].slots;
              const allSlots = [];
              // Generate all time slots from START_HOUR AM to 10 PM
                for (let hour = START_HOUR; hour < END_HOUR; hour++) {
                  const startTime = `${hour.toString().padStart(2, '0')}:00`;
                  const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
                  
                  // Check if this slot exists in API data
                  const existingSlot = existingSlots.find(slot => 
                    slot.startTime === startTime
                  );
                if (existingSlot) {
                  // Use existing slot data
                  allSlots.push(existingSlot);
                } else {
                  // Create unavailable slot
                  const startDateTime = `${dateKey}T${startTime}:00`;
                  const epoch = Math.floor(new Date(startDateTime).getTime() / 1000);
                  const slotId = `${spaceId}_${epoch}`;
                  
                  allSlots.push({
                    id: slotId,
                    startTime: startTime,
                    endTime: endTime,
                    price: defaultPrice,
                    available: false
                  });
                }
              }
              
              // Update the slots array with all slots
              groupedSlots[dateKey].slots = allSlots;
            });
            
            // Update daySchedules with existing data
            setDaySchedules(prev => ({
              ...prev,
              ...groupedSlots
            }));
            
            console.log('Updated daySchedules with all slots (available + unavailable):', groupedSlots);
          }
        } else {
          console.log('No existing availability found or error loading');
        }
      } catch (error) {
        console.error('Error loading existing availability:', error);
      } finally {
        setLoadingAvailability(false);
      }
    };
    console.log("Loaded")
    loadExistingAvailability();
  }, [spaceId, studioExists, isOwner]);

  // Standalone function to refresh availability data
  const refreshAvailabilityData = async () => {
    if (!spaceId || !studioExists || !isOwner) return;
    
    try {
      setLoadingAvailability(true);
      console.log('Refreshing availability data for studio:', spaceId);
      const BASEURL_PROD = "http://0.0.0.0:8000/";
      const response = await fetch(`${BASEURL_PROD}crud/studio-availability/${spaceId}/`);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Refreshed availability data:', result);
        
        if (result.success && result.data.length > 0) {
          // Group slots by date
          const groupedSlots = {};
          
          // First, group existing slots by date
          result.data.forEach(slot => {
            // Extract time directly from string to avoid timezone conversion
            const startTimeStr = slot.start_time.split('T')[1].split('+')[0]; // "11:00:00"
            const endTimeStr = slot.end_time.split('T')[1].split('+')[0]; // "12:00:00"
            
            // Convert to HH:mm format
            const startTime = startTimeStr.substring(0, 5); // "11:00"
            const endTime = endTimeStr.substring(0, 5); // "12:00"
            
            // Get date from string
            const dateStr = slot.start_time.split('T')[0]; // "2025-08-11"
            const dateKey = dateStr;
            
            if (!groupedSlots[dateKey]) {
              groupedSlots[dateKey] = {
                isActive: true,
                slots: []
              };
            }
            
            // Convert API slot to frontend format
            const frontendSlot = {
              id: slot.id.toString(),
              startTime: startTime,
              endTime: endTime,
              price: parseFloat(slot.price_per_hr),
              available: slot.is_available
            };
            
            groupedSlots[dateKey].slots.push(frontendSlot);
          });
          
          // Now, for each date with slots, fill in missing time slots as unavailable
          Object.keys(groupedSlots).forEach(dateKey => {
            const existingSlots = groupedSlots[dateKey].slots;
            const allSlots = [];
            
            // Generate all time slots from START_HOUR AM to 10 PM
            for (let hour = START_HOUR; hour < END_HOUR; hour++) {
              const startTime = `${hour.toString().padStart(2, '0')}:00`;
              const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
              
              // Check if this slot exists in API data
              const existingSlot = existingSlots.find(slot => 
                slot.startTime === startTime && slot.endTime === endTime
              );
              
              if (existingSlot) {
                // Use existing slot data
                allSlots.push(existingSlot);
              } else {
                // Create unavailable slot
                                  const startDateTime = `${dateKey}T${startTime}:00`;
                const epoch = Math.floor(new Date(startDateTime).getTime() / 1000);
                const slotId = `${spaceId}_${epoch}`;
                
                allSlots.push({
                  id: slotId,
                  startTime: startTime,
                  endTime: endTime,
                  price: defaultPrice,
                  available: false
                });
              }
            }
            
            // Update the slots array with all slots
            groupedSlots[dateKey].slots = allSlots;
          });
          
          // Update daySchedules with refreshed data
          setDaySchedules(prev => ({
            ...prev,
            ...groupedSlots
          }));
          
          console.log('Updated daySchedules with all slots (available + unavailable):', groupedSlots);
          alert('Availability data refreshed successfully!');
        } else {
          // Clear existing data if no slots found
          setDaySchedules({});
          alert('No availability data found. Starting fresh.');
        }
      } else {
        console.error('Failed to refresh availability data');
        alert('Failed to refresh availability data. Please try again.');
      }
    } catch (error) {
      console.error('Error refreshing availability data:', error);
      alert(`Error refreshing data: ${error.message}`);
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Render different states based on conditions
  const renderContent = () => {
    console.log("isSingedIn", isSingedIn);
    console.log("isOwner", isOwner);
    console.log("studioExists", studioExists);
    console.log("loading", loading);
    if (loading) {
      return (
        <Grid container spacing={4}>
          {/* Loading skeletons */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width={120} height={24} />
                  </Box>
                  <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 2 }} />
                </CardContent>
              </StyledCard>
            </Box>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <StyledCard>
                <CardContent>
                  <Skeleton variant="text" width={300} height={24} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width={250} height={20} sx={{ mb: 3 }} />
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Skeleton key={index} variant="rectangular" width="100%" height={60} sx={{ mb: 1 }} />
                  ))}
                </CardContent>
              </StyledCard>
            </Box>
          </Grid>
        </Grid>
      );
    }

    // Case 1: Studio exists, user is signed in, and user is owner
    if ( studioExists && isSingedIn && isOwner) {
      return (
        <Grid container spacing={4}>
          {/* Calendar Selection */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalendarIcon size={20} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Select Date
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Choose a date to manage availability for {studio.name}
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
                  
                  <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />
                      <Typography variant="caption">Days with availability set</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>

              {/* Default Pricing */}
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <DollarSign size={20} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Default Pricing
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Set base rates that will apply to new time slots
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Base Price (per hour)"
                      type="number"
                      value={defaultPrice}
                      onChange={(e) => setDefaultPrice(Number(e.target.value))}
                      fullWidth
                    />
                    <TextField
                      label="Evening Premium (6PM+)"
                      type="number"
                      value={eveningPremium}
                      onChange={(e) => setEveningPremium(Number(e.target.value))}
                      fullWidth
                    />
                    <StyledButton 
                      variant="outlined" 
                      onClick={updateAllPrices}
                      fullWidth
                    >
                      Update All Prices for This Day
                    </StyledButton>
                  </Box>
                </CardContent>
              </StyledCard>

              {/* Quick Actions */}
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Copy size={20} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Quick Actions
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <StyledButton 
                      variant="outlined" 
                      onClick={() => copyToNextDays(7)}
                      size="small"
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Copy to Next 7 Days
                    </StyledButton>
                    <StyledButton 
                      variant="outlined" 
                      onClick={() => copyToNextDays(30)}
                      size="small"
                      fullWidth
                      sx={{ justifyContent: 'flex-start' }}
                      hidden
                    >
                      Copy to Next 30 Days
                    </StyledButton>
                  </Box>
                </CardContent>
              </StyledCard>
            </Box>
          </Grid>

          {/* Time Slots Management */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Availability for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Set your hourly availability and pricing for {studio.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">Day Active</Typography>
                      <Switch
                        checked={currentSchedule.isActive}
                        onChange={(e) => 
                          updateSchedule(selectedDateKey, { ...currentSchedule, isActive: e.target.checked })
                        }
                      />
                    </Box>
                  </Box>
                  
                  {!currentSchedule.isActive ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Clock size={48} style={{ color: '#666', margin: '0 auto 16px' }} />
                      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                        Studio Unavailable
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        Turn on &quot;Day Active&quot; to set availability for this date
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {currentSchedule.slots.map((slot) => (
                        <Paper 
                          key={slot.id} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2, 
                            p: 2, 
                            border: 1, 
                            borderColor: 'divider',
                            borderRadius: 1
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                            <Clock size={16} style={{ color: '#666' }} />
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {slot.startTime} - {slot.endTime}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">₹</Typography>
                            <TextField
                              type="number"
                              value={slot.price}
                              onChange={(e) => updateSlot(slot.id, { price: Number(e.target.value) })}
                              size="small"
                              sx={{ width: 80 }}
                            />
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">Available</Typography>
                            <Switch
                              checked={slot.available}
                              onChange={(e) => updateSlot(slot.id, { available: e.target.checked })}
                            />
                          </Box>

                          {currentSchedule.slots.length > 1 && (
                            <IconButton
                              onClick={() => removeTimeSlot(slot.id)}
                              sx={{ color: 'error.main' }}
                              size="small"
                              hidden
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          )}
                        </Paper>
                      ))}

                      <StyledButton 
                        variant="outlined" 
                        onClick={addTimeSlot}
                        startIcon={<Plus size={16} />}
                        disabled={currentSchedule.slots.length >= 15}
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        Add Time Slot
                      </StyledButton>
                    </Box>
                  )}
                </CardContent>
              </StyledCard>

              {/* Summary */}
              {currentSchedule.isActive && (
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Daily Summary
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                      Overview of your availability and potential earnings
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {currentSchedule.slots.filter(s => s.available).length}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Available Hours
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                            ₹{Math.min(...currentSchedule.slots.filter(s => s.available).map(s => s.price)) || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Min Price/Hour
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                            ₹{Math.max(...currentSchedule.slots.filter(s => s.available).map(s => s.price)) || 0}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Max Price/Hour
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                            ₹{currentSchedule.slots.filter(s => s.available).reduce((sum, s) => sum + s.price, 0)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Max Daily Earnings
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </StyledCard>
              )}

              {/* Save Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <StyledButton 
                  variant="contained" 
                  size="large"
                  startIcon={saving ? <Skeleton variant="circular" width={16} height={16} /> : <Save size={16} />}
                  onClick={handleSaveChanges}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </StyledButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      );
    }

    // Case 2: Studio doesn't exist
    if (!studioExists) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" sx={{ color: 'error.main', mb: 2 }}>
            Studio Not Found
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            The studio you&apos;re looking for doesn&apos;t exist or has been removed.
          </Typography>
          <StyledButton 
            variant="contained" 
            onClick={() => window.history.back()}
          >
            Go Back
          </StyledButton>
        </Box>
      );
    }

    // Case 3: User is not signed in
      if (!isSingedIn) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" sx={{ color: 'warning.main', mb: 2 }}>
            Sign In Required
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            You need to sign in to manage studio availability.
          </Typography>
          <StyledButton 
            variant="contained" 
            onClick={() => window.location.href = '/login'}
          >
            Sign In
          </StyledButton>
        </Box>
      );
    }


        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ color: 'error.main', mb: 2 }}>
              Access Denied
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              You don&apos;t have permission to manage this studio&apos;s availability.
            </Typography>
            <StyledButton 
              variant="contained" 
              onClick={() => window.history.back()}
            >
              Go Back
            </StyledButton>
          </Box>
        );
      };
    

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Back Button */}
            <Box sx={{ mb: 3 }} hidden={true}>
              <Link href="/list-studio" style={{ textDecoration: 'none' }}>
                <StyledButton variant="text" startIcon={<ArrowLeft size={16} />}>
                  Back to Studio Management
                </StyledButton>
              </Link>
            </Box>

            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textTransform:'none' }}>
                Manage Availability & Pricing
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, textTransform:'none' }}>
                Set your studio hours, pricing, and availability calendar
              </Typography>
              {!loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<Settings size={12} />} 
                    label={studio.name} 
                    variant="outlined" 
                    size="small"
                  />
                  <Chip label={studio.type} variant="outlined" size="small" />
                  <Chip label={`ID: ${spaceId}`} variant="outlined" size="small" color="info" />
                  {studio.city && (
                    <Chip label={studio.city} variant="outlined" size="small" color="primary" />
                  )}
                  {studio.userId && (
                    <Chip label={`User: ${studio.userId}`} variant="outlined" size="small" color="secondary" />
                  )}
                  <Chip 
                    label={isOwner ? "Owner" : "Not Owner"} 
                    variant="filled" 
                    size="small" 
                    color={isOwner ? "success" : "error"}
                  />
                </Box>
              )}
            </Box>

            {/* Render content based on conditions */}
            {renderContent()}
          </Container>
        </Box>
      </main>
      <ClientFooter />
    </div>
  );

 
}