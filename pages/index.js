
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
  const [currentAccountSlide, setCurrentAccountSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session and set up auth listener
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setUser(session?.user ?? null);
      }
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Auto-slide for hero images
    const heroInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bankingImages.length);
    }, 5000);

    // Auto-slide for account types
    const accountInterval = setInterval(() => {
      setCurrentAccountSlide(prev => (prev + 1) % Math.ceil(accountTypes.length / 6));
    }, 7000);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => {
      subscription?.unsubscribe();
      clearInterval(heroInterval);
      clearInterval(accountInterval);
      observer.disconnect();
    };
  }, []);

  const bankingImages = [
    {
      src: '/images/hero-mobile.jpg.PNG',
      title: 'Mobile Banking Revolution',
      subtitle: 'Bank anywhere, anytime with our award-winning mobile app',
      icon: '📱'
    },
    {
      src: '/images/hero-debit-card-1.jpg.PNG',
      title: 'Premium Debit Cards',
      subtitle: 'Experience contactless payments with advanced security',
      icon: '💳'
    },
    {
      src: '/images/hero-pos.jpg.PNG',
      title: 'ATM & POS Solutions',
      subtitle: 'Access your money worldwide with our extensive network',
      icon: '🏧'
    },
    {
      src: '/images/Bank_hall_business_discussion_72f98bbe.png',
      title: 'Expert Financial Advice',
      subtitle: 'Personalized guidance from certified banking professionals',
      icon: '👥'
    },
    {
      src: '/images/Digital_investment_dashboard_36d35f19.png',
      title: 'Smart Investment Tools',
      subtitle: 'AI-powered investment strategies for maximum returns',
      icon: '📊'
    },
    {
      src: '/images/Mobile_banking_user_experience_576bb7a3.png',
      title: 'Seamless User Experience',
      subtitle: 'Intuitive design meets powerful banking functionality',
      icon: '⚡'
    },
    {
      src: '/images/Modern_bank_lobby_interior_d535acc7.png',
      title: 'Modern Banking Facilities',
      subtitle: 'Visit our state-of-the-art branch locations',
      icon: '🏦'
    }
  ];

  const accountTypes = [
    { name: 'Checking Account', icon: '💳', rate: '0.01% APY', desc: 'Everyday banking made simple', featured: true },
    { name: 'Savings Account', icon: '💰', rate: '4.50% APY', desc: 'Grow your money with competitive rates', featured: true },
    { name: 'Business Checking', icon: '🏢', rate: '0.01% APY', desc: 'Professional banking for businesses', featured: true },
    { name: 'Business Savings', icon: '🏦', rate: '4.25% APY', desc: 'Business savings with higher yields', featured: false },
    { name: 'Student Checking', icon: '🎓', rate: '0.01% APY', desc: 'No-fee banking for students', featured: false },
    { name: 'Money Market Account', icon: '📈', rate: '4.75% APY', desc: 'Premium savings with higher yields', featured: true },
    { name: 'Certificate of Deposit', icon: '🔒', rate: '5.25% APY', desc: 'Secure fixed-rate investments', featured: true },
    { name: 'Retirement Account (IRA)', icon: '🏖️', rate: '4.80% APY', desc: 'Plan for your golden years', featured: false },
    { name: 'Joint Checking', icon: '👫', rate: '0.01% APY', desc: 'Shared banking for couples', featured: false },
    { name: 'Trust Account', icon: '🛡️', rate: '3.50% APY', desc: 'Manage assets for beneficiaries', featured: false },
    { name: 'Investment Brokerage', icon: '📊', rate: 'Variable', desc: 'Trade stocks, bonds, and ETFs', featured: true },
    { name: 'High-Yield Savings', icon: '⭐', rate: '5.00% APY', desc: 'Maximum earning potential', featured: true },
    { name: 'Teen Account', icon: '👦', rate: '2.00% APY', desc: 'Financial education for teens', featured: false },
    { name: 'Senior Account', icon: '👴', rate: '4.00% APY', desc: 'Special benefits for seniors', featured: false },
    { name: 'Premium Checking', icon: '💎', rate: '0.25% APY', desc: 'Luxury banking with perks', featured: false },
    { name: 'Health Savings Account', icon: '🏥', rate: '3.75% APY', desc: 'Tax-advantaged health savings', featured: false },
    { name: 'Business Money Market', icon: '🏗️', rate: '4.50% APY', desc: 'Business liquidity solutions', featured: false },
    { name: 'International Account', icon: '🌍', rate: '3.25% APY', desc: 'Global banking solutions', featured: false },
    { name: 'Cryptocurrency Account', icon: '₿', rate: 'Variable', desc: 'Digital asset management', featured: user ? true : false },
    { name: 'Green Investment Fund', icon: '🌱', rate: '6.00% APY', desc: 'Sustainable investing options', featured: user ? true : false },
    { name: 'Real Estate Investment', icon: '🏠', rate: '7.50% APY', desc: 'Property investment trusts', featured: user ? true : false },
    { name: 'Education Savings (529)', icon: '📚', rate: '4.25% APY', desc: 'Tax-free education savings', featured: false },
    { name: 'Emergency Fund Account', icon: '🚨', rate: '4.10% APY', desc: 'Quick access emergency savings', featured: false }
  ];

  const atmFeatures = [
    { icon: '🏧', title: '55,000+ ATMs', desc: 'Nationwide access' },
    { icon: '🌍', title: 'Global Network', desc: 'Worldwide acceptance' },
    { icon: '📱', title: 'Cardless ATM', desc: 'Mobile app access' },
    { icon: '🔒', title: 'Secure Transactions', desc: 'Bank-grade security' }
  ];

  // Show different account types based on authentication
  const visibleAccountTypes = user ? accountTypes : accountTypes.filter(account => account.featured);

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <MainMenu user={user} />
      <WelcomeBanner />
      
      {/* Enhanced Hero Section with Mobile-First Design */}
      <section style={styles.heroSection} id="hero" data-animate>
        <div style={styles.heroSlide}>
          <div style={styles.heroImageContainer}>
            <img 
              src={bankingImages[currentSlide].src} 
              alt="Banking Hero" 
              style={styles.heroImage}
            />
            <div style={styles.heroOverlay}></div>
          </div>
          <div style={{
            ...styles.heroContent,
            ...(isVisible.hero ? styles.slideInFromLeft : {})
          }}>
            <div style={styles.heroIcon}>{bankingImages[currentSlide].icon}</div>
            <h1 style={styles.heroTitle}>{bankingImages[currentSlide].title}</h1>
            <p style={styles.heroSubtitle}>{bankingImages[currentSlide].subtitle}</p>
            <div style={styles.heroButtons}>
              <Link href="/apply" style={styles.heroButton}>
                <span style={styles.buttonIcon}>🚀</span>
                Get Started Today
              </Link>
              <Link href="/login" style={styles.secondaryButton}>
                <span style={styles.buttonIcon}>👤</span>
                Sign In
              </Link>
            </div>
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

      {/* ATM & Card Services Section */}
      <section style={styles.atmSection} id="atm-services" data-animate>
        <div style={styles.container}>
          <div style={{
            ...styles.sectionHeader,
            ...(isVisible['atm-services'] ? styles.fadeInDown : {})
          }}>
            <h2 style={styles.sectionTitle}>ATM & Card Services</h2>
            <p style={styles.sectionSubtitle}>Access your money anywhere, anytime with our comprehensive card solutions</p>
          </div>
          
          <div style={styles.atmGrid}>
            <div style={{
              ...styles.atmImageContainer,
              ...(isVisible['atm-services'] ? styles.slideInFromLeft : {})
            }}>
              <img src="/images/hero-debit-card-2.jpg.PNG" alt="ATM Card Usage" style={styles.atmImage} />
              <div style={styles.imageOverlay}>
                <h3 style={styles.overlayTitle}>Smart ATM Technology</h3>
                <p style={styles.overlayDesc}>Biometric authentication and cardless transactions</p>
              </div>
            </div>
            
            <div style={{
              ...styles.atmFeaturesGrid,
              ...(isVisible['atm-services'] ? styles.slideInFromRight : {})
            }}>
              {atmFeatures.map((feature, index) => (
                <div key={index} style={{
                  ...styles.featureCard,
                  animationDelay: `${index * 0.1}s`
                }}>
                  <div style={styles.featureIcon}>{feature.icon}</div>
                  <h3 style={styles.featureTitle}>{feature.title}</h3>
                  <p style={styles.featureDesc}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Account Types Showcase */}
      <section style={styles.accountTypesSection} id="account-types" data-animate>
        <div style={styles.container}>
          <div style={{
            ...styles.sectionHeader,
            ...(isVisible['account-types'] ? styles.fadeInUp : {})
          }}>
            <h2 style={styles.sectionTitle}>
              {user ? 'All 23 Account Types We Offer' : 'Featured Banking Accounts'}
            </h2>
            <p style={styles.sectionSubtitle}>
              Find the perfect account for your financial needs
              {!user && (
                <span style={styles.loginPrompt}>
                  <br />
                  <Link href="/login" style={styles.loginLink}>
                    Sign in to view all 23 account types
                  </Link>
                </span>
              )}
            </p>
          </div>
          
          <div style={styles.accountCarousel}>
            <div 
              style={{
                ...styles.accountSlideContainer,
                transform: `translateX(-${currentAccountSlide * 100}%)`
              }}
            >
              {Array.from({ length: Math.ceil(visibleAccountTypes.length / 6) }).map((_, slideIndex) => (
                <div key={slideIndex} style={styles.accountSlide}>
                  <div style={styles.accountGrid}>
                    {visibleAccountTypes.slice(slideIndex * 6, (slideIndex + 1) * 6).map((account, index) => (
                      <div 
                        key={index} 
                        style={{
                          ...styles.accountCard,
                          ...(isVisible['account-types'] ? {
                            ...styles.bounceIn,
                            animationDelay: `${index * 0.1}s`
                          } : {})
                        }}
                      >
                        <div style={styles.accountIcon}>{account.icon}</div>
                        <h3 style={styles.accountName}>{account.name}</h3>
                        <p style={styles.accountRate}>{account.rate}</p>
                        <p style={styles.accountDesc}>{account.desc}</p>
                        {user ? (
                          <Link href="/apply" style={styles.accountButton}>Apply Now</Link>
                        ) : (
                          <Link href="/login" style={styles.accountButtonSecondary}>Sign In to Apply</Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={styles.accountIndicators}>
            {Array.from({ length: Math.ceil(visibleAccountTypes.length / 6) }).map((_, index) => (
              <button
                key={index}
                style={{
                  ...styles.accountIndicator,
                  ...(currentAccountSlide === index ? styles.accountIndicatorActive : {})
                }}
                onClick={() => setCurrentAccountSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Loan Section */}
      <section style={styles.loanSection} id="loan-section" data-animate>
        <div style={styles.container}>
          <div style={{
            ...styles.loanContent,
            ...(isVisible['loan-section'] ? styles.fadeInLeft : {})
          }}>
            <div style={styles.loanImageContainer}>
              <img 
                src="/images/Loan_approval_celebration_banner_919a886f.png" 
                alt="Loan Approval Celebration" 
                style={styles.loanImage}
              />
              <div style={styles.loanImageOverlay}>
                <div style={styles.approvalBadge}>
                  <span style={styles.badgeIcon}>✅</span>
                  <span style={styles.badgeText}>$300K Approved!</span>
                </div>
              </div>
            </div>
            
            <div style={styles.loanInfo}>
              <h2 style={styles.loanTitle}>
                Get Your Loan 
                <span style={styles.highlight}> Approved Fast</span>
              </h2>
              <p style={styles.loanSubtitle}>
                Join thousands of satisfied customers who've achieved their dreams with Oakline Bank's loan programs.
              </p>
              
              <div style={styles.loanStats}>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>$2.5B+</span>
                  <span style={styles.statLabel}>Loans Approved</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>24hrs</span>
                  <span style={styles.statLabel}>Average Approval</span>
                </div>
                <div style={styles.statItem}>
                  <span style={styles.statNumber}>3.5%</span>
                  <span style={styles.statLabel}>Starting APR</span>
                </div>
              </div>
              
              <div style={styles.loanTypes}>
                <div style={styles.loanType}>
                  <span style={styles.loanTypeIcon}>🏠</span>
                  <span>Home Loans</span>
                </div>
                <div style={styles.loanType}>
                  <span style={styles.loanTypeIcon}>🚗</span>
                  <span>Auto Loans</span>
                </div>
                <div style={styles.loanType}>
                  <span style={styles.loanTypeIcon}>👤</span>
                  <span>Personal Loans</span>
                </div>
                <div style={styles.loanType}>
                  <span style={styles.loanTypeIcon}>🏢</span>
                  <span>Business Loans</span>
                </div>
              </div>
              
              {user ? (
                <Link href="/loans" style={styles.loanButton}>
                  Apply for Loan Now
                </Link>
              ) : (
                <Link href="/login" style={styles.loanButtonSecondary}>
                  Sign In to Apply for Loan
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <main>
        <ServicesSection />
        <FeaturesSection />
        <TestimonialsSection />
        
        {/* Enhanced CTA with Animation */}
        <div id="final-cta" data-animate style={{
          ...(isVisible['final-cta'] ? styles.pulse : {})
        }}>
          <CTA
            title="Ready to Start Your Financial Journey?"
            subtitle="Join over 500,000 customers who trust Oakline Bank for their financial needs. Open your account today and experience the difference."
            buttonText="Open Account Now"
            buttonLink="/apply"
            variant="primary"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#ffffff'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #1e3a8a',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    width: '100%',
    overflow: 'hidden'
  },

  // Mobile-First Hero Section
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
  heroImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    transition: 'all 0.8s ease-in-out'
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
    zIndex: 2,
    transition: 'all 0.8s ease-out'
  },
  heroIcon: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    marginBottom: '1rem',
    display: 'block',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
  },
  heroTitle: {
    fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
    fontWeight: '800',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    lineHeight: '1.1',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  heroSubtitle: {
    fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)',
    marginBottom: '2rem',
    opacity: 0.95,
    maxWidth: '600px',
    margin: '0 auto 2rem',
    fontWeight: '300',
    letterSpacing: '0.5px'
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  heroButton: {
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    padding: 'clamp(0.8rem, 2vw, 1.2rem) clamp(1.5rem, 4vw, 2.5rem)',
    borderRadius: '12px',
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    fontWeight: '700',
    boxShadow: '0 8px 20px rgba(5, 150, 105, 0.4)',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transform: 'translateY(0)',
    border: '2px solid transparent'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    padding: 'clamp(0.8rem, 2vw, 1.2rem) clamp(1.5rem, 4vw, 2.5rem)',
    borderRadius: '12px',
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    fontWeight: '700',
    border: '2px solid white',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  buttonIcon: {
    fontSize: '1.2em'
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
    border: '3px solid white',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  indicatorActive: {
    backgroundColor: 'white',
    transform: 'scale(1.3)',
    boxShadow: '0 0 15px rgba(255,255,255,0.6)'
  },

  // Container and Common Styles
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem',
    width: '100%'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: 'clamp(2rem, 5vw, 4rem)',
    transition: 'all 0.6s ease-out'
  },
  sectionTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #059669 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  sectionSubtitle: {
    fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
    color: '#64748b',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6'
  },
  loginPrompt: {
    marginTop: '0.5rem'
  },
  loginLink: {
    color: '#1e3a8a',
    textDecoration: 'underline',
    fontWeight: '600'
  },

  // ATM Section
  atmSection: {
    padding: 'clamp(3rem, 6vw, 6rem) 0',
    backgroundColor: '#f8fafc',
    width: '100%'
  },
  atmGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
    gap: 'clamp(2rem, 4vw, 4rem)',
    alignItems: 'center'
  },
  atmImageContainer: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    transition: 'all 0.8s ease-out'
  },
  atmImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    color: 'white',
    padding: '1.5rem',
    transform: 'translateY(100%)',
    transition: 'transform 0.3s ease'
  },
  overlayTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    marginBottom: '0.5rem'
  },
  overlayDesc: {
    fontSize: '0.9rem',
    opacity: 0.9
  },
  atmFeaturesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1.5rem',
    transition: 'all 0.8s ease-out'
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    border: '1px solid #e2e8f0'
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    display: 'block'
  },
  featureTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  featureDesc: {
    color: '#64748b',
    fontSize: '0.9rem'
  },

  // Account Types Section
  accountTypesSection: {
    padding: 'clamp(3rem, 6vw, 6rem) 0',
    backgroundColor: 'white',
    width: '100%'
  },
  accountCarousel: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '15px'
  },
  accountSlideContainer: {
    display: 'flex',
    transition: 'transform 0.8s ease-in-out',
    width: '100%'
  },
  accountSlide: {
    minWidth: '100%',
    padding: '1.5rem 0'
  },
  accountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
    gap: '1.5rem'
  },
  accountCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
    border: '2px solid #e2e8f0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  accountIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    display: 'block'
  },
  accountName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  accountRate: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#059669',
    marginBottom: '0.5rem'
  },
  accountDesc: {
    color: '#64748b',
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
    lineHeight: '1.4'
  },
  accountButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    textDecoration: 'none',
    padding: '0.7rem 1.3rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },
  accountButtonSecondary: {
    backgroundColor: '#e2e8f0',
    color: '#64748b',
    textDecoration: 'none',
    padding: '0.7rem 1.3rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },
  accountIndicators: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '2rem'
  },
  accountIndicator: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: '2px solid #1e3a8a',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  accountIndicatorActive: {
    backgroundColor: '#1e3a8a',
    transform: 'scale(1.2)'
  },

  // Loan Section
  loanSection: {
    padding: 'clamp(3rem, 6vw, 6rem) 0',
    backgroundColor: '#f8fafc',
    width: '100%'
  },
  loanContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
    gap: 'clamp(2rem, 4vw, 4rem)',
    alignItems: 'center',
    transition: 'all 0.8s ease-out'
  },
  loanImageContainer: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
  },
  loanImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    objectPosition: 'center top'
  },
  loanImageOverlay: {
    position: 'absolute',
    top: '15px',
    right: '15px'
  },
  approvalBadge: {
    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 8px 16px rgba(5, 150, 105, 0.3)',
    fontWeight: '700',
    fontSize: '0.9rem'
  },
  badgeIcon: {
    fontSize: '1rem'
  },
  badgeText: {
    fontSize: '0.9rem'
  },
  loanInfo: {
    padding: '1rem'
  },
  loanTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '1.5rem',
    lineHeight: '1.2'
  },
  highlight: {
    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  loanSubtitle: {
    fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
    color: '#64748b',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  loanStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: '800',
    color: '#1e3a8a',
    display: 'block',
    lineHeight: '1'
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '500',
    marginTop: '0.5rem'
  },
  loanTypes: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  loanType: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    padding: '0.8rem',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1e293b'
  },
  loanTypeIcon: {
    fontSize: '1.3rem'
  },
  loanButton: {
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    padding: 'clamp(0.8rem, 2vw, 1.1rem) clamp(1.5rem, 3vw, 2rem)',
    borderRadius: '10px',
    fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
    fontWeight: '700',
    boxShadow: '0 6px 16px rgba(5, 150, 105, 0.3)',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },
  loanButtonSecondary: {
    backgroundColor: '#e2e8f0',
    color: '#64748b',
    textDecoration: 'none',
    padding: 'clamp(0.8rem, 2vw, 1.1rem) clamp(1.5rem, 3vw, 2rem)',
    borderRadius: '10px',
    fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },

  // Animation Classes
  fadeInUp: {
    animation: 'fadeInUp 0.8s ease-out forwards'
  },
  fadeInDown: {
    animation: 'fadeInDown 0.8s ease-out forwards'
  },
  fadeInLeft: {
    animation: 'fadeInLeft 0.8s ease-out forwards'
  },
  slideInFromLeft: {
    animation: 'slideInFromLeft 1s ease-out forwards'
  },
  slideInFromRight: {
    animation: 'slideInFromRight 1s ease-out forwards'
  },
  bounceIn: {
    animation: 'bounceIn 0.8s ease-out forwards'
  },
  pulse: {
    animation: 'pulse 2s infinite'
  }
};
