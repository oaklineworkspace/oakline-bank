
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import MainMenu from '../components/MainMenu';
import WelcomeBanner from '../components/WelcomeBanner';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import FeaturesSection from '../components/FeaturesSection';
import LoanApprovalSection from '../components/LoanApprovalSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Home() {
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Auto-slide for hero images
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 7);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const bankingImages = [
    {
      src: '/images/hero-mobile.jpg.PNG',
      title: 'Mobile Banking Revolution',
      subtitle: 'Bank on the go with our award-winning mobile app'
    },
    {
      src: '/images/hero-debit-card-1.jpg.PNG',
      title: 'Premium Debit Cards',
      subtitle: 'Experience contactless payments with style'
    },
    {
      src: '/images/hero-pos.jpg.PNG',
      title: 'Business Solutions',
      subtitle: 'Comprehensive payment solutions for businesses'
    },
    {
      src: '/images/Bank_hall_business_discussion_72f98bbe.png',
      title: 'Expert Financial Advice',
      subtitle: 'Personalized guidance from banking professionals'
    },
    {
      src: '/images/Digital_investment_dashboard_36d35f19.png',
      title: 'Investment Management',
      subtitle: 'Smart investing made simple with digital tools'
    },
    {
      src: '/images/Mobile_banking_user_experience_576bb7a3.png',
      title: 'Seamless Banking Experience',
      subtitle: 'Intuitive design meets powerful functionality'
    },
    {
      src: '/images/Modern_bank_lobby_interior_d535acc7.png',
      title: 'Modern Banking Facilities',
      subtitle: 'Visit our state-of-the-art branch locations'
    }
  ];

  return (
    <div style={styles.pageContainer}>
      <MainMenu user={user} />
      <WelcomeBanner />
      
      {/* Enhanced Hero Section with Multiple Images */}
      <section style={styles.heroSection}>
        <div style={styles.heroSlide}>
          <img 
            src={bankingImages[currentSlide].src} 
            alt="Banking Hero" 
            style={styles.heroImage}
          />
          <div style={styles.heroOverlay}></div>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>{bankingImages[currentSlide].title}</h1>
            <p style={styles.heroSubtitle}>{bankingImages[currentSlide].subtitle}</p>
            <Link href="/apply" style={styles.heroButton}>Get Started Today</Link>
          </div>
        </div>
        <div style={styles.slideIndicators}>
          {bankingImages.map((_, index) => (
            <button
              key={index}
              style={{
                ...styles.indicator,
                ...(currentSlide === index ? styles.indicatorActive : {})
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Enhanced Banking Services Grid */}
      <section style={styles.servicesSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Complete Banking Solutions</h2>
          <div style={styles.servicesGrid}>
            <div style={styles.serviceCard}>
              <img src="/images/hero2-mobile.jpg.JPG" alt="Digital Banking" style={styles.serviceImage} />
              <div style={styles.serviceContent}>
                <h3 style={styles.serviceTitle}>Digital Banking</h3>
                <p style={styles.serviceDesc}>24/7 access to your accounts with our secure mobile and web platforms</p>
                <ul style={styles.featureList}>
                  <li>✓ Real-time notifications</li>
                  <li>✓ Biometric security</li>
                  <li>✓ Instant transfers</li>
                </ul>
                <Link href="/apply" style={styles.serviceButton}>Learn More</Link>
              </div>
            </div>
            
            <div style={styles.serviceCard}>
              <img src="/images/hero3-mobile.jpg.PNG" alt="Payment Solutions" style={styles.serviceImage} />
              <div style={styles.serviceContent}>
                <h3 style={styles.serviceTitle}>Payment Solutions</h3>
                <p style={styles.serviceDesc}>Flexible payment options for all your financial needs</p>
                <ul style={styles.featureList}>
                  <li>✓ Contactless payments</li>
                  <li>✓ Bill pay automation</li>
                  <li>✓ International transfers</li>
                </ul>
                <Link href="/transfer" style={styles.serviceButton}>Get Started</Link>
              </div>
            </div>

            <div style={styles.serviceCard}>
              <img src="/images/hero4-mobile.jpg.JPG" alt="Investment Services" style={styles.serviceImage} />
              <div style={styles.serviceContent}>
                <h3 style={styles.serviceTitle}>Investment Services</h3>
                <p style={styles.serviceDesc}>Grow your wealth with expert investment guidance</p>
                <ul style={styles.featureList}>
                  <li>✓ Portfolio management</li>
                  <li>✓ Market insights</li>
                  <li>✓ Risk assessment</li>
                </ul>
                <Link href="/investments" style={styles.serviceButton}>Invest Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Debit Card Showcase */}
      <section style={styles.cardSection}>
        <div style={styles.container}>
          <div style={styles.cardContent}>
            <div style={styles.cardInfo}>
              <h2 style={styles.cardTitle}>Premium Oakline Debit Card</h2>
              <p style={styles.cardDesc}>Experience banking freedom with zero fees and worldwide acceptance.</p>
              <div style={styles.cardFeatures}>
                <div style={styles.feature}>🔒 Advanced chip technology</div>
                <div style={styles.feature}>🌍 Global acceptance</div>
                <div style={styles.feature}>💳 Contactless payments</div>
                <div style={styles.feature}>📱 Real-time alerts</div>
              </div>
              <Link href="/cards" style={styles.cardButton}>Apply for Card</Link>
            </div>
            <div style={styles.cardDisplay}>
              <div style={styles.debitCard}>
                <div style={styles.cardChip}></div>
                <div style={styles.cardLogo}>OAKLINE</div>
                <div style={styles.cardNumber}>4532 8901 2345 6789</div>
                <div style={styles.cardDetails}>
                  <div>
                    <div style={styles.cardLabel}>VALID THRU</div>
                    <div style={styles.cardExpiry}>08/29</div>
                  </div>
                  <div>
                    <div style={styles.cardLabel}>CARDHOLDER</div>
                    <div style={styles.cardName}>ALEX JOHNSON</div>
                  </div>
                </div>
                <div style={styles.cardNetwork}>VISA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ATM and Branch Network */}
      <section style={styles.networkSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Extensive Banking Network</h2>
          <div style={styles.networkGrid}>
            <div style={styles.networkCard}>
              <img src="/images/Banking_executive_team_meeting_c758f3ec.png" alt="Branch Network" style={styles.networkImage} />
              <h3 style={styles.networkTitle}>150+ Branch Locations</h3>
              <p style={styles.networkDesc}>Visit our modern branches for personalized service and expert advice.</p>
            </div>
            <div style={styles.networkCard}>
              <img src="/images/Mobile_banking_user_experience_576bb7a3.png" alt="ATM Network" style={styles.networkImage} />
              <h3 style={styles.networkTitle}>55,000+ ATM Access</h3>
              <p style={styles.networkDesc}>Free access to one of the largest ATM networks in the country.</p>
            </div>
          </div>
        </div>
      </section>

      <main>
        <HeroSection />
        <ServicesSection />
        <FeaturesSection />
        <LoanApprovalSection />
        <TestimonialsSection />
        
        {/* Security & Trust Section */}
        <section style={styles.securitySection}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Your Security is Our Priority</h2>
            <div style={styles.securityGrid}>
              <div style={styles.securityCard}>
                <div style={styles.securityIcon}>🔐</div>
                <h3>Bank-Grade Security</h3>
                <p>256-bit SSL encryption protects all your transactions and personal data.</p>
              </div>
              <div style={styles.securityCard}>
                <div style={styles.securityIcon}>🛡️</div>
                <h3>Fraud Protection</h3>
                <p>24/7 monitoring with instant alerts and zero liability on unauthorized transactions.</p>
              </div>
              <div style={styles.securityCard}>
                <div style={styles.securityIcon}>🏦</div>
                <h3>FDIC Insured</h3>
                <p>Your deposits are insured up to $250,000 by the Federal Deposit Insurance Corporation.</p>
              </div>
              <div style={styles.securityCard}>
                <div style={styles.securityIcon}>📱</div>
                <h3>Biometric Access</h3>
                <p>Secure login with fingerprint and facial recognition technology.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA */}
        <CTA
          title="Ready to Start Your Financial Journey?"
          subtitle="Join over 500,000 customers who trust Oakline Bank for their financial needs. Open your account today and experience the difference."
          buttonText="Open Account Now"
          buttonLink="/apply"
          variant="primary"
        />
      </main>
      
      <Footer />
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    width: '100%',
    overflow: 'hidden'
  },

  // Hero Section Styles
  heroSection: {
    position: 'relative',
    height: '100vh',
    minHeight: '500px',
    maxHeight: '800px',
    overflow: 'hidden',
    width: '100%'
  },
  heroSlide: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center'
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.85) 0%, rgba(5, 150, 105, 0.7) 100%)'
  },
  heroContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: 'white',
    maxWidth: '90%',
    width: '100%',
    padding: '0 1rem',
    zIndex: 2
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 4rem)',
    fontWeight: '700',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
    marginBottom: '2rem',
    opacity: 0.95,
    maxWidth: '600px',
    margin: '0 auto 2rem'
  },
  heroButton: {
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    padding: 'clamp(0.8rem, 2vw, 1.2rem) clamp(1.5rem, 4vw, 2.5rem)',
    borderRadius: '12px',
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    fontWeight: '600',
    boxShadow: '0 8px 20px rgba(5, 150, 105, 0.4)',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },
  slideIndicators: {
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '12px',
    zIndex: 3
  },
  indicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid white',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  indicatorActive: {
    backgroundColor: 'white',
    transform: 'scale(1.2)'
  },

  // Container and Grid Styles
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem',
    width: '100%'
  },

  // Services Section
  servicesSection: {
    padding: 'clamp(3rem, 6vw, 6rem) 0',
    backgroundColor: '#f8fafc',
    width: '100%'
  },
  sectionTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 'clamp(2rem, 4vw, 4rem)'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
    gap: 'clamp(1.5rem, 3vw, 2.5rem)',
    width: '100%'
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 25px 45px rgba(0,0,0,0.12)'
    }
  },
  serviceImage: {
    width: '100%',
    height: '220px',
    objectFit: 'cover'
  },
  serviceContent: {
    padding: 'clamp(1.5rem, 3vw, 2rem)'
  },
  serviceTitle: {
    fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  serviceDesc: {
    color: '#64748b',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
    fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)'
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '2rem'
  },
  serviceButton: {
    color: '#1e3a8a',
    textDecoration: 'none',
    fontWeight: '600',
    padding: '0.8rem 1.6rem',
    border: '2px solid #1e3a8a',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    fontSize: 'clamp(0.9rem, 1.5vw, 1rem)'
  },

  // Card Section
  cardSection: {
    padding: 'clamp(3rem, 6vw, 6rem) 0',
    backgroundColor: 'white',
    width: '100%'
  },
  cardContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
    gap: 'clamp(2rem, 4vw, 4rem)',
    alignItems: 'center'
  },
  cardInfo: {
    padding: '1rem'
  },
  cardTitle: {
    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  cardDesc: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    color: '#64748b',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  cardFeatures: {
    display: 'grid',
    gap: '1rem',
    marginBottom: '2rem'
  },
  feature: {
    fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
    color: '#059669',
    fontWeight: '500'
  },
  cardButton: {
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    padding: 'clamp(0.8rem, 2vw, 1.2rem) clamp(1.5rem, 3vw, 2rem)',
    borderRadius: '10px',
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },
  cardDisplay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem'
  },
  debitCard: {
    width: 'min(350px, 90vw)',
    height: 'calc(min(350px, 90vw) * 0.63)',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #059669 100%)',
    borderRadius: '18px',
    padding: 'clamp(1rem, 3vw, 1.8rem)',
    color: 'white',
    position: 'relative',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    fontFamily: 'monospace'
  },
  cardChip: {
    width: '35px',
    height: '28px',
    background: '#ffd700',
    borderRadius: '6px',
    marginBottom: '1rem'
  },
  cardLogo: {
    fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
    fontWeight: 'bold',
    marginBottom: '1rem',
    letterSpacing: '2px'
  },
  cardNumber: {
    fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
    fontWeight: '500',
    marginBottom: '1.2rem',
    letterSpacing: '2px'
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  cardLabel: {
    fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)',
    marginBottom: '4px',
    opacity: 0.8
  },
  cardExpiry: {
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    fontWeight: '500'
  },
  cardName: {
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    fontWeight: '500'
  },
  cardNetwork: {
    position: 'absolute',
    bottom: 'clamp(1rem, 3vw, 1.8rem)',
    right: 'clamp(1rem, 3vw, 1.8rem)',
    fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
    fontWeight: 'bold',
    fontStyle: 'italic'
  },

  // Network Section
  networkSection: {
    padding: 'clamp(3rem, 6vw, 6rem) 0',
    backgroundColor: '#f8fafc',
    width: '100%'
  },
  networkGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
    gap: 'clamp(2rem, 4vw, 3rem)'
  },
  networkCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: 'clamp(1.5rem, 3vw, 2.5rem)',
    textAlign: 'center',
    boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease'
  },
  networkImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '15px',
    marginBottom: '1.5rem'
  },
  networkTitle: {
    fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  networkDesc: {
    color: '#64748b',
    lineHeight: '1.6',
    fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)'
  },

  // Security Section
  securitySection: {
    padding: 'clamp(3rem, 6vw, 6rem) 0',
    backgroundColor: 'white',
    width: '100%'
  },
  securityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
    gap: 'clamp(1.5rem, 3vw, 2.5rem)'
  },
  securityCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '20px',
    padding: 'clamp(1.5rem, 3vw, 2.5rem)',
    textAlign: 'center',
    transition: 'all 0.3s ease'
  },
  securityIcon: {
    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
    marginBottom: '1.5rem',
    display: 'block'
  }
};
