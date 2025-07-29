'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import citiesData from '../../src/cities.json';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  }
}));

// Popular cities for quick selection
const popularCities = [
  'New Delhi',
  'Gurugram', 
  'Mumbai',
  'Bengaluru',
  'Chennai',
  'Kolkata',
  'Patna'
];

const FILTER_LOCATION_KEY = 'filterLocation';

const LocationModal = ({ open, onClose, selectedLocation, onLocationChange }) => {
  const handleCitySelect = (city) => {
    console.log('LocationModal: City selected:', city);
    onLocationChange(null, city);
    onClose();
  };

  return (
    <BootstrapDialog
      onClose={onClose}
      open={open}
      maxWidth='sm'
      fullWidth
      sx={{
        '& .MuiModal-backdrop': {
          backdropFilter: 'blur(8px)'
        },
      }}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0, color: '#333' }}>Select Your City</h3>
          <Button
            onClick={onClose}
            style={{ minWidth: 'auto', padding: '8px' }}
          >
            <Close />
          </Button>
        </div>

        {/* City Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {popularCities.map((city) => (
            <Button
              key={city}
              onClick={() => handleCitySelect(city)}
              variant={selectedLocation === city ? "contained" : "outlined"}
              style={{
                padding: '12px 16px',
                textTransform: 'none',
                fontSize: '14px',
                backgroundColor: selectedLocation === city ? '#735EAB' : 'transparent',
                color: selectedLocation === city ? 'white' : '#333',
                borderColor: selectedLocation === city ? '#735EAB' : '#ddd',
                '&:hover': {
                  backgroundColor: selectedLocation === city ? '#5a4a8a' : '#f5f5f5'
                }
              }}
            >
              {city}
            </Button>
          ))}
        </div>

        {/* All Cities Dropdown */}
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ marginBottom: '12px', color: '#666' }}>Other Cities</h4>
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #eee',
            borderRadius: '8px'
          }}>
            {citiesData.cities
              .filter(city => !popularCities.includes(city))
              .map((city, index) => (
                <div
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: index < citiesData.cities.length - popularCities.length - 1 ? '1px solid #eee' : 'none',
                    color: '#333',
                    fontSize: '14px',
                    backgroundColor: selectedLocation === city ? '#f0f0f0' : 'white'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = selectedLocation === city ? '#f0f0f0' : '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = selectedLocation === city ? '#f0f0f0' : 'white'}
                >
                  {city}
                </div>
              ))}
          </div>
        </div>
      </div>
    </BootstrapDialog>
  );
};

export default LocationModal; 