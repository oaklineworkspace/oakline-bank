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
      <div style={styles.enrollmentInputContainer}>
        <form onSubmit={handleEnrollmentRequest} style={styles.enrollmentForm}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            style={styles.emailInput}
          />
          <div style={styles.enrollmentFormButtons}>
            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? 'Sending...' : 'Send Enrollment Link'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowEmailInput(false);
                setMessage('');
                setEmail('');
              }}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
        {message && (
          <div style={{
            ...styles.message,
            color: message.includes('sent') ? '#059669' : '#dc2626',
            backgroundColor: message.includes('sent') ? '#d1fae5' : '#fee2e2'
          }}>
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <button onClick={() => setShowEmailInput(true)} style={styles.enrollButton}>
      <span style={styles.enrollButtonIcon}>🔐</span>
      Enroll for Online Access
    </button>
  );
}

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const router = useRouter();

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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

  const toggleDropdown = (menu) => {
    setDropdownOpen(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [menu]: !prev[menu]
    }));
  };

  const closeAllDropdowns = () => {
    setDropdownOpen({});
  };

  const bankAccountTypes = [
    { name: 'Personal Checking', icon: '💳', desc: 'Everyday banking with debit card access' },
    { name: 'Personal Savings', icon: '💰', desc: 'High-yield savings with competitive rates' },
    { name: 'Business Checking', icon: '🏢', desc: 'Banking solutions for your business' },
    { name: 'Business Savings', icon: '📈', desc: 'Business savings with growth potential' },
    { name: 'Student Checking', icon: '🎓', desc: 'No-fee checking for students' },
    { name: 'Money Market', icon: '📊', desc: 'Higher interest with limited transactions' },
    { name: 'Certificate of Deposit', icon: '🏆', desc: 'Fixed-term savings with guaranteed rates' },
    { name: 'Retirement IRA', icon: '🏖️', desc: 'Tax-advantaged retirement savings' }
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-container" onClick={closeAllDropdowns}>
      {/* Single Professional Bank Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          {/* Logo Section */}
          <Link href="/" style={styles.logoSection}>
            <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.logoImg} />
            <div style={styles.logoTextContainer}>
              <span style={styles.logoText}>Oakline Bank</span>
              <span style={styles.logoTagline}>Your Financial Partner</span>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav style={styles.mainNav}>
            <div style={styles.navDropdown}>
              <button 
                style={styles.navButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('banking');
                }}
              >
                Banking Services ▼
              </button>
              {dropdownOpen.banking && (
                <div style={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>💳 Accounts</h4>
                    <Link href="/apply" style={styles.dropdownLink}>Personal Checking</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Savings Account</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Business Banking</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🏠 Loans</h4>
                    <Link href="/apply" style={styles.dropdownLink}>Home Mortgage</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Auto Loans</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Personal Loans</Link>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.navDropdown}>
              <button 
                style={styles.navButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('digital');
                }}
              >
                Digital Banking ▼
              </button>
              {dropdownOpen.digital && (
                <div style={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>📱 Online Services</h4>
                    <Link href="/dashboard" style={styles.dropdownLink}>Online Banking</Link>
                    <Link href="/transfer" style={styles.dropdownLink}>Transfer Money</Link>
                    <Link href="/bill-pay" style={styles.dropdownLink}>Pay Bills</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/support" style={styles.navLink}>Support</Link>
            <Link href="/market-news" style={styles.navLink}>Market News</Link>
          </nav>

          {/* Header Actions */}
          <div style={styles.headerActions}>
            {!user ? (
              <>
                <Link href="/login" style={styles.loginBtn}>Sign In</Link>
                <Link href="/apply" style={styles.applyBtn}>Open Account</Link>
              </>
            ) : (
              <>
                <span style={styles.welcomeText}>Welcome, {user.email?.split('@')[0]}</span>
                <Link href="/dashboard" style={styles.dashboardBtn}>Dashboard</Link>
                <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section with Proper Image Display */}
        <section style={styles.heroSection}>
          <div style={styles.heroContent}>
            <div style={styles.heroText}>
              <h1 style={styles.heroTitle}>
                Modern Banking
                <span style={styles.heroHighlight}> Simplified</span>
              </h1>
              <p style={styles.heroSubtitle}>
                Experience the future of banking with our innovative digital platform. 
                Secure, convenient, and designed for your financial success.
              </p>
              <div style={styles.heroActions}>
                {!user ? (
                  <>
                    <Link href="/apply" style={styles.primaryHeroBtn}>Open Account</Link>
                    <EnrollmentButton />
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" style={styles.primaryHeroBtn}>Go to Dashboard</Link>
                    <Link href="/main-menu" style={styles.secondaryHeroBtn}>Main Menu</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Banking Experience Gallery */}
        <section style={styles.gallerySection}>
          <div style={styles.container}>
            <h2 style={styles.galleryTitle}>Experience Modern Banking</h2>
            <p style={styles.gallerySubtitle}>
              Discover how Oakline Bank transforms your financial experience with cutting-edge technology and personalized service
            </p>

            <div style={styles.imageGrid}>
              <div style={styles.imageItem}>
                <div style={styles.imageContainer}>
                  <img 
                    src="/images/Modern_bank_lobby_interior_d535acc7.png" 
                    alt="Modern Bank Lobby" 
                    style={styles.galleryImage}
                  />
                </div>
                <div style={styles.imageDescription}>
                  <h3 style={styles.imageTitle}>Modern Banking Facilities</h3>
                  <p style={styles.imageText}>
                    Experience banking in our state-of-the-art branches designed with your comfort and convenience in mind. 
                    Our modern facilities feature the latest technology and comfortable waiting areas.
                  </p>
                </div>
              </div>

              <div style={styles.imageItem}>
                <div style={styles.imageContainer}>
                  <img 
                    src="/images/Mobile_banking_user_experience_576bb7a3.png" 
                    alt="Mobile Banking" 
                    style={styles.galleryImage}
                  />
                </div>
                <div style={styles.imageDescription}>
                  <h3 style={styles.imageTitle}>Mobile Banking Excellence</h3>
                  <p style={styles.imageText}>
                    Banking at your fingertips, anytime, anywhere. Our award-winning mobile app provides seamless access 
                    to all your accounts, instant transfers, and mobile check deposits.
                  </p>
                </div>
              </div>

              <div style={styles.imageItem}>
                <div style={styles.imageContainer}>
                  <img 
                    src="/images/Digital_investment_dashboard_36d35f19.png" 
                    alt="Investment Dashboard" 
                    style={styles.galleryImage}
                  />
                </div>
                <div style={styles.imageDescription}>
                  <h3 style={styles.imageTitle}>Smart Investment Tools</h3>
                  <p style={styles.imageText}>
                    Advanced portfolio management and insights to help you grow your wealth. Our digital investment platform 
                    provides real-time market data and personalized recommendations.
                  </p>
                </div>
              </div>

              <div style={styles.imageItem}>
                <div style={styles.imageContainer}>
                  <img 
                    src="/images/Bank_hall_business_discussion_72f98bbe.png" 
                    alt="Business Banking" 
                    style={styles.galleryImage}
                  />
                </div>
                <div style={styles.imageDescription}>
                  <h3 style={styles.imageTitle}>Professional Banking Services</h3>
                  <p style={styles.imageText}>
                    Expert guidance for all your financial decisions. Our experienced banking professionals provide 
                    personalized advice and comprehensive financial planning.
                  </p>
                </div>
              </div>

              <div style={styles.imageItem}>
                <div style={styles.imageContainer}>
                  <img 
                    src="/images/Banking_executive_team_meeting_c758f3ec.png" 
                    alt="Executive Team" 
                    style={styles.galleryImage}
                  />
                </div>
                <div style={styles.imageDescription}>
                  <h3 style={styles.imageTitle}>Expert Financial Team</h3>
                  <p style={styles.imageText}>
                    Dedicated professionals committed to your financial success. Our team of certified financial advisors 
                    work together to provide you with exceptional banking experience.
                  </p>
                </div>
              </div>

              <div style={styles.imageItem}>
                <div style={styles.imageContainer}>
                  <img 
                    src="/images/Loan_approval_celebration_banner_919a886f.png" 
                    alt="Loan Approval" 
                    style={styles.galleryImage}
                  />
                </div>
                <div style={styles.imageDescription}>
                  <h3 style={styles.imageTitle}>Quick Loan Approvals</h3>
                  <p style={styles.imageText}>
                    Fast processing and competitive rates for all your borrowing needs. Our streamlined approval process 
                    gets you the funds you need quickly and efficiently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={styles.featuresSection}>
          <div style={styles.container}>
            <h2 style={styles.featuresTitle}>Why Choose Oakline Bank?</h2>
            <div style={styles.featuresGrid}>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🏦</div>
                <h3 style={styles.featureTitle}>Instant Account Opening</h3>
                <p style={styles.featureDescription}>
                  Open your account in minutes with our streamlined digital process
                </p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📱</div>
                <h3 style={styles.featureTitle}>Mobile Banking</h3>
                <p style={styles.featureDescription}>
                  Bank anywhere, anytime with our award-winning mobile app
                </p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🔒</div>
                <h3 style={styles.featureTitle}>Bank-Level Security</h3>
                <p style={styles.featureDescription}>
                  Your money and data are protected with industry-leading security
                </p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>💳</div>
                <h3 style={styles.featureTitle}>No Monthly Fees</h3>
                <p style={styles.featureDescription}>
                  Enjoy free checking with no minimum balance requirements
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section style={styles.ctaSection}>
          <div style={styles.container}>
            <div style={styles.ctaContent}>
              <h2 style={styles.ctaTitle}>Ready to Start Your Financial Journey?</h2>
              <p style={styles.ctaSubtitle}>
                Join over 500,000 customers who trust Oakline Bank for their financial needs
              </p>
              <div style={styles.ctaActions}>
                <Link href="/apply" style={styles.ctaButton}>Open Account Today</Link>
                <Link href="/support" style={styles.ctaSecondaryButton}>Contact Us</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc'
  },
  loading: {
    fontSize: '1.2rem',
    color: '#64748b'
  },

  // Header Styles
  header: {
    backgroundColor: '#1e3a8a',
    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  headerContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '80px',
    gap: '2rem'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none',
    color: 'white'
  },
  logoImg: {
    height: '50px',
    width: 'auto',
    borderRadius: '8px'
  },
  logoTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  logoText: {
    fontSize: '1.8rem',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    lineHeight: '1.2'
  },
  logoTagline: {
    fontSize: '0.85rem',
    opacity: 0.8,
    fontWeight: '400'
  },
  mainNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  navDropdown: {
    position: 'relative'
  },
  navButton: {
    padding: '0.75rem 1.25rem',
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap'
  },
  navLink: {
    padding: '0.75rem 1.25rem',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    border: '2px solid transparent'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 20px 25px rgba(0,0,0,0.15)',
    padding: '1.5rem',
    minWidth: '320px',
    zIndex: 1000,
    marginTop: '0.5rem',
    display: 'flex',
    gap: '1.5rem'
  },
  dropdownSection: {
    flex: 1,
    minWidth: '150px'
  },
  dropdownHeading: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: '0.75rem'
  },
  dropdownLink: {
    display: 'block',
    padding: '0.5rem 0.75rem',
    color: '#374151',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
    marginBottom: '0.25rem'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  welcomeText: {
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  loginBtn: {
    padding: '0.75rem 1.5rem',
    color: 'white',
    textDecoration: 'none',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  applyBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
  },
  dashboardBtn: {
    padding: '0.75rem 1.25rem',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  logoutBtn: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  // Hero Section
  heroSection: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    padding: '5rem 2rem',
    color: 'white',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  heroText: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: '700',
    marginBottom: '1.5rem',
    lineHeight: '1.2'
  },
  heroHighlight: {
    color: '#fbbf24'
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    marginBottom: '2.5rem',
    opacity: 0.9,
    lineHeight: '1.6'
  },
  heroActions: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  primaryHeroBtn: {
    padding: '1rem 2rem',
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    boxShadow: '0 8px 20px rgba(5, 150, 105, 0.4)',
    transition: 'all 0.3s ease'
  },
  secondaryHeroBtn: {
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: '2px solid white',
    transition: 'all 0.3s ease'
  },

  // Gallery Section
  gallerySection: {
    padding: '5rem 2rem',
    backgroundColor: '#f8fafc'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  galleryTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '1rem'
  },
  gallerySubtitle: {
    fontSize: '1.2rem',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '4rem',
    lineHeight: '1.6',
    maxWidth: '800px',
    margin: '0 auto 4rem'
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '3rem',
    alignItems: 'start'
  },
  imageItem: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  imageContainer: {
    width: '100%',
    height: '250px',
    overflow: 'hidden',
    position: 'relative'
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    transition: 'transform 0.3s ease'
  },
  imageDescription: {
    padding: '2rem'
  },
  imageTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  imageText: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.6',
    margin: 0
  },

  // Features Section
  featuresSection: {
    padding: '5rem 2rem',
    backgroundColor: 'white'
  },
  featuresTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '3rem'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem'
  },
  featureCard: {
    backgroundColor: '#f8fafc',
    padding: '2.5rem 2rem',
    borderRadius: '16px',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1.5rem'
  },
  featureTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  featureDescription: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.6',
    margin: 0
  },

  // CTA Section
  ctaSection: {
    padding: '5rem 2rem',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: 'white'
  },
  ctaContent: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },
  ctaTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: '700',
    marginBottom: '1.5rem'
  },
  ctaSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '2.5rem',
    opacity: 0.9,
    lineHeight: '1.6'
  },
  ctaActions: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  ctaButton: {
    padding: '1rem 2rem',
    backgroundColor: '#059669',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    boxShadow: '0 8px 20px rgba(5, 150, 105, 0.4)',
    transition: 'all 0.3s ease'
  },
  ctaSecondaryButton: {
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: '2px solid white',
    transition: 'all 0.3s ease'
  },

  // Enrollment Components
  enrollButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '1rem 2rem',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: '2px solid rgba(255,255,255,0.3)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  enrollButtonIcon: {
    fontSize: '1.2rem'
  },
  enrollmentInputContainer: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    minWidth: '320px',
    color: '#374151'
  },
  enrollmentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  emailInput: {
    padding: '0.75rem 1rem',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none'
  },
  enrollmentFormButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  submitButton: {
    flex: 1,
    padding: '0.75rem',
    background: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  cancelButton: {
    flex: 1,
    padding: '0.75rem',
    background: 'transparent',
    color: '#6b7280',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  message: {
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginTop: '1rem',
    textAlign: 'center'
  }
};