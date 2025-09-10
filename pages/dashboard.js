
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [creditScore, setCreditScore] = useState(742);
  const [marketData, setMarketData] = useState({
    sp500: { value: 4456.23, change: +12.45, changePercent: +0.28 },
    nasdaq: { value: 13845.67, change: -23.12, changePercent: -0.17 },
    dow: { value: 34567.89, change: +45.67, changePercent: +0.13 }
  });
  
  const router = useRouter();

  // Professional Banking Color Scheme
  const colors = {
    primary: '#1a365d',      // Deep navy blue
    secondary: '#2c5aa0',    // Royal blue
    accent: '#0066cc',       // Bright blue
    success: '#059669',      // Emerald green
    warning: '#d97706',      // Amber
    danger: '#dc2626',       // Red
    light: '#f8fafc',        // Very light blue-gray
    white: '#ffffff',
    gray100: '#f7fafc',
    gray200: '#edf2f7',
    gray300: '#e2e8f0',
    gray400: '#cbd5e0',
    gray500: '#a0aec0',
    gray600: '#718096',
    gray700: '#4a5568',
    gray800: '#2d3748',
    gray900: '#1a202c',
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: colors.light,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    
    // Header Styles
    header: {
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      color: colors.white,
      padding: '0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },
    
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '28px',
      fontWeight: '700',
      letterSpacing: '-0.5px',
    },
    
    logoIcon: {
      fontSize: '32px',
      background: colors.white,
      color: colors.primary,
      borderRadius: '8px',
      padding: '8px',
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    },
    
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      position: 'relative',
    },
    
    userAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: colors.accent,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      fontSize: '16px',
      cursor: 'pointer',
    },
    
    userName: {
      fontWeight: '500',
      fontSize: '16px',
    },
    
    userMenu: {
      position: 'absolute',
      top: '100%',
      right: '0',
      background: colors.white,
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      padding: '8px 0',
      minWidth: '200px',
      marginTop: '8px',
      zIndex: 1001,
    },
    
    menuItem: {
      width: '100%',
      padding: '12px 20px',
      border: 'none',
      background: 'none',
      color: colors.gray700,
      fontSize: '14px',
      cursor: 'pointer',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'background-color 0.2s',
    },
    
    // Main Content
    main: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '32px 24px',
      display: 'grid',
      gap: '32px',
    },
    
    welcomeSection: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      alignItems: 'center',
      gap: '24px',
      marginBottom: '8px',
    },
    
    welcomeText: {
      margin: 0,
    },
    
    welcomeTitle: {
      fontSize: '36px',
      fontWeight: '700',
      color: colors.gray900,
      margin: '0 0 8px 0',
      letterSpacing: '-0.5px',
    },
    
    welcomeSubtitle: {
      fontSize: '18px',
      color: colors.gray600,
      margin: 0,
    },
    
    dateTime: {
      textAlign: 'right',
      color: colors.gray600,
    },
    
    // Financial Summary Cards
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    },
    
    summaryCard: {
      background: colors.white,
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      border: `1px solid ${colors.gray200}`,
      position: 'relative',
      overflow: 'hidden',
    },
    
    balanceCard: {
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      color: colors.white,
    },
    
    cardIcon: {
      fontSize: '32px',
      marginBottom: '16px',
      opacity: 0.9,
    },
    
    cardLabel: {
      fontSize: '14px',
      fontWeight: '500',
      opacity: 0.8,
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    cardValue: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '12px',
      letterSpacing: '-0.5px',
    },
    
    cardChange: {
      fontSize: '14px',
      fontWeight: '500',
    },
    
    // Market Data
    marketSection: {
      background: colors.white,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      border: `1px solid ${colors.gray200}`,
    },
    
    marketGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
    },
    
    marketItem: {
      padding: '16px',
      borderRadius: '12px',
      background: colors.gray50,
      textAlign: 'center',
    },
    
    // Quick Actions
    actionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '32px',
    },
    
    actionCard: {
      background: colors.white,
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      border: `1px solid ${colors.gray200}`,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textDecoration: 'none',
      color: 'inherit',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '12px',
    },
    
    actionIcon: {
      fontSize: '32px',
      width: '64px',
      height: '64px',
      borderRadius: '16px',
      background: `linear-gradient(135deg, ${colors.accent}15, ${colors.primary}15)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '8px',
    },
    
    actionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: colors.gray900,
      margin: 0,
    },
    
    actionDesc: {
      fontSize: '14px',
      color: colors.gray600,
      margin: 0,
    },
    
    // Main Grid Layout
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '32px',
      '@media (max-width: 1024px)': {
        gridTemplateColumns: '1fr',
      },
    },
    
    // Accounts Section
    accountsSection: {
      background: colors.white,
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      border: `1px solid ${colors.gray200}`,
    },
    
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: colors.gray900,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    
    accountCard: {
      background: colors.gray50,
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '16px',
      border: `2px solid transparent`,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    
    accountCardSelected: {
      borderColor: colors.accent,
      background: colors.white,
      boxShadow: '0 4px 12px rgba(0, 102, 204, 0.15)',
    },
    
    accountHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px',
    },
    
    accountType: {
      fontSize: '18px',
      fontWeight: '600',
      color: colors.gray900,
      margin: '0 0 4px 0',
    },
    
    accountNumber: {
      fontSize: '14px',
      color: colors.gray600,
      fontFamily: 'monospace',
    },
    
    accountBalance: {
      fontSize: '28px',
      fontWeight: '700',
      color: colors.gray900,
      textAlign: 'right',
    },
    
    // Transactions Section
    transactionsSection: {
      background: colors.white,
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      border: `1px solid ${colors.gray200}`,
    },
    
    transactionItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px 0',
      borderBottom: `1px solid ${colors.gray200}`,
      gap: '16px',
    },
    
    transactionIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: '600',
    },
    
    transactionDetails: {
      flex: 1,
    },
    
    transactionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: colors.gray900,
      margin: '0 0 4px 0',
    },
    
    transactionDate: {
      fontSize: '14px',
      color: colors.gray600,
      margin: 0,
    },
    
    transactionAmount: {
      fontSize: '16px',
      fontWeight: '600',
      textAlign: 'right',
    },
    
    // Credit Score Widget
    creditScoreWidget: {
      background: colors.white,
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      border: `1px solid ${colors.gray200}`,
      textAlign: 'center',
    },
    
    creditScoreValue: {
      fontSize: '48px',
      fontWeight: '700',
      color: colors.success,
      margin: '16px 0 8px 0',
    },
    
    creditScoreLabel: {
      fontSize: '14px',
      color: colors.gray600,
      margin: '0 0 16px 0',
    },
    
    creditScoreRange: {
      width: '100%',
      height: '8px',
      background: colors.gray200,
      borderRadius: '4px',
      position: 'relative',
      margin: '16px 0',
    },
    
    creditScoreIndicator: {
      position: 'absolute',
      left: '74%',
      top: '-4px',
      width: '16px',
      height: '16px',
      background: colors.success,
      borderRadius: '50%',
      border: `3px solid ${colors.white}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },
    
    // Buttons
    primaryButton: {
      background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
      color: colors.white,
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    },
    
    secondaryButton: {
      background: colors.white,
      color: colors.accent,
      border: `2px solid ${colors.accent}`,
      borderRadius: '12px',
      padding: '10px 22px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    },
    
    // Responsive utilities
    '@media (max-width: 768px)': {
      main: {
        padding: '24px 16px',
      },
      welcomeSection: {
        gridTemplateColumns: '1fr',
        textAlign: 'center',
      },
      dashboardGrid: {
        gridTemplateColumns: '1fr',
      },
    },
  };

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      await fetchUserData(session.user.id);
    } catch (error) {
      console.error('Error checking user:', error);
      setError('Failed to load user data');
      setLoading(false);
    }
  };

  const fetchUserData = async (userId) => {
    setLoading(true);
    setError('');

    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profileError) setUserProfile(profile);

      // Fetch accounts
      let accounts = [];
      const { data: directAccounts, error: directAccountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId);

      if (!directAccountsError) {
        accounts = directAccounts || [];
      }

      setAccounts(accounts);
      if (accounts.length > 0) {
        setSelectedAccount(accounts[0]);
      }

      // Fetch recent transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!transactionsError) {
        setTransactions(transactionsData || []);
      }

    } catch (error) {
      console.error('Error in fetchUserData:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numericAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => {
      const balance = parseFloat(account.balance || 0);
      return total + (isNaN(balance) ? 0 : balance);
    }, 0);
  };

  const getInitials = (name) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      })
    };
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: colors.light,
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: `4px solid ${colors.gray300}`,
          borderTop: `4px solid ${colors.accent}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: colors.gray600, fontSize: '16px' }}>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: colors.light,
        gap: '16px',
        padding: '20px'
      }}>
        <h2 style={{ color: colors.danger }}>Error</h2>
        <p style={{ color: colors.gray600 }}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={styles.primaryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  const dateTime = getCurrentDateTime();

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
        }
        
        .primary-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(0, 102, 204, 0.3);
        }
        
        .secondary-button:hover {
          background: ${colors.accent} !important;
          color: ${colors.white} !important;
        }
        
        .menu-item:hover {
          background-color: ${colors.gray100} !important;
        }
        
        .account-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🏦</div>
            <span>Oakline Bank</span>
          </div>
          
          <div style={styles.headerRight}>
            <div style={styles.userInfo}>
              <div style={styles.userName}>
                {userProfile?.first_name || user?.user_metadata?.first_name || user?.email}
              </div>
              <div 
                style={styles.userAvatar}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {getInitials(userProfile?.first_name || user?.user_metadata?.first_name)}
              </div>
              
              {showUserMenu && (
                <div style={styles.userMenu}>
                  <button 
                    onClick={() => router.push('/profile')} 
                    style={styles.menuItem}
                    className="menu-item"
                  >
                    👤 My Profile
                  </button>
                  <button 
                    onClick={() => router.push('/settings')} 
                    style={styles.menuItem}
                    className="menu-item"
                  >
                    ⚙️ Settings
                  </button>
                  <button 
                    onClick={() => router.push('/security')} 
                    style={styles.menuItem}
                    className="menu-item"
                  >
                    🔒 Security
                  </button>
                  <button 
                    onClick={() => router.push('/support')} 
                    style={styles.menuItem}
                    className="menu-item"
                  >
                    🆘 Help & Support
                  </button>
                  <hr style={{ margin: '8px 0', border: 'none', borderTop: `1px solid ${colors.gray200}` }} />
                  <button 
                    onClick={handleLogout} 
                    style={{...styles.menuItem, color: colors.danger}}
                    className="menu-item"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Welcome Section */}
        <section style={styles.welcomeSection}>
          <div style={styles.welcomeText}>
            <h1 style={styles.welcomeTitle}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
            </h1>
            <p style={styles.welcomeSubtitle}>
              Welcome back to your financial dashboard
            </p>
          </div>
          <div style={styles.dateTime}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: colors.gray700 }}>
              {dateTime.date}
            </div>
            <div style={{ fontSize: '14px', color: colors.gray600 }}>
              {dateTime.time}
            </div>
          </div>
        </section>

        {/* Financial Summary Cards */}
        <section style={styles.summaryGrid}>
          <div style={{...styles.summaryCard, ...styles.balanceCard}}>
            <div style={styles.cardIcon}>💰</div>
            <div style={styles.cardLabel}>Total Balance</div>
            <div style={styles.cardValue}>{formatCurrency(getTotalBalance())}</div>
            <div style={styles.cardChange}>+2.5% from last month</div>
          </div>
          
          <div style={styles.summaryCard}>
            <div style={{...styles.cardIcon, color: colors.success}}>📈</div>
            <div style={{...styles.cardLabel, color: colors.gray600}}>Available Credit</div>
            <div style={{...styles.cardValue, color: colors.gray900}}>{formatCurrency(25000)}</div>
            <div style={{...styles.cardChange, color: colors.success}}>$5,000 increase</div>
          </div>
          
          <div style={styles.summaryCard}>
            <div style={{...styles.cardIcon, color: colors.accent}}>📊</div>
            <div style={{...styles.cardLabel, color: colors.gray600}}>Credit Score</div>
            <div style={{...styles.cardValue, color: colors.gray900}}>{creditScore}</div>
            <div style={{...styles.cardChange, color: colors.success}}>+15 points</div>
          </div>
          
          <div style={styles.summaryCard}>
            <div style={{...styles.cardIcon, color: colors.warning}}>💎</div>
            <div style={{...styles.cardLabel, color: colors.gray600}}>Investments</div>
            <div style={{...styles.cardValue, color: colors.gray900}}>{formatCurrency(48750)}</div>
            <div style={{...styles.cardChange, color: colors.success}}>+$1,250 (2.6%)</div>
          </div>
        </section>

        {/* Market Data */}
        <section style={styles.marketSection}>
          <h3 style={styles.sectionTitle}>
            📈 Market Overview
          </h3>
          <div style={styles.marketGrid}>
            <div style={styles.marketItem}>
              <div style={{ fontWeight: '600', color: colors.gray700 }}>S&P 500</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray900 }}>
                {marketData.sp500.value.toLocaleString()}
              </div>
              <div style={{ 
                color: marketData.sp500.change > 0 ? colors.success : colors.danger,
                fontSize: '14px'
              }}>
                {marketData.sp500.change > 0 ? '+' : ''}{marketData.sp500.change} ({marketData.sp500.changePercent}%)
              </div>
            </div>
            <div style={styles.marketItem}>
              <div style={{ fontWeight: '600', color: colors.gray700 }}>NASDAQ</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray900 }}>
                {marketData.nasdaq.value.toLocaleString()}
              </div>
              <div style={{ 
                color: marketData.nasdaq.change > 0 ? colors.success : colors.danger,
                fontSize: '14px'
              }}>
                {marketData.nasdaq.change > 0 ? '+' : ''}{marketData.nasdaq.change} ({marketData.nasdaq.changePercent}%)
              </div>
            </div>
            <div style={styles.marketItem}>
              <div style={{ fontWeight: '600', color: colors.gray700 }}>Dow Jones</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray900 }}>
                {marketData.dow.value.toLocaleString()}
              </div>
              <div style={{ 
                color: marketData.dow.change > 0 ? colors.success : colors.danger,
                fontSize: '14px'
              }}>
                {marketData.dow.change > 0 ? '+' : ''}{marketData.dow.change} ({marketData.dow.changePercent}%)
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section style={styles.actionsGrid}>
          <Link href="/transfer" style={styles.actionCard} className="action-card">
            <div style={{...styles.actionIcon, background: `linear-gradient(135deg, #3b82f615, #1e40af15)`}}>
              💸
            </div>
            <h4 style={styles.actionTitle}>Transfer Money</h4>
            <p style={styles.actionDesc}>Send money instantly</p>
          </Link>
          
          <Link href="/deposit" style={styles.actionCard} className="action-card">
            <div style={{...styles.actionIcon, background: `linear-gradient(135deg, #10b98115, #047857155)`}}>
              📥
            </div>
            <h4 style={styles.actionTitle}>Deposit Funds</h4>
            <p style={styles.actionDesc}>Add money to account</p>
          </Link>
          
          <Link href="/bill-pay" style={styles.actionCard} className="action-card">
            <div style={{...styles.actionIcon, background: `linear-gradient(135deg, #f59e0b15, #d9770015)`}}>
              🧾
            </div>
            <h4 style={styles.actionTitle}>Pay Bills</h4>
            <p style={styles.actionDesc}>Manage payments</p>
          </Link>
          
          <Link href="/investments" style={styles.actionCard} className="action-card">
            <div style={{...styles.actionIcon, background: `linear-gradient(135deg, #8b5cf615, #7c3aed15)`}}>
              📊
            </div>
            <h4 style={styles.actionTitle}>Investments</h4>
            <p style={styles.actionDesc}>Grow your wealth</p>
          </Link>
          
          <Link href="/loans" style={styles.actionCard} className="action-card">
            <div style={{...styles.actionIcon, background: `linear-gradient(135deg, #06b6d415, #0891b215)`}}>
              🏠
            </div>
            <h4 style={styles.actionTitle}>Loans</h4>
            <p style={styles.actionDesc}>Apply for credit</p>
          </Link>
          
          <Link href="/support" style={styles.actionCard} className="action-card">
            <div style={{...styles.actionIcon, background: `linear-gradient(135deg, #ec489915, #dc262615)`}}>
              🆘
            </div>
            <h4 style={styles.actionTitle}>Customer Support</h4>
            <p style={styles.actionDesc}>Get help 24/7</p>
          </Link>
        </section>

        {/* Main Dashboard Grid */}
        <div style={styles.dashboardGrid}>
          {/* Accounts Section */}
          <section style={styles.accountsSection}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>
                💳 Your Accounts
              </h3>
              <Link href="/account-details" style={styles.secondaryButton} className="secondary-button">
                View All
              </Link>
            </div>

            {accounts.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '48px 24px',
                color: colors.gray600 
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🏦</div>
                <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>No accounts found</p>
                <p style={{ fontSize: '14px', margin: 0 }}>Contact support if this seems incorrect</p>
              </div>
            ) : (
              accounts.map(account => (
                <div
                  key={account.id}
                  onClick={() => setSelectedAccount(account)}
                  style={{
                    ...styles.accountCard,
                    ...(selectedAccount?.id === account.id ? styles.accountCardSelected : {})
                  }}
                  className="account-card"
                >
                  <div style={styles.accountHeader}>
                    <div>
                      <h4 style={styles.accountType}>
                        {account.account_name || account.account_type?.replace('_', ' ')?.toUpperCase()}
                      </h4>
                      <p style={styles.accountNumber}>
                        ****{account.account_number?.slice(-4)}
                      </p>
                    </div>
                    <div style={styles.accountBalance}>
                      {formatCurrency(account.balance)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Recent Transactions */}
            <section style={styles.transactionsSection}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>
                  📈 Recent Activity
                </h3>
                <Link href="/transactions" style={styles.secondaryButton} className="secondary-button">
                  View All
                </Link>
              </div>

              {transactions.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '32px 16px',
                  color: colors.gray600 
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.5 }}>📊</div>
                  <p style={{ margin: 0 }}>No recent transactions</p>
                </div>
              ) : (
                transactions.slice(0, 5).map(transaction => (
                  <div key={transaction.id} style={styles.transactionItem}>
                    <div style={{
                      ...styles.transactionIcon,
                      backgroundColor: transaction.type === 'credit' ? `${colors.success}20` : `${colors.danger}20`,
                      color: transaction.type === 'credit' ? colors.success : colors.danger
                    }}>
                      {transaction.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div style={styles.transactionDetails}>
                      <h4 style={styles.transactionTitle}>
                        {transaction.description || 'Transaction'}
                      </h4>
                      <p style={styles.transactionDate}>
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                    <div style={{
                      ...styles.transactionAmount,
                      color: transaction.type === 'credit' ? colors.success : colors.danger
                    }}>
                      {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </div>
                  </div>
                ))
              )}
            </section>

            {/* Credit Score Widget */}
            <section style={styles.creditScoreWidget}>
              <h3 style={{...styles.sectionTitle, justifyContent: 'center', marginBottom: '16px'}}>
                🎯 Credit Score
              </h3>
              <div style={styles.creditScoreValue}>{creditScore}</div>
              <div style={styles.creditScoreLabel}>Excellent</div>
              <div style={styles.creditScoreRange}>
                <div style={styles.creditScoreIndicator}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: colors.gray500 }}>
                <span>300</span>
                <span>850</span>
              </div>
              <Link href="/credit-report" style={{...styles.primaryButton, marginTop: '16px'}} className="primary-button">
                View Report
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
