// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    // Only run Firebase auth on client side
    if (typeof window !== 'undefined' && auth) {
      try {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          setCurrentUser(user);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.warn('Firebase auth error:', error);
        setLoading(false);
      }
    } else {
      // For SSR, just set loading to false
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    showSignInModal,
    setShowSignInModal
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};