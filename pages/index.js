// pages/index.js
import Head from "next/head";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Certificates from "../components/Certificates";
import Chart from "../components/Chart";
import Testimonials from "../components/Testimonials";
import Promo from "../components/Promo";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Oakline Bank 🏦</title>
        <meta name="description" content="Modern banking experience with Oakline Bank" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Navbar />

      <main>
        <Hero />
        <Features />
        <Certificates />
        <Chart />
        <Testimonials />
        <Promo />
      </main>

      <Footer />
    </div>
  );
}
