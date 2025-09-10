import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
      // Check if email exists in applications table
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

      // Request enrollment email resend
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

    // Listen for auth state changes
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

  // Bank account types
  const bankAccountTypes = [
    { name: 'Personal Checking', icon: '💳', desc: 'Everyday banking with debit card access' },
    { name: 'Personal Savings', icon: '💰', desc: 'High-yield savings with competitive rates' },
    { name: 'Business Checking', icon: '🏢', desc: 'Banking solutions for your business' },
    { name: 'Business Savings', icon: '📈', desc: 'Business savings with growth potential' },
    { name: 'Student Checking', icon: '🎓', desc: 'No-fee checking for students' },
    { name: 'Money Market', icon: '📊', desc: 'Higher interest with limited transactions' },
    { name: 'Certificate of Deposit', icon: '🏆', desc: 'Fixed-term savings with guaranteed rates' },
    { name: 'Retirement IRA', icon: '🏖️', desc: 'Tax-advantaged retirement savings' },
    { name: 'Joint Checking', icon: '👥', desc: 'Shared checking for couples/families' },
    { name: 'Trust Account', icon: '🛡️', desc: 'Fiduciary account management' },
    { name: 'Investment Brokerage', icon: '📈', desc: 'Trade stocks, bonds, and ETFs' },
    { name: 'High Yield Savings', icon: '💎', desc: 'Premium savings with top rates' },
    { name: 'International Checking', icon: '🌍', desc: 'Global banking without borders' },
    { name: 'Foreign Currency', icon: '💱', desc: 'Multi-currency account management' },
    { name: 'Cryptocurrency Wallet', icon: '₿', desc: 'Digital currency storage and trading' },
    { name: 'Loan Repayment', icon: '🏦', desc: 'Dedicated loan payment account' },
    { name: 'Mortgage Account', icon: '🏠', desc: 'Home loan management' },
    { name: 'Auto Loan', icon: '🚗', desc: 'Vehicle financing solutions' },
    { name: 'Credit Card', icon: '💳', desc: 'Revolving credit with rewards' },
    { name: 'Prepaid Card', icon: '🎁', desc: 'Prepaid spending control' },
    { name: 'Payroll Account', icon: '💼', desc: 'Direct deposit and payroll services' },
    { name: 'Nonprofit Charity', icon: '❤️', desc: 'Special accounts for nonprofits' },
    { name: 'Escrow Account', icon: '📋', desc: 'Third-party fund management' }
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
      {/* Standard Bank Header */}
      <header style={styles.bankHeader}>
        <div style={styles.headerContainer}>
          <Link href="/" style={styles.logoSection}>
            <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.logoImg} />
            <span style={styles.logoText}>Oakline Bank</span>
          </Link>

          {/* Main Navigation */}
          <nav style={styles.mainNav}>
            {/* Personal Banking Dropdown */}
            <div style={styles.navDropdown}>
              <button 
                style={styles.navButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('personal');
                }}
              >
                Personal Banking ▼
              </button>
              {dropdownOpen.personal && (
                <div style={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>💳 Checking & Savings</h4>
                    <Link href="/apply" style={styles.dropdownLink}>Personal Checking</Link>
                    <Link href="/apply" style={styles.dropdownLink}>High Yield Savings</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Student Checking</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Money Market</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🏦 Specialized Accounts</h4>
                    <Link href="/apply" style={styles.dropdownLink}>Certificate of Deposit</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Retirement IRA</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Joint Checking</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Trust Account</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Business Banking Dropdown */}
            <div style={styles.navDropdown}>
              <button 
                style={styles.navButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('business');
                }}
              >
                Business Banking ▼
              </button>
              {dropdownOpen.business && (
                <div style={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🏢 Business Accounts</h4>
                    <Link href="/apply" style={styles.dropdownLink}>Business Checking</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Business Savings</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Payroll Account</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Nonprofit Charity</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>📊 Business Services</h4>
                    <Link href="/apply" style={styles.dropdownLink}>Merchant Services</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Business Loans</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Escrow Account</Link>
                  </div>
                </div>
              )}
            </div>

            {/* All Account Types Dropdown */}
            <div style={styles.navDropdown}>
              <button 
                style={styles.navButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('allAccounts');
                }}
              >
                All Account Types ▼
              </button>
              {dropdownOpen.allAccounts && (
                <div style={styles.largeDropdownMenu} onClick={(e) => e.stopPropagation()}>
                  <h3 style={styles.largeDropdownTitle}>Complete Banking Solutions</h3>
                  <div style={styles.accountTypesGrid}>
                    {bankAccountTypes.map((accountType, index) => (
                      <Link href="/apply" key={index} style={styles.accountTypeCard}>
                        <span style={styles.accountTypeIcon}>{accountType.icon}</span>
                        <div style={styles.accountTypeInfo}>
                          <div style={styles.accountTypeName}>{accountType.name}</div>
                          <div style={styles.accountTypeDesc}>{accountType.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Investment & Loans Dropdown */}
            <div style={styles.navDropdown}>
              <button 
                style={styles.navButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('investments');
                }}
              >
                Investments & Loans ▼
              </button>
              {dropdownOpen.investments && (
                <div style={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>📈 Investment Options</h4>
                    <Link href="/apply" style={styles.dropdownLink}>Investment Brokerage</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Cryptocurrency Wallet</Link>
                    <Link href="/investments" style={styles.dropdownLink}>Portfolio Management</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🏠 Loans & Credit</h4>
                    <Link href="/apply" style={styles.dropdownLink}>Mortgage Account</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Auto Loan</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Credit Card</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Personal Loans</Link>
                  </div>
                </div>
              )}
            </div>

            {/* International Banking Dropdown */}
            <div style={styles.navDropdown}>
              <button 
                style={styles.navButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('international');
                }}
              >
                International ▼
              </button>
              {dropdownOpen.international && (
                <div style={styles.dropdownMenu} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🌍 Global Banking</h4>
                    <Link href="/apply" style={styles.dropdownLink}>International Checking</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Foreign Currency</Link>
                    <Link href="/transfer" style={styles.dropdownLink}>Wire Transfers</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Multi-Currency Cards</Link>
                  </div>
                </div>
              )}
            </div>
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
                <Link href="/dashboard" style={styles.dashboardBtn}>Dashboard</Link>
                <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
              </>
            )}
          </div>
        </div>
      </header>

      <MainMenu user={user} />

      {/* Top Action Buttons */}
      <section style={styles.topActionsSection}>
        <div style={styles.container}>
          <div style={styles.topActions}>
            {!user ? (
              // Guest user buttons
              <>
                <Link href="/apply" style={styles.primaryActionButton}>
                  <span style={styles.actionButtonIcon}>🏦</span>
                  Open New Account
                </Link>
                <EnrollmentButton />
                <Link href="/login" style={styles.secondaryActionButton}>
                  <span style={styles.actionButtonIcon}>🔐</span>
                  Sign In
                </Link>
              </>
            ) : (
              // Logged-in user buttons
              <>
                <div style={styles.userGreeting}>
                  Welcome back, {user.email?.split('@')[0] || 'User'}!
                </div>
                <Link href="/main-menu" style={styles.loggedInButton}>
                  <span style={styles.actionButtonIcon}>🏠</span>
                  Main Menu
                </Link>
                <Link href="/dashboard" style={styles.loggedInButton}>
                  <span style={styles.actionButtonIcon}>📊</span>
                  Dashboard
                </Link>
                <button onClick={handleLogout} style={styles.logoutActionButton}>
                  <span style={styles.actionButtonIcon}>🚪</span>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Only show welcome banner for guests */}
      {!user && <WelcomeBanner />}

      <main>
        {/* Only show hero sections for guests */}
        {!user && (
          <>
            <HeroSection />
            <ServicesSection />
            <FeaturesSection />
            <LoanApprovalSection />
            <TestimonialsSection />
          </>
        )}

        {/* Conditional Enrollment/Dashboard Section */}
        {!user ? (
          // Guest enrollment section
          <section style={styles.enrollmentSection}>
            <div style={styles.container}>
              <div style={styles.enrollmentContent}>
                <h2 style={styles.enrollmentTitle}>Already Have an Account?</h2>
                <p style={styles.enrollmentSubtitle}>
                  Enroll for online banking access to manage your accounts, transfer funds, pay bills, and more.
                </p>
                <div style={styles.enrollmentButtons}>
                  <EnrollmentButton />
                  <Link href="/login" style={styles.loginButton}>
                    Already Enrolled? Sign In
                  </Link>
                </div>
                <div style={styles.enrollmentFeatures}>
                  <div style={styles.feature}>
                    <span style={styles.featureIcon}>📱</span>
                    <span>Mobile Banking</span>
                  </div>
                  <div style={styles.feature}>
                    <span style={styles.featureIcon}>💳</span>
                    <span>Bill Pay</span>
                  </div>
                  <div style={styles.feature}>
                    <span style={styles.featureIcon}>📊</span>
                    <span>Account Management</span>
                  </div>
                  <div style={styles.feature}>
                    <span style={styles.featureIcon}>🔒</span>
                    <span>Secure Transfers</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          // Logged-in user quick access section
          <section style={styles.userDashboardSection}>
            <div style={styles.container}>
              <div style={styles.userDashboardContent}>
                <h2 style={styles.userDashboardTitle}>Quick Access</h2>
                <p style={styles.userDashboardSubtitle}>
                  Access your most used banking features quickly
                </p>
                <div style={styles.quickAccessGrid}>
                  <Link href="/dashboard" style={styles.quickAccessCard}>
                    <span style={styles.quickAccessIcon}>📊</span>
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/transfer" style={styles.quickAccessCard}>
                    <span style={styles.quickAccessIcon}>💸</span>
                    <span>Transfer</span>
                  </Link>
                  <Link href="/deposit-real" style={styles.quickAccessCard}>
                    <span style={styles.quickAccessIcon}>📥</span>
                    <span>Deposit</span>
                  </Link>
                  <Link href="/transactions" style={styles.quickAccessCard}>
                    <span style={styles.quickAccessIcon}>📋</span>
                    <span>Transactions</span>
                  </Link>
                  <Link href="/bills" style={styles.quickAccessCard}>
                    <span style={styles.quickAccessIcon}>🧾</span>
                    <span>Pay Bills</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        

        {/* CTAs based on user state */}
        {!user ? (
          <>
            <CTA
              title="New to Oakline Bank?"
              subtitle="Join over 500,000 customers who trust Oakline Bank for their financial needs. Open your account today and experience the difference."
              buttonText="Open New Account"
              buttonLink="/apply"
              variant="primary"
            />
            <CTA
              title="Ready to Start Your Financial Journey?"
              subtitle="Whether you're opening a new account or need banking services, we're here to help you achieve your financial goals."
              buttonText="Explore Our Services"
              buttonLink="/apply"
              variant="secondary"
            />
          </>
        ) : (
          <CTA
            title="Explore More Banking Services"
            subtitle="Discover additional ways we can help you manage and grow your finances with our comprehensive banking solutions."
            buttonText="View All Services"
            buttonLink="/main-menu"
            variant="primary"
          />
        )}

        {/* Banking Experience Gallery - Showcased individually */}
        <section style={styles.gallerySection}>
          <div style={styles.container}>
            <h2 style={styles.galleryTitle}>Experience Modern Banking</h2>
            <p style={styles.gallerySubtitle}>See how Oakline Bank transforms your financial experience with cutting-edge technology and personalized service</p>
            
            {/* Featured Gallery Items - Displayed in sequence */}
            <div style={styles.featuredGallery}>
              <div style={styles.featuredItem}>
                <div style={styles.featuredImageContainer}>
                  <img src="/images/Modern_bank_lobby_interior_d535acc7.png" alt="Modern Bank Lobby" style={styles.featuredImage} />
                </div>
                <div style={styles.featuredContent}>
                  <h3 style={styles.featuredTitle}>Modern Banking Facilities</h3>
                  <p style={styles.featuredDesc}>Experience banking in our state-of-the-art branches designed with your comfort and convenience in mind. Our modern facilities feature the latest technology, comfortable waiting areas, and private consultation rooms.</p>
                  <Link href="/apply" style={styles.featuredButton}>Visit a Branch</Link>
                </div>
              </div>

              <div style={styles.featuredItem}>
                <div style={styles.featuredContent}>
                  <h3 style={styles.featuredTitle}>Mobile Banking Excellence</h3>
                  <p style={styles.featuredDesc}>Banking at your fingertips, anytime, anywhere. Our award-winning mobile app provides seamless access to all your accounts, instant transfers, mobile check deposits, and real-time notifications to keep you in control of your finances.</p>
                  <Link href="/apply" style={styles.featuredButton}>Get Mobile Banking</Link>
                </div>
                <div style={styles.featuredImageContainer}>
                  <img src="/images/Mobile_banking_user_experience_576bb7a3.png" alt="Mobile Banking" style={styles.featuredImage} />
                </div>
              </div>

              <div style={styles.featuredItem}>
                <div style={styles.featuredImageContainer}>
                  <img src="/images/Digital_investment_dashboard_36d35f19.png" alt="Investment Dashboard" style={styles.featuredImage} />
                </div>
                <div style={styles.featuredContent}>
                  <h3 style={styles.featuredTitle}>Smart Investment Tools</h3>
                  <p style={styles.featuredDesc}>Advanced portfolio management and insights to help you grow your wealth. Our digital investment platform provides real-time market data, personalized recommendations, and comprehensive analytics to guide your investment decisions.</p>
                  <Link href="/investments" style={styles.featuredButton}>Start Investing</Link>
                </div>
              </div>

              <div style={styles.featuredItem}>
                <div style={styles.featuredContent}>
                  <h3 style={styles.featuredTitle}>Professional Banking Services</h3>
                  <p style={styles.featuredDesc}>Expert guidance for all your financial decisions. Our experienced banking professionals provide personalized advice, comprehensive financial planning, and tailored solutions to help you achieve your financial goals.</p>
                  <Link href="/apply" style={styles.featuredButton}>Schedule Consultation</Link>
                </div>
                <div style={styles.featuredImageContainer}>
                  <img src="/images/Bank_hall_business_discussion_72f98bbe.png" alt="Business Banking" style={styles.featuredImage} />
                </div>
              </div>

              <div style={styles.featuredItem}>
                <div style={styles.featuredImageContainer}>
                  <img src="/images/Banking_executive_team_meeting_c758f3ec.png" alt="Executive Team" style={styles.featuredImage} />
                </div>
                <div style={styles.featuredContent}>
                  <h3 style={styles.featuredTitle}>Expert Financial Team</h3>
                  <p style={styles.featuredDesc}>Dedicated professionals committed to your financial success. Our team of certified financial advisors, loan specialists, and customer service representatives work together to provide you with exceptional banking experience.</p>
                  <Link href="/support" style={styles.featuredButton}>Meet Our Team</Link>
                </div>
              </div>

              <div style={styles.featuredItem}>
                <div style={styles.featuredContent}>
                  <h3 style={styles.featuredTitle}>Quick Loan Approvals</h3>
                  <p style={styles.featuredDesc}>Fast processing and competitive rates for all your borrowing needs. Whether you're buying a home, starting a business, or making a major purchase, our streamlined approval process gets you the funds you need quickly.</p>
                  <Link href="/loans" style={styles.featuredButton}>Apply for Loan</Link>
                </div>
                <div style={styles.featuredImageContainer}>
                  <img src="/images/Loan_approval_celebration_banner_919a886f.png" alt="Loan Approval" style={styles.featuredImage} />
                </div>
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
  bankHeader: {
    backgroundColor: '#1e40af',
    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  headerContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '70px',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    color: 'white'
  },
  logoImg: {
    height: '40px',
    width: 'auto'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    letterSpacing: '-0.5px'
  },
  mainNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  navDropdown: {
    position: 'relative'
  },
  navButton: {
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
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
  largeDropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
    padding: '2rem',
    width: '90vw',
    maxWidth: '900px',
    zIndex: 1000,
    marginTop: '0.5rem',
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  largeDropdownTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  dropdownSection: {
    flex: 1,
    minWidth: '200px'
  },
  dropdownHeading: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#1e40af',
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
  accountTypesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem'
  },
  accountTypeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.2s',
    border: '1px solid #e2e8f0'
  },
  accountTypeIcon: {
    fontSize: '1.5rem',
    minWidth: '40px',
    textAlign: 'center'
  },
  accountTypeInfo: {
    flex: 1
  },
  accountTypeName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.25rem'
  },
  accountTypeDesc: {
    fontSize: '0.8rem',
    color: '#64748b',
    lineHeight: '1.4'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  loginBtn: {
    padding: '0.5rem 1rem',
    color: 'white',
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  applyBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  dashboardBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(220, 38, 38, 0.8)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  topActionsSection: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    padding: '1.5rem 0',
    borderBottom: '1px solid #1e40af'
  },
  topActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  userGreeting: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    padding: '12px 16px'
  },
  primaryActionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)'
  },
  secondaryActionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'transparent',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s ease'
  },
  loggedInButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease'
  },
  logoutActionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(220, 38, 38, 0.8)',
    color: 'white',
    border: '1px solid rgba(220, 38, 38, 0.9)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  actionButtonIcon: {
    fontSize: '16px'
  },
  enrollmentSection: {
    padding: '4rem 0',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0'
  },
  userDashboardSection: {
    padding: '4rem 0',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    borderTop: '1px solid #bae6fd',
    borderBottom: '1px solid #bae6fd'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
  },
  enrollmentContent: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },
  userDashboardContent: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },
  enrollmentTitle: {
    fontSize: 'clamp(28px, 4vw, 36px)',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem',
    lineHeight: '1.2'
  },
  userDashboardTitle: {
    fontSize: 'clamp(28px, 4vw, 36px)',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem',
    lineHeight: '1.2'
  },
  enrollmentSubtitle: {
    fontSize: '18px',
    color: '#64748b',
    marginBottom: '2.5rem',
    lineHeight: '1.6'
  },
  userDashboardSubtitle: {
    fontSize: '18px',
    color: '#64748b',
    marginBottom: '2.5rem',
    lineHeight: '1.6'
  },
  enrollmentButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '3rem',
    flexWrap: 'wrap'
  },
  quickAccessGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  quickAccessCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '1.5rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: '#374151',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  quickAccessIcon: {
    fontSize: '2rem'
  },
  enrollButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 4px 14px rgba(30, 64, 175, 0.3)',
    transition: 'all 0.3s ease',
    minHeight: '52px',
    border: 'none',
    cursor: 'pointer'
  },
  enrollButtonIcon: {
    fontSize: '18px'
  },
  loginButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'transparent',
    color: '#1e40af',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    border: '2px solid #1e40af',
    transition: 'all 0.3s ease',
    minHeight: '52px'
  },
  enrollmentFeatures: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '1rem',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  featureIcon: {
    fontSize: '18px'
  },
  enrollmentInputContainer: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
    minWidth: '300px'
  },
  enrollmentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  emailInput: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  },
  enrollmentFormButtons: {
    display: 'flex',
    gap: '8px'
  },
  submitButton: {
    flex: 1,
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  cancelButton: {
    flex: 1,
    padding: '12px 16px',
    background: 'transparent',
    color: '#6b7280',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  message: {
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '12px',
    textAlign: 'center'
  },
  gallerySection: {
    padding: '5rem 0',
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    borderTop: '1px solid #bae6fd'
  },
  galleryTitle: {
    fontSize: 'clamp(32px, 5vw, 42px)',
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '1rem',
    lineHeight: '1.2'
  },
  gallerySubtitle: {
    fontSize: '20px',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '4rem',
    lineHeight: '1.6',
    maxWidth: '800px',
    margin: '0 auto 4rem'
  },
  featuredGallery: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  featuredItem: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '3rem',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '2rem',
      padding: '2rem'
    }
  },
  featuredImageContainer: {
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
  },
  featuredImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.3s ease'
  },
  featuredContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  featuredTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1e293b',
    lineHeight: '1.3'
  },
  featuredDesc: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: '1.6'
  },
  featuredButton: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    backgroundColor: '#1e40af',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    alignSelf: 'flex-start',
    boxShadow: '0 4px 14px rgba(30, 64, 175, 0.3)'
  }
};