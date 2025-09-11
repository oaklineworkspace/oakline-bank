// pages/_app.js
import '../styles/globals.css';
import '../styles/responsive.css';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <Head>
        <title>Oakline Bank</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Secure and convenient banking with Oakline Bank." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />

        {/* iPhone and Mobile Optimization */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Oakline Bank" />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="format-detection" content="telephone=no" />

        {/* Prevent form zoom on iOS */}
        <style>{`
          @media screen and (-webkit-min-device-pixel-ratio:0) {
            input, select, textarea {
              font-size: 16px !important;
            }
          }
        `}</style>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}