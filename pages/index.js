import { useEffect, useRef } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductHero from "../components/ProductHero";
import Features from "../components/Features";
import Certificates from "../components/Certificates";
import Promo from "../components/Promo";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import ChatButton from "../components/ChatButton";

import AccountCard from "../components/AccountCard";
import TransactionItem from "../components/TransactionItem";
import CTA from "../components/CTA";

export default function Home() {
  const cardsRef = useRef([]);
  const transactionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("pop-up");
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => card && observer.observe(card));
    transactionsRef.current.forEach((item) => item && observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const accountCards = [
    { title: "Debit Card", description: "Fast and secure", image: "/hero-debit-card-1.jpg.PNG" },
    { title: "Development Fund", description: "Grow your savings", image: "/hero-development-fund.jpg.PNG" },
    { title: "Mobile Transactions", description: "Bank on the go", image: "/hero-mobile-transactions.jpg.PNG" },
  ];

  const transactions = [
    { title: "Payment to Vendor", amount: "-$120", date: "2025-08-31" },
    { title: "Salary Credit", amount: "+$3500", date: "2025-08-30" },
    { title: "Utility Bill", amount: "-$90", date: "2025-08-29" },
  ];

  return (
    <div className="app-container">
      <Header />
      <Navbar />

      <section className="hero fade-up">
        <Hero />
      </section>

      <section className="product-hero fade-up delay-1">
        <ProductHero />
      </section>

      <section className="features-section fade-up delay-2">
        <h2>Our Features</h2>
        <Features />
      </section>

      <section className="accounts-section">
        <h2>Choose Your Account</h2>
        <div className="grid">
          {accountCards.map((card, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`box ${index % 2 === 0 ? "fade-left" : "fade-right"}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <AccountCard {...card} />
            </div>
          ))}
        </div>
      </section>

      <section className="certificates-section fade-up delay-1">
        <Certificates />
      </section>

      <section className="promo-section fade-up delay-2">
        <CTA text="Open an account today" buttonText="Get Started" />
        <Promo />
      </section>

      <section className="testimonials-section fade-up delay-3">
        <h2>What Our Clients Say</h2>
        <Testimonials />
      </section>

      <section className="transactions-section">
        <h2>Recent Transactions</h2>
        <div className="grid">
          {transactions.map((txn, index) => (
            <div
              key={index}
              ref={(el) => (transactionsRef.current[index] = el)}
              className={`box ${index % 2 === 0 ? "fade-left" : "fade-right"}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <TransactionItem {...txn} />
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <ChatButton />
    </div>
  );
}
