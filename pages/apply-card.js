
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function ApplyCard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
      await fetchUserAccounts(user);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAccounts = async (user) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/get-user-accounts', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setAccounts(data.accounts);
      } else {
        setError('Failed to load your accounts');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Error loading accounts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAccount) {
      setError('Please select an account');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/apply-card', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountId: selectedAccount
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Card application submitted successfully! You will receive confirmation once approved.');
        setSelectedAccount('');
        // Redirect to cards page after 3 seconds
        setTimeout(() => {
          router.push('/cards');
        }, 3000);
      } else {
        setError(data.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Apply for Debit Card</h1>
        <Link href="/dashboard" style={styles.backButton}>
          ← Back to Dashboard
        </Link>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>💳 Debit Card Application</h2>
          <p style={styles.subtitle}>
            Apply for a debit card to access your funds instantly anywhere in the world.
          </p>
        </div>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        {accounts.length === 0 ? (
          <div style={styles.noAccounts}>
            <h3>No Eligible Accounts Found</h3>
            <p>You need to have an active account to apply for a debit card.</p>
            <Link href="/apply" style={styles.openAccountButton}>
              Open an Account First
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Select Account for Card</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                style={styles.select}
                required
              >
                <option value="">Choose an account...</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.account_type} - ****{account.account_number.slice(-4)} 
                    (Balance: ${parseFloat(account.balance || 0).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.features}>
              <h3>Card Benefits & Features</h3>
              <div style={styles.featuresList}>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>🔒</span>
                  <span>Advanced security with EMV chip technology</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>🌍</span>
                  <span>Accepted worldwide at millions of locations</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>📱</span>
                  <span>Contactless payments for quick transactions</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>🚫</span>
                  <span>Zero liability protection against fraud</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>🏧</span>
                  <span>Free ATM access at network locations</span>
                </div>
                <div style={styles.feature}>
                  <span style={styles.featureIcon}>📊</span>
                  <span>Real-time transaction alerts and controls</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(submitting ? styles.disabledButton : {})
              }}
              disabled={submitting}
            >
              {submitting ? '⏳ Submitting Application...' : '💳 Apply for Card'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1e3a8a'
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginTop: '50px',
    color: '#6b7280'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    maxWidth: '800px',
    margin: '0 auto'
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  cardTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    lineHeight: '1.6'
  },
  success: {
    color: '#065f46',
    backgroundColor: '#d1fae5',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '500'
  },
  error: {
    color: '#991b1b',
    backgroundColor: '#fef2f2',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '500'
  },
  noAccounts: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280'
  },
  openAccountButton: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151'
  },
  select: {
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  features: {
    backgroundColor: '#f8fafc',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  },
  featuresList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    marginTop: '20px'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: '#374151'
  },
  featureIcon: {
    fontSize: '20px'
  },
  submitButton: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  }
};
