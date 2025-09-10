
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function AccountDetails() {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      checkUserAndFetchAccount();
    }
  }, [id]);

  const checkUserAndFetchAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      await fetchAccountDetails(user, id);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountDetails = async (user, accountId) => {
    try {
      // Fetch account details
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', accountId)
        .eq('user_id', user.id)
        .single();

      if (accountError && accountError.code !== 'PGRST116') {
        console.error('Error fetching account:', accountError);
        return;
      }

      if (!accountData) {
        // Try fetching by email if user_id doesn't work
        const { data: emailAccountData, error: emailError } = await supabase
          .from('accounts')
          .select('*')
          .eq('id', accountId)
          .eq('user_email', user.email)
          .single();

        if (emailError && emailError.code !== 'PGRST116') {
          console.error('Error fetching account by email:', emailError);
          return;
        }

        setAccount(emailAccountData);
      } else {
        setAccount(accountData);
      }

      // Fetch transactions for this account
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('account_id', accountId)
        .order('created_at', { ascending: false });

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
      } else {
        setTransactions(transactionsData || []);
      }
    } catch (error) {
      console.error('Error fetching account details:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading account details...</div>
      </div>
    );
  }

  if (!account) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>Account Not Found</h2>
          <p>The requested account could not be found.</p>
          <Link href="/dashboard" style={styles.backButton}>
            Back to Dashboard
          </Link>
        </div>
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
          <div style={styles.headerActions}>
            <Link href="/dashboard" style={styles.backButton}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Account Overview */}
        <div style={styles.accountCard}>
          <div style={styles.accountHeader}>
            <div>
              <h1 style={styles.accountTitle}>
                {account.account_name || account.name || 'Account Details'}
              </h1>
              <div style={styles.accountType}>
                {(account.account_type || account.type || 'Account').replace('_', ' ').toUpperCase()}
              </div>
            </div>
            <div style={styles.accountStatus}>
              {account.status || 'Active'}
            </div>
          </div>

          <div style={styles.accountInfo}>
            <div style={styles.balanceSection}>
              <div style={styles.balanceLabel}>Current Balance</div>
              <div style={styles.balanceAmount}>
                {formatCurrency(account.balance || 0)}
              </div>
            </div>

            <div style={styles.accountDetails}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Account Number:</span>
                <span style={styles.detailValue}>{account.account_number}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Routing Number:</span>
                <span style={styles.detailValue}>075915826</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Account Type:</span>
                <span style={styles.detailValue}>
                  {(account.account_type || account.type || 'Account').replace('_', ' ')}
                </span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Opened:</span>
                <span style={styles.detailValue}>
                  {account.created_at ? formatDate(account.created_at) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.actionsCard}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionGrid}>
            <Link href="/transfer" style={styles.actionButton}>
              <span style={styles.actionIcon}>💸</span>
              <span>Transfer Money</span>
            </Link>
            <Link href="/deposit-real" style={styles.actionButton}>
              <span style={styles.actionIcon}>📥</span>
              <span>Make Deposit</span>
            </Link>
            <Link href="/withdrawal" style={styles.actionButton}>
              <span style={styles.actionIcon}>📤</span>
              <span>Withdraw Funds</span>
            </Link>
            <Link href="/statements" style={styles.actionButton}>
              <span style={styles.actionIcon}>📄</span>
              <span>Download Statement</span>
            </Link>
          </div>
        </div>

        {/* Transaction History */}
        <div style={styles.transactionsCard}>
          <h2 style={styles.sectionTitle}>Recent Transactions</h2>
          {transactions.length > 0 ? (
            <div style={styles.transactionsList}>
              {transactions.map(transaction => (
                <div key={transaction.id} style={styles.transactionItem}>
                  <div style={styles.transactionInfo}>
                    <div style={styles.transactionDesc}>
                      {transaction.description || transaction.transaction_type || 'Transaction'}
                    </div>
                    <div style={styles.transactionDate}>
                      {formatDate(transaction.created_at)}
                    </div>
                  </div>
                  <div style={{
                    ...styles.transactionAmount,
                    color: (transaction.amount || 0) >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    {(transaction.amount || 0) >= 0 ? '+' : ''}{formatCurrency(transaction.amount || 0)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.noTransactions}>
              <p>No transactions found for this account.</p>
            </div>
          )}
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
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    fontSize: '1.2rem',
    color: '#64748b'
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    textAlign: 'center',
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
    alignItems: 'center'
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
  headerActions: {
    display: 'flex',
    gap: '1rem'
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '0.9rem',
    border: '1px solid rgba(255,255,255,0.3)'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  accountCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  accountHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem'
  },
  accountTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 0.5rem 0'
  },
  accountType: {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: '500'
  },
  accountStatus: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  accountInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '2rem',
    alignItems: 'start'
  },
  balanceSection: {
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: '#f8fafc',
    borderRadius: '12px'
  },
  balanceLabel: {
    fontSize: '1rem',
    color: '#64748b',
    marginBottom: '0.5rem'
  },
  balanceAmount: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1e40af'
  },
  accountDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px'
  },
  detailLabel: {
    fontWeight: '500',
    color: '#64748b'
  },
  detailValue: {
    fontWeight: '600',
    color: '#1e293b'
  },
  actionsCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '1.5rem'
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    textDecoration: 'none',
    color: '#374151',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  actionIcon: {
    fontSize: '1.25rem'
  },
  transactionsCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  transactionsList: {
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
    borderRadius: '8px'
  },
  transactionInfo: {
    flex: 1
  },
  transactionDesc: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: '0.25rem'
  },
  transactionDate: {
    fontSize: '0.85rem',
    color: '#64748b'
  },
  transactionAmount: {
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  noTransactions: {
    textAlign: 'center',
    padding: '2rem',
    color: '#64748b'
  }
};
