
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
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
      await fetchUserData(user);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
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

      // If no accounts found by user_id, try by email (check if user_email column exists)
      if (!accountsData || accountsData.length === 0) {
        // First try with user_email, if that fails try with email
        let { data: emailAccounts, error: emailError } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_email', user.email);
        
        // If user_email column doesn't exist, try with email
        if (emailError && emailError.code === '42703') {
          const { data: emailAccounts2, error: emailError2 } = await supabase
            .from('accounts')
            .select('*')
            .eq('email', user.email);
          emailAccounts = emailAccounts2;
          emailError = emailError2;
        }
        
        accountsData = emailAccounts;
        accountsError = emailError;
      }

      // If still no accounts, create sample accounts with proper structure
      if (!accountsData || accountsData.length === 0) {
        accountsData = [
          {
            id: 1,
            account_type: 'checking',
            account_name: 'Premier Checking',
            balance: 0.00,
            account_number: `****${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Active',
            user_id: user.id,
            user_email: user.email
          },
          {
            id: 2,
            account_type: 'savings',
            account_name: 'High Yield Savings',
            balance: 0.00,
            account_number: `****${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Active',
            user_id: user.id,
            user_email: user.email
          }
        ];
      }

      setAccounts(accountsData || []);

      // Fetch real transactions for this user
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // If no transactions found, try by email
      if (!transactionsData || transactionsData.length === 0) {
        const { data: emailTransactions, error: emailTransError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_email', user.email)
          .order('created_at', { ascending: false })
          .limit(10);
        
        setTransactions(emailTransactions || []);
      } else {
        setTransactions(transactionsData || []);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      setAccounts([]);
      setTransactions([]);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount || 0));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTotalBalance = () => {
    return accounts
      .filter(acc => acc.type !== 'Credit')
      .reduce((total, acc) => total + (parseFloat(acc.balance) || 0), 0);
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

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading your dashboard...</div>
      </div>
    );
  }

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
            <button onClick={() => supabase.auth.signOut()} style={styles.logoutBtn}>
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
            style={activeTab === 'transactions' ? {...styles.tab, ...styles.activeTab} : styles.tab}
            onClick={() => setActiveTab('transactions')}
          >
            📋 Transactions
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

            {/* Recent Transactions */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Recent Transactions</h3>
                <Link href="/transactions" style={styles.viewAllLink}>View All</Link>
              </div>
              <div style={styles.transactionList}>
                {transactions.length > 0 ? (
                  transactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} style={styles.transactionItem}>
                      <div style={styles.transactionInfo}>
                        <div style={styles.transactionDesc}>
                          {transaction.description || transaction.transaction_type || 'Transaction'}
                        </div>
                        <div style={styles.transactionDate}>
                          {formatDate(transaction.created_at || transaction.date)}
                        </div>
                      </div>
                      <div style={{
                        ...styles.transactionAmount,
                        color: (transaction.amount || 0) >= 0 ? '#10b981' : '#ef4444'
                      }}>
                        {(transaction.amount || 0) >= 0 ? '+' : ''}{formatCurrency(transaction.amount || 0)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={styles.noTransactions}>
                    <p>No transactions yet. Start banking with us!</p>
                  </div>
                )}
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
                    <div style={styles.accountType}>
                      {(account.account_type || account.type || 'Account').replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div style={styles.accountStatus}>{account.status || 'Active'}</div>
                  </div>
                  <div style={styles.accountName}>
                    {account.account_name || account.name || `${(account.account_type || account.type || 'Account').replace(/_/g, ' ')} Account`}
                  </div>
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

        {activeTab === 'transactions' && (
          <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Transaction History</h2>
            <div style={styles.transactionList}>
              {transactions.length > 0 ? (
                transactions.map(transaction => (
                  <div key={transaction.id} style={styles.transactionItem}>
                    <div style={styles.transactionInfo}>
                      <div style={styles.transactionDesc}>
                        {transaction.description || transaction.transaction_type || 'Transaction'}
                      </div>
                      <div style={styles.transactionMeta}>
                        <span style={styles.transactionDate}>
                          {formatDate(transaction.created_at || transaction.date)}
                        </span>
                        <span style={styles.transactionAccount}>
                          {transaction.account_type || 'Account'}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      ...styles.transactionAmount,
                      color: (transaction.amount || 0) >= 0 ? '#10b981' : '#ef4444'
                    }}>
                      {(transaction.amount || 0) >= 0 ? '+' : ''}{formatCurrency(transaction.amount || 0)}
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.noTransactions}>
                  <p>No transactions found. Your transaction history will appear here once you start banking with us.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div style={styles.content}>
            <h2 style={styles.sectionTitle}>Banking Services</h2>
            <div style={styles.serviceGrid}>
              <Link href="/loans" style={styles.serviceCard}>
                <span style={styles.serviceIcon}>🏠</span>
                <div style={styles.serviceInfo}>
                  <div style={styles.serviceTitle}>Loans & Credit</div>
                  <div style={styles.serviceDesc}>Apply for personal, auto, or home loans</div>
                </div>
              </Link>
              <Link href="/investments" style={styles.serviceCard}>
                <span style={styles.serviceIcon}>📈</span>
                <div style={styles.serviceInfo}>
                  <div style={styles.serviceTitle}>Investment Services</div>
                  <div style={styles.serviceDesc}>Grow your wealth with our investment options</div>
                </div>
              </Link>
              <Link href="/crypto" style={styles.serviceCard}>
                <span style={styles.serviceIcon}>₿</span>
                <div style={styles.serviceInfo}>
                  <div style={styles.serviceTitle}>Cryptocurrency</div>
                  <div style={styles.serviceDesc}>Buy, sell, and trade digital currencies</div>
                </div>
              </Link>
              <button onClick={handleSupportContact} style={{...styles.serviceCard, cursor: 'pointer', border: 'none', background: 'white'}}>
                <span style={styles.serviceIcon}>🎧</span>
                <div style={styles.serviceInfo}>
                  <div style={styles.serviceTitle}>Customer Support</div>
                  <div style={styles.serviceDesc}>Get help with your banking needs</div>
                </div>
              </button>
              <Link href="/credit-report" style={styles.serviceCard}>
                <span style={styles.serviceIcon}>📊</span>
                <div style={styles.serviceInfo}>
                  <div style={styles.serviceTitle}>Credit Report</div>
                  <div style={styles.serviceDesc}>Check your credit score and history</div>
                </div>
              </Link>
              <Link href="/security" style={styles.serviceCard}>
                <span style={styles.serviceIcon}>🔒</span>
                <div style={styles.serviceInfo}>
                  <div style={styles.serviceTitle}>Security Center</div>
                  <div style={styles.serviceDesc}>Manage your account security settings</div>
                </div>
              </Link>
            </div>
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
  section: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  viewAllLink: {
    color: '#1e40af',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500'
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
  transactionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    gap: '1rem'
  },
  transactionInfo: {
    flex: 1,
    minWidth: 0
  },
  transactionDesc: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: '0.25rem'
  },
  transactionDate: {
    fontSize: '0.8rem',
    color: '#64748b'
  },
  transactionMeta: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  transactionAccount: {
    fontSize: '0.8rem',
    color: '#64748b'
  },
  transactionAmount: {
    fontSize: '0.95rem',
    fontWeight: 'bold',
    textAlign: 'right'
  },
  noTransactions: {
    textAlign: 'center',
    padding: '2rem',
    color: '#64748b'
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
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  serviceCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.2s',
    border: '1px solid #e2e8f0'
  },
  serviceIcon: {
    fontSize: '2rem',
    minWidth: '60px',
    textAlign: 'center'
  },
  serviceInfo: {
    flex: 1
  },
  serviceTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  serviceDesc: {
    fontSize: '0.9rem',
    color: '#64748b',
    lineHeight: '1.4'
  }
};
