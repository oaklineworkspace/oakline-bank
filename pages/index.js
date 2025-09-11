
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


export default function Home() {
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentAccountSlide, setCurrentAccountSlide] = useState(0);
  const [currentFeatureSlide, setCurrentFeatureSlide] = useState(0);
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
    }, 4000);

    // Auto-slide for account types
    const accountInterval = setInterval(() => {
      setCurrentAccountSlide(prev => (prev + 1) % Math.ceil(accountTypes.length / 6));
    }, 6000);

    // Auto-slide for feature showcase
    const featureInterval = setInterval(() => {
      setCurrentFeatureSlide(prev => (prev + 1) % bankingFeatures.length);
    }, 5000);

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
      clearInterval(featureInterval);
      observer.disconnect();
    };
  }, []);

  const bankingImages = [
    {
      src: '/images/handshake_business_deal.png',
      title: 'Professional Banking Partnership',
      subtitle: 'Building trust through personalized financial solutions',
      icon: '🤝'
    },
    {
      src: '/images/atm_withdrawal_transaction.png',
      title: 'Convenient ATM Access',
      subtitle: 'Withdraw cash securely from our nationwide network',
      icon: '🏧'
    },
    {
      src: '/images/Bank_hall_business_discussion_72f98bbe.png',
      title: 'Expert Financial Consultation',
      subtitle: 'Professional advice from certified banking specialists',
      icon: '💼'
    },
    {
      src: '/images/Modern_bank_lobby_interior_d535acc7.png',
      title: 'Modern Banking Facilities',
      subtitle: 'Experience banking in our state-of-the-art branches',
      icon: '🏦'
    },
    {
      src: '/images/Digital_investment_dashboard_36d35f19.png',
      title: 'Digital Investment Platform',
      subtitle: 'Manage your investments with cutting-edge technology',
      icon: '📊'
    },
    {
      src: '/images/Mobile_banking_user_experience_576bb7a3.png',
      title: 'Mobile Banking Excellence',
      subtitle: 'Bank anywhere with our award-winning mobile app',
      icon: '📱'
    },
    {
      src: '/images/atm_machine_people.png',
      title: 'ATM Network Access',
      subtitle: 'Access your money 24/7 at thousands of locations nationwide',
      icon: '🏧'
    },
    {
      src: '/images/mobile_banking_app.png',
      title: 'Oakline Mobile App',
      subtitle: 'Complete banking control right in your pocket',
      icon: '📲'
    }
  ];

  const bankingFeatures = [
    {
      image: '/images/handshake_business_deal.png',
      title: 'Trusted Partnerships',
      description: 'Building lasting relationships with our valued customers through transparent and reliable banking services.',
      features: ['Personalized Service', 'Dedicated Relationship Manager', 'Priority Customer Support', '24/7 Banking Assistance']
    },
    {
      image: '/images/atm_withdrawal_transaction.png',
      title: 'Convenient Banking',
      description: 'Access your money anytime, anywhere with our extensive ATM network and mobile banking solutions.',
      features: ['5,000+ ATMs Nationwide', 'Mobile Check Deposit', 'Contactless Payments', 'Real-time Notifications']
    },
    {
      image: '/images/Modern_bank_lobby_interior_d535acc7.png',
      title: 'Premium Banking Experience',
      description: 'Visit our modern branches for a comfortable and efficient banking experience with expert staff.',
      features: ['Private Banking Suites', 'Express Service Counters', 'Digital Self-Service Kiosks', 'Comfortable Waiting Areas']
    },
    {
      image: '/images/Digital_investment_dashboard_36d35f19.png',
      title: 'Smart Investments',
      description: 'Grow your wealth with our comprehensive investment platform and professional financial advisors.',
      features: ['Portfolio Management', 'Market Research Tools', 'Risk Assessment', 'Retirement Planning']
    }
  ];

  const accountTypes = [
    { name: 'Premium Checking', icon: '💎', rate: '0.25% APY', desc: 'Luxury banking with exclusive perks', featured: true },
    { name: 'High-Yield Savings', icon: '⭐', rate: '5.00% APY', desc: 'Maximum earning potential', featured: true },
    { name: 'Business Checking', icon: '🏢', rate: '0.15% APY', desc: 'Professional banking for businesses', featured: true },
    { name: 'Investment Account', icon: '📈', rate: 'Variable', desc: 'Trade stocks, bonds, and ETFs', featured: true },
    { name: 'Money Market', icon: '💰', rate: '4.75% APY', desc: 'Premium savings with higher yields', featured: true },
    { name: 'Certificate of Deposit', icon: '🔒', rate: '5.25% APY', desc: 'Secure fixed-rate investments', featured: true },
    { name: 'Student Account', icon: '🎓', rate: '2.50% APY', desc: 'No-fee banking for students', featured: false },
    { name: 'Retirement IRA', icon: '🏖️', rate: '4.80% APY', desc: 'Plan for your golden years', featured: false },
    { name: 'Joint Account', icon: '👫', rate: '0.50% APY', desc: 'Shared banking for couples', featured: false },
    { name: 'Trust Account', icon: '🛡️', rate: '3.50% APY', desc: 'Manage assets for beneficiaries', featured: false },
    { name: 'Teen Account', icon: '👦', rate: '2.00% APY', desc: 'Financial education for teens', featured: false },
    { name: 'Senior Account', icon: '👴', rate: '4.00% APY', desc: 'Special benefits for seniors', featured: false },
    { name: 'Health Savings', icon: '🏥', rate: '3.75% APY', desc: 'Tax-advantaged health savings', featured: false },
    { name: 'International Account', icon: '🌍', rate: '3.25% APY', desc: 'Global banking solutions', featured: false },
    { name: 'Cryptocurrency Account', icon: '₿', rate: 'Variable', desc: 'Digital asset management', featured: user ? true : false },
    { name: 'Green Investment', icon: '🌱', rate: '6.00% APY', desc: 'Sustainable investing options', featured: user ? true : false },
    { name: 'Real Estate Investment', icon: '🏠', rate: '7.50% APY', desc: 'Property investment trusts', featured: user ? true : false },
    { name: 'Education Savings', icon: '📚', rate: '4.25% APY', desc: 'Tax-free education savings', featured: false },
    { name: 'Emergency Fund', icon: '🚨', rate: '4.10% APY', desc: 'Quick access emergency savings', featured: false },
    { name: 'Small Business', icon: '🏪', rate: '3.80% APY', desc: 'Banking solutions for small business', featured: false },
    { name: 'Corporate Banking', icon: '🏭', rate: '4.20% APY', desc: 'Enterprise banking solutions', featured: false },
    { name: 'Private Banking', icon: '💎', rate: '5.50% APY', desc: 'Exclusive high-net-worth services', featured: user ? true : false },
    { name: 'Wealth Management', icon: '👑', rate: '6.75% APY', desc: 'Comprehensive wealth solutions', featured: user ? true : false }
  ];

  // Show different account types based on authentication
  const visibleAccountTypes = user ? accountTypes : accountTypes.filter(account => account.featured);

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your banking experience...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <MainMenu user={user} />
      <WelcomeBanner />
      
      {/* Enhanced Mobile-First Hero Section */}
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
            ...(isVisible.hero ? styles.slideInFromBottom : {})
          }}>
            <div style={styles.heroIcon}>{bankingImages[currentSlide].icon}</div>
            <h1 style={styles.heroTitle}>{bankingImages[currentSlide].title}</h1>
            <p style={styles.heroSubtitle}>{bankingImages[currentSlide].subtitle}</p>
            <div style={styles.heroButtons}>
              <Link href="/apply" style={styles.heroButton}>
                <span style={styles.buttonIcon}>🚀</span>
                Start Banking Today
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

      {/* Banking Features Showcase */}
      <section style={styles.featuresShowcase} id="features-showcase" data-animate>
        <div style={styles.container}>
          <div style={{
            ...styles.sectionHeader,
            ...(isVisible['features-showcase'] ? styles.fadeInUp : {})
          }}>
            <h2 style={styles.sectionTitle}>Why Choose Oakline Bank</h2>
            <p style={styles.sectionSubtitle}>Discover the features that make us your trusted financial partner</p>
          </div>
          
          <div style={styles.featureShowcaseContainer}>
            <div style={styles.featureContent}>
              <div style={{
                ...styles.featureImageContainer,
                ...(isVisible['features-showcase'] ? styles.slideInFromLeft : {})
              }}>
                <img 
                  src={bankingFeatures[currentFeatureSlide].image} 
                  alt={bankingFeatures[currentFeatureSlide].title}
                  style={styles.featureImage}
                />
                <div style={styles.featureImageOverlay}>
                  <div style={styles.featureBadge}>
                    <span>✨ Featured Service</span>
                  </div>
                </div>
              </div>
              
              <div style={{
                ...styles.featureInfo,
                ...(isVisible['features-showcase'] ? styles.slideInFromRight : {})
              }}>
                <h3 style={styles.featureTitle}>{bankingFeatures[currentFeatureSlide].title}</h3>
                <p style={styles.featureDescription}>{bankingFeatures[currentFeatureSlide].description}</p>
                
                <div style={styles.featuresList}>
                  {bankingFeatures[currentFeatureSlide].features.map((feature, index) => (
                    <div key={index} style={styles.featureItem}>
                      <span style={styles.featureIcon}>✓</span>
                      <span style={styles.featureText}>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link href="/apply" style={styles.featureButton}>
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          
          <div style={styles.featureIndicators}>
            {bankingFeatures.map((_, index) => (
              <button
                key={index}
                style={{
                  ...styles.featureIndicator,
                  ...(currentFeatureSlide === index ? styles.featureIndicatorActive : {})
                }}
                onClick={() => setCurrentFeatureSlide(index)}
              />
            ))}
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
                alt="Loan Approval Success" 
                style={styles.loanImage}
              />
              <div style={styles.loanImageOverlay}>
                <div style={styles.approvalBadge}>
                  <span style={styles.badgeIcon}>✅</span>
                  <span style={styles.badgeText}>Approved in 24hrs!</span>
                </div>
              </div>
            </div>
            
            <div style={styles.loanInfo}>
              <h2 style={styles.loanTitle}>
                Get Your Loan 
                <span style={styles.highlight}> Approved Fast</span>
              </h2>
              <p style={styles.loanSubtitle}>
                Join thousands of satisfied customers who've achieved their dreams with Oakline Bank's comprehensive loan programs.
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
                  <span style={styles.statNumber}>3.2%</span>
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
        
        {/* Account Types Discovery Section */}
      <section style={styles.accountTypesDiscovery} id="account-types-discovery" data-animate>
        <div style={styles.container}>
          <div style={{
            ...styles.sectionHeader,
            ...(isVisible['account-types-discovery'] ? styles.fadeInUp : {})
          }}>
            <h2 style={styles.sectionTitle}>Explore All Our Account Types</h2>
            <p style={styles.sectionSubtitle}>
              Discover detailed information about all 23 account types we offer. 
              Find comprehensive features, benefits, and eligibility requirements for each account.
            </p>
          </div>
          
          <div style={styles.accountTypesPreview}>
            <div style={styles.previewCard}>
              <span style={styles.previewIcon}>💳</span>
              <h3 style={styles.previewTitle}>Personal Banking</h3>
              <p style={styles.previewDesc}>Checking, Savings, Student, Senior accounts and more</p>
            </div>
            <div style={styles.previewCard}>
              <span style={styles.previewIcon}>🏢</span>
              <h3 style={styles.previewTitle}>Business Banking</h3>
              <p style={styles.previewDesc}>Small Business, Corporate, and Professional accounts</p>
            </div>
            <div style={styles.previewCard}>
              <span style={styles.previewIcon}>📈</span>
              <h3 style={styles.previewTitle}>Investment Accounts</h3>
              <p style={styles.previewDesc}>Retirement, Investment, and Wealth Management options</p>
            </div>
            <div style={styles.previewCard}>
              <span style={styles.previewIcon}>🎯</span>
              <h3 style={styles.previewTitle}>Specialized Accounts</h3>
              <p style={styles.previewDesc}>HSA, Education, Trust, and International accounts</p>
            </div>
          </div>
          
          <div style={styles.accountTypesAction}>
            <Link href="/account-types" style={styles.exploreButton}>
              <span style={styles.buttonIcon}>🔍</span>
              Explore All 23 Account Types
            </Link>
            <p style={styles.actionNote}>
              Get detailed comparisons, features, and eligibility requirements
            </p>
          </div>
        </div>
      </section>

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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '6px solid rgba(255,255,255,0.2)',
    borderTop: '6px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  loadingText: {
    fontSize: '1.2rem',
    fontWeight: '500',
    opacity: 0.9
  },
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    width: '100%',
    overflow: 'hidden'
  },

  // Mobile-First Hero Section
  heroSection: {
    position: 'relative',
    height: '60vh',
    minHeight: '400px',
    maxHeight: '500px',
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
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(99, 102, 241, 0.7) 100%)'
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
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    marginBottom: '0.8rem',
    display: 'block',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
  },
  heroTitle: {
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    fontWeight: '800',
    marginBottom: '0.8rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    lineHeight: '1.1'
  },
  heroSubtitle: {
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    marginBottom: '1.5rem',
    opacity: 0.95,
    maxWidth: '500px',
    margin: '0 auto 1.5rem',
    fontWeight: '300'
  },
  heroButtons: {
    display: 'flex',
    gap: '0.8rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  heroButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    textDecoration: 'none',
    padding: 'clamp(0.7rem, 1.5vw, 1rem) clamp(1.2rem, 3vw, 2rem)',
    borderRadius: '10px',
    fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
    fontWeight: '700',
    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    border: '2px solid transparent'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    padding: 'clamp(0.7rem, 1.5vw, 1rem) clamp(1.2rem, 3vw, 2rem)',
    borderRadius: '10px',
    fontSize: 'clamp(0.85rem, 1.8vw, 1rem)',
    fontWeight: '700',
    border: '2px solid white',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  buttonIcon: {
    fontSize: '1.1em'
  },
  slideIndicators: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '10px',
    zIndex: 3
  },
  indicator: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: '2px solid white',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  indicatorActive: {
    backgroundColor: 'white',
    transform: 'scale(1.2)',
    boxShadow: '0 0 12px rgba(255,255,255,0.6)'
  },

  // Features Showcase Section
  featuresShowcase: {
    padding: 'clamp(2.5rem, 5vw, 4rem) 0',
    backgroundColor: 'white',
    width: '100%'
  },
  featureShowcaseContainer: {
    marginBottom: '2rem'
  },
  featureContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
    gap: 'clamp(1.5rem, 3vw, 3rem)',
    alignItems: 'center'
  },
  featureImageContainer: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
    transition: 'all 0.8s ease-out'
  },
  featureImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  featureImageOverlay: {
    position: 'absolute',
    top: '15px',
    right: '15px'
  },
  featureBadge: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  },
  featureInfo: {
    padding: '1rem',
    transition: 'all 0.8s ease-out'
  },
  featureTitle: {
    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  featureDescription: {
    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
    color: '#64748b',
    marginBottom: '1.5rem',
    lineHeight: '1.6'
  },
  featuresList: {
    marginBottom: '2rem'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '0.8rem',
    fontSize: '0.95rem',
    color: '#374151'
  },
  featureIcon: {
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  featureText: {
    fontWeight: '500'
  },
  featureButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    textDecoration: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  },
  featureIndicators: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '2rem'
  },
  featureIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: '2px solid #3b82f6',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  featureIndicatorActive: {
    backgroundColor: '#3b82f6',
    transform: 'scale(1.3)'
  },

  // Container and Common Styles
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    width: '100%'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: 'clamp(1.5rem, 4vw, 3rem)',
    transition: 'all 0.6s ease-out'
  },
  sectionTitle: {
    fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '0.8rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  sectionSubtitle: {
    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
    color: '#64748b',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: '1.6'
  },
  loginPrompt: {
    marginTop: '0.5rem'
  },
  loginLink: {
    color: '#3b82f6',
    textDecoration: 'underline',
    fontWeight: '600'
  },

  // Account Types Section
  accountTypesSection: {
    padding: 'clamp(2.5rem, 5vw, 4rem) 0',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    width: '100%'
  },
  accountCarousel: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '12px'
  },
  accountSlideContainer: {
    display: 'flex',
    transition: 'transform 0.8s ease-in-out',
    width: '100%'
  },
  accountSlide: {
    minWidth: '100%',
    padding: '1rem 0'
  },
  accountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
    gap: '1.2rem'
  },
  accountCard: {
    backgroundColor: 'white',
    padding: '1.2rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
    border: '2px solid #e2e8f0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  accountIcon: {
    fontSize: '2rem',
    marginBottom: '0.8rem',
    display: 'block'
  },
  accountName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.4rem'
  },
  accountRate: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#10b981',
    marginBottom: '0.4rem'
  },
  accountDesc: {
    color: '#64748b',
    fontSize: '0.8rem',
    marginBottom: '1rem',
    lineHeight: '1.4'
  },
  accountButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    textDecoration: 'none',
    padding: '0.6rem 1.1rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },
  accountButtonSecondary: {
    backgroundColor: '#e2e8f0',
    color: '#64748b',
    textDecoration: 'none',
    padding: '0.6rem 1.1rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },
  accountIndicators: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '1.5rem'
  },
  accountIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    border: '2px solid #3b82f6',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  accountIndicatorActive: {
    backgroundColor: '#3b82f6',
    transform: 'scale(1.2)'
  },

  // Loan Section
  loanSection: {
    padding: 'clamp(2.5rem, 5vw, 4rem) 0',
    backgroundColor: 'white',
    width: '100%'
  },
  loanContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
    gap: 'clamp(1.5rem, 3vw, 3rem)',
    alignItems: 'center',
    transition: 'all 0.8s ease-out'
  },
  loanImageContainer: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
  },
  loanImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    objectPosition: 'center'
  },
  loanImageOverlay: {
    position: 'absolute',
    top: '15px',
    right: '15px'
  },
  approvalBadge: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 6px 12px rgba(16, 185, 129, 0.3)',
    fontWeight: '700',
    fontSize: '0.85rem'
  },
  badgeIcon: {
    fontSize: '0.9rem'
  },
  badgeText: {
    fontSize: '0.85rem'
  },
  loanInfo: {
    padding: '1rem'
  },
  loanTitle: {
    fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '1rem',
    lineHeight: '1.2'
  },
  highlight: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  loanSubtitle: {
    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
    color: '#64748b',
    marginBottom: '1.5rem',
    lineHeight: '1.6'
  },
  loanStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
    fontWeight: '800',
    color: '#3b82f6',
    display: 'block',
    lineHeight: '1'
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '500',
    marginTop: '0.3rem'
  },
  loanTypes: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '0.8rem',
    marginBottom: '1.5rem'
  },
  loanType: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.6rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    boxShadow: '0 3px 8px rgba(0,0,0,0.04)',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#1e293b'
  },
  loanTypeIcon: {
    fontSize: '1.1rem'
  },
  loanButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    textDecoration: 'none',
    padding: 'clamp(0.7rem, 1.8vw, 1rem) clamp(1.2rem, 2.5vw, 1.8rem)',
    borderRadius: '8px',
    fontSize: 'clamp(0.85rem, 1.6vw, 1rem)',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },
  loanButtonSecondary: {
    backgroundColor: '#e2e8f0',
    color: '#64748b',
    textDecoration: 'none',
    padding: 'clamp(0.7rem, 1.8vw, 1rem) clamp(1.2rem, 2.5vw, 1.8rem)',
    borderRadius: '8px',
    fontSize: 'clamp(0.85rem, 1.6vw, 1rem)',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },

  // Animation Classes
  fadeInUp: {
    animation: 'fadeInUp 0.8s ease-out forwards'
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
  slideInFromBottom: {
    animation: 'slideInFromBottom 1s ease-out forwards'
  },
  bounceIn: {
    animation: 'bounceIn 0.8s ease-out forwards'
  },
  pulse: {
    animation: 'pulse 2s infinite'
  },

  // Account Types Discovery Section
  accountTypesDiscovery: {
    padding: 'clamp(2.5rem, 5vw, 4rem) 0',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    width: '100%'
  },
  accountTypesPreview: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  previewCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
    border: '2px solid #e2e8f0',
    transition: 'all 0.3s ease'
  },
  previewIcon: {
    fontSize: '2.5rem',
    display: 'block',
    marginBottom: '1rem'
  },
  previewTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.75rem'
  },
  previewDesc: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: '1.5'
  },
  accountTypesAction: {
    textAlign: 'center'
  },
  exploreButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: 'clamp(0.8rem, 2vw, 1.2rem) clamp(1.5rem, 3vw, 2.5rem)',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    fontWeight: '700',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.3s ease',
    marginBottom: '1rem'
  },
  actionNote: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontStyle: 'italic'
  }
};
