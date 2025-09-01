// pages/index.js
import Head from "next/head";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Promo from "../components/Promo";
import ProductHero from "../components/ProductHero";
import Testimonials from "../components/Testimonials";
import Certificates from "../components/Certificates";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import ChatButton from "../components/ChatButton";

export default function Home() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme === "dark" ? "dark" : "");
  }, [theme]);

  return (
    <>
      <Head>
        <title>Oakline Bank — Modern Banking</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </Head>

      <Header theme={theme} setTheme={setTheme} />

      <main>
        {/* Hero Section */}
        <Hero
          title="Welcome to Oakline Bank"
          subtitle="Banking made simple, secure, and smart."
          ctaText="Get Started"
          ctaHref="/signup"
          imgSrc="/images/hero-main.jpg"
        />

        {/* Features Grid */}
        <Features start={0} end={6} />

        {/* Promo Banner */}
        <Promo
          imgSrc="/images/hero-oakline-features.jpg.PNG"
          title="Smart Banking Features"
          description="Manage accounts, track transactions, and gain insights all in one app."
          ctaText="Learn More"
          ctaHref="/features"
        />

        {/* Product Hero */}
        <ProductHero
          imgSrc="/images/hero-debit-card-1.jpg.PNG"
          title="Oakline Debit Card"
          description="Secure worldwide, contactless payments, instant lock & unlock, and real-time spend tracking."
          ctaText="Get Your Debit Card"
          ctaHref="/debit-card"
        />

        <Features start={6} end={12} />

        {/* Mobile Banking Promo */}
        <Promo
          imgSrc="/images/hero-mobile-transactions.jpg.PNG"
          title="Bank On The Go"
          description="Check balances, make transfers, and track statements right from your phone."
          isDark
          ctaText="Learn More"
          ctaHref="/mobile"
        />

        <Features start={12} end={18} />

        {/* POS Solutions */}
        <ProductHero
          imgSrc="/images/hero-pos.jpg.PNG"
          title="POS & Merchant Solutions"
          description="Fast, secure payment processing and an easy dashboard for merchants."
          ctaText="Explore POS"
          ctaHref="/pos-solutions"
        />

        {/* Crypto & Development Fund */}
        <ProductHero
          imgSrc="/images/hero-development-fund.jpg.PNG"
          title="Oakline Development & Crypto Banking"
          description="Support innovation with our development fund, and explore crypto banking including secure wallets and trading."
          list={[
            "Secure Crypto Wallets",
            "Real-Time Crypto Trading",
            "Investment Tracking & Reports",
            "Dedicated Development Fund Initiatives",
          ]}
          ctaText="Explore Fund & Crypto"
          ctaHref="/development-crypto"
          imageLeft
        />

        {/* Testimonials */}
        <Testimonials />

        <Features start={18} end={28} />

        {/* Certificates */}
        <Certificates />

        {/* Call To Action */}
        <CTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Chat Button */}
      <ChatButton />
    </>
  );
}
