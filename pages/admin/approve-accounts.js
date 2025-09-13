
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
        <div style={styles.headerContent}>
          <h1 style={styles.title}>✅ Account Approval</h1>
          <p style={styles.subtitle}>Approve or reject pending account applications</p>
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
                      <p style={styles.detail}>
                        <strong>Name:</strong> {account.applications.first_name} {account.applications.last_name}
                      </p>
                      <p style={styles.detail}>
                        <strong>Email:</strong> {account.applications.email}
                      </p>
                      <p style={styles.detail}>
                        <strong>Phone:</strong> {account.applications.phone || 'Not provided'}
                      </p>
                      <p style={styles.detail}>
                        <strong>Address:</strong> {account.applications.address || 'Not provided'}
                      </p>
                    </>
                  )}
                  <p style={styles.detail}>
                    <strong>Initial Balance:</strong> ${parseFloat(account.balance || 0).toFixed(2)}
                  </p>
                  <p style={styles.detail}>
                    <strong>Applied:</strong> {new Date(account.created_at).toLocaleDateString()}
                  </p>
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
    padding: '20px'
  },
  loginCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    gap: '15px'
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3c72',
    margin: 0
  },
  subtitle: {
    fontSize: '16px',
    color: '#555',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  refreshButton: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  backButton: {
    background: '#6b7280',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'inline-block'
  },
  logoutButton: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  },
  loginButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  error: {
    color: '#dc3545',
    fontSize: '14px',
    textAlign: 'center'
  },
  errorMessage: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '15px',
    borderRadius: '8px',
    margin: '0 0 20px 0',
    border: '1px solid #fecaca'
  },
  accountsSection: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: '20px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  accountsGrid: {
    display: 'grid',
    gap: '20px'
  },
  accountCard: {
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    backgroundColor: '#fafafa'
  },
  accountHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  accountInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  accountNumber: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0
  },
  accountType: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    alignSelf: 'flex-start'
  },
  statusBadge: {
    backgroundColor: '#fbbf24',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  accountDetails: {
    marginBottom: '20px'
  },
  detail: {
    margin: '5px 0',
    fontSize: '14px',
    color: '#64748b'
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  approveButton: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  rejectButton: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  }
};
