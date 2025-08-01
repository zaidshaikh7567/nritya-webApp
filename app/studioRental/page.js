'use client';

import { Suspense } from 'react';
import { Box, Typography, Container, Skeleton } from '@mui/material';
import StudioRentalPage from '../../src/Screens/StudioRentalPage';

export default function StudioRentalPageWrapper() {
  return (
    <Suspense fallback={
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Container>
    }>
      <StudioRentalPage />
    </Suspense>
  );
} 