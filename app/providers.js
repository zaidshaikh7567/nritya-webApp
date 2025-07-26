'use client'

import { Provider } from 'react-redux'
import store from '../src/redux/store'
import { AuthProvider } from '../src/context/AuthContext'
import LoaderProvider from '../src/context/LoaderContext'
import SnackbarProvider from '../src/context/SnackbarContext'
import { HelmetProvider } from 'react-helmet-async'

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <AuthProvider>
          <LoaderProvider>
            <SnackbarProvider>
              {children}
            </SnackbarProvider>
          </LoaderProvider>
        </AuthProvider>
      </HelmetProvider>
    </Provider>
  )
} 