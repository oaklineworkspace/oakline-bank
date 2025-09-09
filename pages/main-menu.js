
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function MainMenu() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [debitCards, setDebitCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
        if (session?.user) {
          fetchUserData(session.user.id, session.user.email);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
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
        await fetchUserData(user.id, user.email);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const fetchUserData = async (userId, email) => {
    try {
      // Fetch accounts
      let { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId);

      if (!accountsData || accountsData.length === 0) {
        const { data: emailAccounts, error: emailError } = await supabase
          .from('accounts')
          .select('*')
          .eq('email', email);
        
        accountsData = emailAccounts;
        accountsError = emailError;
      }

      if (accountsError) throw accountsError;
      setAccounts(accountsData || []);

      // Fetch or create debit cards for user
      await fetchOrCreateDebitCards(userId, email, accountsData);
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
        // Table doesn't exist, create it
        await createDebitCardsTable();
        existingCards = [];
      }

      // If no cards exist and user has accounts, create cards
      if ((!existingCards || existingCards.length === 0) && userAccounts && userAccounts.length > 0) {
        const newCards = await Promise.all(
          userAccounts.map(account => createDebitCard(userId, account))
        );
        setDebitCards(newCards.filter(card => card !== null));
      } else {
        setDebitCards(existingCards || []);
      }
    } catch (error) {
      console.error('Error with debit cards:', error);
      setDebitCards([]);
    }
  };

  const createDebitCardsTable = async () => {
    try {
      // This would be handled by your database admin, but for demo we'll log it
      console.log('Debit cards table needs to be created');
    } catch (error) {
      console.error('Error creating debit cards table:', error);
    }
  };

  const createDebitCard = async (userId, account) => {
    try {
      const cardNumber = generateCardNumber();
      const expiryDate = generateExpiryDate();
      const cvv = generateCVV();
      
      const cardData = {
        user_id: userId,
        account_id: account.id,
        card_number: cardNumber,
        cardholder_name: account.account_holder || 'Account Holder',
        expiry_date: expiryDate,
        cvv: cvv,
        card_type: 'Visa',
        status: 'active',
        created_at: new Date().toISOString()
      };

      // Try to insert into database
      const { data, error } = await supabase
        .from('debit_cards')
        .insert([cardData])
        .select()
        .single();

      if (error) {
        console.error('Error creating debit card:', error);
        // Return mock data for demo
        return cardData;
      }

      return data;
    } catch (error) {
      console.error('Error creating debit card:', error);
      // Return mock data for demo
      return {
        user_id: userId,
        account_id: account.id,
        card_number: generateCardNumber(),
        cardholder_name: account.account_holder || 'Account Holder',
        expiry_date: generateExpiryDate(),
        cvv: generateCVV(),
        card_type: 'Visa',
        status: 'active'
      };
    }
  };

  const generateCardNumber = () => {
    // Generate a fake Visa card number (starts with 4)
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

  const maskCardNumber = (number) => {
    if (!number) return '';
    return `**** **** **** ${number.slice(-4)}`;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
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
      <div style={styles.container}>
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
            <div style={styles.logo}>
              <span>🏦</span>
              Oakline Bank
            </div>
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
            <button onClick={() => router.push('/')} style={styles.navButton}>
              Home
            </button>
            <button onClick={() => router.push('/dashboard')} style={styles.navButton}>
              Dashboard
            </button>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* User Welcome & Balance */}
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

      {/* Debit Cards Section */}
      {debitCards.length > 0 && (
        <section style={styles.cardsSection}>
          <h2 style={styles.sectionTitle}>Your Debit Cards</h2>
          <div style={styles.cardsGrid}>
            {debitCards.map((card, index) => (
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
            ))}
          </div>
        </section>
      )}

      {/* Banking Services with Dropdowns */}
      <main style={styles.main}>
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
                    onClick={() => router.push(item.path)}
                  >
                    <span style={styles.serviceItemIcon}>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
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
  cardsSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem 2rem 2rem'
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
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem',
    textAlign: 'center'
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
