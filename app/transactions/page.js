'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@mui/material'
import { NextRouterProvider } from '../../src/utils/NextRouterWrapper'

const TransactionsPage = dynamic(() => import('../../src/Screens/TransactionsPage'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" animation="wave" height="100vh" />
})

const Header = dynamic(() => import('../components/ClientHeader'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      width: '100%', 
      height: '7vh', 
      backgroundColor: "black", 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000 
    }}>
      <Skeleton variant="rectangular" animation="wave" sx={{ height: '100%' }} />
    </div>
  )
})

const Footer = dynamic(() => import('../components/ClientFooter'), {
  ssr: false
})

export default function TransactionsPageWrapper() {
  return (
    <NextRouterProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
          <TransactionsPage />
        </main>
        <Footer />
      </div>
    </NextRouterProvider>
  )
} 