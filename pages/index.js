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
  const [currentFeatureSlide, setCurrentFeatureSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

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

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.navigationDropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    const cleanup = () => {
      document.removeEventListener('click', handleClickOutside);
    };

    // Auto-slide for hero images
    const heroInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bankingImages.length);
    }, 5000);

    // Auto-slide for account types
    const accountInterval = setInterval(() => {
      setCurrentAccountSlide(prev => (prev + 1) % Math.ceil(visibleAccountTypes.length / 6));
    }, 7000);

    // Auto-slide for feature showcase
    const featureInterval = setInterval(() => {
      setCurrentFeatureSlide(prev => (prev + 1) % bankingFeatures.length);
    }, 6000);

    // Enhanced Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe all animated elements
    setTimeout(() => {
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      subscription?.unsubscribe();
      clearInterval(heroInterval);
      clearInterval(accountInterval);
      clearInterval(featureInterval);
      observer.disconnect();
      cleanup();
    };
  }, []);

  const bankingImages = [
    {
      src: '/images/atm_machine_people.png',
      title: 'Convenient ATM Network Access',
      subtitle: 'Access your money 24/7 at thousands of locations nationwide with zero fees',
      icon: '🏧',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      src: '/images/mobile_banking_app.png',
      title: 'Oakline Mobile Banking',
      subtitle: 'Complete banking control right in your pocket with our award-winning app',
      icon: '📱',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      src: '/images/handshake_business_deal.png',
      title: 'Professional Banking Partnership',
      subtitle: 'Building trust through personalized financial solutions and expert guidance',
      icon: '🤝',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      src: '/images/atm_withdrawal_transaction.png',
      title: 'Secure Transaction Processing',
      subtitle: 'Bank with confidence using our advanced security and fraud protection',
      icon: '🔒',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      src: '/images/Bank_hall_business_discussion_72f98bbe.png',
      title: 'Expert Financial Consultation',
      subtitle: 'Professional advice from certified banking specialists in our modern branches',
      icon: '💼',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      src: '/images/Modern_bank_lobby_interior_d535acc7.png',
      title: 'Modern Banking Facilities',
      subtitle: 'Experience premium banking in our state-of-the-art branch locations',
      icon: '🏦',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      src: '/images/Digital_investment_dashboard_36d35f19.png',
      title: 'Advanced Investment Platform',
      subtitle: 'Grow your wealth with cutting-edge investment tools and real-time analytics',
      icon: '📊',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    },
    {
      src: '/images/Mobile_banking_user_experience_576bb7a3.png',
      title: 'Seamless Digital Experience',
      subtitle: 'Enjoy intuitive banking with our user-friendly mobile and web platforms',
      icon: '⚡',
      gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
    }
  ];

  const bankingFeatures = [
    {
      image: '/images/atm_machine_people.png',
      title: 'Nationwide ATM Access',
      description: 'Access your money at over 55,000 ATMs across the country with no fees. Our extensive network ensures you\'re never far from your money.',
      features: ['55,000+ Fee-Free ATMs', 'International ATM Access', 'Mobile ATM Locator', '24/7 Cash Availability'],
      icon: '🏧',
      color: '#3b82f6'
    },
    {
      image: '/images/mobile_banking_app.png',
      title: 'Award-Winning Mobile App',
      description: 'Experience banking reimagined with our state-of-the-art mobile application. Manage all your finances with ease.',
      features: ['Mobile Check Deposit', 'Instant Transfers', 'Bill Pay & Scheduling', 'Real-time Notifications'],
      icon: '📱',
      color: '#10b981'
    },
    {
      image: '/images/handshake_business_deal.png',
      title: 'Personal Banking Relationships',
      description: 'Build lasting financial partnerships with dedicated relationship managers who understand your unique needs.',
      features: ['Dedicated Relationship Manager', 'Personalized Financial Planning', 'Priority Customer Support', 'Exclusive Banking Benefits'],
      icon: '🤝',
      color: '#f59e0b'
    },
    {
      image: '/images/Digital_investment_dashboard_36d35f19.png',
      title: 'Investment & Wealth Management',
      description: 'Grow your wealth with professional investment management and comprehensive financial planning services.',
      features: ['Professional Portfolio Management', 'Market Research & Analytics', 'Retirement Planning', 'Tax-Advantaged Accounts'],
      icon: '📈',
      color: '#8b5cf6'
    }
  ];

  const accountTypes = [
    { name: 'Premium Checking', icon: '💎', rate: '0.25% APY', desc: 'Luxury banking with exclusive perks and premium benefits', featured: true, benefits: 'Free checks, premium debit card, concierge service' },
    { name: 'High-Yield Savings', icon: '⭐', rate: '5.00% APY', desc: 'Maximum earning potential with competitive rates', featured: true, benefits: 'No minimum balance, compound interest, mobile banking' },
    { name: 'Business Checking', icon: '🏢', rate: '0.15% APY', desc: 'Professional banking solutions for growing businesses', featured: true, benefits: 'Free business banking, merchant services, payroll integration' },
    { name: 'Investment Account', icon: '📈', rate: 'Variable', desc: 'Trade stocks, bonds, ETFs, and mutual funds', featured: true, benefits: 'Commission-free trades, research tools, advisory services' },
    { name: 'Money Market', icon: '💰', rate: '4.75% APY', desc: 'Premium savings with higher yields and flexibility', featured: true, benefits: 'Tiered interest rates, check writing, debit card access' },
    { name: 'Certificate of Deposit', icon: '🔒', rate: '5.25% APY', desc: 'Secure fixed-rate investments with guaranteed returns', featured: true, benefits: 'FDIC insured, fixed rates, flexible terms' },
    { name: 'Student Account', icon: '🎓', rate: '2.50% APY', desc: 'No-fee banking designed for students', featured: false, benefits: 'No monthly fees, overdraft protection, financial education' },
    { name: 'Retirement IRA', icon: '🏖️', rate: '4.80% APY', desc: 'Plan for your golden years with tax advantages', featured: false, benefits: 'Traditional & Roth options, tax benefits, retirement planning' },
    { name: 'Joint Account', icon: '👫', rate: '0.50% APY', desc: 'Shared banking solutions for couples and families', featured: false, benefits: 'Dual access, shared goals, family financial planning' },
    { name: 'Trust Account', icon: '🛡️', rate: '3.50% APY', desc: 'Manage assets for beneficiaries with professional oversight', featured: false, benefits: 'Estate planning, fiduciary services, beneficiary management' },
    { name: 'Teen Account', icon: '👦', rate: '2.00% APY', desc: 'Financial education and independence for teens', featured: false, benefits: 'Parental controls, spending alerts, financial literacy tools' },
    { name: 'Senior Account', icon: '👴', rate: '4.00% APY', desc: 'Special benefits and services for seniors 65+', featured: false, benefits: 'Senior discounts, health savings options, estate planning' },
    { name: 'Health Savings', icon: '🏥', rate: '3.75% APY', desc: 'Tax-advantaged savings for medical expenses', featured: false, benefits: 'Triple tax advantage, investment options, no expiration' },
    { name: 'International Account', icon: '🌍', rate: '3.25% APY', desc: 'Global banking solutions for international needs', featured: false, benefits: 'Multi-currency support, international transfers, global ATM access' },
    { name: 'Cryptocurrency Account', icon: '₿', rate: 'Variable', desc: 'Secure digital asset management and trading', featured: user ? true : false, benefits: 'Multiple cryptocurrencies, secure storage, trading platform' },
    { name: 'Green Investment', icon: '🌱', rate: '6.00% APY', desc: 'Sustainable investing for environmental impact', featured: user ? true : false, benefits: 'ESG investments, impact reporting, sustainable returns' },
    { name: 'Real Estate Investment', icon: '🏠', rate: '7.50% APY', desc: 'Property investment trusts and real estate funds', featured: user ? true : false, benefits: 'REIT investments, property exposure, professional management' },
    { name: 'Education Savings', icon: '📚', rate: '4.25% APY', desc: 'Tax-free education savings for future learning', featured: false, benefits: '529 plan benefits, tax-free growth, educational flexibility' },
    { name: 'Emergency Fund', icon: '🚨', rate: '4.10% APY', desc: 'Quick access emergency savings with high yields', featured: false, benefits: 'Instant access, high yield, automatic savings tools' },
    { name: 'Small Business', icon: '🏪', rate: '3.80% APY', desc: 'Comprehensive banking solutions for small businesses', featured: false, benefits: 'Business loans, merchant services, accounting integration' },
    { name: 'Corporate Banking', icon: '🏭', rate: '4.20% APY', desc: 'Enterprise banking solutions for large organizations', featured: false, benefits: 'Treasury management, commercial lending, cash management' },
    { name: 'Private Banking', icon: '💎', rate: '5.50% APY', desc: 'Exclusive high-net-worth banking services', featured: user ? true : false, benefits: 'Private banker, exclusive rates, luxury services' },
    { name: 'Wealth Management', icon: '👑', rate: '6.75% APY', desc: 'Comprehensive wealth solutions for affluent clients', featured: user ? true : false, benefits: 'Investment advisory, estate planning, tax optimization' }
  ];

  // Show different account types based on authentication
  const visibleAccountTypes = user ? accountTypes : accountTypes.filter(account => account.featured);

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>
          <div style={styles.spinner}></div>
          <div style={styles.loadingContent}>
            <h2 style={styles.loadingTitle}>Welcome to Oakline Bank</h2>
            <p style={styles.loadingText}>Loading your premium banking experience...</p>
            <div style={styles.loadingProgress}>
              <div style={styles.progressBar}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Single Clean Header */}
      <header style={styles.mainHeader}>
        <div style={styles.headerContainer}>
          <Link href="/" style={styles.logoSection}>
            <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.headerLogo} />
            <div style={styles.brandSection}>
              <span style={styles.bankName}>Oakline Bank</span>
              <span style={styles.bankTagline}>Your Financial Partner</span>
            </div>
          </Link>

          <div style={styles.headerCenter}>
            <span style={styles.routingInfo}>Routing: 075915826</span>
            <span style={styles.phoneInfo}>📞 1-800-OAKLINE</span>
          </div>

          <div style={styles.headerActions}>
            <div style={styles.navigationDropdown} className="navigationDropdown">
              <button 
                style={styles.dropdownButton}
                onClick={() => setActiveDropdown(activeDropdown === 'nav' ? null : 'nav')}
              >
                <span style={styles.menuIcon}>☰</span>
                Menu
                <span style={styles.dropdownArrow}>▼</span>
              </button>

              {activeDropdown === 'nav' && (
                <div style={styles.dropdownMenu}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownSectionTitle}>Banking</h4>
                    <Link href="/account-types" style={styles.dropdownItem}>All Account Types</Link>
                    <Link href="/loans" style={styles.dropdownItem}>Loans & Credit</Link>
                    <Link href="/cards" style={styles.dropdownItem}>Credit Cards</Link>
                    <Link href="/investments" style={styles.dropdownItem}>Investments</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownSectionTitle}>Services</h4>
                    <Link href="/transfer" style={styles.dropdownItem}>Money Transfer</Link>
                    <Link href="/bill-pay" style={styles.dropdownItem}>Bill Pay</Link>
                    <Link href="/crypto" style={styles.dropdownItem}>Cryptocurrency</Link>
                    <Link href="/financial-advisory" style={styles.dropdownItem}>Financial Advisory</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownSectionTitle}>Support</h4>
                    <Link href="/support" style={styles.dropdownItem}>Customer Support</Link>
                    <Link href="/faq" style={styles.dropdownItem}>FAQ</Link>
                    <Link href="/security" style={styles.dropdownItem}>Security Center</Link>
                    <Link href="/about" style={styles.dropdownItem}>About Us</Link>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.authButtons}>
              {user ? (
                <>
                  <Link href="/dashboard" style={styles.dashboardButton}>
                    <span style={styles.buttonIcon}>📊</span>
                    Dashboard
                  </Link>
                  <Link href="/main-menu" style={styles.menuButton}>
                    <span style={styles.buttonIcon}>☰</span>
                    Menu
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" style={styles.loginButton}>Sign In</Link>
                  <Link href="/apply" style={styles.applyButton}>Open Account</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile-First Hero Section with Parallax Effect */}
      <section style={styles.heroSection} id="hero" data-animate>
        <div style={styles.heroParallax}>
          <div style={styles.heroSlide}>
            <div style={styles.heroImageContainer}>
              <img 
                src={bankingImages[currentSlide].src} 
                alt={bankingImages[currentSlide].title}
                style={styles.heroImage}
              />
              <div style={{
                ...styles.heroOverlay,
                background: bankingImages[currentSlide].gradient
              }}></div>
            </div>
            <div style={{
              ...styles.heroContent,
              ...(isVisible.hero ? styles.heroAnimated : {})
            }}>
              <div style={styles.heroIconContainer}>
                <div style={styles.heroIcon}>{bankingImages[currentSlide].icon}</div>
              </div>
              <h1 style={styles.heroTitle}>{bankingImages[currentSlide].title}</h1>
              <p style={styles.heroSubtitle}>{bankingImages[currentSlide].subtitle}</p>

              {/* Bank Routing Number Display */}
              <div style={styles.routingNumberCard}>
                <div style={styles.routingLabel}>Oakline Bank Routing Number</div>
                <div style={styles.routingNumber}>075915826</div>
                <div style={styles.routingNote}>Use this for wire transfers, direct deposits, and ACH transactions</div>
              </div>

              <div style={styles.heroButtons}>
                {user ? (
                  <>
                    <Link href="/dashboard" style={styles.heroButton}>
                      <span style={styles.buttonIcon}>📊</span>
                      Go to Dashboard
                    </Link>
                    <Link href="/account-types" style={styles.secondaryButton}>
                      <span style={styles.buttonIcon}>🔍</span>
                      Explore All Accounts
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/apply" style={styles.heroButton}>
                      <span style={styles.buttonIcon}>🚀</span>
                      Start Banking Today
                    </Link>
                    <Link href="/login" style={styles.secondaryButton}>
                      <span style={styles.buttonIcon}>👤</span>
                      Sign In
                    </Link>
                  </>
                )}
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
        </div>
      </section>

      {/* Enhanced Banking Features Showcase with Advanced Animations */}
      <section style={styles.featuresShowcase} id="features-showcase" data-animate>
        <div style={styles.container}>
          <div style={{
            ...styles.sectionHeader,
            ...(isVisible['features-showcase'] ? styles.staggeredFadeIn : {})
          }}>
            <h2 style={styles.sectionTitle}>Why Choose Oakline Bank</h2>
            <p style={styles.sectionSubtitle}>
              Discover the premium features that make us your trusted financial partner
            </p>
            <div style={styles.titleUnderline}></div>
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
                  <div style={{
                    ...styles.featureBadge,
                    backgroundColor: bankingFeatures[currentFeatureSlide].color
                  }}>
                    <span style={styles.badgeIcon}>{bankingFeatures[currentFeatureSlide].icon}</span>
                    <span>Premium Service</span>
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
                    <div key={index} style={{
                      ...styles.featureItem,
                      ...(isVisible['features-showcase'] ? {
                        ...styles.bounceInLeft,
                        animationDelay: `${index * 0.1}s`
                      } : {})
                    }}>
                      <span style={{
                        ...styles.featureIcon,
                        backgroundColor: bankingFeatures[currentFeatureSlide].color
                      }}>✓</span>
                      <span style={styles.featureText}>{feature}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.featureActions}>
                  {user ? (
                    <Link href="/dashboard" style={{
                      ...styles.featureButton,
                      backgroundColor: bankingFeatures[currentFeatureSlide].color
                    }}>
                      Access Now
                    </Link>
                  ) : (
                    <Link href="/apply" style={{
                      ...styles.featureButton,
                      backgroundColor: bankingFeatures[currentFeatureSlide].color
                    }}>
                      Get Started
                    </Link>
                  )}
                  <Link href="/account-types" style={styles.featureButtonSecondary}>
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.featureIndicators}>
            {bankingFeatures.map((_, index) => (
              <button
                key={index}
                style={{
                  ...styles.featureIndicator,
                  ...(currentFeatureSlide === index ? {
                    ...styles.featureIndicatorActive,
                    backgroundColor: bankingFeatures[currentFeatureSlide].color
                  } : {})
                }}
                onClick={() => setCurrentFeatureSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Account Types Section with User-Specific Content */}
      <section style={styles.accountTypesSection} id="account-types" data-animate>
        <div style={styles.container}>
          <div style={{
            ...styles.sectionHeader,
            ...(isVisible['account-types'] ? styles.zoomIn : {})
          }}>
            <h2 style={styles.sectionTitle}>
              {user ? 'All 23 Account Types Available to You' : 'Featured Banking Accounts'}
            </h2>
            <p style={styles.sectionSubtitle}>
              Find the perfect account for your financial needs and goals
              {!user && (
                <span style={styles.loginPrompt}>
                  <br />
                  <Link href="/login" style={styles.loginLink}>
                    🔓 Sign in to unlock all 23 premium account types
                  </Link>
                </span>
              )}
            </p>
            <div style={styles.titleUnderline}></div>
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
                            ...styles.flipInY,
                            animationDelay: `${index * 0.1}s`
                          } : {})
                        }}
                      >
                        <div style={styles.accountCardInner}>
                          <div style={styles.accountIcon}>{account.icon}</div>
                          <h3 style={styles.accountName}>{account.name}</h3>
                          <p style={styles.accountRate}>{account.rate}</p>
                          <p style={styles.accountDesc}>{account.desc}</p>
                          <div style={styles.accountBenefits}>
                            <small style={styles.benefitsText}>{account.benefits}</small>
                          </div>
                          {user ? (
                            <Link href="/apply" style={styles.accountButton}>
                              <span style={styles.buttonIcon}>⚡</span>
                              Apply Now
                            </Link>
                          ) : (
                            <Link href="/login" style={styles.accountButtonSecondary}>
                              <span style={styles.buttonIcon}>🔒</span>
                              Sign In to Apply
                            </Link>
                          )}
                        </div>
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

      {/* Enhanced Services Section */}
      <ServicesSection />
      <FeaturesSection />

      {/* Enhanced Loan Section with Better Imagery */}
      <LoanApprovalSection />

      {/* Testimonials Section */}
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
              Find comprehensive features, benefits, and eligibility requirements.
            </p>
            <div style={styles.titleUnderline}></div>
          </div>

          <div style={styles.accountTypesPreview}>
            {[
              { icon: '💳', title: 'Personal Banking', desc: 'Checking, Savings, Student, Senior accounts and more', color: '#3b82f6' },
              { icon: '🏢', title: 'Business Banking', desc: 'Small Business, Corporate, and Professional accounts', color: '#10b981' },
              { icon: '📈', title: 'Investment Accounts', desc: 'Retirement, Investment, and Wealth Management options', color: '#f59e0b' },
              { icon: '🎯', title: 'Specialized Accounts', desc: 'HSA, Education, Trust, and International accounts', color: '#8b5cf6' }
            ].map((item, index) => (
              <div 
                key={index}
                style={{
                  ...styles.previewCard,
                  ...(isVisible['account-types-discovery'] ? {
                    ...styles.slideInFromBottom,
                    animationDelay: `${index * 0.2}s`
                  } : {})
                }}
              >
                <div style={{...styles.previewIconContainer, backgroundColor: item.color}}>
                  <span style={styles.previewIcon}>{item.icon}</span>
                </div>
                <h3 style={styles.previewTitle}>{item.title}</h3>
                <p style={styles.previewDesc}>{item.desc}</p>
                <div style={{...styles.previewAccent, backgroundColor: item.color}}></div>
              </div>
            ))}
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

      {/* Enhanced Final CTA */}
      <div id="final-cta" data-animate style={{
        ...(isVisible['final-cta'] ? styles.pulseGlow : {})
      }}>
        <CTA
          title={user ? "Ready to Expand Your Banking?" : "Ready to Start Your Financial Journey?"}
          subtitle={user ? 
            "Explore additional account types and premium services available to you as a valued customer." :
            "Join over 500,000 customers who trust Oakline Bank for their financial needs. Open your account today and experience the difference."
          }
          buttonText={user ? "Explore More Services" : "Open Account Now"}
          buttonLink={user ? "/account-types" : "/apply"}
          variant="primary"
        />
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  // Main Header Styles
  mainHeader: {
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderBottom: '3px solid #3b82f6',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%'
  },
  headerContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  headerCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none'
  },
  headerLogo: {
    height: '50px',
    width: 'auto'
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  bankName: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#1e40af',
    lineHeight: '1'
  },
  bankTagline: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: '500'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  bankInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.25rem'
  },
  routingInfo: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#374151'
  },
  phoneInfo: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#3b82f6'
  },
  navigationDropdown: {
    position: 'relative'
  },
  dropdownButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  menuIcon: {
    fontSize: '1.1rem'
  },
  dropdownArrow: {
    fontSize: '0.8rem',
    transition: 'transform 0.3s ease'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    border: '2px solid #e2e8f0',
    padding: '1.5rem',
    minWidth: '300px',
    zIndex: 1000,
    marginTop: '0.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem'
  },
  dropdownSection: {
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '1rem'
  },
  dropdownSectionTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  dropdownItem: {
    display: 'block',
    padding: '0.5rem 0',
    color: '#374151',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'color 0.3s ease'
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  loginButton: {
    padding: '0.6rem 1.2rem',
    backgroundColor: 'transparent',
    border: '2px solid #3b82f6',
    color: '#3b82f6',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  applyButton: {
    padding: '0.6rem 1.2rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.3s ease'
  },
  dashboardButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.2rem',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.3s ease'
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.2rem',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
    transition: 'all 0.3s ease'
  },
  buttonIcon: {
    fontSize: '1rem'
  },
  topBarContent: {
    maxWidth: '1400px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  announcement: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexGrow: 1,
    flexWrap: 'wrap'
  },
  announcementIcon: {
    fontSize: '1.5rem',
    marginRight: '0.5rem',
    color: '#3b82f6' // Primary accent color
  },
  announcementText: {
    fontWeight: '500',
    color: '#94a3b8', // Slightly muted text
    flexShrink: 0
  },
  announcementLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '700',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    transition: 'all 0.3s ease',
    marginLeft: 'auto' // Pushes the link to the right
  },
  topBarLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  topBarLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s ease',
    position: 'relative'
  },
  phoneNumber: {
    fontWeight: '700',
    color: '#3b82f6', // Primary accent color for phone number
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },

  // Loading Screen Styles
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loadingSpinner: {
    textAlign: 'center',
    maxWidth: '400px',
    padding: '2rem'
  },
  spinner: {
    width: '80px',
    height: '80px',
    border: '8px solid rgba(255,255,255,0.2)',
    borderTop: '8px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1.2s linear infinite',
    marginBottom: '2rem',
    margin: '0 auto 2rem'
  },
  loadingContent: {
    textAlign: 'center'
  },
  loadingTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1rem',
    animation: 'fadeInUp 1s ease-out'
  },
  loadingText: {
    fontSize: '1.1rem',
    opacity: 0.9,
    marginBottom: '2rem',
    animation: 'fadeInUp 1s ease-out 0.3s both'
  },
  loadingProgress: {
    width: '100%',
    height: '4px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '2px',
    overflow: 'hidden',
    animation: 'fadeInUp 1s ease-out 0.6s both'
  },
  progressBar: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
    borderRadius: '2px',
    animation: 'progressSlide 2s ease-in-out infinite'
  },

  // Main Container
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    width: '100%',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },

  // Enhanced Hero Section
  heroSection: {
    position: 'relative',
    height: 'clamp(500px, 70vh, 700px)',
    overflow: 'hidden',
    width: '100%'
  },
  heroParallax: {
    position: 'relative',
    width: '100%',
    height: '100%',
    perspective: '1000px'
  },
  heroSlide: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transform: 'translateZ(0)'
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
    transition: 'all 1.2s ease-in-out',
    transform: 'scale(1.05)',
    animation: 'heroImageFloat 20s ease-in-out infinite'
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.85
  },
  heroContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: 'white',
    maxWidth: '95%',
    width: '100%',
    padding: '0 1rem',
    zIndex: 10,
    transition: 'all 1s ease-out'
  },
  heroAnimated: {
    animation: 'heroContentSlideUp 1.2s ease-out'
  },
  heroIconContainer: {
    marginBottom: '1.5rem'
  },
  heroIcon: {
    fontSize: 'clamp(3rem, 6vw, 4.5rem)',
    display: 'inline-block',
    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
    animation: 'heroIconBounce 2s ease-in-out infinite'
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: '900',
    marginBottom: '1rem',
    textShadow: '2px 4px 8px rgba(0,0,0,0.5)',
    lineHeight: '1.1',
    letterSpacing: '-0.02em'
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
    marginBottom: '2rem',
    opacity: 0.95,
    maxWidth: '600px',
    margin: '0 auto 2rem',
    fontWeight: '400',
    lineHeight: '1.5',
    textShadow: '1px 2px 4px rgba(0,0,0,0.3)'
  },

  // Routing Number Card
  routingNumberCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '2rem',
    maxWidth: '400px',
    margin: '0 auto 2rem',
    animation: 'routingCardGlow 3s ease-in-out infinite'
  },
  routingLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    opacity: 0.9,
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  routingNumber: {
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: '2px',
    marginBottom: '0.5rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  },
  routingNote: {
    fontSize: '0.8rem',
    opacity: 0.8,
    lineHeight: '1.4'
  },

  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '1rem'
  },
  heroButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    textDecoration: 'none',
    padding: 'clamp(1rem, 2vw, 1.3rem) clamp(1.5rem, 4vw, 2.5rem)',
    borderRadius: '12px',
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    fontWeight: '700',
    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: 'none',
    transform: 'translateY(0)',
    animation: 'buttonPulse 2s ease-in-out infinite'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    padding: 'clamp(1rem, 2vw, 1.3rem) clamp(1.5rem, 4vw, 2.5rem)',
    borderRadius: '12px',
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    fontWeight: '700',
    border: '2px solid white',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backdropFilter: 'blur(10px)'
  },
  buttonIcon: {
    fontSize: '1.2em'
  },

  // Slide Indicators
  slideIndicators: {
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '12px',
    zIndex: 15
  },
  indicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid white',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.4s ease',
    backdropFilter: 'blur(5px)'
  },
  indicatorActive: {
    backgroundColor: 'white',
    transform: 'scale(1.4)',
    boxShadow: '0 0 20px rgba(255,255,255,0.8)'
  },

  // Enhanced Features Showcase
  featuresShowcase: {
    padding: 'clamp(4rem, 8vw, 6rem) 0',
    backgroundColor: 'white',
    width: '100%',
    position: 'relative'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem',
    width: '100%'
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: 'clamp(2rem, 5vw, 4rem)',
    transition: 'all 0.8s ease-out'
  },
  staggeredFadeIn: {
    animation: 'staggeredFadeIn 1s ease-out'
  },
  sectionTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.02em'
  },
  sectionSubtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    color: '#64748b',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6',
    fontWeight: '400'
  },
  titleUnderline: {
    width: '80px',
    height: '4px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    margin: '1.5rem auto 0',
    borderRadius: '2px',
    animation: 'underlineExpand 1s ease-out 0.5s both'
  },

  // Feature Showcase Content
  featureShowcaseContainer: {
    marginBottom: '3rem'
  },
  featureContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
    gap: 'clamp(2rem, 4vw, 4rem)',
    alignItems: 'center'
  },
  featureImageContainer: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    transition: 'all 0.8s ease-out',
    transform: 'translateX(-100px)',
    opacity: 0
  },
  slideInFromLeft: {
    animation: 'slideInFromLeft 1s ease-out forwards'
  },
  featureImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    transition: 'transform 0.5s ease'
  },
  featureImageOverlay: {
    position: 'absolute',
    top: '20px',
    right: '20px'
  },
  featureBadge: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: '700',
    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backdropFilter: 'blur(10px)'
  },
  badgeIcon: {
    fontSize: '1rem'
  },
  featureInfo: {
    padding: '1rem',
    transition: 'all 0.8s ease-out',
    transform: 'translateX(100px)',
    opacity: 0
  },
  slideInFromRight: {
    animation: 'slideInFromRight 1s ease-out forwards'
  },
  featureTitle: {
    fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: '1.5rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.01em'
  },
  featureDescription: {
    fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
    color: '#64748b',
    marginBottom: '2rem',
    lineHeight: '1.7',
    fontWeight: '400'
  },
  featuresList: {
    marginBottom: '2.5rem'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
    fontSize: '1rem',
    color: '#374151',
    opacity: 0,
    transform: 'translateX(-20px)'
  },
  bounceInLeft: {
    animation: 'bounceInLeft 0.6s ease-out forwards'
  },
  featureIcon: {
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)'
  },
  featureText: {
    fontWeight: '600'
  },
  featureActions: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  featureButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 1.8rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
    transform: 'translateY(0)'
  },
  featureButtonSecondary: {
    backgroundColor: 'transparent',
    color: '#3b82f6',
    textDecoration: 'none',
    padding: '1rem 1.8rem',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    border: '2px solid #3b82f6',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  },

  // Feature Indicators
  featureIndicators: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '2.5rem'
  },
  featureIndicator: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: '2px solid #3b82f6',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  featureIndicatorActive: {
    backgroundColor: '#3b82f6',
    transform: 'scale(1.4)'
  },

  // Enhanced Account Types Section
  accountTypesSection: {
    padding: 'clamp(4rem, 8vw, 6rem) 0',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    width: '100%',
    position: 'relative'
  },
  loginPrompt: {
    marginTop: '1rem',
    display: 'block'
  },
  loginLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '700',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    marginTop: '0.5rem'
  },

  // Account Carousel
  accountCarousel: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '16px'
  },
  accountSlideContainer: {
    display: 'flex',
    transition: 'transform 1s ease-in-out',
    width: '100%'
  },
  accountSlide: {
    minWidth: '100%',
    padding: '1.5rem 0'
  },
  accountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '1.5rem'
  },
  accountCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    border: '2px solid #e2e8f0',
    transition: 'all 0.4s ease',
    cursor: 'pointer',
    position: 'relative',
    transform: 'scale(0.8) rotateY(90deg)',
    opacity: 0
  },
  flipInY: {
    animation: 'flipInY 0.8s ease-out forwards'
  },
  accountCardInner: {
    padding: '1.8rem',
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  accountIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    display: 'block',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
  },
  accountName: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '0.5rem',
    letterSpacing: '-0.01em'
  },
  accountRate: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#10b981',
    marginBottom: '0.5rem'
  },
  accountDesc: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    lineHeight: '1.5',
    flex: 1
  },
  accountBenefits: {
    backgroundColor: '#f8fafc',
    padding: '0.8rem',
    borderRadius: '8px',
    marginBottom: '1.5rem'
  },
  benefitsText: {
    fontSize: '0.8rem',
    color: '#64748b',
    lineHeight: '1.4'
  },
  accountButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    textDecoration: 'none',
    padding: '0.8rem 1.3rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transform: 'translateY(0)'
  },
  accountButtonSecondary: {
    backgroundColor: '#e2e8f0',
    color: '#64748b',
    textDecoration: 'none',
    padding: '0.8rem 1.3rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },

  // Account Indicators
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
    border: '2px solid #3b82f6',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  accountIndicatorActive: {
    backgroundColor: '#3b82f6',
    transform: 'scale(1.3)'
  },

  // Account Types Discovery
  accountTypesDiscovery: {
    padding: 'clamp(4rem, 8vw, 6rem) 0',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    width: '100%'
  },
  accountTypesPreview: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  previewCard: {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
    border: '2px solid #e2e8f0',
    transition: 'all 0.4s ease',
    position: 'relative',
    overflow: 'hidden',
    transform: 'translateY(50px)',
    opacity: 0
  },
  slideInFromBottom: {
    animation: 'slideInFromBottom 0.8s ease-out forwards'
  },
  previewIconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    position: 'relative'
  },
  previewIcon: {
    fontSize: '2rem',
    color: 'white'
  },
  previewTitle: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '1rem',
    letterSpacing: '-0.01em'
  },
  previewDesc: {
    fontSize: '0.95rem',
    color: '#64748b',
    lineHeight: '1.6'
  },
  previewAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px'
  },
  accountTypesAction: {
    textAlign: 'center'
  },
  exploreButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: 'clamp(1rem, 2.5vw, 1.5rem) clamp(2rem, 4vw, 3rem)',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '16px',
    fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
    fontWeight: '800',
    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
    transition: 'all 0.3s ease',
    marginBottom: '1rem',
    transform: 'translateY(0)'
  },
  actionNote: {
    fontSize: '0.95rem',
    color: '#64748b',
    fontStyle: 'italic'
  },

  // Animation Classes
  fadeInUp: {
    animation: 'fadeInUp 1s ease-out forwards'
  },
  zoomIn: {
    animation: 'zoomIn 0.8s ease-out forwards'
  },
  pulseGlow: {
    animation: 'pulseGlow 2s ease-in-out infinite'
  },

  // Mobile Responsive Styles
  '@media (max-width: 768px)': {
    headerContainer: {
      flexDirection: 'column',
      padding: '0.75rem',
      gap: '1rem'
    },
    headerCenter: {
      order: 1,
      width: '100%',
      textAlign: 'center'
    },
    logoSection: {
      order: 0
    },
    headerActions: {
      order: 2,
      width: '100%',
      justifyContent: 'center'
    },
    authButtons: {
      flexDirection: 'column',
      gap: '0.5rem',
      width: '100%'
    },
    dashboardButton: {
      width: '100%',
      justifyContent: 'center'
    },
    menuButton: {
      width: '100%',
      justifyContent: 'center'
    },
    loginButton: {
      width: '100%',
      textAlign: 'center',
      justifyContent: 'center'
    },
    applyButton: {
      width: '100%',
      textAlign: 'center',
      justifyContent: 'center'
    },
    dropdownMenu: {
      position: 'fixed',
      top: '100%',
      left: '1rem',
      right: '1rem',
      width: 'auto'
    },
    heroSection: {
      height: 'auto',
      minHeight: '60vh',
      padding: '2rem 1rem'
    },
    heroContent: {
      padding: '0 0.5rem'
    },
    heroButtons: {
      flexDirection: 'column',
      width: '100%',
      gap: '0.75rem'
    },
    heroButton: {
      width: '100%',
      justifyContent: 'center'
    },
    secondaryButton: {
      width: '100%',
      justifyContent: 'center'
    }
  }
};

