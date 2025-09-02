// pages/index.js
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Oakline Bank</title>
        <link rel="icon" href="/favicon.ico" /> {/* Add your favicon here */}
        <meta name="description" content="Oakline Bank - Modern online banking" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main>
        <Hero />
        <Features />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
