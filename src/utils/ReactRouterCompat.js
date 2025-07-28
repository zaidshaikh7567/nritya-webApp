import React from 'react';
import { useRouter } from 'next/navigation';
import { useParams as useNextParams } from 'next/navigation';

// Mock React Router hooks for compatibility
export const useNavigate = () => {
  const router = useRouter();
  return (path) => router.push(path);
};

export const useParams = () => {
  // For Next.js, we need to get params from the URL
  // This is a simplified version - you might need to adjust based on your routing
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const params = {};
    
    // Extract params from pathname
    const pathSegments = pathname.split('/');
    if (pathSegments.length > 2) {
      // Handle dynamic routes like /studio/[studioId]
      if (pathSegments[1] === 'studio' && pathSegments[2]) {
        params.studioId = pathSegments[2];
      }
      if (pathSegments[1] === 'workshop' && pathSegments[2]) {
        params.workshopId = pathSegments[2];
      }
      if (pathSegments[1] === 'openClass' && pathSegments[2]) {
        params.entityId = pathSegments[2];
      }
      if (pathSegments[1] === 'course' && pathSegments[2]) {
        params.entityId = pathSegments[2];
      }
    }
    
    return params;
  }
  return {};
};

export const useLocation = () => {
  if (typeof window !== 'undefined') {
    return {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      state: null
    };
  }
  return {
    pathname: '/',
    search: '',
    hash: '',
    state: null
  };
};

// Mock other React Router exports that might be needed
export const Outlet = ({ children }) => children;
export const Navigate = ({ to }) => {
  const router = useRouter();
  React.useEffect(() => {
    router.push(to);
  }, [to, router]);
  return null;
}; 