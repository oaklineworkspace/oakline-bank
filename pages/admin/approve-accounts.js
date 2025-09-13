
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function ApproveAccounts() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(null);
  const router = useRouter();

  const ADMIN_PASSWORD = 'Chrismorgan23$';

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchPendingAccounts();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      setError('');
      fetchPendingAccounts();
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  const fetchPendingAccounts = async () => {
    setLoading(true);
    try {
      const { data: accounts, error } = await supabase
        .from('accounts')
        .select(`
          *,
          applications:application_id (
            email,
            first_name,
            last_name,
            phone,
            address
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending accounts:', error);
        setError('Failed to load pending accounts');
      } else {
        setPendingAccounts(accounts || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load pending accounts');
    } finally {
      setLoading(false);
    }
  };

  const approveAccount = async (accountId) => {
    setProcessing(accountId);
    try {
      const { error } = await supabase
        .from('accounts')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId);

      if (error) {
        console.error('Error approving account:', error);
        setError('Failed to approve account');
      } else {
        // Remove from pending list
        setPendingAccounts(prev => prev.filter(acc => acc.id !== accountId));
        alert('Account approved successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to approve account');
    } finally {
      setProcessing(null);
    }
  };

  const rejectAccount = async (accountId) => {
    setProcessing(accountId);
    try {
      const { error } = await supabase
        .from('accounts')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', accountId);

      if (error) {
        console.error('Error rejecting account:', error);
        setError('Failed to reject account');
      } else {
        // Remove from pending list
        setPendingAccounts(prev => prev.filter(acc => acc.id !== accountId));
        alert('Account rejected successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to reject account');
    } finally {
      setProcessing(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>🏦 Account Approval</h1>
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && <div style={styles.error}>{error}</div>}
            <button type="submit" style={styles.loginButton}>
              🔐 Access Account Approval
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>✅ Account Approval</h1>
            <p style={styles.subtitle}>Approve or reject pending account applications</p>
          </div>
        </div>
        <div style={styles.headerActions}>
          <button onClick={fetchPendingAccounts} style={styles.refreshButton}>
            🔄 Refresh
          </button>
          <Link href="/admin/admin-dashboard" style={styles.backButton}>
            ← Dashboard
          </Link>
          <button onClick={handleLogout} style={styles.logoutButton}>
            🚪 Logout
          </button>
        </div>
      </div>

      {error && (
        <div style={styles.errorMessage}>{error}</div>
      )}

      <div style={styles.accountsSection}>
        <h2 style={styles.sectionTitle}>
          Pending Accounts ({pendingAccounts.length})
        </h2>
        
        {loading ? (
          <div style={styles.loading}>Loading pending accounts...</div>
        ) : pendingAccounts.length === 0 ? (
          <div style={styles.emptyState}>
            <h3>No Pending Accounts</h3>
            <p>All accounts have been processed or no applications have been submitted yet.</p>
          </div>
        ) : (
          <div style={styles.accountsGrid}>
            {pendingAccounts.map(account => (
              <div key={account.id} style={styles.accountCard}>
                <div style={styles.accountHeader}>
                  <div style={styles.accountInfo}>
                    <h3 style={styles.accountNumber}>Account: {account.account_number}</h3>
                    <span style={styles.accountType}>{account.account_type?.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div style={styles.statusBadge}>
                    PENDING
                  </div>
                </div>
                
                <div style={styles.accountDetails}>
                  {account.applications && (
                    <>
                      <div style={styles.detail}>
                        <span style={styles.detailLabel}>Name:</span>
                        <span style={styles.detailValue}>{account.applications.first_name} {account.applications.last_name}</span>
                      </div>
                      <div style={styles.detail}>
                        <span style={styles.detailLabel}>Email:</span>
                        <span style={styles.detailValue}>{account.applications.email}</span>
                      </div>
                      <div style={styles.detail}>
                        <span style={styles.detailLabel}>Phone:</span>
                        <span style={styles.detailValue}>{account.applications.phone || 'Not provided'}</span>
                      </div>
                      <div style={styles.detail}>
                        <span style={styles.detailLabel}>Address:</span>
                        <span style={styles.detailValue}>{account.applications.address || 'Not provided'}</span>
                      </div>
                    </>
                  )}
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Initial Balance:</span>
                    <span style={styles.detailValue}>${parseFloat(account.balance || 0).toFixed(2)}</span>
                  </div>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Applied:</span>
                    <span style={styles.detailValue}>{new Date(account.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div style={styles.actionButtons}>
                  <button
                    onClick={() => approveAccount(account.id)}
                    disabled={processing === account.id}
                    style={styles.approveButton}
                  >
                    {processing === account.id ? '⏳ Processing...' : '✅ Approve'}
                  </button>
                  <button
                    onClick={() => rejectAccount(account.id)}
                    disabled={processing === account.id}
                    style={styles.rejectButton}
                  >
                    {processing === account.id ? '⏳ Processing...' : '❌ Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    padding: '1rem'
  },
  loginCard: {
    background: 'white',
    padding: 'clamp(1.5rem, 5vw, 2.5rem)',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
    padding: 'clamp(1rem, 3vw, 1.5rem)'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
    background: 'white',
    padding: 'clamp(1rem, 4vw, 1.5rem)',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 2rem)',
    fontWeight: '700',
    color: '#1e3c72',
    margin: 0,
    lineHeight: '1.2'
  },
  subtitle: {
    fontSize: 'clamp(0.875rem, 3vw, 1rem)',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.4'
  },
  headerActions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  refreshButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.25rem)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
  },
  backButton: {
    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
    color: 'white',
    border: 'none',
    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.25rem)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)'
  },
  logoutButton: {
    background: 'linear-gradient(135deg, #dc3545 0%, #b91c1c 100%)',
    color: 'white',
    border: 'none',
    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.25rem)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: 'clamp(0.75rem, 3vw, 1rem)',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: 'clamp(1rem, 3vw, 1.125rem)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit'
  },
  loginButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: 'clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
    borderRadius: '12px',
    fontSize: 'clamp(1rem, 3vw, 1.125rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)'
  },
  error: {
    color: '#dc2626',
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    textAlign: 'center',
    fontWeight: '500'
  },
  errorMessage: {
    background: '#fef2f2',
    color: '#dc2626',
    padding: 'clamp(1rem, 3vw, 1.25rem)',
    borderRadius: '12px',
    margin: '0 0 1.5rem 0',
    border: '1px solid #fecaca',
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    fontWeight: '500'
  },
  accountsSection: {
    background: 'white',
    padding: 'clamp(1rem, 4vw, 1.5rem)',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
  },
  sectionTitle: {
    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
    fontWeight: '700',
    color: '#1e3c72',
    marginBottom: '1.5rem',
    lineHeight: '1.2'
  },
  loading: {
    textAlign: 'center',
    padding: 'clamp(2rem, 6vw, 3rem)',
    color: '#6b7280',
    fontSize: 'clamp(1rem, 3vw, 1.125rem)'
  },
  emptyState: {
    textAlign: 'center',
    padding: 'clamp(2rem, 6vw, 3rem)',
    color: '#6b7280'
  },
  accountsGrid: {
    display: 'grid',
    gap: 'clamp(1rem, 3vw, 1.5rem)',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))'
  },
  accountCard: {
    border: '2px solid #e2e8f0',
    borderRadius: '16px',
    padding: 'clamp(1rem, 4vw, 1.5rem)',
    backgroundColor: '#fafbfc',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  accountHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  accountInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: '1'
  },
  accountNumber: {
    fontSize: 'clamp(1rem, 3.5vw, 1.25rem)',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    lineHeight: '1.2'
  },
  accountType: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    padding: '0.375rem 0.75rem',
    borderRadius: '12px',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    fontWeight: '600',
    alignSelf: 'flex-start',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },
  statusBadge: {
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: '0.375rem 0.75rem',
    borderRadius: '12px',
    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
  },
  accountDetails: {
    marginBottom: '1.5rem',
    display: 'grid',
    gap: '0.5rem'
  },
  detail: {
    margin: 0,
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    color: '#64748b',
    lineHeight: '1.4',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.25rem 0',
    borderBottom: '1px solid #f1f5f9'
  },
  detailLabel: {
    fontWeight: '600',
    color: '#374151'
  },
  detailValue: {
    fontWeight: '500',
    textAlign: 'right'
  },
  actionButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem'
  },
  approveButton: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    padding: 'clamp(0.75rem, 3vw, 1rem)',
    borderRadius: '12px',
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  rejectButton: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    padding: 'clamp(0.75rem, 3vw, 1rem)',
    borderRadius: '12px',
    fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  '@media (max-width: 768px)': {
    headerActions: {
      width: '100%',
      justifyContent: 'space-between'
    },
    accountsGrid: {
      gridTemplateColumns: '1fr'
    },
    actionButtons: {
      gridTemplateColumns: '1fr',
      gap: '0.5rem'
    }
  }
};
