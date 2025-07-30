'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Card, 
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Skeleton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaClock, FaRegCalendarAlt } from 'react-icons/fa';
import { Badge } from 'react-bootstrap';

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
      [`${variantId}-${subvariantId}`]: parseInt(value) || 0
    }));
  };

  const handleConfirm = () => {
    // Calculate total and proceed with booking
    const selectedItems = Object.entries(quantities)
      .filter(([key, quantity]) => quantity > 0)
      .map(([key, quantity]) => {
        const [variantId, subvariantId] = key.split('-');
        const variant = workshopData.variants.find(v => v.variant_id === variantId);
        const subvariant = variant?.subvariants.find(s => s.subvariant_id === subvariantId);
        return {
          variantId,
          subvariantId,
          quantity,
          price: subvariant?.price || 0,
          description: subvariant?.description || '',
          date: variant?.date || '',
          time: variant?.time || ''
        };
      });

    if (selectedItems.length === 0) {
      alert('Please select at least one ticket option.');
      return;
    }

    // Here you would typically proceed to payment/booking confirmation
    console.log('Selected items:', selectedItems);
    alert('Booking functionality to be implemented');
  };

  const handleCancel = () => {
    router.back();
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
                          value={quantities[`${variant.variant_id}-${subvariant.subvariant_id}`] || 0}
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
          variant="outlined"
          onClick={handleCancel}
          sx={{
            borderColor: '#735EAB',
            color: '#735EAB',
            '&:hover': {
              borderColor: '#735EAB',
              bgcolor: 'rgba(115, 94, 171, 0.1)'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{
            bgcolor: '#735EAB',
            color: 'white',
            '&:hover': {
              bgcolor: '#5a4a8a'
            }
          }}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
} 