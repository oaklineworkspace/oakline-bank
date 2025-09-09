
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function MainMenu() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      await fetchUserAccounts(user.id);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAccounts = async (userId) => {
    try {
      let { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId);

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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading menu...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span>🏦</span>
            Oakline Bank
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            style={styles.backButton}
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* User Welcome */}
      <section style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>
          Welcome, {user?.user_metadata?.first_name || user?.email?.split('@')[0]}!
        </h1>
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
  backButton: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
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
  welcomeSection: {
    padding: 'clamp(1rem, 4vw, 2rem)',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  welcomeTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem',
    textAlign: 'center'
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
