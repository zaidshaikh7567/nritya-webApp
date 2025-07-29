import { redirect } from 'next/navigation';

export default function ExplorePage({ searchParams }) {
  const city = searchParams?.city || 'New Delhi';
  
  // Redirect to main page with city parameter
  redirect(`/?city=${encodeURIComponent(city)}`);
} 