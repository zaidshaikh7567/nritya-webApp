import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
    const location = useLocation();
    const { currentUser, setShowSignInModal } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            setShowSignInModal(true);
        }
        }, [currentUser, location.pathname, setShowSignInModal]);
    
      if (!currentUser) {
        return null;
      }

    return <Outlet />;
}

export default ProtectedRoute