// Add CSS animations to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    :root {
      /* Professional Banking Color Palette */
      --navy-blue: #1a365d;
      --navy-blue-light: #2d5a87;
      --navy-blue-dark: #0f2a44;
      --banking-green: #059669;
      --banking-green-light: #10b981;
      --banking-green-dark: #047857;
      --banking-gold: #d97706;
      --banking-gold-light: #f59e0b;
      --banking-gold-dark: #92400e;
      --pure-white: #ffffff;
      --off-white: #f8fafc;
      --neutral-gray: #64748b;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes progressSlide {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(0%); }
      100% { transform: translateX(100%); }
    }

    @keyframes heroImageFloat {
      0%, 100% { transform: scale(1.05) translateY(0px); }
      50% { transform: scale(1.08) translateY(-10px); }
    }

    @keyframes heroContentSlideUp {
      0% { transform: translate(-50%, -30%) scale(0.9); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }

    @keyframes heroIconBounce {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(5deg); }
    }

    @keyframes routingCardGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.3); }
      50% { box-shadow: 0 0 30px rgba(255,255,255,0.5); }
    }

    @keyframes buttonPulse {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-2px) scale(1.02); }
    }

    @keyframes staggeredFadeIn {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes underlineExpand {
      0% { width: 0; }
      100% { width: 80px; }
    }

    @keyframes slideInFromLeft {
      0% { transform: translateX(-100px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideInFromRight {
      0% { transform: translateX(100px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideInFromBottom {
      0% { transform: translateY(50px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }

    @keyframes bounceInLeft {
      0% { transform: translateX(-20px); opacity: 0; }
      60% { transform: translateX(5px); opacity: 0.8; }
      100% { transform: translateX(0); opacity: 1; }
    }

    @keyframes flipInY {
      0% { transform: scale(0.8) rotateY(90deg); opacity: 0; }
      50% { transform: scale(0.9) rotateY(0deg); opacity: 0.5; }
      100% { transform: scale(1) rotateY(0deg); opacity: 1; }
    }

    @keyframes fadeInUp {
      0% { transform: translateY(30px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }

    @keyframes zoomIn {
      0% { transform: scale(0.8); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes pulseGlow {
      0%, 100% { transform: scale(1); filter: brightness(1); }
      50% { transform: scale(1.02); filter: brightness(1.1); }
    }

    /* Hover Effects */
    .accountCard:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }

    .previewCard:hover {
      transform: translateY(-10px);
      box-shadow: 0 25px 50px rgba(0,0,0,0.15);
    }

    .heroButton:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(16, 185, 129, 0.6);
    }

    .secondaryButton:hover {
      background-color: rgba(255,255,255,0.2);
      transform: translateY(-3px);
    }

    .featureImage:hover {
      transform: scale(1.05);
    }

    .exploreButton:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(59, 130, 246, 0.6);
    }

    .topBarLink:hover {
      color: #ffffff; /* Lighten color on hover */
    }

    .announcementLink:hover {
      background-color: rgba(59, 130, 246, 0.2);
    }
  `;
  document.head.appendChild(styleSheet);
}