
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const heroSlides = [
    {
      image: '/images/Modern_bank_lobby_interior_d535acc7.png',
      title: 'Banking Made Simple',
      subtitle: 'Experience secure, convenient banking with our award-winning mobile app and personalized service.'
    },
    {
      image: '/images/Mobile_banking_user_experience_576bb7a3.png',
      title: 'Mobile Banking Excellence',
      subtitle: 'Access your accounts 24/7 with biometric security, instant transfers, and real-time notifications.'
    },
    {
      image: '/images/Digital_investment_dashboard_36d35f19.png',
      title: 'Grow Your Wealth',
      subtitle: 'Smart investment solutions and expert financial planning tailored to your goals and lifestyle.'
    }
  ];

  useEffect(() => {
    checkUser();

    // Auto-slide hero images
    const slideInterval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

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
      {/* Mobile-First Professional Header */}
      <header style={styles.header}>
        {/* Top Contact Bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarContent}>
            <div style={styles.contactInfo}>
              <span style={styles.contactItem}>📞 1-800-OAKLINE</span>
              <span style={styles.contactItem}>✉️ support@oaklinebank.com</span>
            </div>
            <div style={styles.quickActions}>
              <Link href="/support" style={styles.quickLink}>Help</Link>
              <Link href="/faq" style={styles.quickLink}>FAQ</Link>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav style={styles.mainNav}>
          <div style={styles.navContainer}>
            {/* Logo Section */}
            <Link href="/" style={styles.logoSection}>
              <div style={styles.logoContainer}>
                <div style={styles.logoIcon}>🏦</div>
                <div style={styles.logoText}>
                  <span style={styles.bankName}>Oakline Bank</span>
                  <span style={styles.tagline}>Your Financial Partner</span>
                </div>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              style={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>

            {/* Desktop Navigation */}
            <div style={styles.desktopMenu}>
              <div style={styles.dropdown}>
                <button 
                  style={styles.dropdownBtn}
                  onClick={() => toggleDropdown('banking')}
                >
                  Banking ▼
                </button>
                {dropdownOpen.banking && (
                  <div style={styles.dropdownContent}>
                    <Link href="/apply" style={styles.dropdownLink}>Personal Banking</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Business Banking</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Loans & Credit</Link>
                    <Link href="/cards" style={styles.dropdownLink}>Cards</Link>
                  </div>
                )}
              </div>

              <div style={styles.dropdown}>
                <button 
                  style={styles.dropdownBtn}
                  onClick={() => toggleDropdown('digital')}
                >
                  Digital ▼
                </button>
                {dropdownOpen.digital && (
                  <div style={styles.dropdownContent}>
                    <Link href="/dashboard" style={styles.dropdownLink}>Online Banking</Link>
                    <Link href="/transfer" style={styles.dropdownLink}>Transfer Money</Link>
                    <Link href="/bill-pay" style={styles.dropdownLink}>Bill Pay</Link>
                    <Link href="/deposit-real" style={styles.dropdownLink}>Mobile Deposit</Link>
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
                  <Link href="/dashboard" style={styles.dashboardButton}>Banking</Link>
                  <button onClick={handleLogout} style={styles.logoutButton}>Sign Out</button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div style={styles.mobileMenu}>
              <Link href="/apply" style={styles.mobileLink}>Open Account</Link>
              <Link href="/login" style={styles.mobileLink}>Sign In</Link>
              <Link href="/dashboard" style={styles.mobileLink}>Online Banking</Link>
              <Link href="/loans" style={styles.mobileLink}>Loans</Link>
              <Link href="/investments" style={styles.mobileLink}>Investments</Link>
              <Link href="/support" style={styles.mobileLink}>Support</Link>
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <div style={styles.heroSlider}>
            <img 
              src={heroSlides[currentHeroSlide].image} 
              alt="Oakline Bank Services" 
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
                    <Link href="/dashboard" style={styles.primaryButton}>My Banking</Link>
                    <Link href="/main-menu" style={styles.secondaryButton}>Menu</Link>
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

        {/* Quick Stats */}
        <section style={styles.statsSection}>
          <div style={styles.container}>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>500K+</div>
                <div style={styles.statLabel}>Trusted Customers</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>$2.5B+</div>
                <div style={styles.statLabel}>Loans Approved</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>4.9/5</div>
                <div style={styles.statLabel}>Customer Rating</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>24/7</div>
                <div style={styles.statLabel}>Customer Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Banking Services */}
        <section style={styles.servicesSection}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Complete Banking Solutions</h2>
            <div style={styles.servicesGrid}>
              <div style={styles.serviceCard}>
                <img src="/images/Bank_hall_business_discussion_72f98bbe.png" alt="Personal Banking" style={styles.serviceImage} />
                <div style={styles.serviceContent}>
                  <h3>Personal Banking</h3>
                  <p>Checking, savings, and personal loans designed for your lifestyle and financial goals.</p>
                  <Link href="/apply" style={styles.serviceButton}>Learn More</Link>
                </div>
              </div>
              <div style={styles.serviceCard}>
                <img src="/images/Banking_executive_team_meeting_c758f3ec.png" alt="Business Banking" style={styles.serviceImage} />
                <div style={styles.serviceContent}>
                  <h3>Business Banking</h3>
                  <p>Comprehensive solutions to help your business grow and succeed in today's market.</p>
                  <Link href="/apply" style={styles.serviceButton}>Learn More</Link>
                </div>
              </div>
              <div style={styles.serviceCard}>
                <img src="/images/Loan_approval_celebration_banner_919a886f.png" alt="Loan Services" style={styles.serviceImage} />
                <div style={styles.serviceContent}>
                  <h3>Loan Services</h3>
                  <p>Home, auto, and personal loans with competitive rates and fast approval process.</p>
                  <Link href="/loans" style={styles.serviceButton}>Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Realistic Debit Cards Section */}
        <section style={styles.cardsSection}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Oakline Debit Cards</h2>
            <p style={styles.sectionSubtitle}>Choose from our premium collection of debit cards designed for your lifestyle</p>
            <div style={styles.cardsGrid}>
              <div style={styles.cardShowcase}>
                <div style={styles.realisticCard}>
                  <div style={styles.cardTop}>
                    <div style={styles.cardBankName}>OAKLINE BANK</div>
                    <div style={styles.cardType}>DEBIT</div>
                  </div>
                  <div style={styles.chipContactless}>
                    <div style={styles.chip}></div>
                    <div style={styles.contactlessIcon}>📶</div>
                  </div>
                  <div style={styles.cardNumber}>4532 1234 5678 9012</div>
                  <div style={styles.cardDetails}>
                    <div>
                      <div style={styles.cardLabel}>VALID THRU</div>
                      <div style={styles.cardValue}>12/28</div>
                    </div>
                    <div>
                      <div style={styles.cardLabel}>CARDHOLDER NAME</div>
                      <div style={styles.cardValue}>JOHN DOE</div>
                    </div>
                  </div>
                  <div style={styles.cardBrand}>VISA</div>
                </div>
                <h3>Classic Debit Card</h3>
                <p>Perfect for everyday banking with no monthly fees and worldwide acceptance.</p>
                <ul style={styles.cardFeatures}>
                  <li>✓ No monthly maintenance fees</li>
                  <li>✓ Free ATM withdrawals nationwide</li>
                  <li>✓ Contactless payment technology</li>
                  <li>✓ 24/7 fraud monitoring</li>
                </ul>
              </div>
              <div style={styles.cardShowcase}>
                <div style={styles.realisticCardPremium}>
                  <div style={styles.cardTop}>
                    <div style={styles.cardBankName}>OAKLINE BANK</div>
                    <div style={styles.cardType}>PREMIUM</div>
                  </div>
                  <div style={styles.chipContactless}>
                    <div style={styles.chip}></div>
                    <div style={styles.contactlessIcon}>📶</div>
                  </div>
                  <div style={styles.cardNumber}>5432 9876 5432 1098</div>
                  <div style={styles.cardDetails}>
                    <div>
                      <div style={styles.cardLabel}>VALID THRU</div>
                      <div style={styles.cardValue}>12/28</div>
                    </div>
                    <div>
                      <div style={styles.cardLabel}>CARDHOLDER NAME</div>
                      <div style={styles.cardValue}>JANE SMITH</div>
                    </div>
                  </div>
                  <div style={styles.cardBrand}>MASTERCARD</div>
                </div>
                <h3>Premium Debit Card</h3>
                <p>Enhanced features for our valued customers with premium benefits and rewards.</p>
                <ul style={styles.cardFeatures}>
                  <li>✓ 2% cashback on purchases</li>
                  <li>✓ Travel insurance included</li>
                  <li>✓ Priority customer service</li>
                  <li>✓ Higher daily transaction limits</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ATM Network */}
        <section style={styles.atmSection}>
          <div style={styles.container}>
            <div style={styles.atmContent}>
              <div style={styles.atmText}>
                <h2 style={styles.sectionTitle}>Nationwide ATM Access</h2>
                <p style={styles.atmDescription}>
                  Access your money anytime, anywhere with our extensive ATM network. Over 55,000 ATMs 
                  nationwide provide convenient 24/7 access to your accounts.
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

        {/* Mobile Banking */}
        <section style={styles.mobileSection}>
          <div style={styles.container}>
            <div style={styles.mobileContent}>
              <div style={styles.mobileImages}>
                <img src="/images/hero-mobile.jpg.PNG" alt="Mobile Banking App" style={styles.mobileImage} />
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
                  <div style={styles.appButton}>📱 App Store</div>
                  <div style={styles.appButton}>📲 Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Testimonials with Circular Images */}
        <section style={styles.testimonialsSection}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>What Our Customers Say</h2>
            <p style={styles.sectionSubtitle}>Join thousands of satisfied customers who trust Oakline Bank</p>
            <div style={styles.testimonialsGrid}>
              <div style={styles.testimonialCard}>
                <div style={styles.testimonialHeader}>
                  <img src="/images/testimonial-1.jpg.JPG" alt="Sarah Johnson" style={styles.testimonialImage} />
                  <div style={styles.testimonialInfo}>
                    <h4 style={styles.testimonialName}>Sarah Johnson</h4>
                    <p style={styles.testimonialTitle}>Small Business Owner</p>
                    <div style={styles.rating}>⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p style={styles.testimonialText}>
                  "Oakline Bank has transformed my banking experience. The mobile app is intuitive 
                  and the customer service is exceptional. Highly recommended!"
                </p>
              </div>
              <div style={styles.testimonialCard}>
                <div style={styles.testimonialHeader}>
                  <img src="/images/testimonial-2.jpg.JPG" alt="Michael Chen" style={styles.testimonialImage} />
                  <div style={styles.testimonialInfo}>
                    <h4 style={styles.testimonialName}>Michael Chen</h4>
                    <p style={styles.testimonialTitle}>Real Estate Agent</p>
                    <div style={styles.rating}>⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p style={styles.testimonialText}>
                  "As a business owner, I appreciate the comprehensive business banking solutions 
                  and competitive loan rates. Great service all around."
                </p>
              </div>
              <div style={styles.testimonialCard}>
                <div style={styles.testimonialHeader}>
                  <img src="/images/testimonial-3.jpg.JPG" alt="Emma Rodriguez" style={styles.testimonialImage} />
                  <div style={styles.testimonialInfo}>
                    <h4 style={styles.testimonialName}>Emma Rodriguez</h4>
                    <p style={styles.testimonialTitle}>Tech Professional</p>
                    <div style={styles.rating}>⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p style={styles.testimonialText}>
                  "The investment options and financial advisory services helped me plan for 
                  my future effectively. Couldn't be happier with my choice."
                </p>
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
                <p>FDIC insured up to $250,000 with advanced encryption and fraud protection.</p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📱</div>
                <h3>Mobile Banking</h3>
                <p>Award-winning mobile app with biometric login and seamless user experience.</p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🏦</div>
                <h3>No Monthly Fees</h3>
                <p>Free checking with no minimum balance requirements or hidden charges.</p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>⚡</div>
                <h3>Instant Transfers</h3>
                <p>Real-time money transfers between accounts and to other banks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Services */}
        <section style={styles.investmentSection}>
          <div style={styles.container}>
            <div style={styles.investmentContent}>
              <div style={styles.investmentText}>
                <h2 style={styles.sectionTitle}>Investment Services</h2>
                <p style={styles.investmentDescription}>
                  Grow your wealth with our comprehensive investment solutions. From retirement planning 
                  to portfolio management, our certified financial advisors guide your journey.
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
            <p style={styles.ctaSubtitle}>Join over 500,000 customers who trust Oakline Bank</p>
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
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3a8a'
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

  // Mobile-First Header
  header: {
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  topBar: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '0.5rem 0',
    fontSize: '0.8rem',
    '@media (max-width: 768px)': {
      fontSize: '0.7rem'
    }
  },
  topBarContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contactInfo: {
    display: 'flex',
    gap: '1rem',
    '@media (max-width: 768px)': {
      gap: '0.5rem'
    }
  },
  contactItem: {
    '@media (max-width: 568px)': {
      display: 'none'
    }
  },
  quickActions: {
    display: 'flex',
    gap: '1rem'
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
    padding: '0.75rem 0',
    borderBottom: '1px solid #e5e7eb'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logoSection: {
    textDecoration: 'none'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  logoIcon: {
    fontSize: '2rem',
    color: '#1e3a8a'
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column'
  },
  bankName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e3a8a',
    lineHeight: '1.2',
    '@media (max-width: 768px)': {
      fontSize: '1.3rem'
    }
  },
  tagline: {
    fontSize: '0.7rem',
    color: '#666',
    fontWeight: '500',
    '@media (max-width: 768px)': {
      fontSize: '0.65rem'
    }
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#374151',
    cursor: 'pointer',
    padding: '0.5rem',
    '@media (max-width: 768px)': {
      display: 'block'
    }
  },
  desktopMenu: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  dropdown: {
    position: 'relative'
  },
  dropdownBtn: {
    background: 'none',
    border: 'none',
    color: '#374151',
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: 'white',
    minWidth: '200px',
    padding: '1rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    zIndex: 200
  },
  dropdownLink: {
    display: 'block',
    color: '#6b7280',
    textDecoration: 'none',
    padding: '0.5rem 0',
    fontSize: '0.85rem',
    transition: 'color 0.2s'
  },
  navLink: {
    color: '#374151',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    transition: 'all 0.2s'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    '@media (max-width: 768px)': {
      display: 'none'
    }
  },
  loginButton: {
    color: '#1e3a8a',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    border: '2px solid #1e3a8a',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  applyButton: {
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  dashboardButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  mobileMenu: {
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    padding: '1rem',
    display: 'block',
    '@media (min-width: 769px)': {
      display: 'none'
    }
  },
  mobileLink: {
    display: 'block',
    color: '#374151',
    textDecoration: 'none',
    padding: '0.75rem 0',
    fontSize: '1rem',
    borderBottom: '1px solid #f3f4f6'
  },

  // Hero Section
  heroSection: {
    position: 'relative',
    height: '60vh',
    minHeight: '400px',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      height: '50vh',
      minHeight: '350px'
    }
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
    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.8), rgba(59, 130, 246, 0.6))',
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
    maxWidth: '90%',
    padding: '0 1rem'
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 'bold',
    marginBottom: '1rem',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    marginBottom: '2rem',
    opacity: 0.95,
    lineHeight: '1.5',
    maxWidth: '600px',
    margin: '0 auto 2rem'
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  primaryButton: {
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    padding: '0.875rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)',
    transition: 'all 0.3s'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    padding: '0.875rem 2rem',
    border: '2px solid white',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  enrollBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.3)',
    padding: '0.875rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  slideIndicators: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 3
  },
  indicator: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },

  // Container
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  sectionTitle: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '1rem'
  },
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '3rem',
    maxWidth: '600px',
    margin: '0 auto 3rem',
    lineHeight: '1.6'
  },

  // Stats Section
  statsSection: {
    padding: '3rem 0',
    backgroundColor: '#f8fafc'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '2rem',
    textAlign: 'center'
  },
  statCard: {
    padding: '1rem'
  },
  statNumber: {
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '0.5rem'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '500'
  },

  // Services Section
  servicesSection: {
    padding: '4rem 0',
    backgroundColor: 'white'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s'
  },
  serviceImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  serviceContent: {
    padding: '1.5rem'
  },
  serviceButton: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1e3a8a',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },

  // Cards Section
  cardsSection: {
    padding: '4rem 0',
    backgroundColor: '#f8fafc'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '3rem'
  },
  cardShowcase: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  realisticCard: {
    width: '320px',
    height: '200px',
    margin: '0 auto 1.5rem',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)',
    borderRadius: '12px',
    padding: '20px',
    color: 'white',
    position: 'relative',
    boxShadow: '0 8px 25px rgba(30, 58, 138, 0.3)',
    fontFamily: 'monospace'
  },
  realisticCardPremium: {
    width: '320px',
    height: '200px',
    margin: '0 auto 1.5rem',
    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #8b5cf6 100%)',
    borderRadius: '12px',
    padding: '20px',
    color: 'white',
    position: 'relative',
    boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)',
    fontFamily: 'monospace'
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  cardBankName: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  cardType: {
    fontSize: '0.7rem',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '3px 6px',
    borderRadius: '3px'
  },
  chipContactless: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  chip: {
    width: '35px',
    height: '28px',
    background: 'linear-gradient(45deg, #ffd700, #ffa500)',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.3)'
  },
  contactlessIcon: {
    fontSize: '1.2rem',
    opacity: 0.8
  },
  cardNumber: {
    fontSize: '1rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginBottom: '1.5rem',
    fontFamily: 'monospace'
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  cardLabel: {
    fontSize: '0.6rem',
    opacity: 0.8,
    marginBottom: '3px',
    letterSpacing: '0.5px'
  },
  cardValue: {
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  cardBrand: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    fontSize: '1rem',
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  cardFeatures: {
    listStyle: 'none',
    padding: 0,
    textAlign: 'left',
    marginTop: '1rem'
  },

  // ATM Section
  atmSection: {
    padding: '4rem 0',
    backgroundColor: 'white'
  },
  atmContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '2rem'
    }
  },
  atmText: {},
  atmDescription: {
    fontSize: '1.1rem',
    color: '#64748b',
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
    height: '300px',
    objectFit: 'cover',
    borderRadius: '12px'
  },

  // Mobile Section
  mobileSection: {
    padding: '4rem 0',
    backgroundColor: '#f8fafc'
  },
  mobileContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '2rem',
      textAlign: 'center'
    }
  },
  mobileImages: {
    '@media (max-width: 768px)': {
      order: 2
    }
  },
  mobileImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '12px'
  },
  mobileText: {
    '@media (max-width: 768px)': {
      order: 1
    }
  },
  mobileDescription: {
    fontSize: '1.1rem',
    color: '#64748b',
    lineHeight: '1.7',
    marginBottom: '2rem'
  },
  mobileFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '2rem'
  },
  mobileFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  checkIcon: {
    color: '#059669',
    fontWeight: 'bold'
  },
  appButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      justifyContent: 'center'
    }
  },
  appButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1e3a8a',
    color: 'white',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600'
  },

  // Testimonials Section
  testimonialsSection: {
    padding: '4rem 0',
    backgroundColor: 'white'
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  testimonialCard: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s'
  },
  testimonialHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  testimonialImage: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #e2e8f0'
  },
  testimonialInfo: {},
  testimonialName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.25rem'
  },
  testimonialTitle: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '0.5rem'
  },
  rating: {
    fontSize: '0.9rem'
  },
  testimonialText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#374151',
    fontStyle: 'italic'
  },

  // Features Section
  featuresSection: {
    padding: '4rem 0',
    backgroundColor: '#f8fafc'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem'
  },
  featureCard: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s'
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },

  // Investment Section
  investmentSection: {
    padding: '4rem 0',
    backgroundColor: 'white'
  },
  investmentContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '2rem'
    }
  },
  investmentText: {},
  investmentDescription: {
    fontSize: '1.1rem',
    color: '#64748b',
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
    backgroundColor: '#1e3a8a',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  investmentImages: {},
  investmentImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '12px'
  },

  // CTA Section
  ctaSection: {
    padding: '4rem 0',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: 'white',
    textAlign: 'center'
  },
  ctaTitle: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  ctaSubtitle: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
    opacity: 0.9
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  ctaPrimary: {
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)',
    transition: 'all 0.3s'
  },
  ctaSecondary: {
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2rem',
    border: '2px solid white',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },

  // Enrollment Components
  enrollmentContainer: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    minWidth: '280px',
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
    borderRadius: '6px',
    fontSize: '1rem'
  },
  enrollmentButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  enrollmentSubmit: {
    flex: 1,
    padding: '0.75rem',
    background: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  enrollmentCancel: {
    flex: 1,
    padding: '0.75rem',
    background: 'transparent',
    color: '#6b7280',
    border: '2px solid #d1d5db',
    borderRadius: '6px',
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
