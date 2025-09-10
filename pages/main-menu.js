
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function MainMenu() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
        if (session?.user) {
          fetchUserData(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await fetchUserData(user);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const fetchUserData = async (user) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('applications')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getUserDisplayName = () => {
    if (userProfile) {
      return `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
    }
    return user?.email?.split('@')[0] || 'User';
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

  const handleSupportContact = () => {
    window.location.href = 'mailto:support@theoaklinebank.com?subject=Customer Support Request';
  };

  const allServices = [
    // Account Management
    { name: 'Dashboard', path: '/dashboard', icon: '📊', category: 'Account Management', description: 'View account overview and balances' },
    { name: 'Account Details', path: '/account-details', icon: '📋', category: 'Account Management', description: 'Detailed account information' },
    { name: 'Transaction History', path: '/transactions', icon: '📜', category: 'Account Management', description: 'View all transactions' },
    { name: 'My Profile', path: '/profile', icon: '👤', category: 'Account Management', description: 'Manage personal information' },
    
    // Money Management
    { name: 'Transfer Money', path: '/transfer', icon: '💸', category: 'Money Management', description: 'Transfer between accounts or to others' },
    { name: 'Make Deposit', path: '/deposit-real', icon: '📥', category: 'Money Management', description: 'Deposit money to your account' },
    { name: 'Withdraw Funds', path: '/withdrawal', icon: '📤', category: 'Money Management', description: 'Withdraw money from your account' },
    { name: 'Bill Pay', path: '/bill-pay', icon: '🧾', category: 'Money Management', description: 'Pay your bills online' },
    
    // Cards & Digital
    { name: 'My Cards', path: '/cards', icon: '💳', category: 'Cards & Digital', description: 'Manage debit and credit cards' },
    { name: 'Digital Wallet', path: '/digital-wallet', icon: '📱', category: 'Cards & Digital', description: 'Mobile payment options' },
    { name: 'Card Controls', path: '/card-controls', icon: '🔧', category: 'Cards & Digital', description: 'Set spending limits and controls' },
    
    // Loans & Credit
    { name: 'Loans', path: '/loans', icon: '🏠', category: 'Loans & Credit', description: 'Apply for personal, auto, or home loans' },
    { name: 'Credit Report', path: '/credit-report', icon: '📋', category: 'Loans & Credit', description: 'Check your credit score and history' },
    
    // Investments
    { name: 'Investments', path: '/investments', icon: '📊', category: 'Investments', description: 'Manage your investment portfolio' },
    { name: 'Cryptocurrency', path: '/crypto', icon: '₿', category: 'Investments', description: 'Buy, sell, and trade digital currencies' },
    
    // Support & Security
    { name: 'Customer Support', path: '/support', icon: '🎧', category: 'Support & Security', description: 'Get help with your banking needs', isButton: true },
    { name: 'Security Center', path: '/security', icon: '🔒', category: 'Support & Security', description: 'Manage account security settings' },
    { name: 'Messages', path: '/messages', icon: '💬', category: 'Support & Security', description: 'View bank communications' },
    { name: 'Notifications', path: '/notifications', icon: '🔔', category: 'Support & Security', description: 'Manage notification preferences' }
  ];

  const filteredServices = allServices.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedServices = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  if (loading || authLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  // Guest user view
  if (!user) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <Link href="/" style={styles.logo}>
              <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.logoImg} />
              <span style={styles.logoText}>Oakline Bank</span>
            </Link>
            <div style={styles.guestActions}>
              <button onClick={() => router.push('/login')} style={styles.loginButton}>
                Login
              </button>
            </div>
          </div>
        </header>

        <section style={styles.guestWelcomeSection}>
          <h1 style={styles.guestWelcomeTitle}>Welcome to Oakline Bank</h1>
          <p style={styles.guestSubtitle}>Please sign in to access your banking services</p>
          <div style={styles.guestActionButtons}>
            <button onClick={() => router.push('/apply')} style={styles.primaryGuestButton}>
              <span style={styles.buttonIcon}>🏦</span>
              Open New Account
            </button>
            <button onClick={() => router.push('/login')} style={styles.secondaryGuestButton}>
              <span style={styles.buttonIcon}>🔐</span>
              Sign In
            </button>
            <button onClick={() => router.push('/')} style={styles.secondaryGuestButton}>
              <span style={styles.buttonIcon}>📝</span>
              Enroll Online
            </button>
          </div>
        </section>
      </div>
    );
  }

  // Logged-in user view - Main Menu
  return (
    <div style={styles.container} onClick={closeAllDropdowns}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link href="/" style={styles.logo}>
            <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.logoImg} />
            <span style={styles.logoText}>Oakline Bank</span>
          </Link>

          {/* Navigation Dropdowns */}
          <nav style={styles.headerNav}>
            {/* Banking Dropdown */}
            <div style={styles.dropdown}>
              <button 
                style={styles.dropdownBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('banking');
                }}
              >
                Banking ▼
              </button>
              {dropdownOpen.banking && (
                <div style={styles.dropdownContent} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>💳 Account Services</h4>
                    <Link href="/dashboard" style={styles.dropdownLink}>Dashboard</Link>
                    <Link href="/account-details" style={styles.dropdownLink}>Account Details</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Open New Account</Link>
                    <Link href="/profile" style={styles.dropdownLink}>My Profile</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>💸 Transactions</h4>
                    <Link href="/transfer" style={styles.dropdownLink}>Transfer Money</Link>
                    <Link href="/deposit-real" style={styles.dropdownLink}>Mobile Deposit</Link>
                    <Link href="/withdrawal" style={styles.dropdownLink}>Withdraw Funds</Link>
                    <Link href="/transactions" style={styles.dropdownLink}>Transaction History</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Financial Services Dropdown */}
            <div style={styles.dropdown}>
              <button 
                style={styles.dropdownBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('financial');
                }}
              >
                Financial Services ▼
              </button>
              {dropdownOpen.financial && (
                <div style={styles.dropdownContent} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🏠 Loans & Credit</h4>
                    <Link href="/loans" style={styles.dropdownLink}>Apply for Loans</Link>
                    <Link href="/credit-report" style={styles.dropdownLink}>Credit Report</Link>
                    <Link href="/cards" style={styles.dropdownLink}>Credit Cards</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>📈 Investments</h4>
                    <Link href="/investments" style={styles.dropdownLink}>Investment Portfolio</Link>
                    <Link href="/crypto" style={styles.dropdownLink}>Cryptocurrency</Link>
                    <Link href="/financial-advisory" style={styles.dropdownLink}>Financial Advisory</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Digital Services Dropdown */}
            <div style={styles.dropdown}>
              <button 
                style={styles.dropdownBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('digital');
                }}
              >
                Digital Services ▼
              </button>
              {dropdownOpen.digital && (
                <div style={styles.dropdownContent} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>📱 Mobile Banking</h4>
                    <Link href="/cards" style={styles.dropdownLink}>Manage Cards</Link>
                    <Link href="/bill-pay" style={styles.dropdownLink}>Bill Pay</Link>
                    <Link href="/notifications" style={styles.dropdownLink}>Notifications</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🔒 Security</h4>
                    <Link href="/security" style={styles.dropdownLink}>Security Settings</Link>
                    <Link href="/mfa-setup" style={styles.dropdownLink}>Two-Factor Auth</Link>
                    <Link href="/messages" style={styles.dropdownLink}>Secure Messages</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Support Dropdown */}
            <div style={styles.dropdown}>
              <button 
                style={styles.dropdownBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('support');
                }}
              >
                Support ▼
              </button>
              {dropdownOpen.support && (
                <div style={styles.dropdownContent} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🎧 Get Help</h4>
                    <button onClick={handleSupportContact} style={styles.dropdownButton}>Contact Support</button>
                    <Link href="/faq" style={styles.dropdownLink}>FAQ</Link>
                    <Link href="/support" style={styles.dropdownLink}>Help Center</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>📞 Contact Info</h4>
                    <div style={styles.contactInfo}>
                      <div style={styles.contactItem}>📞 1-800-OAKLINE</div>
                      <div style={styles.contactItem}>✉️ support@theoaklinebank.com</div>
                      <div style={styles.contactItem}>🕒 24/7 Available</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div style={styles.userInfo}>
            {/* Dashboard Access Dropdown */}
            <div style={styles.dropdown}>
              <button 
                style={styles.dashboardAccessBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('dashboardAccess');
                }}
              >
                Quick Access ▼
              </button>
              {dropdownOpen.dashboardAccess && (
                <div style={styles.dropdownContent} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>📊 Quick Navigation</h4>
                    <Link href="/dashboard" style={styles.dropdownLink}>Dashboard</Link>
                    <Link href="/main-menu" style={styles.dropdownLink}>Main Menu</Link>
                    <Link href="/" style={styles.dropdownLink}>Homepage</Link>
                    <Link href="/account-details" style={styles.dropdownLink}>Account Details</Link>
                  </div>
                </div>
              )}
            </div>
            
            <span style={styles.welcomeText}>Welcome, {getUserDisplayName()}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Welcome Section */}
        <div style={styles.welcomeCard}>
          <h1 style={styles.welcomeTitle}>Banking Services Menu</h1>
          <p style={styles.welcomeSubtitle}>
            Access all your banking services and manage your finances in one place
          </p>
          
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search banking services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>

          {/* Quick Access Buttons */}
          <div style={styles.quickNavButtons}>
            <Link href="/dashboard" style={styles.quickNavButton}>
              <span style={styles.quickNavIcon}>📊</span>
              <span>Dashboard</span>
            </Link>
            <Link href="/transfer" style={styles.quickNavButton}>
              <span style={styles.quickNavIcon}>💸</span>
              <span>Quick Transfer</span>
            </Link>
            <Link href="/bill-pay" style={styles.quickNavButton}>
              <span style={styles.quickNavIcon}>🧾</span>
              <span>Pay Bills</span>
            </Link>
            <button onClick={handleSupportContact} style={{...styles.quickNavButton, border: 'none', cursor: 'pointer'}}>
              <span style={styles.quickNavIcon}>📞</span>
              <span>Support</span>
            </button>
          </div>
        </div>

        {/* Menu Categories */}
        <div style={styles.menuContainer}>
          {Object.entries(groupedServices).map(([category, services]) => (
            <div key={category} style={styles.categorySection}>
              <div style={styles.categoryHeader}>
                <span style={styles.categoryIcon}>
                  {category === 'Account Management' ? '🏦' :
                   category === 'Money Management' ? '💰' :
                   category === 'Cards & Digital' ? '💳' :
                   category === 'Loans & Credit' ? '🏠' :
                   category === 'Investments' ? '📈' :
                   category === 'Support & Security' ? '🛡️' : '⚙️'}
                </span>
                <h2 style={styles.categoryTitle}>{category}</h2>
                <span style={styles.categoryCount}>{services.length} services</span>
              </div>

              <div style={styles.menuGrid}>
                {services.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    style={styles.menuItem}
                    onClick={() => {
                      if (item.isButton || item.name === 'Customer Support') {
                        handleSupportContact();
                      } else {
                        router.push(item.path);
                      }
                    }}
                  >
                    <div style={styles.menuItemHeader}>
                      <span style={styles.menuItemIcon}>{item.icon}</span>
                      <h3 style={styles.menuItemTitle}>{item.name}</h3>
                    </div>
                    <p style={styles.menuItemDescription}>{item.description}</p>
                    <div style={styles.menuItemArrow}>→</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Featured Services */}
        <div style={styles.featuredSection}>
          <h2 style={styles.featuredTitle}>Featured Services</h2>
          <div style={styles.featuredGrid}>
            <div style={styles.featuredCard}>
              <div style={styles.featuredIcon}>🎯</div>
              <div style={styles.featuredContent}>
                <h3 style={styles.featuredName}>Smart Savings</h3>
                <p style={styles.featuredDesc}>Automatically save money with our AI-powered savings recommendations</p>
                <Link href="/investments" style={styles.featuredBtn}>Learn More</Link>
              </div>
            </div>
            <div style={styles.featuredCard}>
              <div style={styles.featuredIcon}>⚡</div>
              <div style={styles.featuredContent}>
                <h3 style={styles.featuredName}>Instant Transfers</h3>
                <p style={styles.featuredDesc}>Send money instantly to family and friends with zero fees</p>
                <Link href="/transfer" style={styles.featuredBtn}>Try Now</Link>
              </div>
            </div>
            <div style={styles.featuredCard}>
              <div style={styles.featuredIcon}>🏆</div>
              <div style={styles.featuredContent}>
                <h3 style={styles.featuredName}>Rewards Program</h3>
                <p style={styles.featuredDesc}>Earn cashback on every purchase with our premium rewards program</p>
                <Link href="/rewards" style={styles.featuredBtn}>Join Now</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative'
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9'
  },
  loading: {
    fontSize: '1.2rem',
    color: '#64748b'
  },
  header: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '0.5rem',
      padding: '0 0.5rem'
    }
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'white'
  },
  logoImg: {
    height: '40px',
    width: 'auto'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  headerNav: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    '@media (max-width: 768px)': {
      width: '100%',
      overflowX: 'auto',
      paddingBottom: '0.5rem',
      gap: '0.25rem'
    }
  },
  dropdown: {
    position: 'relative'
  },
  dropdownBtn: {
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  dropdownContent: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    padding: '1rem',
    minWidth: '280px',
    zIndex: 1000,
    marginTop: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  dropdownSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  dropdownHeading: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#1e40af',
    margin: '0 0 0.5rem 0'
  },
  dropdownLink: {
    padding: '0.5rem 0.75rem',
    color: '#374151',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    transition: 'all 0.2s'
  },
  dropdownButton: {
    padding: '0.5rem 0.75rem',
    color: '#374151',
    background: 'none',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  contactItem: {
    fontSize: '0.8rem',
    color: '#64748b',
    padding: '0.25rem 0'
  },
  guestActions: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  welcomeText: {
    fontSize: '1rem',
    fontWeight: '500'
  },
  dashboardAccessBtn: {
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s'
  },
  loginButton: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  guestWelcomeSection: {
    padding: 'clamp(2rem, 6vw, 4rem)',
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center'
  },
  guestWelcomeTitle: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  guestSubtitle: {
    fontSize: '1.2rem',
    color: '#64748b',
    marginBottom: '2.5rem',
    lineHeight: '1.6'
  },
  guestActionButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  primaryGuestButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(30, 64, 175, 0.3)'
  },
  secondaryGuestButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    background: 'transparent',
    color: '#1e40af',
    border: '2px solid #1e40af',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  buttonIcon: {
    fontSize: '1.1rem'
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: 'clamp(1rem, 3vw, 2rem)'
  },
  welcomeCard: {
    backgroundColor: 'white',
    padding: 'clamp(2rem, 4vw, 3rem)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    marginBottom: '3rem',
    textAlign: 'center',
    border: '1px solid #e2e8f0'
  },
  welcomeTitle: {
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  welcomeSubtitle: {
    fontSize: '1.1rem',
    color: '#64748b',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  searchContainer: {
    position: 'relative',
    maxWidth: '400px',
    margin: '0 auto 2rem auto'
  },
  searchInput: {
    width: '100%',
    padding: '1rem 3rem 1rem 1rem',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s'
  },
  searchIcon: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.2rem',
    color: '#64748b'
  },
  quickNavButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  quickNavButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1e40af',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(30, 64, 175, 0.2)'
  },
  quickNavIcon: {
    fontSize: '1.1rem'
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  categorySection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #f1f5f9',
    flexWrap: 'wrap'
  },
  categoryIcon: {
    fontSize: '2rem'
  },
  categoryTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0,
    flex: 1
  },
  categoryCount: {
    fontSize: '0.8rem',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontWeight: '500'
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem'
  },
  menuItem: {
    padding: '2rem',
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative'
  },
  menuItemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem'
  },
  menuItemIcon: {
    fontSize: '1.8rem',
    minWidth: '50px',
    textAlign: 'center'
  },
  menuItemTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0
  },
  menuItemDescription: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: '1.6',
    margin: '0 0 0 66px'
  },
  menuItemArrow: {
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    fontSize: '1.5rem',
    color: '#94a3b8',
    fontWeight: 'bold',
    transition: 'all 0.2s'
  },
  featuredSection: {
    marginTop: '3rem'
  },
  featuredTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  featuredCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: '1px solid #e2e8f0'
  },
  featuredIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#eff6ff',
    borderRadius: '50%'
  },
  featuredContent: {
    flex: 1
  },
  featuredName: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  featuredDesc: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '1.5rem'
  },
  featuredBtn: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1e40af',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.2s'
  }
};
