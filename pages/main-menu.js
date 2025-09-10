
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function MainMenu() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [debitCards, setDebitCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
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
        setAccounts([]);
        setDebitCards([]);
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

      // Fetch real accounts for this user
      let { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id);

      // If no accounts found by user_id, try by email
      if (!accountsData || accountsData.length === 0) {
        const { data: emailAccounts, error: emailError } = await supabase
          .from('accounts')
          .select('*')
          .eq('email', user.email);
        
        accountsData = emailAccounts;
        accountsError = emailError;
      }

      // If still no accounts, create sample accounts
      if (!accountsData || accountsData.length === 0) {
        accountsData = [
          {
            id: 1,
            type: 'Checking',
            name: 'Premier Checking',
            balance: 0.00,
            account_number: `****${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Active',
            user_id: user.id,
            email: user.email
          },
          {
            id: 2,
            type: 'Savings',
            name: 'High Yield Savings',
            balance: 0.00,
            account_number: `****${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Active',
            user_id: user.id,
            email: user.email
          }
        ];
      }

      setAccounts(accountsData || []);

      // Fetch or create debit cards for user
      await fetchOrCreateDebitCards(user.id, user.email, accountsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAccounts([]);
      setDebitCards([]);
    }
  };

  const fetchOrCreateDebitCards = async (userId, email, userAccounts) => {
    try {
      // First try to get existing cards
      let { data: existingCards, error } = await supabase
        .from('debit_cards')
        .select('*')
        .eq('user_id', userId);

      if (error && error.code === 'PGRST205') {
        // Table doesn't exist, create mock cards
        existingCards = [];
      }

      // If no cards exist and user has accounts, create cards
      if ((!existingCards || existingCards.length === 0) && userAccounts && userAccounts.length > 0) {
        const newCards = userAccounts.map(account => createMockDebitCard(userId, account));
        setDebitCards(newCards);
      } else {
        setDebitCards(existingCards || []);
      }
    } catch (error) {
      console.error('Error with debit cards:', error);
      setDebitCards([]);
    }
  };

  const createMockDebitCard = (userId, account) => {
    const cardNumber = generateCardNumber();
    const expiryDate = generateExpiryDate();
    const cvv = generateCVV();
    
    return {
      user_id: userId,
      account_id: account.id,
      card_number: cardNumber,
      cardholder_name: userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : 'Account Holder',
      expiry_date: expiryDate,
      cvv: cvv,
      card_type: 'Visa',
      status: 'active',
      created_at: new Date().toISOString()
    };
  };

  const generateCardNumber = () => {
    const prefix = '4532';
    let cardNumber = prefix;
    for (let i = 0; i < 12; i++) {
      cardNumber += Math.floor(Math.random() * 10);
    }
    return cardNumber;
  };

  const generateExpiryDate = () => {
    const currentDate = new Date();
    const expiryYear = currentDate.getFullYear() + 3;
    const expiryMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    return `${expiryMonth}/${expiryYear.toString().substr(-2)}`;
  };

  const generateCVV = () => {
    return Math.floor(Math.random() * 900) + 100;
  };

  const formatCardNumber = (number) => {
    if (!number) return '';
    return number.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setAccounts([]);
      setDebitCards([]);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
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

  const getUserDisplayName = () => {
    if (userProfile) {
      return `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const handleSupportContact = () => {
    window.location.href = 'mailto:support@theoaklinebank.com?subject=Customer Support Request';
  };

  const bankingServices = [
    {
      name: 'Account Management',
      icon: '🏦',
      items: [
        { name: 'View Accounts', path: '/dashboard', icon: '👁️' },
        { name: 'Account Details', path: '/account-details', icon: '📋' },
        { name: 'Account Statements', path: '/statements', icon: '📄' },
        { name: 'Close Account', path: '/close-account', icon: '❌' }
      ]
    },
    {
      name: 'Money Transfer',
      icon: '💸',
      items: [
        { name: 'Transfer Money', path: '/transfer', icon: '💫' },
        { name: 'International Transfer', path: '/international-transfer', icon: '🌍' },
        { name: 'Wire Transfer', path: '/wire-transfer', icon: '⚡' },
        { name: 'Scheduled Transfers', path: '/scheduled-transfers', icon: '📅' }
      ]
    },
    {
      name: 'Cards & Payments',
      icon: '💳',
      items: [
        { name: 'My Debit Cards', path: '/cards', icon: '💳' },
        { name: 'Credit Cards', path: '/credit-cards', icon: '🎫' },
        { name: 'Card Controls', path: '/card-controls', icon: '🔧' },
        { name: 'Digital Wallet', path: '/digital-wallet', icon: '📱' }
      ]
    },
    {
      name: 'Loans & Credit',
      icon: '🏠',
      items: [
        { name: 'Personal Loans', path: '/loans', icon: '👤' },
        { name: 'Home Mortgage', path: '/mortgage', icon: '🏡' },
        { name: 'Auto Loans', path: '/auto-loans', icon: '🚗' },
        { name: 'Business Loans', path: '/business-loans', icon: '🏢' }
      ]
    },
    {
      name: 'Investments',
      icon: '📈',
      items: [
        { name: 'Investment Portfolio', path: '/investments', icon: '📊' },
        { name: 'Crypto Trading', path: '/crypto', icon: '₿' },
        { name: 'Retirement Planning', path: '/retirement', icon: '🎯' },
        { name: 'Financial Advisory', path: '/financial-advisory', icon: '👨‍💼' }
      ]
    },
    {
      name: 'Customer Service',
      icon: '🆘',
      items: [
        { name: 'Support Center', path: '/support', icon: '💬' },
        { name: 'Live Chat', path: '/live-chat', icon: '💭' },
        { name: 'Schedule Appointment', path: '/appointments', icon: '📅' },
        { name: 'FAQs', path: '/faq', icon: '❓' }
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
          <p style={styles.guestSubtitle}>Your trusted financial partner</p>
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

  // Logged-in user view with dashboard style
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
        {/* User Profile Section */}
        {userProfile && (
          <div style={styles.profileCard}>
            <h2 style={styles.profileTitle}>Account Holder Information</h2>
            <div style={styles.profileGrid}>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Full Name:</span>
                <span style={styles.profileValue}>
                  {`${userProfile.first_name || ''} ${userProfile.middle_name || ''} ${userProfile.last_name || ''}`.trim()}
                </span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Email:</span>
                <span style={styles.profileValue}>{userProfile.email}</span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Phone:</span>
                <span style={styles.profileValue}>{userProfile.phone || 'Not provided'}</span>
              </div>
              <div style={styles.profileItem}>
                <span style={styles.profileLabel}>Address:</span>
                <span style={styles.profileValue}>
                  {userProfile.address ? `${userProfile.address}, ${userProfile.city || ''}, ${userProfile.state || ''} ${userProfile.zip_code || ''}`.trim() : 'Not provided'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav style={styles.tabNav}>
          <button
            style={activeTab === 'overview' ? {...styles.tab, ...styles.activeTab} : styles.tab}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            style={activeTab === 'accounts' ? {...styles.tab, ...styles.activeTab} : styles.tab}
            onClick={() => setActiveTab('accounts')}
          >
            🏦 Accounts
          </button>
          <button
            style={activeTab === 'cards' ? {...styles.tab, ...styles.activeTab} : styles.tab}
            onClick={() => setActiveTab('cards')}
          >
            💳 Cards
          </button>
          <button
            style={activeTab === 'services' ? {...styles.tab, ...styles.activeTab} : styles.tab}
            onClick={() => setActiveTab('services')}
          >
            🔧 Services
          </button>
        </nav>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div style={styles.content}>
            {/* Balance Summary */}
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Total Balance</h2>
              <div style={styles.totalBalance}>{formatCurrency(getTotalBalance())}</div>
              <div style={styles.balanceSubtext}>Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}</div>
            </div>

            {/* Quick Actions */}
            <div style={styles.quickActions}>
              <h3 style={styles.sectionTitle}>Quick Actions</h3>
              <div style={styles.actionGrid}>
                <Link href="/transfer" style={styles.actionCard}>
                  <span style={styles.actionIcon}>💸</span>
                  <span style={styles.actionText}>Transfer Money</span>
                </Link>
                <Link href="/deposit-real" style={styles.actionCard}>
                  <span style={styles.actionIcon}>📥</span>
                  <span style={styles.actionText}>Mobile Deposit</span>
                </Link>
                <Link href="/bill-pay" style={styles.actionCard}>
                  <span style={styles.actionIcon}>💳</span>
                  <span style={styles.actionText}>Pay Bills</span>
                </Link>
                <Link href="/cards" style={styles.actionCard}>
                  <span style={styles.actionIcon}>🎯</span>
                  <span style={styles.actionText}>Manage Cards</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div style={styles.content}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Your Accounts</h2>
              <Link href="/apply" style={styles.addAccountBtn}>+ Add Account</Link>
            </div>
            <div style={styles.accountGrid}>
              {accounts.map(account => (
                <div key={account.id} style={styles.accountCard}>
                  <div style={styles.accountHeader}>
                    <div style={styles.accountType}>{account.type}</div>
                    <div style={styles.accountStatus}>{account.status || 'Active'}</div>
                  </div>
                  <div style={styles.accountName}>{account.name || `${account.type} Account`}</div>
                  <div style={styles.accountNumber}>{account.account_number}</div>
                  <div style={{
                    ...styles.accountBalance,
                    color: (parseFloat(account.balance) || 0) < 0 ? '#ef4444' : '#10b981'
                  }}>
                    {formatCurrency(account.balance || 0)}
                  </div>
                  <Link href={`/account-details?id=${account.id}`} style={styles.viewDetailsBtn}>
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cards' && (
          <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Your Debit Cards</h2>
            <div style={styles.cardsGrid}>
              {debitCards.length > 0 ? (
                debitCards.map((card, index) => (
                  <div key={index} style={styles.debitCard}>
                    <div style={styles.cardHeader}>
                      <span style={styles.cardType}>{card.card_type || 'Visa'}</span>
                      <span style={styles.cardStatus}>{card.status || 'Active'}</span>
                    </div>
                    <div style={styles.cardNumber}>
                      {formatCardNumber(card.card_number)}
                    </div>
                    <div style={styles.cardDetails}>
                      <div>
                        <div style={styles.cardLabel}>Cardholder Name</div>
                        <div style={styles.cardValue}>{card.cardholder_name}</div>
                      </div>
                      <div>
                        <div style={styles.cardLabel}>Expires</div>
                        <div style={styles.cardValue}>{card.expiry_date}</div>
                      </div>
                      <div>
                        <div style={styles.cardLabel}>CVV</div>
                        <div style={styles.cardValue}>***</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.noCards}>
                  <p>No debit cards found. Contact customer service to request a card.</p>
                  <button onClick={handleSupportContact} style={styles.contactBtn}>
                    Contact Support
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Banking Services</h2>
            
            {bankingServices.map((service, index) => (
              <div key={index} style={styles.serviceSection}>
                <div 
                  style={styles.serviceHeader}
                  onClick={() => toggleDropdown(service.name)}
                >
                  <div style={styles.serviceTitle}>
                    <span style={styles.serviceIcon}>{service.icon}</span>
                    <span>{service.name}</span>
                  </div>
                  <span style={styles.dropdownArrow}>
                    {openDropdown === service.name ? '▲' : '▼'}
                  </span>
                </div>
                
                {openDropdown === service.name && (
                  <div style={styles.serviceDropdown}>
                    {service.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        style={styles.serviceItem}
                        onClick={() => {
                          if (item.name === 'Support Center') {
                            handleSupportContact();
                          } else {
                            router.push(item.path);
                          }
                        }}
                      >
                        <span style={styles.serviceItemIcon}>{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
  profileCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  },
  profileTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '1rem'
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem'
  },
  profileItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  profileLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '500'
  },
  profileValue: {
    fontSize: '1rem',
    color: '#1e293b',
    fontWeight: '500'
  },
  tabNav: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    overflowX: 'auto',
    padding: '0.5rem 0'
  },
  tab: {
    padding: '0.75rem 1rem',
    backgroundColor: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#64748b',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    minWidth: 'fit-content'
  },
  activeTab: {
    backgroundColor: '#1e40af',
    color: 'white',
    borderColor: '#1e40af'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  summaryTitle: {
    fontSize: '1.1rem',
    color: '#64748b',
    margin: '0 0 1rem 0',
    fontWeight: '500'
  },
  totalBalance: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 'bold',
    color: '#1e40af',
    margin: '0.5rem 0'
  },
  balanceSubtext: {
    fontSize: '0.9rem',
    color: '#64748b'
  },
  quickActions: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 1.5rem 0'
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem'
  },
  actionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1.5rem 1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#374151',
    transition: 'all 0.2s',
    border: '2px solid transparent'
  },
  actionIcon: {
    fontSize: '1.5rem'
  },
  actionText: {
    fontSize: '0.9rem',
    fontWeight: '500',
    textAlign: 'center'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  addAccountBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#1e40af',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  accountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  accountCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  accountHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  accountType: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1e40af',
    textTransform: 'uppercase'
  },
  accountStatus: {
    fontSize: '0.8rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    borderRadius: '4px',
    fontWeight: '500'
  },
  accountName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  accountNumber: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '1rem'
  },
  accountBalance: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  },
  viewDetailsBtn: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#f1f5f9',
    color: '#1e40af',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  debitCard: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    color: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 8px 25px rgba(30, 58, 138, 0.3)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  cardType: {
    fontSize: '1.2rem',
    fontWeight: '700'
  },
  cardStatus: {
    fontSize: '0.8rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    textTransform: 'uppercase'
  },
  cardNumber: {
    fontSize: '1.5rem',
    fontWeight: '700',
    letterSpacing: '0.1em',
    marginBottom: '1.5rem'
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem'
  },
  cardLabel: {
    fontSize: '0.7rem',
    opacity: 0.8,
    textTransform: 'uppercase',
    marginBottom: '0.25rem'
  },
  cardValue: {
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  noCards: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  contactBtn: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1e40af',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  serviceSection: {
    marginBottom: '0.5rem'
  },
  serviceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '0.5rem'
  },
  serviceTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b'
  },
  serviceIcon: {
    fontSize: '1.5rem'
  },
  dropdownArrow: {
    fontSize: '1rem',
    color: '#64748b'
  },
  serviceDropdown: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '0.5rem',
    marginBottom: '1rem'
  },
  serviceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '0.5rem',
    fontSize: '0.95rem',
    color: '#374151',
    transition: 'all 0.2s ease'
  },
  serviceItemIcon: {
    fontSize: '1.2rem'
  }
};
