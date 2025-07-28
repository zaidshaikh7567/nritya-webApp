import React from 'react';
import { useRouter } from 'next/navigation';
import UserPage from './UserPage';

// Mock React Router hooks for UserPage compatibility
const mockReactRouter = {
  useNavigate: () => {
    const router = useRouter();
    return (path) => router.push(path);
  },
  useParams: () => ({}),
  useLocation: () => ({
    pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
    search: typeof window !== 'undefined' ? window.location.search : '',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
    state: null
  })
};

// Temporarily mock react-router-dom for UserPage
if (typeof window !== 'undefined') {
  window.__REACT_ROUTER_MOCK__ = mockReactRouter;
}

function ProfilePage() {
  const router = useRouter();
  
  // Create a wrapper for any React Router dependencies
  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div>
      <UserPage />
    </div>
  );
}

export default ProfilePage; 