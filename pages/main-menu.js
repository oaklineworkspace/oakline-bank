import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function MainMenu() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();

    // Listen for auth changes
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
      // Fetch user profile from applications table
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

  const handleSupportContact = () => {
    window.location.href = 'mailto:support@theoaklinebank.com?subject=Customer Support Request';
  };

  const menuItems = [
    {
      category: 'My Banking',
      icon: '🏦',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: '📊', description: 'View account overview and balances' },
        { name: 'Account Details', path: '/account-details', icon: '📋', description: 'Detailed account information' },
        { name: 'Transaction History', path: '/transactions', icon: '📜', description: 'View all transactions' },
        { name: 'My Profile', path: '/profile', icon: '👤', description: 'Manage personal information' }
      ]
    },
    {
      category: 'Money Management',
      icon: '💰',
      items: [
        { name: 'Transfer Money', path: '/transfer', icon: '💸', description: 'Transfer between accounts or to others' },
        { name: 'Make Deposit', path: '/deposit-real', icon: '📥', description: 'Deposit money to your account' },
        { name: 'Withdraw Funds', path: '/withdrawal', icon: '📤', description: 'Withdraw money from your account' },
        { name: 'Bill Pay', path: '/bill-pay', icon: '🧾', description: 'Pay your bills online' }
      ]
    },
    {
      category: 'Cards & Payments',
      icon: '💳',
      items: [
        { name: 'My Cards', path: '/cards', icon: '💳', description: 'Manage debit and credit cards' },
        { name: 'Digital Wallet', path: '/digital-wallet', icon: '📱', description: 'Mobile payment options' },
        { name: 'Card Controls', path: '/card-controls', icon: '🔧', description: 'Set spending limits and controls' }
      ]
    },
    {
      category: 'Financial Services',
      icon: '📈',
      items: [
        { name: 'Loans', path: '/loans', icon: '🏠', description: 'Apply for personal, auto, or home loans' },
        { name: 'Investments', path: '/investments', icon: '📊', description: 'Manage your investment portfolio' },
        { name: 'Cryptocurrency', path: '/crypto', icon: '₿', description: 'Buy, sell, and trade digital currencies' },
        { name: 'Credit Report', path: '/credit-report', icon: '📋', description: 'Check your credit score and history' }
      ]
    },
    {
      category: 'Support & Security',
      icon: '🛡️',
      items: [
        { name: 'Customer Support', path: '/support', icon: '🎧', description: 'Get help with your banking needs' },
        { name: 'Security Center', path: '/security', icon: '🔒', description: 'Manage account security settings' },
        { name: 'Messages', path: '/messages', icon: '💬', description: 'View bank communications' },
        { name: 'Notifications', path: '/notifications', icon: '🔔', description: 'Manage notification preferences' }
      ]
    },
    {
      category: 'Account Services',
      icon: '⚙️',
      items: [
        { name: 'Open New Account', path: '/apply', icon: '➕', description: 'Apply for additional accounts' },
        { name: 'Account Statements', path: '/statements', icon: '📄', description: 'Download account statements' },
        { name: 'Tax Documents', path: '/tax-documents', icon: '📋', description: 'Access tax-related documents' },
        { name: 'Rewards Program', path: '/rewards', icon: '🎁', description: 'View and redeem rewards' }
      ]
    }
  ];

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
        {/* Header */}
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
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link href="/" style={styles.logo}>
            <img src="/images/logo-primary.png.jpg" alt="Oakline Bank" style={styles.logoImg} />
            <span style={styles.logoText}>Oakline Bank</span>
          </Link>
          <div style={styles.userInfo}>
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
            Choose from the banking services below to manage your finances
          </p>
          <div style={styles.quickNavButtons}>
            <Link href="/dashboard" style={styles.quickNavButton}>
              <span style={styles.quickNavIcon}>📊</span>
              <span>Go to Dashboard</span>
            </Link>
            <Link href="/transfer" style={styles.quickNavButton}>
              <span style={styles.quickNavIcon}>💸</span>
              <span>Quick Transfer</span>
            </Link>
            <button onClick={handleSupportContact} style={{...styles.quickNavButton, border: 'none', cursor: 'pointer'}}>
              <span style={styles.quickNavIcon}>📞</span>
              <span>Contact Support</span>
            </button>
          </div>
        </div>

        {/* Menu Categories */}
        <div style={styles.menuContainer}>
          {menuItems.map((category, categoryIndex) => (
            <div key={categoryIndex} style={styles.categorySection}>
              <div style={styles.categoryHeader}>
                <span style={styles.categoryIcon}>{category.icon}</span>
                <h2 style={styles.categoryTitle}>{category.category}</h2>
              </div>

              <div style={styles.menuGrid}>
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    style={styles.menuItem}
                    onClick={() => {
                      if (item.name === 'Customer Support') {
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
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
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
  header: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
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
  logoutBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '6px',
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  welcomeCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    marginBottom: '3rem',
    textAlign: 'center'
  },
  welcomeTitle: {
    fontSize: '2.5rem',
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
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  quickNavIcon: {
    fontSize: '1.1rem'
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem'
  },
  categorySection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #f1f5f9'
  },
  categoryIcon: {
    fontSize: '2rem'
  },
  categoryTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  menuItem: {
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative'
  },
  menuItemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.75rem'
  },
  menuItemIcon: {
    fontSize: '1.5rem',
    minWidth: '40px',
    textAlign: 'center'
  },
  menuItemTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0
  },
  menuItemDescription: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: '1.5',
    margin: '0 0 0 56px'
  },
  menuItemArrow: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    fontSize: '1.2rem',
    color: '#94a3b8',
    fontWeight: 'bold'
  }
};