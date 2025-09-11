
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import Footer from '../components/Footer';

// Enrollment Button Component
function EnrollmentButton() {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnrollmentRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data: application, error } = await supabase
        .from('applications')
        .select('id, email, first_name, last_name')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (error || !application) {
        setMessage('Email not found. Please apply for an account first or check your email address.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/resend-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: application.id })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Enrollment email sent! Please check your inbox and spam folder.');
        setEmail('');
        setShowEmailInput(false);
      } else {
        setMessage(result.error || 'Failed to send enrollment email. Please try again.');
      }
    } catch (error) {
      console.error('Enrollment request error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showEmailInput) {
    return (
      <div style={styles.enrollmentContainer}>
        <form onSubmit={handleEnrollmentRequest} style={styles.enrollmentForm}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            style={styles.enrollmentInput}
          />
          <div style={styles.enrollmentButtons}>
            <button type="submit" disabled={loading} style={styles.enrollmentSubmit}>
              {loading ? 'Sending...' : 'Send Link'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowEmailInput(false);
                setMessage('');
                setEmail('');
              }}
              style={styles.enrollmentCancel}
            >
              Cancel
            </button>
          </div>
        </form>
        {message && (
          <div style={{
            ...styles.message,
            color: message.includes('sent') ? '#16a34a' : '#dc2626',
            backgroundColor: message.includes('sent') ? '#dcfce7' : '#fef2f2'
          }}>
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <button onClick={() => setShowEmailInput(true)} style={styles.enrollBtn}>
      Complete Enrollment
    </button>
  );
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const router = useRouter();

  const heroSlides = [
    {
      image: '/images/Modern_bank_lobby_interior_d535acc7.png',
      title: 'Welcome to Oakline Bank',
      subtitle: 'Experience modern banking with personalized service and cutting-edge technology.'
    },
    {
      image: '/images/Mobile_banking_user_experience_576bb7a3.png',
      title: 'Banking Made Simple',
      subtitle: 'Access your accounts 24/7 with our award-winning mobile and online banking platform.'
    },
    {
      image: '/images/Digital_investment_dashboard_36d35f19.png',
      title: 'Grow Your Wealth',
      subtitle: 'Smart investment solutions and financial planning tailored to your goals.'
    },
    {
      image: '/images/Bank_hall_business_discussion_72f98bbe.png',
      title: 'Expert Financial Guidance',
      subtitle: 'Professional consultations and personalized banking solutions for your future.'
    }
  ];

  useEffect(() => {
    checkUser();

    // Auto-slide hero images
    const slideInterval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clearInterval(slideInterval);
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    } catch (error) {
      console.error('Error checking user:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleDropdown = (menu) => {
    setDropdownOpen(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div style={styles.loadingText}>Loading Oakline Bank...</div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Enhanced Professional Bank Header */}
      <header style={styles.header}>
        {/* Top Info Bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarContent}>
            <div style={styles.contactInfo}>
              <span>📞 1-800-OAKLINE (625-5463)</span>
              <span>✉️ support@theoaklinebank.com</span>
              <span>🕒 24/7 Customer Service</span>
            </div>
            <div style={styles.quickLinks}>
              <Link href="/support" style={styles.quickLink}>Support</Link>
              <Link href="/faq" style={styles.quickLink}>FAQ</Link>
              <Link href="/market-news" style={styles.quickLink}>Market News</Link>
            </div>
          </div>
        </div>

        {/* Main Navigation with Dropdowns */}
        <nav style={styles.mainNav}>
          <div style={styles.navContainer}>
            {/* Logo */}
            <Link href="/" style={styles.logoSection}>
              <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.logo} />
              <div style={styles.logoText}>
                <span style={styles.bankName}>Oakline Bank</span>
                <span style={styles.tagline}>Your Financial Partner</span>
              </div>
            </Link>

            {/* Enhanced Navigation Menu with Dropdowns */}
            <div style={styles.navMenu}>
              <div style={styles.dropdown}>
                <button 
                  style={styles.dropdownBtn}
                  onClick={() => toggleDropdown('banking')}
                  onMouseEnter={() => setDropdownOpen(prev => ({ ...prev, banking: true }))}
                >
                  Banking Services ▼
                </button>
                {dropdownOpen.banking && (
                  <div 
                    style={styles.dropdownContent}
                    onMouseLeave={() => setDropdownOpen(prev => ({ ...prev, banking: false }))}
                  >
                    <div style={styles.dropdownSection}>
                      <h4 style={styles.dropdownHeading}>💳 Account Types</h4>
                      <Link href="/apply" style={styles.dropdownLink}>Checking Account</Link>
                      <Link href="/apply" style={styles.dropdownLink}>Savings Account</Link>
                      <Link href="/apply" style={styles.dropdownLink}>Business Account</Link>
                      <Link href="/apply" style={styles.dropdownLink}>Student Account</Link>
                    </div>
                    <div style={styles.dropdownSection}>
                      <h4 style={styles.dropdownHeading}>🏠 Loans & Credit</h4>
                      <Link href="/loans" style={styles.dropdownLink}>Home Mortgage</Link>
                      <Link href="/loans" style={styles.dropdownLink}>Personal Loan</Link>
                      <Link href="/loans" style={styles.dropdownLink}>Auto Loan</Link>
                      <Link href="/cards" style={styles.dropdownLink}>Credit Cards</Link>
                    </div>
                  </div>
                )}
              </div>

              <div style={styles.dropdown}>
                <button 
                  style={styles.dropdownBtn}
                  onClick={() => toggleDropdown('digital')}
                  onMouseEnter={() => setDropdownOpen(prev => ({ ...prev, digital: true }))}
                >
                  Digital Banking ▼
                </button>
                {dropdownOpen.digital && (
                  <div 
                    style={styles.dropdownContent}
                    onMouseLeave={() => setDropdownOpen(prev => ({ ...prev, digital: false }))}
                  >
                    <div style={styles.dropdownSection}>
                      <h4 style={styles.dropdownHeading}>📱 Online Services</h4>
                      <Link href="/dashboard" style={styles.dropdownLink}>Online Banking</Link>
                      <Link href="/transfer" style={styles.dropdownLink}>Money Transfer</Link>
                      <Link href="/bill-pay" style={styles.dropdownLink}>Bill Pay</Link>
                      <Link href="/deposit-real" style={styles.dropdownLink}>Mobile Deposit</Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/investments" style={styles.navLink}>Investments</Link>
              <Link href="/support" style={styles.navLink}>Support</Link>
            </div>

            {/* Header Actions */}
            <div style={styles.headerActions}>
              {!user ? (
                <>
                  <Link href="/login" style={styles.loginButton}>Sign In</Link>
                  <Link href="/apply" style={styles.applyButton}>Open Account</Link>
                </>
              ) : (
                <>
                  <span style={styles.welcomeText}>Welcome, {user.email?.split('@')[0]}</span>
                  <Link href="/dashboard" style={styles.dashboardButton}>My Banking</Link>
                  <button onClick={handleLogout} style={styles.logoutButton}>Sign Out</button>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section with Enhanced Image Carousel */}
        <section style={styles.heroSection}>
          <div style={styles.heroSlider}>
            <img 
              src={heroSlides[currentHeroSlide].image} 
              alt="Banking Services" 
              style={styles.heroImage}
            />
            <div style={styles.heroOverlay}></div>
            <div style={styles.heroContent}>
              <h1 style={styles.heroTitle}>{heroSlides[currentHeroSlide].title}</h1>
              <p style={styles.heroSubtitle}>{heroSlides[currentHeroSlide].subtitle}</p>
              <div style={styles.heroButtons}>
                {!user ? (
                  <>
                    <Link href="/apply" style={styles.primaryButton}>Get Started</Link>
                    <EnrollmentButton />
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" style={styles.primaryButton}>My Dashboard</Link>
                    <Link href="/main-menu" style={styles.secondaryButton}>Banking Menu</Link>
                  </>
                )}
              </div>
            </div>

            {/* Slide Indicators */}
            <div style={styles.slideIndicators}>
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  style={{
                    ...styles.indicator,
                    backgroundColor: index === currentHeroSlide ? '#ffffff' : 'rgba(255,255,255,0.5)'
                  }}
                  onClick={() => setCurrentHeroSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Banking Services Grid */}
        <section style={styles.servicesSection}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Complete Banking Solutions</h2>
            <div style={styles.servicesGrid}>
              <div style={styles.serviceCard}>
                <img src="/images/Bank_hall_business_discussion_72f98bbe.png" alt="Personal Banking" style={styles.serviceImage} />
                <div style={styles.serviceContent}>
                  <h3>Personal Banking</h3>
                  <p>Checking, savings, and personal loans designed for your lifestyle.</p>
                  <Link href="/apply" style={styles.serviceButton}>Learn More</Link>
                </div>
              </div>
              <div style={styles.serviceCard}>
                <img src="/images/Banking_executive_team_meeting_c758f3ec.png" alt="Business Banking" style={styles.serviceImage} />
                <div style={styles.serviceContent}>
                  <h3>Business Banking</h3>
                  <p>Comprehensive solutions to help your business grow and succeed.</p>
                  <Link href="/apply" style={styles.serviceButton}>Learn More</Link>
                </div>
              </div>
              <div style={styles.serviceCard}>
                <img src="/images/Loan_approval_celebration_banner_919a886f.png" alt="Loan Services" style={styles.serviceImage} />
                <div style={styles.serviceContent}>
                  <h3>Loan Services</h3>
                  <p>Home, auto, and personal loans with competitive rates and fast approval.</p>
                  <Link href="/loans" style={styles.serviceButton}>Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Oakline Debit Cards Section */}
        <section style={styles.cardsSection}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Oakline Debit Cards</h2>
            <p style={styles.sectionSubtitle}>Choose from our premium collection of debit cards designed for your lifestyle</p>
            <div style={styles.cardsGrid}>
              <div style={styles.cardShowcase}>
                <img src="/images/hero-debit-card-1.jpg.PNG" alt="Oakline Classic Debit Card" style={styles.cardImage} />
                <h3>Classic Debit Card</h3>
                <p>Perfect for everyday banking with no monthly fees and worldwide acceptance.</p>
                <ul style={styles.cardFeatures}>
                  <li>No monthly maintenance fees</li>
                  <li>Free ATM withdrawals at Oakline ATMs</li>
                  <li>Contactless payment technology</li>
                  <li>24/7 fraud monitoring</li>
                </ul>
              </div>
              <div style={styles.cardShowcase}>
                <img src="/images/hero-debit-card-2.jpg.PNG" alt="Oakline Premium Debit Card" style={styles.cardImage} />
                <h3>Premium Debit Card</h3>
                <p>Enhanced features for our valued customers with premium benefits.</p>
                <ul style={styles.cardFeatures}>
                  <li>Cashback rewards on purchases</li>
                  <li>Travel insurance included</li>
                  <li>Priority customer service</li>
                  <li>Higher daily transaction limits</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ATM Network Section */}
        <section style={styles.atmSection}>
          <div style={styles.container}>
            <div style={styles.atmContent}>
              <div style={styles.atmText}>
                <h2 style={styles.sectionTitle}>Nationwide ATM Network</h2>
                <p style={styles.atmDescription}>
                  Access your money anytime, anywhere with our extensive ATM network. Over 55,000 ATMs nationwide 
                  provide convenient 24/7 access to your accounts with no fees at Oakline ATM locations.
                </p>
                <div style={styles.atmFeatures}>
                  <div style={styles.atmFeature}>
                    <span style={styles.atmIcon}>🏧</span>
                    <div>
                      <h4>55,000+ ATMs</h4>
                      <p>Nationwide coverage</p>
                    </div>
                  </div>
                  <div style={styles.atmFeature}>
                    <span style={styles.atmIcon}>🚫</span>
                    <div>
                      <h4>No Fees</h4>
                      <p>Free at Oakline ATMs</p>
                    </div>
                  </div>
                  <div style={styles.atmFeature}>
                    <span style={styles.atmIcon}>🕐</span>
                    <div>
                      <h4>24/7 Access</h4>
                      <p>Always available</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={styles.atmImages}>
                <img src="/images/hero-pos.jpg.PNG" alt="ATM Machine" style={styles.atmImage} />
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Banking Section */}
        <section style={styles.mobileSection}>
          <div style={styles.container}>
            <div style={styles.mobileContent}>
              <div style={styles.mobileImages}>
                <img src="/images/hero-mobile.jpg.PNG" alt="Mobile Banking App" style={styles.mobileImage} />
                <img src="/images/hero-mobile-transactions.jpg.PNG" alt="Mobile Transactions" style={styles.mobileImageSmall} />
              </div>
              <div style={styles.mobileText}>
                <h2 style={styles.sectionTitle}>Award-Winning Mobile App</h2>
                <p style={styles.mobileDescription}>
                  Bank on the go with our secure, user-friendly mobile app. Manage your accounts, 
                  transfer money, deposit checks, and pay bills - all from your smartphone.
                </p>
                <div style={styles.mobileFeatures}>
                  <div style={styles.mobileFeature}>
                    <span style={styles.checkIcon}>✓</span>
                    <span>Biometric login (Face ID & Fingerprint)</span>
                  </div>
                  <div style={styles.mobileFeature}>
                    <span style={styles.checkIcon}>✓</span>
                    <span>Mobile check deposit</span>
                  </div>
                  <div style={styles.mobileFeature}>
                    <span style={styles.checkIcon}>✓</span>
                    <span>Real-time notifications</span>
                  </div>
                  <div style={styles.mobileFeature}>
                    <span style={styles.checkIcon}>✓</span>
                    <span>Instant money transfers</span>
                  </div>
                </div>
                <div style={styles.appButtons}>
                  <div style={styles.appButton}>📱 Download on App Store</div>
                  <div style={styles.appButton}>📲 Get it on Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Discussion Section */}
        <section style={styles.discussionSection}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Join the Conversation</h2>
            <p style={styles.sectionSubtitle}>See what our customers are saying about their banking experience</p>
            <div style={styles.discussionGrid}>
              <div style={styles.discussionCard}>
                <img src="/images/testimonial-1.jpg.JPG" alt="Customer Discussion" style={styles.discussionImage} />
                <div style={styles.discussionContent}>
                  <h3>Sarah Johnson</h3>
                  <p>"Oakline Bank has transformed my banking experience. The mobile app is intuitive and the customer service is exceptional."</p>
                  <div style={styles.rating}>⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <div style={styles.discussionCard}>
                <img src="/images/testimonial-2.jpg.JPG" alt="Business Owner" style={styles.discussionImage} />
                <div style={styles.discussionContent}>
                  <h3>Michael Chen</h3>
                  <p>"As a business owner, I appreciate the comprehensive business banking solutions and competitive loan rates."</p>
                  <div style={styles.rating}>⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <div style={styles.discussionCard}>
                <img src="/images/testimonial-3.jpg.JPG" alt="Young Professional" style={styles.discussionImage} />
                <div style={styles.discussionContent}>
                  <h3>Emma Rodriguez</h3>
                  <p>"The investment options and financial advisory services helped me plan for my future effectively."</p>
                  <div style={styles.rating}>⭐⭐⭐⭐⭐</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={styles.featuresSection}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Why Choose Oakline Bank?</h2>
            <div style={styles.featuresGrid}>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🔒</div>
                <h3>Bank-Level Security</h3>
                <p>Your deposits are FDIC insured up to $250,000 with advanced encryption and fraud protection.</p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📱</div>
                <h3>Mobile Banking</h3>
                <p>Award-winning mobile app with biometric login, instant notifications, and seamless user experience.</p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🏦</div>
                <h3>No Monthly Fees</h3>
                <p>Free checking with no minimum balance requirements, hidden fees, or maintenance charges.</p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>⚡</div>
                <h3>Instant Transfers</h3>
                <p>Real-time money transfers between accounts and to other banks with competitive exchange rates.</p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>💳</div>
                <h3>Premium Cards</h3>
                <p>Contactless debit and credit cards with cashback rewards and worldwide acceptance.</p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🎯</div>
                <h3>Financial Goals</h3>
                <p>Personalized financial planning tools and investment advice to help you reach your goals.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Services Section */}
        <section style={styles.investmentSection}>
          <div style={styles.container}>
            <div style={styles.investmentContent}>
              <div style={styles.investmentText}>
                <h2 style={styles.sectionTitle}>Investment Services</h2>
                <p style={styles.investmentDescription}>
                  Grow your wealth with our comprehensive investment solutions. From retirement planning 
                  to portfolio management, our certified financial advisors are here to guide your journey.
                </p>
                <div style={styles.investmentOptions}>
                  <div style={styles.investmentOption}>
                    <h4>🏠 Real Estate Investments</h4>
                    <p>Diversify with real estate investment trusts</p>
                  </div>
                  <div style={styles.investmentOption}>
                    <h4>📈 Stock Portfolio</h4>
                    <p>Build a balanced portfolio with expert guidance</p>
                  </div>
                  <div style={styles.investmentOption}>
                    <h4>🎯 Retirement Planning</h4>
                    <p>Secure your future with comprehensive retirement plans</p>
                  </div>
                </div>
                <Link href="/investments" style={styles.investmentButton}>Explore Investments</Link>
              </div>
              <div style={styles.investmentImages}>
                <img src="/images/Digital_investment_dashboard_36d35f19.png" alt="Investment Dashboard" style={styles.investmentImage} />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section style={styles.ctaSection}>
          <div style={styles.container}>
            <h2 style={styles.ctaTitle}>Ready to Start Banking with Us?</h2>
            <p style={styles.ctaSubtitle}>Join over 500,000 customers who trust Oakline Bank for their financial success</p>
            <div style={styles.ctaStats}>
              <div style={styles.ctaStat}>
                <span style={styles.ctaStatNumber}>500K+</span>
                <span style={styles.ctaStatLabel}>Happy Customers</span>
              </div>
              <div style={styles.ctaStat}>
                <span style={styles.ctaStatNumber}>$2.5B+</span>
                <span style={styles.ctaStatLabel}>Loans Approved</span>
              </div>
              <div style={styles.ctaStat}>
                <span style={styles.ctaStatNumber}>4.9/5</span>
                <span style={styles.ctaStatLabel}>Customer Rating</span>
              </div>
            </div>
            <div style={styles.ctaButtons}>
              <Link href="/apply" style={styles.ctaPrimary}>Open Account Today</Link>
              <Link href="/support" style={styles.ctaSecondary}>Contact Us</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff'
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#003366'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: 'white',
    marginTop: '1rem',
    fontSize: '1.1rem'
  },

  // Enhanced Header Styles with Professional Banking Colors
  header: {
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  topBar: {
    backgroundColor: '#003366',
    color: 'white',
    padding: '0.75rem 0'
  },
  topBarContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem'
  },
  contactInfo: {
    display: 'flex',
    gap: '2rem'
  },
  quickLinks: {
    display: 'flex',
    gap: '1.5rem'
  },
  quickLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  },
  mainNav: {
    backgroundColor: 'white',
    padding: '1rem 0',
    borderBottom: '1px solid #e5e7eb'
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none'
  },
  logo: {
    height: '50px',
    width: 'auto',
    borderRadius: '8px'
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column'
  },
  bankName: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#003366',
    lineHeight: '1.2'
  },
  tagline: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '500'
  },
  navMenu: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  },
  dropdown: {
    position: 'relative'
  },
  dropdownBtn: {
    background: 'none',
    border: 'none',
    color: '#374151',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: 'white',
    minWidth: '500px',
    padding: '1.5rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    zIndex: 200,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem'
  },
  dropdownSection: {
    minWidth: '200px'
  },
  dropdownHeading: {
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
    color: '#003366',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '8px'
  },
  dropdownLink: {
    display: 'block',
    color: '#6b7280',
    textDecoration: 'none',
    padding: '8px 0',
    fontSize: '14px',
    transition: 'color 0.2s',
    borderRadius: '4px'
  },
  navLink: {
    color: '#374151',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  welcomeText: {
    color: '#374151',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  loginButton: {
    color: '#003366',
    textDecoration: 'none',
    padding: '0.75rem 1.5rem',
    border: '2px solid #003366',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  applyButton: {
    backgroundColor: '#006633',
    color: 'white',
    textDecoration: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s',
    boxShadow: '0 2px 4px rgba(0, 102, 51, 0.3)'
  },
  dashboardButton: {
    backgroundColor: '#003366',
    color: 'white',
    textDecoration: 'none',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  logoutButton: {
    backgroundColor: '#cc3333',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer'
  },

  // Enhanced Hero Section
  heroSection: {
    position: 'relative',
    height: '700px',
    overflow: 'hidden'
  },
  heroSlider: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0, 51, 102, 0.8), rgba(0, 102, 153, 0.6))',
    zIndex: 1
  },
  heroContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: 'white',
    zIndex: 2,
    maxWidth: '800px',
    padding: '0 2rem'
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    marginBottom: '2.5rem',
    opacity: 0.95,
    lineHeight: '1.6'
  },
  heroButtons: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  primaryButton: {
    backgroundColor: '#006633',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    boxShadow: '0 8px 20px rgba(0, 102, 51, 0.4)',
    transition: 'all 0.3s'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2rem',
    border: '2px solid white',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  enrollBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.3)',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
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
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },

  // Enhanced Sections
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
  },
  sectionTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: '1rem'
  },
  sectionSubtitle: {
    fontSize: '1.2rem',
    color: '#666',
    textAlign: 'center',
    marginBottom: '3rem',
    maxWidth: '600px',
    margin: '0 auto 3rem'
  },
  servicesSection: {
    padding: '5rem 0',
    backgroundColor: '#f8fafc'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem'
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s'
  },
  serviceImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover'
  },
  serviceContent: {
    padding: '1.5rem'
  },
  serviceButton: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#003366',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },

  // Debit Cards Section
  cardsSection: {
    padding: '5rem 0',
    backgroundColor: 'white'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '3rem'
  },
  cardShowcase: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f8fafc'
  },
  cardImage: {
    width: '100%',
    maxWidth: '300px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '1.5rem'
  },
  cardFeatures: {
    listStyle: 'none',
    padding: 0,
    textAlign: 'left',
    marginTop: '1rem'
  },

  // ATM Section
  atmSection: {
    padding: '5rem 0',
    backgroundColor: '#f0f9ff'
  },
  atmContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center'
  },
  atmText: {},
  atmDescription: {
    fontSize: '1.1rem',
    color: '#666',
    lineHeight: '1.7',
    marginBottom: '2rem'
  },
  atmFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  atmFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  atmIcon: {
    fontSize: '2rem'
  },
  atmImages: {},
  atmImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '16px'
  },

  // Mobile Banking Section
  mobileSection: {
    padding: '5rem 0',
    backgroundColor: 'white'
  },
  mobileContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center'
  },
  mobileImages: {
    display: 'flex',
    gap: '1rem'
  },
  mobileImage: {
    width: '70%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '16px'
  },
  mobileImageSmall: {
    width: '30%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '16px',
    marginTop: '2rem'
  },
  mobileText: {},
  mobileDescription: {
    fontSize: '1.1rem',
    color: '#666',
    lineHeight: '1.7',
    marginBottom: '2rem'
  },
  mobileFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
  },
  mobileFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  checkIcon: {
    color: '#006633',
    fontWeight: 'bold'
  },
  appButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  appButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#003366',
    color: 'white',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600'
  },

  // Customer Discussion Section
  discussionSection: {
    padding: '5rem 0',
    backgroundColor: '#f8fafc'
  },
  discussionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  discussionCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s'
  },
  discussionImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  discussionContent: {
    padding: '1.5rem'
  },
  rating: {
    fontSize: '1.2rem',
    marginTop: '1rem'
  },

  featuresSection: {
    padding: '5rem 0',
    backgroundColor: 'white'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  featureCard: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    transition: 'transform 0.3s'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1.5rem'
  },

  // Investment Section
  investmentSection: {
    padding: '5rem 0',
    backgroundColor: '#f0f9ff'
  },
  investmentContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center'
  },
  investmentText: {},
  investmentDescription: {
    fontSize: '1.1rem',
    color: '#666',
    lineHeight: '1.7',
    marginBottom: '2rem'
  },
  investmentOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
  },
  investmentOption: {},
  investmentButton: {
    display: 'inline-block',
    padding: '1rem 2rem',
    backgroundColor: '#003366',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  investmentImages: {},
  investmentImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '16px'
  },

  ctaSection: {
    padding: '5rem 0',
    background: 'linear-gradient(135deg, #003366 0%, #006699 100%)',
    color: 'white',
    textAlign: 'center'
  },
  ctaTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 'bold',
    marginBottom: '1.5rem'
  },
  ctaSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '3rem',
    opacity: 0.9
  },
  ctaStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  ctaStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  ctaStatNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#ffffff'
  },
  ctaStatLabel: {
    fontSize: '1rem',
    opacity: 0.8
  },
  ctaButtons: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  ctaPrimary: {
    backgroundColor: '#006633',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    boxShadow: '0 8px 20px rgba(0, 102, 51, 0.4)',
    transition: 'all 0.3s'
  },
  ctaSecondary: {
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2rem',
    border: '2px solid white',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },

  // Enrollment Components
  enrollmentContainer: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    minWidth: '300px',
    color: '#374151'
  },
  enrollmentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  enrollmentInput: {
    padding: '0.75rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem'
  },
  enrollmentButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  enrollmentSubmit: {
    flex: 1,
    padding: '0.75rem',
    background: '#003366',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  enrollmentCancel: {
    flex: 1,
    padding: '0.75rem',
    background: 'transparent',
    color: '#6b7280',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  message: {
    padding: '0.75rem',
    borderRadius: '6px',
    marginTop: '1rem',
    fontSize: '0.9rem',
    textAlign: 'center'
  }
};
