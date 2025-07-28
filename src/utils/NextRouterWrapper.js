import React from 'react';
import { useRouter } from 'next/navigation';
import { createContext, useContext } from 'react';

// Create a context that provides Next.js router functionality
const NextRouterContext = createContext();

export const NextRouterProvider = ({ children }) => {
  const router = useRouter();
  
  const navigate = (path) => {
    router.push(path);
  };
  
  const goBack = () => {
    router.back();
  };
  
  const replace = (path) => {
    router.replace(path);
  };
  
  const value = {
    navigate,
    goBack,
    replace,
    router
  };
  
  return (
    <NextRouterContext.Provider value={value}>
      {children}
    </NextRouterContext.Provider>
  );
};

export const useNextRouter = () => {
  const context = useContext(NextRouterContext);
  if (!context) {
    throw new Error('useNextRouter must be used within a NextRouterProvider');
  }
  return context;
};

// Mock useNavigate for components that expect React Router
export const useNavigate = () => {
  const { navigate } = useNextRouter();
  return navigate;
};

// Mock useParams for components that expect React Router
export const useParams = () => {
  // For Next.js, we need to get params from the URL
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

// Mock useLocation for components that expect React Router
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