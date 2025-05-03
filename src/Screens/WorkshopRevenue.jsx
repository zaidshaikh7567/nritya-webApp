import React from 'react';
import { Card, CardContent, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { formatDateToReadable } from '../utils/timeUtils';


const dummyWorkshop = {
  "workshop_id": "eb44a69f-ca3d-4033-8aba-09bfd73e58c7",
  "name": "Workshop Name 1",
  "dance_styles": "Salsa, Tango",
  "commission": 10,
  "variants": [
    {
      "variant_id": "59587f16-d4a7-462a-8431-150fef452516",
      "date": "2025-01-01",
      "time": "17:00",
      "description": "DAY 1 | Tanish x Jhanavi",
      "subvariants": [
        { "subvariant_id": "612d1000-9206-4796-8f6b-2b5ec47aa03c", "description": "Single Entry (Early Bird)", "price": 2000, "capacity": 5, "bookings": 5 },
        { "subvariant_id": "dd29097b-8660-4809-8670-c8dd823212e4", "description": "Couple Entry (Early Bird)", "price": 3500, "capacity": 5, "bookings": 5 },
        { "subvariant_id": "03c9baa0-b782-4fbe-90bd-97d29f0d752e", "description": "Group of 3", "price": 5999, "capacity": 20, "bookings": 7 },
        { "subvariant_id": "612d1000-9206-4796-8f6b-2b5ec47aa03d", "description": "Single Entry", "price": 2499, "capacity": 40, "bookings": 6 },
        { "subvariant_id": "dd29097b-8660-4809-8670-c8dd823212e5", "description": "Couple Entry", "price": 3999, "capacity": 40, "bookings": 5 },
      ]
    },
    {
        "variant_id": "59587f16-d4a7-462a-8431-150fef452516",
        "date": "2025-01-01",
        "time": "19:00",
        "description": "DAY 1 | Tanish x Jhanavi",
        "subvariants": [
          { "subvariant_id": "612d1000-9206-4796-8f6b-2b5ec47aa03c", "description": "Single Entry (Early Bird)", "price": 3000, "capacity": 5, "bookings": 5 },
          { "subvariant_id": "dd29097b-8660-4809-8670-c8dd823212e4", "description": "Couple Entry (Early Bird)", "price": 4500, "capacity": 5, "bookings": 5 },
          { "subvariant_id": "03c9baa0-b782-4fbe-90bd-97d29f0d752e", "description": "Group of 3", "price": 5999, "capacity": 20, "bookings": 7 },
          { "subvariant_id": "612d1000-9206-4796-8f6b-2b5ec47aa03d", "description": "Single Entry", "price": 3499, "capacity": 40, "bookings": 6 },
          { "subvariant_id": "dd29097b-8660-4809-8670-c8dd823212e5", "description": "Couple Entry", "price": 4999, "capacity": 40, "bookings": 5 },
        ]
      },
    {
      "variant_id": "36d48162-72f2-41f0-bea1-5ab61cd629a2",
      "date": "2025-01-02",
      "time": "19:00",
      "description": "DAY 2 | Tanish x Jhanavi",
      "subvariants": [
        { "subvariant_id": "51185e42-c2b5-4d1c-92ce-a85785862a20", "description": "Single Entry (Early Bird)", "price": 1800, "capacity": 5, "bookings": 5 },
        { "subvariant_id": "51185e42-c2b5-4d1c-92ce-a85785862a21", "description": "Couple Entry (Early Bird)", "price": 2999, "capacity": 5, "bookings": 5 },
        { "subvariant_id": "51185e42-c2b5-4d1c-92ce-a85785862a20", "description": "Single Entry", "price": 1999, "capacity": 40, "bookings":  5},
        { "subvariant_id": "51185e42-c2b5-4d1c-92ce-a85785862a21", "description": "Couple Entry", "price": 3499, "capacity": 40, "bookings": 6 }
      ]
    },
    {
        "variant_id": "36d48162-72f2-41f0-bea1-5ab61cd629a3",
        "date": "2025-01-01",
        "time": "17:00",
        "description": "DAY PASS | Tanish x Jhanavi",
        "subvariants": [
          { "subvariant_id": "51185e42-c2b5-4d1c-92ce-a85785862a30", "description": "DAY PASS (Early Bird)", "price": 4999, "capacity": 5, "bookings": 5 },
          { "subvariant_id": "51185e42-c2b5-4d1c-92ce-a85785862a31", "description": "DAY PASS", "price": 5999, "capacity": 20, "bookings": 5 }
        ]
      }
  ]
};



const WorkshopRevenue = () => {
    const { workshopId } = useParams();
    const workshop = dummyWorkshop;
    if (!workshop) {
      return <Typography variant="h6">Workshop not found</Typography>;
    }
    const commission_pc = workshop.commission/100;
    const earning_factor = 1 - commission_pc;
    const calculateTotalRevenue = () => {
      let earned = 0;
      let potential = 0;
      workshop.variants.forEach(variant => {
        variant.subvariants.forEach(sub => {
          earned += sub.price * sub.bookings;
          potential += sub.price * sub.capacity;
        });
      });
      return { earned, potential };
    };
  
    const { earned, potential } = calculateTotalRevenue();
  
    return (
      <div>
        <Typography variant="h5" style={{textTransform:'none'}} gutterBottom>{workshop.name} — Revenue Summary</Typography>
  
        <Card sx={{ mb: 2, maxWidth: "20rem" }}>
          <CardContent>
            <Typography variant="h6">Finances</Typography>
            <Typography variant="body1">💰Total Sales: ₹ {earned.toLocaleString()}</Typography>
            <Typography variant="body1">💰Commission: ₹ {(commission_pc*earned).toLocaleString()}</Typography>
            <hr/>
            <Typography variant="body1">💰Earnings: ₹ {(earning_factor*earned).toLocaleString()}</Typography>
          </CardContent>
        </Card>
  
        <Divider sx={{ my: 2 }} />
  
        {workshop.variants.map(variant => (
          <Card key={variant.variant_id} sx={{ mb: 3 }} border={1} borderColor="#e0e0e0">
            <CardContent>
              <Typography variant="h6" gutterBottom style={{textTransform:'none'}}>
                {variant.description} ({formatDateToReadable(variant.date)} | {variant.time})
              </Typography>
  
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Subvariant</strong></TableCell>
                      <TableCell align="right"><strong>Price (₹)</strong></TableCell>
                      <TableCell align="right"><strong>Capacity</strong></TableCell>
                      <TableCell align="right"><strong>Bookings</strong></TableCell>
                      <TableCell align="right"><strong>Revenue (₹)</strong></TableCell>
                      <TableCell align="right"><strong>Commission (10%) (₹)</strong></TableCell>
                      <TableCell align="right"><strong>Earnings (₹)</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {variant.subvariants.map(sub => {
                      const revenueEarned = sub.price * sub.bookings;
                      const commission = revenueEarned * commission_pc;
                      const earnings = revenueEarned * earning_factor;
                      return (
                        <TableRow key={sub.subvariant_id}>
                          <TableCell>{sub.description}</TableCell>
                          <TableCell align="right">{sub.price}</TableCell>
                          <TableCell align="right">{sub.capacity}</TableCell>
                          <TableCell align="right">{sub.bookings}</TableCell>
                          <TableCell align="right">₹ {revenueEarned.toLocaleString()}</TableCell>
                          <TableCell align="right">₹ {commission.toLocaleString()}</TableCell>
                          <TableCell align="right">₹ {earnings.toLocaleString()}</TableCell>
                        </TableRow>
                      );
                    })}
  
                    {/* Variant total row */}
                    <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                      <TableCell colSpan={4}><strong>Event Total</strong></TableCell>
                      <TableCell align="right">
                        ₹ {variant.subvariants.reduce((acc, sub) => acc + (sub.price * sub.bookings), 0).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        ₹ {variant.subvariants.reduce((acc, sub) => acc + (sub.price * sub.bookings * 0.10), 0).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        ₹ {variant.subvariants.reduce((acc, sub) => {
                          const revenue = sub.price * sub.bookings;
                          return acc + (revenue - revenue * 0.10);
                        }, 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
  
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        ))}
  
      </div>
    );
  };
  
  export default WorkshopRevenue;
  
