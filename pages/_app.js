// pages/_app.js
import '../styles/globals.css';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Oakline Bank</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Secure and convenient banking with Oakline Bank." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
