'use client';

import React, { useState } from 'react';
import { Button } from '@mui/material';
import PriceDetailsModal from './PriceDetailsModal';

export default function TicketClient({ ticketData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewPriceDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleViewPriceDetails}
        sx={{
          borderColor: 'white',
          color: 'white',
          '&:hover': {
            borderColor: 'white',
            bgcolor: 'rgba(255,255,255,0.1)'
          }
        }}
      >
        View Price Details
      </Button>
      
      <PriceDetailsModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        ticketData={ticketData}
      />
    </>
  );
} 