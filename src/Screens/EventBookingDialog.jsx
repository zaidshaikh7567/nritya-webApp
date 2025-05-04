import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  Card, CardContent, Typography, FormControlLabel, Checkbox,
  TextField, Button, Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from '@mui/material';
import {convertTo12HourFormat} from '../utils/timeUtils';



const EventBookingDialog = ({ open, onClose, workshopData }) => {
    const [selectedVariants, setSelectedVariants] = useState([]);
    const [selectedSubvariants, setSelectedSubvariants] = useState({});
    const [quantities, setQuantities] = useState({});

    const getVariantDescription = (variantId) => {
        const variant = workshopData.variants.find(v => v.variant_id === variantId);
        return variant ? variant.description : 'No description available';
      };
    
    const getSubvariantDescription = (variant_id, subvariant_id) => {
        const variant = workshopData.variants.find(v => v.variant_id === variant_id);
        const subvariant = variant?.subvariants.find(s => s.subvariant_id === subvariant_id);
        return subvariant ? subvariant.description : 'No description available';
    };
      
  
    const handleVariantToggle = (variant) => {
      const isSelected = selectedVariants.some(v => v.variant_id === variant.variant_id);
      let updatedVariants;
  
      if (isSelected) {
        updatedVariants = selectedVariants.filter(v => v.variant_id !== variant.variant_id);
        const newSubvariants = { ...selectedSubvariants };
        const newQuantities = { ...quantities };
  
        delete newSubvariants[variant.variant_id];
        delete newQuantities[variant.variant_id];
  
        setSelectedSubvariants(newSubvariants);
        setQuantities(newQuantities);
      } else {
        updatedVariants = [...selectedVariants, variant];
        setSelectedSubvariants(prev => ({
          ...prev,
          [variant.variant_id]: {}
        }));
        setQuantities(prev => ({
          ...prev,
          [variant.variant_id]: {}
        }));
      }
  
      setSelectedVariants(updatedVariants);
    };
  
    const handleSubvariantSelect = (variant_id, subvariant_id, price) => {
      const current = selectedSubvariants[variant_id]?.[subvariant_id] || false;
  
      setSelectedSubvariants(prev => ({
        ...prev,
        [variant_id]: {
          ...prev[variant_id],
          [subvariant_id]: !current
        }
      }));
  
      if (!current) {
        setQuantities(prev => ({
          ...prev,
          [variant_id]: {
            ...prev[variant_id],
            [subvariant_id]: 1
          }
        }));
      } else {
        setQuantities(prev => ({
          ...prev,
          [variant_id]: {
            ...prev[variant_id],
            [subvariant_id]: 0
          }
        }));
      }
    };

  
    const handleQuantityChange2 = (variant_id, subvariant_id, value) => {
      setQuantities(prev => ({
        ...prev,
        [variant_id]: {
          ...prev[variant_id],
          [subvariant_id]: Math.max(0, parseInt(value) || 0)
        }
      }));
    };

    const handleQuantityChange = (variant_id, subvariant_id, value) => {
        const newValue = Math.max(0, parseInt(value) || 0);
      
        setQuantities(prev => {
          const updatedQuantities = { ...prev };
      
          if (newValue === 0) {
            
            if (updatedQuantities[variant_id]) {
              delete updatedQuantities[variant_id][subvariant_id];
              if (Object.keys(updatedQuantities[variant_id]).length === 0) {
                delete updatedQuantities[variant_id];
              }
            }
          } else {
            updatedQuantities[variant_id] = {
              ...updatedQuantities[variant_id],
              [subvariant_id]: newValue
            };
          }
      
          return updatedQuantities;
        });
      
        if (newValue === 0) {
          setSelectedSubvariants(prev => {
            const updatedSelected = { ...prev };
      
            if (updatedSelected[variant_id]) {
              delete updatedSelected[variant_id][subvariant_id];
      
              if (Object.keys(updatedSelected[variant_id]).length === 0) {
                delete updatedSelected[variant_id];
              }
            }
      
            return updatedSelected;
          });
        }
      };
      
  
    const calculateSummary = () => {
      let confirmed = [];
  
      selectedVariants.forEach(variant => {
        const subSelections = selectedSubvariants[variant.variant_id] || {};
        const subQuantities = quantities[variant.variant_id] || {};
  
        variant.subvariants.forEach(sub => {
          if (subSelections[sub.subvariant_id]) {
            confirmed.push({
              variant: variant.variant_id,
              subvariant: sub.subvariant_id,
              price: sub.price,
              quantity: subQuantities[sub.subvariant_id] || 0
            });
          }
        });
      });
  
      const total = confirmed.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
      return { confirmed, total };
    };
  
    const handleConfirmBooking = () => {
      const { confirmed, total } = calculateSummary();
    
      if (confirmed.length === 0) {
        alert("Select at least one pricing option.");
        return;
      }
    
      // Ensure workshopId exists
      const workshopId = workshopData?.workshop_id;
      if (!workshopId) {
        alert("Workshop ID is missing.");
        return;
      }
    
      let bookingData = {
        workshop_id: workshopId,
        buyers_name: "NAME OF BUYER",
        buyer_email: "buyer@fake.com",
        buyer_number: "+910123456789",
        total: total,
        variant: {}
      };
    
      // Constructing the variant structure
      confirmed.map(item => {
        const { quantity, subvariant, price, variant } = item;
        console.log(quantity, subvariant, price, variant)
        // Ensure all required fields are available
        if (variant && subvariant && quantity !== undefined && price !== undefined) {
          if (!bookingData.variant[variant]) {
            bookingData.variant[variant] = {};
          }
    
          bookingData.variant[variant][subvariant] = {
            quantity: quantity,
            price: price
          };
        } else {
          console.warn("Incomplete data for item: ", item);
        }
      });
    
      console.log("Booking Data JSON:", JSON.stringify(bookingData, null, 2));
    
      // Optional: display a nice summary alert too
      let summary = confirmed.map(
        item => {
          const { quantity, subvariant, price, variant } = item;
          return `${quantity} x ${subvariant} @ ₹${price} (Event: ${variant})`;
        }
      ).join('\n');
    
      alert(`Booking Summary:\n\n${summary}\n\nTotal: ₹${total}`);
      handleClose();
    };

    const handleClose = () => {
      onClose();
      setSelectedVariants([]);
      setSelectedSubvariants({});
      setQuantities({});
    };
  
    const { confirmed, total } = calculateSummary();
  
    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ textTransform:'none'}}>Select Events</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {workshopData && workshopData.variants.map((variant, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Card
                  sx={{
                    border: selectedVariants.some(v => v.variant_id === variant.variant_id) 
                      ? '2px solid #735EAB' 
                      : '1px solid #ccc',
                    color: selectedVariants.some(v => v.variant_id === variant.variant_id)
                      ? '#white'
                      : 'inherit',
                    backgroundColor: selectedVariants.some(v => v.variant_id === variant.variant_id)
                      ? '#735EAB'
                      : 'transparent',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'black' },
                  }}
                  onClick={() => handleVariantToggle(variant)}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{
                      color: selectedVariants.some(v => v.variant_id === variant.variant_id)
                      ? '#ffffff'
                      : 'inherit',
                      textTransform:'none',
                    }}
                    >{variant.description}</Typography>
                    <Typography variant="body2" sx={{
                      color: selectedVariants.some(v => v.variant_id === variant.variant_id)
                      ? '#ffffff'
                      : 'inherit',
                    }} >🗓️ {variant.date} | 🕑 {convertTo12HourFormat(variant.time)}</Typography>
                  </CardContent>
                </Card>
                
              </Grid>
             
            ))}
          </Grid>
  
          {selectedVariants.length > 0 && selectedVariants.map((variant, vi) => (
            <div key={vi} style={{ marginTop: 32 }}>
              <Typography variant="h6" sx={{textTransform:'none',}} gutterBottom>{variant.description} : Ticket Options</Typography>
              <Grid container spacing={2}>
                {variant.subvariants.map((sub, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card sx={{ p: 2, border: '1px solid #ccc' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedSubvariants[variant.variant_id]?.[sub.subvariant_id] || false}
                            onChange={() => handleSubvariantSelect(variant.variant_id, sub.subvariant_id, sub.price)}
                          />
                        }
                        label={
                          <div>
                            <Typography variant="subtitle1" sx={{textTransform:'none',}}>{sub.description}</Typography>
                            <Typography variant="body2">₹{sub.price}</Typography>
                          </div>
                        }
                      />
                      <TextField
                        type="number"
                        label="Quantity"
                        value={quantities[variant.variant_id]?.[sub.subvariant_id] || 0}
                        onChange={(e) => handleQuantityChange(variant.variant_id, sub.subvariant_id, e.target.value)}
                        fullWidth
                        sx={{ mt: 1 }}
                        inputProps={{ min: 0 }}
                        disabled={!selectedSubvariants[variant.variant_id]?.[sub.subvariant_id]}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          ))}
  
          {confirmed.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{textTransform:'none'}}gutterBottom>Booking Summary</Typography>
  
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Event</strong></TableCell>
                      <TableCell><strong>Pricing Option</strong></TableCell>
                      <TableCell align="right"><strong>Price (₹)</strong></TableCell>
                      <TableCell align="right"><strong>Quantity</strong></TableCell>
                      <TableCell align="right"><strong>Subtotal (₹)</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {confirmed.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{getVariantDescription(item.variant)}</TableCell>
                        <TableCell>{getSubvariantDescription(item.variant,item.subvariant)}</TableCell>
                        <TableCell align="right">{item.price}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{item.price * item.quantity}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} align="right"><strong>Total:</strong></TableCell>
                      <TableCell align="right"><strong>₹{total}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
  
        </DialogContent>
  
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmBooking}
            disabled={confirmed.length === 0}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default EventBookingDialog;
  
