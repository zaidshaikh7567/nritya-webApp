'use client'

import { Suspense } from 'react'
import { Box, Skeleton } from '@mui/material'
import dynamic from 'next/dynamic'

const Header = dynamic(() => import('../../src/Components/Header'), {
  ssr: false,
  loading: () => (
    <Box sx={{ 
      width: '100%', 
      height: '7vh', 
      backgroundColor: "black", 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000 
    }}>
      <Skeleton variant="rectangular" animation="wave" sx={{ height: '100%' }} />
    </Box>
  )
})

export default function ClientHeader() {
  return (
    <Suspense fallback={
      <Box sx={{ 
        width: '100%', 
        height: '7vh', 
        backgroundColor: "black", 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000 
      }}>
        <Skeleton variant="rectangular" animation="wave" sx={{ height: '100%' }} />
      </Box>
    }>
      <Header />
    </Suspense>
  )
} 