
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: ''
  });
  const [paymentData, setPaymentData] = useState({
    payee: '',
    amount: '',
    dueDate: '',
    description: ''
  });
  const router = useRouter();

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
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      // Fetch accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (accountsError) throw accountsError;
      
      setAccounts(accountsData || []);
      if (accountsData && accountsData.length > 0) {
        setSelectedAccount(accountsData[0]);
      }

      // Fetch recent transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);

    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load account information');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + parseFloat(account.balance || 0), 0);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    // This would implement actual transfer logic
    console.log('Transfer:', transferData);
    setShowTransferModal(false);
    // Refresh data after transfer
    await fetchUserData(user.id);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    // This would implement actual payment logic
    console.log('Payment:', paymentData);
    setShowPayModal(false);
    // Refresh data after payment
    await fetchUserData(user.id);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} style={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      background: 'linear-gradient(135deg, #0070f3 0%, #0051a5 100%)',
      color: 'white',
      padding: '1.5rem 2rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
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
      fontWeight: 'bold'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    logoutButton: {
      background: 'rgba(255,255,255,0.2)',
      border: '1px solid rgba(255,255,255,0.3)',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    },
    welcomeSection: {
      marginBottom: '2rem'
    },
    welcomeTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '0.5rem'
    },
    balanceCard: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      padding: '2rem',
      borderRadius: '16px',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
    },
    totalBalance: {
      fontSize: '0.9rem',
      opacity: 0.9,
      marginBottom: '0.5rem'
    },
    balanceAmount: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    balanceActions: {
      display: 'flex',
      gap: '1rem'
    },
    actionButton: {
      background: 'rgba(255,255,255,0.2)',
      border: '1px solid rgba(255,255,255,0.3)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '2rem'
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    accountCard: {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    accountCardSelected: {
      borderColor: '#0070f3',
      backgroundColor: '#f0f9ff'
    },
    accountHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem'
    },
    accountName: {
      fontWeight: '600',
      color: '#1e293b'
    },
    accountNumber: {
      fontSize: '0.8rem',
      color: '#64748b'
    },
    accountBalance: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#059669'
    },
    transactionItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 0',
      borderBottom: '1px solid #f1f5f9'
    },
    transactionIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      marginRight: '0.75rem'
    },
    transactionDetails: {
      flex: 1
    },
    transactionDescription: {
      fontWeight: '500',
      color: '#1e293b',
      marginBottom: '0.25rem'
    },
    transactionDate: {
      fontSize: '0.8rem',
      color: '#64748b'
    },
    transactionAmount: {
      fontWeight: '600'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      maxWidth: '400px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#1e293b'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500',
      color: '#374151'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '1rem',
      backgroundColor: 'white',
      boxSizing: 'border-box'
    },
    modalActions: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    primaryButton: {
      backgroundColor: '#0070f3',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      flex: 1
    },
    secondaryButton: {
      backgroundColor: '#f1f5f9',
      color: '#64748b',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      flex: 1
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f4f6',
      borderTop: '4px solid #0070f3',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem'
    },
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      textAlign: 'center',
      padding: '2rem'
    },
    retryButton: {
      backgroundColor: '#0070f3',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '1rem',
      marginTop: '1rem'
    },
    quickActions: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
      marginTop: '1rem'
    },
    quickActionCard: {
      textAlign: 'center',
      padding: '1rem',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    quickActionIcon: {
      fontSize: '2rem',
      marginBottom: '0.5rem',
      display: 'block'
    }
  };

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .action-button:hover {
          background: rgba(255,255,255,0.3) !important;
        }
        
        .account-card:hover {
          border-color: #94a3b8 !important;
          transform: translateY(-1px);
        }
        
        .quick-action:hover {
          border-color: #0070f3 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,112,243,0.15) !important;
        }
      `}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>🏦 Oakline Bank</div>
          <div style={styles.userInfo}>
            <span>Welcome, {user?.user_metadata?.first_name || user?.email}</span>
            <button 
              onClick={handleLogout}
              style={styles.logoutButton}
              className="action-button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Welcome Section */}
        <section style={styles.welcomeSection}>
          <h1 style={styles.welcomeTitle}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
          </h1>
          
          {/* Total Balance Card */}
          <div style={styles.balanceCard}>
            <div style={styles.totalBalance}>Total Balance</div>
            <div style={styles.balanceAmount}>{formatCurrency(getTotalBalance())}</div>
            <div style={styles.balanceActions}>
              <button 
                onClick={() => setShowTransferModal(true)}
                style={styles.actionButton}
                className="action-button"
              >
                💸 Transfer Money
              </button>
              <button 
                onClick={() => setShowPayModal(true)}
                style={styles.actionButton}
                className="action-button"
              >
                💳 Pay Bills
              </button>
              <button 
                onClick={() => router.push('/deposit')}
                style={styles.actionButton}
                className="action-button"
              >
                💰 Deposit
              </button>
            </div>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div style={styles.grid}>
          {/* Accounts Section */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              💳 Your Accounts
            </h2>
            
            {accounts.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                No accounts found. Contact support if this seems incorrect.
              </p>
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
                      <div style={styles.accountName}>{account.account_name}</div>
                      <div style={styles.accountNumber}>
                        ****{account.account_number?.slice(-4)}
                      </div>
                    </div>
                    <div style={styles.accountBalance}>
                      {formatCurrency(account.balance)}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Quick Actions */}
            <div style={styles.quickActions}>
              <div 
                onClick={() => router.push('/transactions')}
                style={styles.quickActionCard}
                className="quick-action"
              >
                <span style={styles.quickActionIcon}>📊</span>
                <div>Statements</div>
              </div>
              <div 
                onClick={() => router.push('/cards')}
                style={styles.quickActionCard}
                className="quick-action"
              >
                <span style={styles.quickActionIcon}>💳</span>
                <div>Cards</div>
              </div>
              <div 
                onClick={() => router.push('/loans')}
                style={styles.quickActionCard}
                className="quick-action"
              >
                <span style={styles.quickActionIcon}>🏠</span>
                <div>Loans</div>
              </div>
            </div>
          </section>

          {/* Recent Transactions */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              📈 Recent Activity
            </h2>
            
            {transactions.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                No recent transactions
              </p>
            ) : (
              transactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} style={styles.transactionItem}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      ...styles.transactionIcon,
                      backgroundColor: transaction.type === 'credit' ? '#dcfce7' : '#fee2e2',
                      color: transaction.type === 'credit' ? '#16a34a' : '#dc2626'
                    }}>
                      {transaction.type === 'credit' ? '↓' : '↑'}
                    </div>
                    <div style={styles.transactionDetails}>
                      <div style={styles.transactionDescription}>
                        {transaction.description || 'Transaction'}
                      </div>
                      <div style={styles.transactionDate}>
                        {formatDate(transaction.created_at)}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    ...styles.transactionAmount,
                    color: transaction.type === 'credit' ? '#16a34a' : '#dc2626'
                  }}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))
            )}
            
            <button 
              onClick={() => router.push('/transactions')}
              style={{
                ...styles.primaryButton,
                marginTop: '1rem',
                width: '100%'
              }}
            >
              View All Transactions
            </button>
          </section>
        </div>
      </main>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div style={styles.modal} onClick={() => setShowTransferModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Transfer Money</h3>
            <form onSubmit={handleTransfer}>
              <div style={styles.formGroup}>
                <label style={styles.label}>From Account</label>
                <select 
                  style={styles.select}
                  value={transferData.fromAccount}
                  onChange={e => setTransferData({...transferData, fromAccount: e.target.value})}
                  required
                >
                  <option value="">Select account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.account_name} - {formatCurrency(account.balance)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>To Account/Recipient</label>
                <input 
                  type="text"
                  style={styles.input}
                  placeholder="Account number or email"
                  value={transferData.toAccount}
                  onChange={e => setTransferData({...transferData, toAccount: e.target.value})}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Amount</label>
                <input 
                  type="number"
                  step="0.01"
                  style={styles.input}
                  placeholder="0.00"
                  value={transferData.amount}
                  onChange={e => setTransferData({...transferData, amount: e.target.value})}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Description (Optional)</label>
                <input 
                  type="text"
                  style={styles.input}
                  placeholder="What's this for?"
                  value={transferData.description}
                  onChange={e => setTransferData({...transferData, description: e.target.value})}
                />
              </div>
              
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowTransferModal(false)} style={styles.secondaryButton}>
                  Cancel
                </button>
                <button type="submit" style={styles.primaryButton}>
                  Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayModal && (
        <div style={styles.modal} onClick={() => setShowPayModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Pay Bills</h3>
            <form onSubmit={handlePayment}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Payee</label>
                <input 
                  type="text"
                  style={styles.input}
                  placeholder="Company or person name"
                  value={paymentData.payee}
                  onChange={e => setPaymentData({...paymentData, payee: e.target.value})}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Amount</label>
                <input 
                  type="number"
                  step="0.01"
                  style={styles.input}
                  placeholder="0.00"
                  value={paymentData.amount}
                  onChange={e => setPaymentData({...paymentData, amount: e.target.value})}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Due Date</label>
                <input 
                  type="date"
                  style={styles.input}
                  value={paymentData.dueDate}
                  onChange={e => setPaymentData({...paymentData, dueDate: e.target.value})}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <input 
                  type="text"
                  style={styles.input}
                  placeholder="Account number or memo"
                  value={paymentData.description}
                  onChange={e => setPaymentData({...paymentData, description: e.target.value})}
                />
              </div>
              
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowPayModal(false)} style={styles.secondaryButton}>
                  Cancel
                </button>
                <button type="submit" style={styles.primaryButton}>
                  Schedule Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
