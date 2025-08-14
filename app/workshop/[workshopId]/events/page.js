import React from 'react';
import { 
  Box, 
  Typography, 
} from '@mui/material';
import ClientHeader from '../../../components/ClientHeader';
import ClientFooter from '../../../components/ClientFooter';
import WorkshopEventsClient from './WorkshopEventsClient';
import { BASEURL_PROD } from '../../../../src/constants';
//const BASEURL_PROD = "https://nrityaserver-2b241e0a97e5.herokuapp.com/";

async function fetchWorkshopData(workshopId) {
  try {
    const url = `${BASEURL_PROD}crud/get_workshop_by_id/${workshopId}`;
    const response = await fetch(url, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching workshop data:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { workshopId } = params;
  const workshopData = await fetchWorkshopData(workshopId);

  if (!workshopData) {
    return {
      title: 'Workshop Events Not Found',
      description: 'The workshop events you are looking for do not exist or have been removed.',
    };
  }

  const name = workshopData.name || 'Workshop';
  const city = workshopData.city || 'City';
  const minPrice = workshopData.min_price || 0;
  const danceStyles = workshopData.dance_styles || 'Dance';
  const startDate = workshopData.start_date || '';
  const endDate = workshopData.end_date || workshopData.start_date || '';
  const description = workshopData.description || 'Book your dance workshop events';

  const title = `Book Tickets for ${name} - ${city}`;
  const metaDescription = `Book ${name} : ₹${minPrice} - ${danceStyles}, ${startDate}${endDate && endDate !== startDate ? ` to ${endDate}` : ''}, ${description}`;

  return {
    title,
    description: metaDescription,
    openGraph: {
      title,
      description: metaDescription,
      type: 'website',
      images: [
        {
          url: 'https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg',
          width: 1200,
          height: 630,
          alt: `${name} Events`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
      images: ['https://cdn.pixabay.com/photo/2016/12/30/10/03/dance-1940245_960_720.jpg'],
    },
  };
}

export default async function WorkshopEventsPage({ params }) {
  const { workshopId } = params;
  
  // Fetch data server-side
  const workshopData = await fetchWorkshopData(workshopId);

  if (!workshopData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ClientHeader />
        <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Workshop Not Found
            </Typography>
            <Typography variant="body1">
              The workshop you&apos;re looking for doesn&apos;t exist or has been removed.
            </Typography>
          </Box>
        </main>
        <ClientFooter />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '99%' }}>
        <WorkshopEventsClient 
          workshopData={workshopData} 
          workshopId={workshopId}
        />
      </main>
      <ClientFooter />
    </div>
  );
} 