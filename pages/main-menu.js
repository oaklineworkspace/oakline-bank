
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function MainMenu() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
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
          fetchUserAccounts(session.user.id, session.user.email);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setAccounts([]);
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
        await fetchUserAccounts(user.id, user.email);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const fetchUserAccounts = async (userId, email) => {
    try {
      // First try to get accounts by user_id
      let { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId);

      // If no accounts found by user_id, try by email
      if (!data || data.length === 0) {
        const { data: emailAccounts, error: emailError } = await supabase
          .from('accounts')
          .select('*')
          .eq('email', email);
        
        data = emailAccounts;
        error = emailError;
      }

      // If still no accounts, check via profiles table
      if (!data || data.length === 0) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('application_id')
          .eq('id', userId)
          .single();

        if (profile?.application_id) {
          const { data: accountsData, error: accountsError } = await supabase
            .from('accounts')
            .select('*')
            .eq('application_id', profile.application_id);

          data = accountsData;
          error = accountsError;
        }
      }

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setAccounts([]);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccounts([]);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + parseFloat(account.balance || 0), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const menuItems = [
    {
      title: 'Banking',
      items: [
        { name: 'Dashboard', icon: '🏠', path: '/dashboard', description: 'Account overview' },
        { name: 'Transfer Money', icon: '💸', path: '/transfer', description: 'Send money anywhere' },
        { name: 'Deposit Funds', icon: '📥', path: '/deposit-real', description: 'Add money to account' },
        { name: 'Withdraw Funds', icon: '💳', path: '/withdrawal', description: 'Take money out' },
        { name: 'Transactions', icon: '📊', path: '/transactions', description: 'Transaction history' }
      ]
    },
    {
      title: 'Cards & Payments',
      items: [
        { name: 'My Cards', icon: '💳', path: '/cards', description: 'Manage debit/credit cards' },
        { name: 'Bill Pay', icon: '💰', path: '/bill-pay', description: 'Pay bills easily' },
        { name: 'Rewards', icon: '🎁', path: '/rewards', description: 'View reward points' }
      ]
    },
    {
      title: 'Investments & Savings',
      items: [
        { name: 'Investments', icon: '📈', path: '/investments', description: 'Grow your wealth' },
        { name: 'Crypto Trading', icon: '₿', path: '/crypto', description: 'Digital currency' },
        { name: 'Loans', icon: '🏠', path: '/loans', description: 'Personal & home loans' }
      ]
    },
    {
      title: 'Support & Settings',
      items: [
        { name: 'Profile', icon: '👤', path: '/profile', description: 'Personal information' },
        { name: 'Security', icon: '🔒', path: '/security', description: 'Account security' },
        { name: 'Messages', icon: '💬', path: '/messages', description: 'Bank communications' },
        { name: 'Support', icon: '🆘', path: '/support', description: 'Get help' }
      ]
    }
  ];

  if (loading || authLoading) {
    return (
      <div style={styles.container}>
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
            <div style={styles.logo}>
              <span>🏦</span>
              Oakline Bank
            </div>
            <div style={styles.guestActions}>
              <button
                onClick={() => router.push('/login')}
                style={styles.loginButton}
              >
                Login
              </button>
            </div>
          </div>
        </header>

        {/* Guest Welcome */}
        <section style={styles.guestWelcomeSection}>
          <h1 style={styles.guestWelcomeTitle}>Welcome to Oakline Bank</h1>
          <p style={styles.guestSubtitle}>
            Your trusted financial partner for all your banking needs
          </p>
          <div style={styles.guestActionButtons}>
            <button
              onClick={() => router.push('/apply')}
              style={styles.primaryGuestButton}
            >
              <span style={styles.buttonIcon}>🏦</span>
              Open New Account
            </button>
            <button
              onClick={() => router.push('/login')}
              style={styles.secondaryGuestButton}
            >
              <span style={styles.buttonIcon}>🔐</span>
              Sign In
            </button>
            <button
              onClick={() => router.push('/')}
              style={styles.secondaryGuestButton}
            >
              <span style={styles.buttonIcon}>📝</span>
              Enroll Online
            </button>
          </div>
        </section>

        {/* Guest Services */}
        <section style={styles.guestServicesSection}>
          <h2 style={styles.sectionTitle}>Our Services</h2>
          <div style={styles.serviceGrid}>
            <div style={styles.serviceCard}>
              <div style={styles.serviceIcon}>💳</div>
              <h3>Personal Banking</h3>
              <p>Checking, savings, and money market accounts</p>
            </div>
            <div style={styles.serviceCard}>
              <div style={styles.serviceIcon}>🏠</div>
              <h3>Loans & Mortgages</h3>
              <p>Home, auto, and personal loans</p>
            </div>
            <div style={styles.serviceCard}>
              <div style={styles.serviceIcon}>📈</div>
              <h3>Investments</h3>
              <p>Build your wealth with our investment options</p>
            </div>
            <div style={styles.serviceCard}>
              <div style={styles.serviceIcon}>📱</div>
              <h3>Mobile Banking</h3>
              <p>Bank anywhere, anytime with our mobile app</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Logged-in user view
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span>🏦</span>
            Oakline Bank
          </div>
          <div style={styles.userActions}>
            <button
              onClick={() => router.push('/')}
              style={styles.navButton}
            >
              Home
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              style={styles.navButton}
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* User Welcome */}
      <section style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>
          Welcome back, {user?.user_metadata?.first_name || user?.email?.split('@')[0]}!
        </h1>
        <p style={styles.userEmail}>Logged in as: {user.email}</p>
        <div style={styles.balanceCard}>
          <div style={styles.balanceInfo}>
            <span style={styles.balanceLabel}>Total Balance</span>
            <span style={styles.balanceAmount}>{formatCurrency(getTotalBalance())}</span>
          </div>
          <div style={styles.accountCount}>
            {accounts.length} Account{accounts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Menu Sections */}
      <main style={styles.main}>
        {menuItems.map((section, sectionIndex) => (
          <section key={sectionIndex} style={styles.menuSection}>
            <h2 style={styles.sectionTitle}>{section.title}</h2>
            <div style={styles.menuGrid}>
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  onClick={() => router.push(item.path)}
                  style={styles.menuCard}
                  className="menu-card"
                >
                  <div style={styles.menuIcon}>{item.icon}</div>
                  <div style={styles.menuContent}>
                    <h3 style={styles.menuTitle}>{item.name}</h3>
                    <p style={styles.menuDescription}>{item.description}</p>
                  </div>
                  <div style={styles.menuArrow}>→</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Quick Actions */}
      <section style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.quickGrid}>
          <button
            onClick={() => router.push('/transfer')}
            style={{...styles.quickButton, backgroundColor: '#059669'}}
          >
            <span style={styles.quickIcon}>⚡</span>
            Quick Transfer
          </button>
          <button
            onClick={() => router.push('/deposit-real')}
            style={{...styles.quickButton, backgroundColor: '#0369a1'}}
          >
            <span style={styles.quickIcon}>💰</span>
            Deposit Now
          </button>
          <button
            onClick={() => router.push('/support')}
            style={{...styles.quickButton, backgroundColor: '#7c3aed'}}
          >
            <span style={styles.quickIcon}>🆘</span>
            Get Help
          </button>
        </div>
      </section>

      <style jsx>{`
        .menu-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          border-color: #3b82f6;
        }
        
        .menu-card:active {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
    color: 'white',
    padding: '1rem 2rem',
    boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  guestActions: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  userActions: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
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
  navButton: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  logoutButton: {
    background: 'rgba(220, 38, 38, 0.8)',
    border: '1px solid rgba(220, 38, 38, 0.9)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#64748b'
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
  guestServicesSection: {
    padding: 'clamp(2rem, 6vw, 4rem)',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem'
  },
  serviceCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  serviceIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  welcomeSection: {
    padding: 'clamp(1rem, 4vw, 2rem)',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  welcomeTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem',
    textAlign: 'center'
  },
  userEmail: {
    fontSize: '1rem',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  balanceCard: {
    background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
    color: 'white',
    padding: '2rem',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 10px 40px rgba(16, 185, 129, 0.25)'
  },
  balanceInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  balanceLabel: {
    fontSize: '1rem',
    opacity: 0.9
  },
  balanceAmount: {
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    fontWeight: '800'
  },
  accountCount: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 clamp(1rem, 4vw, 2rem)'
  },
  menuSection: {
    marginBottom: '3rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem'
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid #e2e8f0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  menuIcon: {
    fontSize: '2rem',
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    flexShrink: 0
  },
  menuContent: {
    flex: 1
  },
  menuTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 0.5rem 0'
  },
  menuDescription: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: 0
  },
  menuArrow: {
    fontSize: '1.5rem',
    color: '#94a3b8',
    fontWeight: 'bold'
  },
  quickActions: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  quickButton: {
    border: 'none',
    borderRadius: '16px',
    padding: '1.5rem',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease'
  },
  quickIcon: {
    fontSize: '1.5rem'
  }
};
