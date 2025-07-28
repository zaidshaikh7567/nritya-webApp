import React from 'react';
import { useRouter } from 'next/navigation';

// Mock React Router hooks for Next.js compatibility
export const useNavigate = () => {
  const router = useRouter();
  return (path) => router.push(path);
};

export const useParams = () => {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const params = {};
    
    const pathSegments = pathname.split('/');
    if (pathSegments.length > 2) {
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

export const Outlet = ({ children }) => children;

export const Navigate = ({ to }) => {
  const router = useRouter();
  React.useEffect(() => {
    router.push(to);
  }, [to, router]);
  return null;
};

export const HashRouter = ({ children }) => children;
export const BrowserRouter = ({ children }) => children;
export const Routes = ({ children }) => children;
export const Route = ({ element, path }) => element;
export const Link = ({ to, children, ...props }) => {
  const router = useRouter();
  return React.createElement('a', {
    ...props,
    href: to,
    onClick: (e) => {
      e.preventDefault();
      router.push(to);
    }
  }, children);
};

// Export all the hooks and components that React Router provides
export default {
  useNavigate,
  useParams,
  useLocation,
  Outlet,
  Navigate,
  HashRouter,
  BrowserRouter,
  Routes,
  Route,
  Link
}; 