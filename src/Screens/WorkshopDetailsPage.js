import React, { useState } from 'react';
import {
  Paper, Typography, Grid, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Card, CardContent, TextField, Checkbox, FormControlLabel,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dance8 from '../Components/DanceImg/Dance8.jpg';

const WorkshopDetailsPage = () => {
    const data = {
        workshop: {
          name: "Hasthtag",
          dance_styles: "salsa, tango",
          building: "Hashtag Event Hall",
          street: "Main St",
          city: "Mumbai",
          description: "Hashtag Event: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          terms_conditions: "No refunds",
          geolocation: "19.0760,72.8777",
          start_date:"2025-01-01",
          end_date:"2025-01-02",
          min_price: 2000,
        },
        variants: [
          {
            date: "2025-01-01",
            time: "6am-8pm",
            description: "DAY 1 | Tanish x Jhanavi",
            subvariants: [
              { price: 2000, capacity: 40, description: "Early Bird (Single Entry)" },
              { price: 3500, capacity: 40, description: "Early Bird (Couple Entry)" },
              { price: 5999, capacity: 20, description: "Group of 3" }
            ]
          },
          {
            date: "2025-01-01",
            time: "9pm-11pm",
            description: "DAY 1 | Tanish x Jhanavi (Evening)",
            subvariants: [
              { price: 1900, capacity: 40, description: "Single Entry" }
            ]
          },
          {
            date: "2025-01-02",
            time: "6pm-9pm",
            description: "DAY 2 | Tanish x Jhanavi",
            subvariants: [
              { price: 1800, capacity: 40, description: "Single Entry" }
            ]
          }
        ]
      };    

  const { workshop, variants } = data;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSubvariants, setSelectedSubvariants] = useState({});
  const [quantities, setQuantities] = useState({});

  const handleBookNow = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVariant(null);
    setSelectedSubvariants({});
    setQuantities({});
  };

  const handleSubvariantSelect = (description) => {
    setSelectedSubvariants(prev => ({
      ...prev,
      [description]: !prev[description]
    }));
    if (!selectedSubvariants[description]) {
      setQuantities(prev => ({ ...prev, [description]: 1 }));
    } else {
      setQuantities(prev => ({ ...prev, [description]: 0 }));
    }
  };

  const handleQuantityChange = (description, value) => {
    setQuantities(prev => ({
      ...prev,
      [description]: Math.max(0, parseInt(value) || 0)
    }));
  };

  const handleConfirmBooking = () => {
    const confirmed = Object.keys(selectedSubvariants)
      .filter(desc => selectedSubvariants[desc])
      .map(desc => ({
        description: desc,
        price: selectedVariant.subvariants.find(sub => sub.description === desc).price,
        quantity: quantities[desc]
      }));

    if (confirmed.length === 0) {
      alert("Select at least one pricing option.");
      return;
    }

    const total = confirmed.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    let summary = confirmed.map(
      item => `${item.quantity} x ${item.description} @ ₹${item.price}`
    ).join('\n');

    alert(`Booked for ${selectedVariant.description}:\n\n${summary}\n\nTotal: ₹${total}`);

    handleCloseDialog();
  };

  return (
    <>
    
    <Paper sx={{ p: 4, mb: 4 }}>
    <Grid container spacing={3}>
        {/* Image on LHS */}
        <Grid item xs={12} sm={4}>
        <img 
            src={Dance8} 
            alt="Workshop" 
            style={{ width: '100%', borderRadius: 8 }}
        />
        </Grid>

        {/* Details on RHS */}
        <Grid item xs={12} sm={8}>
        <Typography variant="h4" style={{textTransform: 'none'}} gutterBottom>{workshop.name}</Typography>
        <Typography variant="body1" gutterBottom><strong>Dance Styles:</strong> {workshop.dance_styles}</Typography>
        <Typography variant="body2" gutterBottom><strong>City:</strong> {workshop.city}</Typography>
        <Typography variant="body2" gutterBottom><strong>Dates:</strong> {workshop.start_date} to {workshop.end_date}</Typography>
        <Typography variant="body2" gutterBottom><strong>Starting from </strong> {workshop.min_price}</Typography>


        <Button variant="contained" onClick={handleBookNow} sx={{ mt: 2 }}>Book Now</Button>
        </Grid>
    </Grid>



      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Select Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {variants.map((variant, i) => (
              <Grid item xs={12} key={i}>
                <Card
                  sx={{
                    border: selectedVariant?.description === variant.description ? '2px solid #1976d2' : '1px solid #ccc',
                    cursor: 'pointer',
                    '&:hover': { borderColor: '#1976d2' }
                  }}
                  onClick={() => {
                    setSelectedVariant(variant);
                    const initialSelected = {};
                    const initialQuantities = {};
                    variant.subvariants.forEach(sub => {
                      initialSelected[sub.description] = false;
                      initialQuantities[sub.description] = 0;
                    });
                    setSelectedSubvariants(initialSelected);
                    setQuantities(initialQuantities);
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" style={{textTransform: 'none'}} >{variant.description}</Typography>
                    <Typography variant="body2">🗓️ {variant.date} | 🕑 {variant.time}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {selectedVariant && (
            <div style={{ marginTop: 24 }}>
              <Typography variant="h6" style={{textTransform: 'none'}}  gutterBottom>Pricing Options</Typography>
              <Grid container spacing={2}>
                {selectedVariant.subvariants.map((sub, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card sx={{ p: 2 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedSubvariants[sub.description]}
                            onChange={() => handleSubvariantSelect(sub.description)}
                          />
                        }
                        label={
                          <div>
                            <Typography variant="subtitle1">{sub.description}</Typography>
                            <Typography variant="body2">₹{sub.price}</Typography>
                          </div>
                        }
                      />
                      <TextField
                        type="number"
                        label="Quantity"
                        value={quantities[sub.description]}
                        onChange={(e) => handleQuantityChange(sub.description, e.target.value)}
                        fullWidth
                        sx={{ mt: 1 }}
                        inputProps={{ min: 0 }}
                        disabled={!selectedSubvariants[sub.description]}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmBooking}
            disabled={!selectedVariant}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      
    </Paper>

    <Paper sx={{ p: 2, mt: 3 }}>
  <Typography variant="h6" style={{textTransform: 'none'}}  gutterBottom>Workshop Details</Typography>

  <Typography variant="subtitle1" style={{textTransform: 'none'}}  fontWeight="bold" mt={2}>Description</Typography>
  <Typography variant="body2">{workshop.description}</Typography>

  <Typography variant="subtitle1" style={{textTransform: 'none'}}  fontWeight="bold" mt={2}>Address</Typography>
  <Typography variant="body2">
    {workshop.building}, {workshop.street}, {workshop.city}
  </Typography>

</Paper>


      {/* Accordion for Terms & Conditions */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography><strong>Terms & Conditions</strong></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">{workshop.terms_conditions}</Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default WorkshopDetailsPage;
