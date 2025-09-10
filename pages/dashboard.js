
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import DebitCard from '../components/DebitCard';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dropdownOpen, setDropdownOpen] = useState({});
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

      if (!accountsData || accountsData.length === 0) {
        let { data: emailAccounts, error: emailError } = await supabase
          .from('accounts')
          .select('*')
          .eq('user_email', user.email);
        
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

      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

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

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading your dashboard...</div>
      </div>
    );
  }

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
            {/* Banking Services Dropdown */}
            <div style={styles.dropdown}>
              <button 
                style={styles.dropdownBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('banking');
                }}
              >
                Banking Services ▼
              </button>
              {dropdownOpen.banking && (
                <div style={styles.dropdownContent} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>💳 Account Services</h4>
                    <Link href="/account-details" style={styles.dropdownLink}>Account Details</Link>
                    <Link href="/transactions" style={styles.dropdownLink}>Transaction History</Link>
                    <Link href="/apply" style={styles.dropdownLink}>Open New Account</Link>
                    <Link href="/cards" style={styles.dropdownLink}>Manage Cards</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>💸 Transfers & Payments</h4>
                    <Link href="/transfer" style={styles.dropdownLink}>Transfer Money</Link>
                    <Link href="/bill-pay" style={styles.dropdownLink}>Pay Bills</Link>
                    <Link href="/deposit-real" style={styles.dropdownLink}>Mobile Deposit</Link>
                    <Link href="/withdrawal" style={styles.dropdownLink}>Withdraw Funds</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Loans & Credit Dropdown */}
            <div style={styles.dropdown}>
              <button 
                style={styles.dropdownBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('loans');
                }}
              >
                Loans & Credit ▼
              </button>
              {dropdownOpen.loans && (
                <div style={styles.dropdownContent} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🏠 Home Loans</h4>
                    <Link href="/loans" style={styles.dropdownLink}>Mortgage Application</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Refinancing</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Home Equity Loans</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🚗 Auto & Personal</h4>
                    <Link href="/loans" style={styles.dropdownLink}>Auto Loans</Link>
                    <Link href="/loans" style={styles.dropdownLink}>Personal Loans</Link>
                    <Link href="/credit-report" style={styles.dropdownLink}>Credit Report</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Investments Dropdown */}
            <div style={styles.dropdown}>
              <button 
                style={styles.dropdownBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('investments');
                }}
              >
                Investments ▼
              </button>
              {dropdownOpen.investments && (
                <div style={styles.dropdownContent} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>📈 Investment Options</h4>
                    <Link href="/investments" style={styles.dropdownLink}>Portfolio Management</Link>
                    <Link href="/crypto" style={styles.dropdownLink}>Cryptocurrency</Link>
                    <Link href="/financial-advisory" style={styles.dropdownLink}>Financial Advisory</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>📊 Trading</h4>
                    <Link href="/investments" style={styles.dropdownLink}>Stock Trading</Link>
                    <Link href="/market-news" style={styles.dropdownLink}>Market News</Link>
                    <Link href="/rewards" style={styles.dropdownLink}>Rewards Program</Link>
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
                    <Link href="/security" style={styles.dropdownLink}>Security Center</Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>📱 Digital Services</h4>
                    <Link href="/messages" style={styles.dropdownLink}>Messages</Link>
                    <Link href="/notifications" style={styles.dropdownLink}>Notifications</Link>
                    <Link href="/main-menu" style={styles.dropdownLink}>Full Menu</Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div style={styles.userInfo}>
            {/* Menu Access Dropdown */}
            <div style={styles.dropdown}>
              <button 
                style={styles.menuAccessBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('menuAccess');
                }}
              >
                Menu ▼
              </button>
              {dropdownOpen.menuAccess && (
                <div style={styles.dropdownContent} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.dropdownSection}>
                    <h4 style={styles.dropdownHeading}>🏠 Navigation</h4>
                    <Link href="/main-menu" style={styles.dropdownLink}>Full Main Menu</Link>
                    <Link href="/dashboard" style={styles.dropdownLink}>Dashboard Home</Link>
                    <Link href="/" style={styles.dropdownLink}>Bank Homepage</Link>
                  </div>
                </div>
              )}
            </div>
            
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
            <div style={styles.profileHeader}>
              <h2 style={styles.profileTitle}>Account Holder Information</h2>
              <Link href="/profile" style={styles.editProfileBtn}>Edit Profile</Link>
            </div>
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

        {/* Balance Summary Cards */}
        <div style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>💰</div>
            <div style={styles.summaryContent}>
              <h3 style={styles.summaryTitle}>Total Balance</h3>
              <div style={styles.summaryAmount}>{formatCurrency(getTotalBalance())}</div>
              <div style={styles.summarySubtext}>Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
          
          <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>📊</div>
            <div style={styles.summaryContent}>
              <h3 style={styles.summaryTitle}>This Month</h3>
              <div style={styles.summaryAmount}>+$2,450</div>
              <div style={styles.summarySubtext}>12% increase from last month</div>
            </div>
          </div>
          
          <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>💳</div>
            <div style={styles.summaryContent}>
              <h3 style={styles.summaryTitle}>Available Credit</h3>
              <div style={styles.summaryAmount}>$15,000</div>
              <div style={styles.summarySubtext}>Credit limit utilization: 25%</div>
            </div>
          </div>
        </div>

        {/* Debit Card Display */}
        {accounts.length > 0 && (
          <div style={styles.debitCardSection}>
            <h3 style={styles.sectionTitle}>Your Debit Card</h3>
            <p style={styles.cardSectionSubtitle}>Manage your primary debit card linked to your checking account</p>
            <DebitCard 
              user={user}
              userProfile={userProfile}
              account={accounts.find(acc => acc.account_type === 'checking') || accounts[0]}
              cardType="debit"
              showDetails={true}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div style={styles.quickActionsSection}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={styles.actionGrid}>
            <Link href="/transfer" style={styles.actionCard}>
              <span style={styles.actionIcon}>💸</span>
              <div style={styles.actionContent}>
                <span style={styles.actionText}>Transfer Money</span>
                <span style={styles.actionDesc}>Send or move funds</span>
              </div>
            </Link>
            <Link href="/deposit" style={styles.actionCard}>
              <span style={styles.actionIcon}>📥</span>
              <div style={styles.actionContent}>
                <span style={styles.actionText}>Mobile Deposit</span>
                <span style={styles.actionDesc}>Deposit checks instantly</span>
              </div>
            </Link>
            <Link href="/bill-pay" style={styles.actionCard}>
              <span style={styles.actionIcon}>🧾</span>
              <div style={styles.actionContent}>
                <span style={styles.actionText}>Pay Bills</span>
                <span style={styles.actionDesc}>Schedule payments</span>
              </div>
            </Link>
            <Link href="/cards" style={styles.actionCard}>
              <span style={styles.actionIcon}>💳</span>
              <div style={styles.actionContent}>
                <span style={styles.actionText}>Manage Cards</span>
                <span style={styles.actionDesc}>Control card settings</span>
              </div>
            </Link>
          </div>
        </div>

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
                      <div style={styles.transactionIcon}>
                        {transaction.amount >= 0 ? '📥' : '📤'}
                      </div>
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
                    <div style={styles.emptyStateIcon}>📭</div>
                    <h4 style={styles.emptyStateTitle}>No transactions yet</h4>
                    <p style={styles.emptyStateDesc}>Start banking with us to see your transaction history here!</p>
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
                  <div style={styles.accountNumber}>Account: {account.account_number}</div>
                  <div style={{
                    ...styles.accountBalance,
                    color: (parseFloat(account.balance) || 0) < 0 ? '#ef4444' : '#10b981'
                  }}>
                    {formatCurrency(account.balance || 0)}
                  </div>
                  <div style={styles.accountActions}>
                    <Link href={`/account-details?id=${account.id}`} style={styles.viewDetailsBtn}>
                      View Details
                    </Link>
                    <Link href={`/transfer?from=${account.id}`} style={styles.transferBtn}>
                      Transfer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div style={styles.content}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Transaction History</h2>
              <div style={styles.filterButtons}>
                <button style={styles.filterBtn}>All</button>
                <button style={styles.filterBtn}>Income</button>
                <button style={styles.filterBtn}>Expenses</button>
              </div>
            </div>
            <div style={styles.transactionList}>
              {transactions.length > 0 ? (
                transactions.map(transaction => (
                  <div key={transaction.id} style={styles.transactionItem}>
                    <div style={styles.transactionIcon}>
                      {transaction.amount >= 0 ? '📥' : '📤'}
                    </div>
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
                  <div style={styles.emptyStateIcon}>📭</div>
                  <h4 style={styles.emptyStateTitle}>No transactions found</h4>
                  <p style={styles.emptyStateDesc}>Your transaction history will appear here once you start banking with us.</p>
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
                <span style={styles.serviceArrow}>→</span>
              </Link>
              <Link href="/investments" style={styles.serviceCard}>
                <span style={styles.serviceIcon}>📈</span>
                <div style={styles.serviceInfo}>
                  <div style={styles.serviceTitle}>Investment Services</div>
                  <div style={styles.serviceDesc}>Grow your wealth with our investment options</div>
                </div>
                <span style={styles.serviceArrow}>→</span>
              </Link>
              <Link href="/crypto" style={styles.serviceCard}>
                <span style={styles.serviceIcon}>₿</span>
                <div style={styles.serviceInfo}>
                  <div style={styles.serviceTitle}>Cryptocurrency</div>
                  <div style={styles.serviceDesc}>Buy, sell, and trade digital currencies</div>
                </div>
                <span style={styles.serviceArrow}>→</span>
              </Link>
              <button onClick={handleSupportContact} style={{...styles.serviceCard, cursor: 'pointer', border: 'none', background: 'white'}}>
                <span style={styles.serviceIcon}>🎧</span>
                <div style={styles.serviceInfo}>
                  <div style={styles.serviceTitle}>Customer Support</div>
                  <div style={styles.serviceDesc}>Get help with your banking needs</div>
                </div>
                <span style={styles.serviceArrow}>→</span>
              </button>
              <Link href="/credit-report" style={styles.serviceCard}>
                <span style={styles.serviceIcon}>📊</span>
                <div style={styles.serviceInfo}>
                  <div style={styles.serviceTitle}>Credit Report</div>
                  <div style={styles.serviceDesc}>Check your credit score and history</div>
                </div>
                <span style={styles.serviceArrow}>→</span>
              </Link>
              <Link href="/security" style={styles.serviceCard}>
                <span style={styles.serviceIcon}>🔒</span>
                <div style={styles.serviceInfo}>
                  <div style={styles.serviceTitle}>Security Center</div>
                  <div style={styles.serviceDesc}>Manage your account security settings</div>
                </div>
                <span style={styles.serviceArrow}>→</span>
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
      gap: '0.5rem'
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
  menuAccessBtn: {
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
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: 'clamp(1rem, 3vw, 2rem)'
  },
  profileCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    marginBottom: '2rem',
    border: '1px solid #e2e8f0'
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  profileTitle: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0
  },
  editProfileBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#1e40af',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem'
  },
  profileItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  profileLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '600'
  },
  profileValue: {
    fontSize: '1rem',
    color: '#1e293b',
    fontWeight: '500'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    border: '1px solid #e2e8f0'
  },
  summaryIcon: {
    fontSize: '2.5rem',
    padding: '1rem',
    backgroundColor: '#eff6ff',
    borderRadius: '12px'
  },
  summaryContent: {
    flex: 1
  },
  summaryTitle: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: '0 0 0.5rem 0',
    fontWeight: '600'
  },
  summaryAmount: {
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: 'bold',
    color: '#1e40af',
    margin: '0 0 0.5rem 0'
  },
  summarySubtext: {
    fontSize: '0.8rem',
    color: '#64748b'
  },
  debitCardSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    marginBottom: '2rem',
    border: '1px solid #e2e8f0',
    textAlign: 'center'
  },
  cardSectionSubtitle: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '1.5rem',
    lineHeight: '1.5'
  },
  quickActionsSection: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    marginBottom: '2rem',
    border: '1px solid #e2e8f0'
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    textDecoration: 'none',
    color: '#374151',
    transition: 'all 0.2s',
    border: '2px solid transparent'
  },
  actionIcon: {
    fontSize: '1.5rem',
    minWidth: '40px'
  },
  actionContent: {
    flex: 1
  },
  actionText: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.25rem'
  },
  actionDesc: {
    fontSize: '0.8rem',
    color: '#64748b'
  },
  tabNav: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    overflowX: 'auto',
    padding: '0.5rem 0',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  tab: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
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
  section: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0
  },
  viewAllLink: {
    color: '#1e40af',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #1e40af',
    transition: 'all 0.2s'
  },
  addAccountBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1e40af',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(30, 64, 175, 0.3)'
  },
  filterButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  filterBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  transactionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  },
  transactionIcon: {
    fontSize: '1.5rem',
    minWidth: '40px',
    textAlign: 'center'
  },
  transactionInfo: {
    flex: 1,
    minWidth: 0
  },
  transactionDesc: {
    fontSize: '1rem',
    fontWeight: '600',
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
    fontSize: '1rem',
    fontWeight: 'bold',
    textAlign: 'right',
    minWidth: '80px'
  },
  noTransactions: {
    textAlign: 'center',
    padding: '3rem 2rem',
    color: '#64748b'
  },
  emptyStateIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  emptyStateTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 0.5rem 0'
  },
  emptyStateDesc: {
    fontSize: '0.9rem',
    color: '#64748b',
    margin: 0
  },
  accountGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem'
  },
  accountCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s'
  },
  accountHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  accountType: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#1e40af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  accountStatus: {
    fontSize: '0.8rem',
    padding: '0.25rem 0.75rem',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    borderRadius: '20px',
    fontWeight: '600'
  },
  accountName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '0.75rem'
  },
  accountNumber: {
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '1.5rem',
    fontFamily: 'monospace'
  },
  accountBalance: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem'
  },
  accountActions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  viewDetailsBtn: {
    flex: 1,
    display: 'inline-block',
    padding: '0.75rem 1rem',
    backgroundColor: '#f1f5f9',
    color: '#1e40af',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s',
    textAlign: 'center'
  },
  transferBtn: {
    flex: 1,
    display: 'inline-block',
    padding: '0.75rem 1rem',
    backgroundColor: '#1e40af',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    textAlign: 'center'
  },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem'
  },
  serviceCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.2s',
    border: '1px solid #e2e8f0'
  },
  serviceIcon: {
    fontSize: '2rem',
    minWidth: '60px',
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#eff6ff',
    borderRadius: '12px'
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
    lineHeight: '1.5'
  },
  serviceArrow: {
    fontSize: '1.5rem',
    color: '#94a3b8',
    fontWeight: 'bold'
  }
};
