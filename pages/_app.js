// pages/_app.js
import '../styles/globals.css';
import '../styles/responsive.css';
import '../styles/StickyFooter.css';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import StickyFooter from '../components/StickyFooter';

const queryClient = new QueryClient()

// Create context for pathname
const PathnameContext = createContext()

// Wrapper component to provide pathname
function PathnameContextProviderAdapter({ children, router }) {
  return (
    <PathnameContext.Provider value={router.pathname}>
      {children}
    </PathnameContext.Provider>
  )
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  // Pages where sticky footer should not appear
  const hideFooterPages = ['/login', '/signup', '/reset-password', '/verify-email']
  const shouldShowFooter = !hideFooterPages.includes(router.pathname)

  return (
    <QueryClientProvider client={queryClient}>
      <PathnameContextProviderAdapter router={router}>
        <div style={{ paddingBottom: shouldShowFooter ? '140px' : '0' }}>
          <Component {...pageProps} />
        </div>
        {shouldShowFooter && <StickyFooter />}
      </PathnameContextProviderAdapter>
    </QueryClientProvider>
  )
}