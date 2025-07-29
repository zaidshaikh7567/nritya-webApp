'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const FILTER_LOCATION_KEY = 'filterLocation';

export default function LocationSync() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if URL city parameter matches localStorage preference
    const urlCity = searchParams?.get('city');
    const storedCity = localStorage.getItem(FILTER_LOCATION_KEY);
    
    // If user has a stored preference but URL doesn't match
    if (storedCity && !urlCity) {
      // Redirect to URL with stored city
      router.push(`/explore/?city=${encodeURIComponent(storedCity)}`);
    }
    // If URL has city but localStorage doesn't match
    else if (urlCity && storedCity !== urlCity) {
      // Update localStorage to match URL
      localStorage.setItem(FILTER_LOCATION_KEY, urlCity);
    }
    // If no stored preference and no URL city, set default
    else if (!storedCity && !urlCity) {
      localStorage.setItem(FILTER_LOCATION_KEY, 'New Delhi');
    }
  }, [searchParams, router]);

  // This component doesn't render anything
  return null;
} 