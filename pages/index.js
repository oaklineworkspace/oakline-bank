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
      {/* Professional Bank Header */}
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

        {/* Main Navigation */}
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

            {/* Navigation Menu */}
            <div style={styles.navMenu}>
              <Link href="/apply" style={styles.navLink}>Open Account</Link>
              <Link href="/loans" style={styles.navLink}>Loans</Link>
              <Link href="/investments" style={styles.navLink}>Investments</Link>
              <Link href="/cards" style={styles.navLink}>Cards</Link>
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
        {/* Hero Section with Image Carousel */}
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
                <h3>Personal Banking</h3>
                <p>Checking, savings, and personal loans designed for your lifestyle.</p>
                <Link href="/apply" style={styles.serviceButton}>Learn More</Link>
              </div>
              <div style={styles.serviceCard}>
                <img src="/images/Banking_executive_team_meeting_c758f3ec.png" alt="Business Banking" style={styles.serviceImage} />
                <h3>Business Banking</h3>
                <p>Comprehensive solutions to help your business grow and succeed.</p>
                <Link href="/apply" style={styles.serviceButton}>Learn More</Link>
              </div>
              <div style={styles.serviceCard}>
                <img src="/images/Loan_approval_celebration_banner_919a886f.png" alt="Loan Services" style={styles.serviceImage} />
                <h3>Loan Services</h3>
                <p>Home, auto, and personal loans with competitive rates and fast approval.</p>
                <Link href="/loans" style={styles.serviceButton}>Learn More</Link>
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
                <p>Your deposits are FDIC insured up to $250,000 with advanced encryption.</p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📱</div>
                <h3>Mobile Banking</h3>
                <p>Award-winning mobile app with biometric login and instant notifications.</p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🏦</div>
                <h3>No Monthly Fees</h3>
                <p>Free checking with no minimum balance requirements or hidden fees.</p>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>⚡</div>
                <h3>Instant Transfers</h3>
                <p>Real-time money transfers between accounts and to other banks.</p>
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
    flexDirection: 'column'
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

  // Header Styles
  header: {
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  topBar: {
    backgroundColor: '#1e3a8a',
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
    padding: '1rem 0'
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
    color: '#1e3a8a',
    lineHeight: '1.2'
  },
  tagline: {
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '500'
  },
  navMenu: {
    display: 'flex',
    gap: '2rem'
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
    color: '#1e3a8a',
    textDecoration: 'none',
    padding: '0.75rem 1.5rem',
    border: '2px solid #1e3a8a',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  applyButton: {
    backgroundColor: '#16a34a',
    color: 'white',
    textDecoration: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s',
    boxShadow: '0 2px 4px rgba(22, 163, 74, 0.3)'
  },
  dashboardButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    textDecoration: 'none',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer'
  },

  // Hero Section
  heroSection: {
    position: 'relative',
    height: '600px',
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
    backgroundColor: '#16a34a',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    boxShadow: '0 8px 20px rgba(22, 163, 74, 0.4)',
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

  // Sections
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
  },
  sectionTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '3rem'
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
    height: '200px',
    objectFit: 'cover'
  },
  serviceButton: {
    display: 'inline-block',
    margin: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1e3a8a',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600'
  },
  featuresSection: {
    padding: '5rem 0',
    backgroundColor: 'white'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem'
  },
  featureCard: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '16px',
    border: '1px solid #e2e8f0'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1.5rem'
  },
  ctaSection: {
    padding: '5rem 0',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
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
    marginBottom: '2.5rem',
    opacity: 0.9
  },
  ctaButtons: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  ctaPrimary: {
    backgroundColor: '#16a34a',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    boxShadow: '0 8px 20px rgba(22, 163, 74, 0.4)'
  },
  ctaSecondary: {
    backgroundColor: 'transparent',
    color: 'white',
    textDecoration: 'none',
    padding: '1rem 2rem',
    border: '2px solid white',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600'
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
    background: '#1e3a8a',
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