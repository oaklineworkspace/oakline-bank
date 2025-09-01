// pages/index.js
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import AccountCard from '../components/AccountCard';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      
      {/* Optional: showcase account types */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f5f5f5' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Choose Your Account</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <AccountCard type="Savings" benefits={['No monthly fees', 'High interest']} />
          <AccountCard type="Checking" benefits={['Free debit card', 'Easy transfers']} />
          <AccountCard type="Business" benefits={['Multiple users', 'Advanced reporting']} />
        </div>
      </section>

      <Footer />
    </>
  );
}
