'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Close } from '@mui/icons-material';

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

export default function PriceDetailsModal({ open, onClose, ticketData }) {
  if (!ticketData) return null;
  
  // Sort booking items by date and time for the modal as well
  const sortedBookingItems = [...ticketData.booking_items].sort((a, b) => {
    // First sort by date
    const dateComparison = new Date(a.date) - new Date(b.date);
    if (dateComparison !== 0) return dateComparison;
    
    // If dates are same, sort by time
    return a.time.localeCompare(b.time);
  });
  
  const sortedTicketData = {
    ...ticketData,
    booking_items: sortedBookingItems
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: '2px solid #735EAB'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#735EAB', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          💰 Price Details
        </Typography>
        <Button
          onClick={onClose}
          sx={{ color: 'white', minWidth: 'auto' }}
        >
          <Close />
        </Button>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 'bold', 
          color: '#735EAB',
          mb: 3,
          textAlign: 'center'
                 }}>
           {sortedTicketData.workshop_name}
         </Typography>

        {/* Itemized Breakdown */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            mb: 3,
            color: '#735EAB'
          }}>
            Booking Items
          </Typography>
          
                     <List>
             {sortedTicketData.booking_items.map((item, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
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
                
                <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      📅 {formatDate(item.date)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      🕐 {convertTo12HourFormat(item.time)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {item.quantity} × ₹{item.price_per_ticket}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    color: '#735EAB'
                  }}>
                    ₹{item.subtotal}
                  </Typography>
                </Box>
              </Box>
            ))}
          </List>
        </Box>

        {/* Price Summary */}
        <Box sx={{ 
          bgcolor: '#735EAB', 
          color: 'white',
          p: 3, 
          borderRadius: 2
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            mb: 3,
            textAlign: 'center'
          }}>
            Price Summary
          </Typography>
          
          <Box sx={{ mb: 2 }}>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
               <Typography>Subtotal:</Typography>
               <Typography>₹{sortedTicketData.booking_summary.subtotal}</Typography>
             </Box>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
               <Typography>Booking Fee:</Typography>
               <Typography>₹{sortedTicketData.booking_summary.booking_fee}</Typography>
             </Box>
             {sortedTicketData.booking_summary.cgst > 0 && (
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                 <Typography>CGST:</Typography>
                 <Typography>₹{sortedTicketData.booking_summary.cgst}</Typography>
               </Box>
             )}
             {sortedTicketData.booking_summary.sgst > 0 && (
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                 <Typography>SGST:</Typography>
                 <Typography>₹{sortedTicketData.booking_summary.sgst}</Typography>
               </Box>
             )}
          </Box>
          
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                         <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
               Total:
             </Typography>
             <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
               ₹{sortedTicketData.booking_summary.total}
             </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#735EAB',
            '&:hover': { bgcolor: '#5a4a8a' }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
} 