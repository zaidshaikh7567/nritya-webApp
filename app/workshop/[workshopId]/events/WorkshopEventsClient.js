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
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaClock, FaRegCalendarAlt } from 'react-icons/fa';
import { Badge } from 'react-bootstrap';
const INT_FEE = 0.03;

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
      [`${variantId}__${subvariantId}`]: parseInt(value) || 0  // Use double underscore to avoid conflicts with hyphens
    }));
  };

  const handleConfirm = () => {
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
            variantId,
            subvariantId,
            quantity,
            price: subvariant?.price || 0,
            description: subvariant?.description || '',
            date: variant?.date || '',
            time: variant?.time || '',
            variantDescription: variant?.description || '',
            subvariantDescription: subvariant?.description || ''
          };
          
          console.log('Created item:', result);
          return result;
        } else {
          console.log('Variant not found!');
          return {
            variantId,
            subvariantId,
            quantity,
            price: 0,
            description: '',
            date: '',
            time: '',
            variantDescription: '',
            subvariantDescription: ''
          };
        }
      });

    console.log('Selected items after mapping:', selectedItems);

    if (selectedItems.length === 0) {
      alert('Please select at least one ticket option.');
      return;
    }

    // Calculate total amount
    const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate total quantity
    const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

    // Calculate additional fees
    const subtotal = total;
    const internetConvenienceFee = Math.round(subtotal * INT_FEE); // 5% internet convenience fee
    const totalWithFees = subtotal + internetConvenienceFee;

    // Create detailed booking payload
    const bookingPayload = {
      workshop_id: workshopId,
      workshop_name: workshopData?.name || 'Unknown Workshop',
      workshop_description: workshopData?.description || '',
      buyers_name: "Buyer Name", // This should come from user profile
      buyer_email: "buyer@email.com", // This should come from user profile
      buyer_number: "+919876543210", // This should come from user profile
      subtotal: subtotal,
      internet_convenience_fee: internetConvenienceFee,
      total: totalWithFees,
      total_quantity: totalQuantity,
      details: {}
    };

    // Build variant structure with detailed information
    selectedItems.forEach(item => {
      const { variantId, subvariantId, quantity, price, variantDescription, subvariantDescription } = item;
      
      if (!bookingPayload.details[variantId]) {
        bookingPayload.details[variantId] = {};
      }

      bookingPayload.details[variantId][subvariantId] = {
        variant_id: variantId,
        subvariant_id: subvariantId,
        price_per_ticket: price,
        quantity: quantity,
        variant_description: variantDescription,
        subvariant_description: subvariantDescription,
        date: item.date,
        time: item.time
      };
    });

    // Create detailed price breakup
    const priceBreakup = {
      items: selectedItems.map(item => ({
        variant_id: item.variantId,
        subvariant_id: item.subvariantId,
        variant_description: item.variantDescription,
        subvariant_description: item.subvariantDescription,
        date: item.date,
        time: item.time,
        quantity: item.quantity,
        price_per_ticket: item.price,
        subtotal: item.price * item.quantity
      })),
      summary: {
        subtotal: subtotal,
        booking_fee: internetConvenienceFee,
        cgst: 0, // Removed GST
        sgst: 0, // Removed GST
        total: totalWithFees
      }
    };

    // Log the complete booking information
    console.log('=== WORKSHOP BOOKING DETAILS ===');
    console.log('Price Breakup:');
    console.log(JSON.stringify(priceBreakup, null, 2));
    console.log('');
    
    console.log('=== PRICE BREAKDOWN ===');
    console.log(`Subtotal: ₹${subtotal}`);
    console.log(`Internet Con Fee (${INT_FEE * 100}%): ₹${internetConvenienceFee}`);
    console.log(`Total: ₹${totalWithFees}`);
    console.log(`Total Quantity: ${totalQuantity} tickets`);
    console.log('=== END BOOKING DETAILS ===');
    console.log(selectedItems);

    // For now, just show an alert with summary
    const summaryText = selectedItems.map(item => 
      `${item.quantity} × ${item.subvariantDescription || 'Unknown'} (${item.variantDescription || 'Unknown'}) = ₹${item.price * item.quantity}`
    ).join('\n');

    alert(`Booking Summary:\n\n${summaryText}\n\nTotal: ₹${total}\n\nCheck console for detailed payload.`);
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
          sx={{
            bgcolor: '#735EAB',
            color: 'white',
            '&:hover': {
              bgcolor: '#5a4a8a'
            }
          }}
        >
          Book Tickets
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
        const internetConvenienceFee = Math.round(subtotal * INT_FEE);
        const total = subtotal + internetConvenienceFee;

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
                <Typography variant="body1">Internet Convenience Fee ({INT_FEE * 100}%):</Typography>
                <Typography variant="body1">₹{internetConvenienceFee}</Typography>
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
    </Box>
  );
} 