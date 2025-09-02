import Head from "next/head";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import ProductHero from "../components/ProductHero";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
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

      <Header />
      <Hero />

      {/* Core Features */}
      <Features 
        title="Our Core Features"
        description="Everything you need — from everyday accounts to advanced crypto and business solutions."
        features={[
          {
            icon: "fa-credit-card",
            title: "Checking",
            desc: "Flexible accounts, debit cards, and instant payments.",
            link: "checking"
          },
          {
            icon: "fa-piggy-bank",
            title: "Savings",
            desc: "High-yield savings with auto-save options and goals.",
            link: "savings"
          },
          {
            icon: "fa-building",
            title: "Business",
            desc: "Business checking, merchant tools, payroll integrations.",
            link: "business"
          },
          {
            icon: "fa-hand-holding-dollar",
            title: "Loans",
            desc: "Personal & business loans with competitive rates.",
            link: "loans"
          },
          {
            icon: "fa-coins",
            title: "Certificates (CDs)",
            desc: "Fixed-term deposits with guaranteed returns.",
            link: "cd"
          },
          {
            icon: "fa-wallet",
            title: "Digital Wallet",
            desc: "Connect cards for instant mobile payments & wallets.",
            link: "mobile"
          },
        ]}
      />

      <ProductHero
        title="Oakline Debit Card"
        description="Secure worldwide, with contactless payments, instant lock & unlock and real-time spend tracking."
        imgSrc="/images/hero-debit-card-1.jpg.PNG"
        link="debit-card"
      />

      <Features 
        features={[
          {
            icon: "fa-globe",
            title: "International Transfers",
            desc: "Fast cross-border payments with competitive FX.",
            link: "transfers"
          },
          {
            icon: "fa-shield-alt",
            title: "Security & Fraud Protection",
            desc: "Multi-layer encryption, 2FA, and real-time fraud alerts.",
            link: "security"
          },
          {
            icon: "fa-chart-line",
            title: "Investments",
            desc: "Advisory, robo-advice and investment accounts.",
            link: "invest"
          },
        ]}
      />

      <ProductHero
        title="Bank On The Go"
        description="Check balances, make transfers, and track statements right from your phone."
        imgSrc="/images/hero-mobile-transactions.jpg.PNG"
        link="mobile"
      />

      <Testimonials />

      <CTA />

      <Footer />
    </>
  );
}
